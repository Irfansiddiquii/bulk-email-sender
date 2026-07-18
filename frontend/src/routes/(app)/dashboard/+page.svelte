<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { toastStore } from '$lib/stores/toastStore';
	import { dashboardApi } from '$lib/api/dashboard';
	import { sendApi } from '$lib/api/send';
	import Header from '$lib/components/layout/Header.svelte';
	import { LayoutDashboard, MailCheck, AlertCircle, Clock, Play, Pause, Trash2, ShieldAlert, CheckCircle, RefreshCw, BarChart2 } from 'lucide-svelte';

	let loading = true;
	let initialLoaded = false;

	// Polling states
	let pollTimer: NodeJS.Timeout | null = null;
	let currentInterval = 30000;
	let isPolling = false;

	// Dashboard state
	let hasActiveBatch = false;
	let hasScheduledJobs = false;
	let hasRunningScheduledJobs = false;

	// Data states
	let batchStatus: {
		isRunning: boolean;
		isPaused: boolean;
		total: number;
		sent: number;
		failed: number;
		elapsedSeconds: number;
		remainingSeconds?: number;
		emailDelay: number;
		batchSize: number;
		batchDelay: number;
		currentBatchCount?: number;
	} | null = null;

	let scheduledJobs: any[] = [];
	let lastUpdated = '';

	onMount(async () => {
		try {
			await refreshDashboard(true);
			startPolling(currentInterval);
		} finally {
			loading = false;
			initialLoaded = true;
		}
	});

	onDestroy(() => {
		stopPolling();
	});

	function startPolling(interval: number) {
		stopPolling();
		currentInterval = interval;
		isPolling = true;

		pollTimer = setInterval(async () => {
			await checkSystemState();
		}, interval);
	}

	function stopPolling() {
		if (pollTimer) {
			clearInterval(pollTimer);
			pollTimer = null;
		}
		isPolling = false;
	}

	async function checkSystemState() {
		try {
			const res = await dashboardApi.getPollStatus();
			if (res.data.success) {
				const info = res.data.data;
				hasActiveBatch = info.hasActiveBatch;
				hasScheduledJobs = info.hasScheduledJobs;
				hasRunningScheduledJobs = info.hasRunningScheduledJobs;
				lastUpdated = new Date(info.lastUpdated).toLocaleTimeString();

				// If we need polling
				if (info.pollNeeded) {
					// Check if interval should adapt
					if (currentInterval !== info.pollInterval || !isPolling) {
						startPolling(info.pollInterval);
					}
					// Fetch updated metrics
					await fetchDashboardData();
				} else {
					// Stop polling if nothing is active
					stopPolling();
					batchStatus = null;
					scheduledJobs = [];
				}
			}
		} catch (err) {
			console.error('System state check error:', err);
		}
	}

	async function fetchDashboardData() {
		try {
			const res = await dashboardApi.getDashboardData();
			if (res.data.success) {
				batchStatus = res.data.data.batch;
				scheduledJobs = res.data.data.scheduledJobs || [];
			}
		} catch (err) {
			console.error('Dashboard data fetch error:', err);
		}
	}

	async function refreshDashboard(showToast = false) {
		if (showToast && initialLoaded) toastStore.info('Refreshing dashboard...');
		await checkSystemState();
		await fetchDashboardData();
		if (showToast && initialLoaded) toastStore.success('Dashboard metrics updated.');
	}

	// Batch Job Control Actions
	async function pauseBatch() {
		try {
			const res = await sendApi.pauseBatch();
			if (res.data.success) {
				toastStore.success('Batch dispatch paused.');
				await refreshDashboard();
			}
		} catch (err: any) {
			toastStore.danger(err.response?.data?.message || 'Failed to pause batch.');
		}
	}

	async function resumeBatch() {
		try {
			const res = await sendApi.resumeBatch();
			if (res.data.success) {
				toastStore.success('Batch dispatch resumed.');
				await refreshDashboard();
			}
		} catch (err: any) {
			toastStore.danger(err.response?.data?.message || 'Failed to resume batch.');
		}
	}

	async function cancelBatch() {
		if (confirm('Are you sure you want to cancel the active campaign dispatch? This cannot be undone.')) {
			try {
				const res = await sendApi.cancelBatch();
				if (res.data.success) {
					toastStore.success('Active campaign cancelled.');
					batchStatus = null;
					await refreshDashboard();
				}
			} catch (err: any) {
				toastStore.danger(err.response?.data?.message || 'Failed to cancel campaign.');
			}
		}
	}

	// Scheduled Campaign Actions
	async function cancelScheduledJob(id: string) {
		if (confirm('Cancel this scheduled campaign send?')) {
			try {
				const res = await sendApi.deleteScheduledJob(id);
				if (res.data.success) {
					toastStore.success('Scheduled campaign cancelled.');
					await refreshDashboard();
				}
			} catch (err: any) {
				toastStore.danger(err.response?.data?.message || 'Failed to cancel scheduled campaign.');
			}
		}
	}

	// Utility calculations
	$: percentComplete = batchStatus ? Math.round((batchStatus.sent / batchStatus.total) * 100) : 0;
	$: timeRemainingText = () => {
		if (!batchStatus || !batchStatus.remainingSeconds) return 'Calculating...';
		const secs = batchStatus.remainingSeconds;
		if (secs < 60) return `${secs} seconds`;
		const mins = Math.ceil(secs / 60);
		return `${mins} min`;
	};
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<Header title="Campaign Dashboard" subtitle="Monitor live email sends, queues, and background automated actions" />
		<div class="flex items-center gap-3">
			{#if lastUpdated}
				<span class="text-xs text-slate-400 bg-slate-100 border border-slate-200/50 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
					<span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
					Auto-Updated: {lastUpdated}
				</span>
			{/if}
			<button 
				on:click={() => refreshDashboard(true)}
				class="bg-white border border-slate-200 hover:bg-slate-50 p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 text-slate-600 shadow-sm"
				title="Sync Status"
			>
				<RefreshCw class="w-4.5 h-4.5" />
			</button>
		</div>
	</div>

	{#if loading}
		<div class="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center">
			<div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-3"></div>
			<p class="text-slate-500 text-sm">Syncing system states...</p>
		</div>
	{:else}
		<!-- Status Overview Cards -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- Sent card -->
			<div class="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm flex items-start gap-4">
				<div class="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 shrink-0">
					<MailCheck class="w-6 h-6" />
				</div>
				<div>
					<span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Sending Queue</span>
					<span class="text-2xl font-bold text-slate-800 mt-1 block">
						{#if batchStatus}
							{batchStatus.sent} / {batchStatus.total}
						{:else}
							Inactive
						{/if}
					</span>
					<span class="text-xs text-slate-400 block mt-1">
						{#if batchStatus}
							Campaign in progress
						{:else}
							No active send queue
						{/if}
					</span>
				</div>
			</div>

			<!-- Queue Status Card -->
			<div class="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm flex items-start gap-4"
				class:border-amber-400={batchStatus?.isPaused}
				class:border-indigo-400={batchStatus?.isRunning && !batchStatus.isPaused}
			>
				<div class="p-3 rounded-2xl shrink-0"
					class:bg-indigo-50={!batchStatus}
					class:text-indigo-600={!batchStatus}
					class:bg-amber-50={batchStatus?.isPaused}
					class:text-amber-600={batchStatus?.isPaused}
					class:bg-blue-50={batchStatus?.isRunning && !batchStatus.isPaused}
					class:text-blue-600={batchStatus?.isRunning && !batchStatus.isPaused}
				>
					<BarChart2 class="w-6 h-6" />
				</div>
				<div>
					<span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Queue Status</span>
					<span class="text-2xl font-bold text-slate-800 mt-1 block">
						{#if batchStatus}
							{#if batchStatus.isPaused}
								Paused
							{:else}
								Processing
							{/if}
						{:else}
							Idle
						{/if}
					</span>
					<span class="text-xs text-slate-400 block mt-1">
						{#if batchStatus}
							Running at {batchStatus.emailDelay}s/email
						{:else}
							Ready for new campaign
						{/if}
					</span>
				</div>
			</div>

			<!-- Scheduled Count Card -->
			<div class="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm flex items-start gap-4">
				<div class="p-3 bg-violet-50 border border-violet-100 rounded-2xl text-violet-600 shrink-0">
					<Clock class="w-6 h-6" />
				</div>
				<div>
					<span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Scheduled Sends</span>
					<span class="text-2xl font-bold text-slate-800 mt-1 block">
						{scheduledJobs.length}
					</span>
					<span class="text-xs text-slate-400 block mt-1">
						Upcoming campaign events
					</span>
				</div>
			</div>
		</div>

		<!-- Live Send Monitor (Progress Bar) -->
		{#if batchStatus}
			<div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
				<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<span class="bg-indigo-50 text-indigo-600 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-indigo-200 inline-block mb-1.5">
							{#if batchStatus.isPaused}
								Paused
							{:else}
								Active Campaign Send
							{/if}
						</span>
						<h3 class="font-bold text-lg text-slate-800">Campaign Dispatch Progress</h3>
					</div>
					<div class="flex gap-2.5">
						{#if batchStatus.isPaused}
							<button 
								on:click={resumeBatch}
								class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-500/10"
							>
								<Play class="w-3.5 h-3.5 fill-white" />
								Resume Send
							</button>
						{:else}
							<button 
								on:click={pauseBatch}
								class="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/10"
							>
								<Pause class="w-3.5 h-3.5 fill-white" />
								Pause Send
							</button>
						{/if}
						<button 
							on:click={cancelBatch}
							class="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
						>
							<Trash2 class="w-3.5 h-3.5" />
							Cancel Queue
						</button>
					</div>
				</div>

				<!-- Progress bar layout -->
				<div class="space-y-2">
					<div class="flex justify-between text-xs text-slate-500">
						<span class="font-bold">Sent: {batchStatus.sent} / {batchStatus.total}</span>
						<span class="font-bold text-slate-800">{percentComplete}% Complete</span>
					</div>
					<div class="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
						<div 
							class="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500" 
							style="width: {percentComplete}%"
						></div>
					</div>
				</div>

				<!-- Secondary details -->
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100 text-xs">
					<div>
						<span class="text-slate-400 block font-bold uppercase tracking-wider mb-1">Delivered Successfully</span>
						<span class="font-bold text-emerald-600 text-sm">{batchStatus.sent - batchStatus.failed}</span>
					</div>
					<div>
						<span class="text-slate-400 block font-bold uppercase tracking-wider mb-1">Failed Sends</span>
						<span class="font-bold text-rose-600 text-sm">{batchStatus.failed}</span>
					</div>
					<div>
						<span class="text-slate-400 block font-bold uppercase tracking-wider mb-1">Estimated Time Left</span>
						<span class="font-bold text-slate-800 text-sm">{timeRemainingText()}</span>
					</div>
					<div>
						<span class="text-slate-400 block font-bold uppercase tracking-wider mb-1">Rate Settings</span>
						<span class="font-bold text-slate-800 text-sm">{batchStatus.emailDelay}s delay</span>
					</div>
				</div>
			</div>
		{/if}

		<!-- Scheduled Campaigns List -->
		{#if scheduledJobs.length > 0}
			<div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
				<h3 class="font-bold text-slate-800 text-base">Scheduled Campaigns</h3>
				<div class="overflow-x-auto">
					<table class="w-full text-sm text-left text-slate-500">
						<thead class="text-xs uppercase bg-slate-50 text-slate-400 border-b border-slate-100">
							<tr>
								<th class="px-6 py-4 font-bold">Subject / Name</th>
								<th class="px-6 py-4 font-bold">Scheduled Time</th>
								<th class="px-6 py-4 font-bold">Recipient Count</th>
								<th class="px-6 py-4 font-bold">Notify Email</th>
								<th class="px-6 py-4 font-bold">Status</th>
								<th class="px-6 py-4 font-bold text-right">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-100">
							{#each scheduledJobs as job (job.id)}
								<tr class="hover:bg-slate-50/50 transition-colors">
									<td class="px-6 py-4 font-bold text-slate-800">{job.subject || 'Campaign'}</td>
									<td class="px-6 py-4">{new Date(job.scheduled_time).toLocaleString()}</td>
									<td class="px-6 py-4 font-semibold">{job.total_contacts || 'All'}</td>
									<td class="px-6 py-4">{job.notify_email || 'None'}</td>
									<td class="px-6 py-4">
										{#if job.status === 'running'}
											<span class="bg-blue-50 text-blue-600 border border-blue-100 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full animate-pulse">Running</span>
										{:else}
											<span class="bg-amber-50 text-amber-600 border border-amber-100 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">Scheduled</span>
										{/if}
									</td>
									<td class="px-6 py-4 text-right">
										<button 
											on:click={() => cancelScheduledJob(job.id)}
											class="p-2 text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all"
											title="Cancel Schedule"
										>
											<Trash2 class="w-4 h-4" />
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		<!-- Empty State when nothing is processing -->
		{#if !batchStatus && scheduledJobs.length === 0}
			<div class="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
				<div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
					<LayoutDashboard class="w-8 h-8 text-slate-400" />
				</div>
				<h3 class="text-lg font-bold text-slate-800">All Campaigns Dispatched</h3>
				<p class="text-slate-500 text-sm mt-1 max-w-sm mx-auto">There are no campaigns currently active or scheduled in the queue. You can compose a new one to start sending.</p>
				<a 
					href="/compose"
					class="mt-6 inline-block bg-primary hover:bg-primary-dark text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm shadow-md shadow-primary/10"
				>
					Compose Campaign
				</a>
			</div>
		{/if}
	{/if}
</div>
