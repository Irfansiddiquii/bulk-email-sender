<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { toastStore } from '$lib/stores/toastStore';
	import { dashboardApi } from '$lib/api/dashboard';
	import { sendApi } from '$lib/api/send';
	import { reportApi } from '$lib/api/report';
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

	// Past analytics stats state
	let stats = {
		total: 0,
		success: 0,
		failed: 0,
		successRate: '0%'
	};

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

	async function fetchStats() {
		try {
			const res = await reportApi.getReports();
			if (res.data.success) {
				const rawStats = res.data.data.stats || { total: 0, sent: 0, failed: 0, errors: 0 };
				const success = rawStats.sent || 0;
				const failed = (rawStats.failed || 0) + (rawStats.errors || 0);
				const total = rawStats.total || (success + failed);
				const successRate = total > 0 ? `${Math.round((success / total) * 100)}%` : '0%';
				
				stats = {
					total,
					success,
					failed,
					successRate
				};
			}
		} catch (err) {
			console.error('Error fetching dashboard stats:', err);
		}
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
					await fetchStats();
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
		await fetchStats();
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

<div class="space-y-8 select-none">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-2 border-b border-slate-100">
		<Header title="Campaign Dashboard" subtitle="Monitor live email sends, queues, and background automated actions" />
		<div class="flex items-center gap-3 self-end sm:self-auto">
			{#if lastUpdated}
				<span class="text-[10px] font-bold text-slate-500 bg-white border border-slate-200/50 px-3 py-2 rounded-xl flex items-center gap-2 shadow-sm">
					<span class="relative flex h-2 w-2">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
					</span>
					AUTO-UPDATED: {lastUpdated}
				</span>
			{/if}
			<button 
				on:click={() => refreshDashboard(true)}
				class="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 p-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 text-slate-600 shadow-sm flex items-center justify-center shrink-0"
				title="Sync Status"
			>
				<RefreshCw class="w-4 h-4" />
			</button>
		</div>
	</div>

	{#if loading}
		<!-- Modern Skeleton Loading state -->
		<div class="space-y-6">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each Array(4) as _}
					<div class="p-1.5 bg-[#090d16]/5 border border-slate-200/40 rounded-2xl animate-pulse">
						<div class="p-5 bg-white border border-slate-100 rounded-[calc(1rem-0.125rem)] shadow-soft h-[104px] flex items-center gap-4">
							<div class="w-11 h-11 bg-slate-100 rounded-xl shrink-0"></div>
							<div class="space-y-2 flex-grow">
								<div class="h-3 bg-slate-100 rounded w-1/2"></div>
								<div class="h-6 bg-slate-100 rounded w-3/4"></div>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="p-1.5 bg-[#090d16]/5 border border-slate-200/40 rounded-[2rem] animate-pulse">
				<div class="p-12 bg-white border border-slate-100 rounded-[calc(2rem-0.375rem)] shadow-soft flex flex-col items-center justify-center gap-4">
					<div class="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-500 animate-spin"></div>
					<div class="space-y-2 text-center w-full max-w-sm">
						<div class="h-4 bg-slate-100 rounded w-2/3 mx-auto"></div>
						<div class="h-3.5 bg-slate-100 rounded w-1/2 mx-auto"></div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Status Overview Cards -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Sent card -->
			<div class="p-1.5 bg-[#090d16]/5 border border-slate-200/45 rounded-2xl transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-0.5 hover:border-indigo-100/80 group">
				<div class="p-5 bg-white border border-slate-100/60 rounded-[calc(1rem-0.125rem)] shadow-soft flex items-start gap-4 h-full relative overflow-hidden">
					<div class="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-emerald-50/20 opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
					<div class="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 shrink-0 transition-transform duration-300 group-hover:scale-105">
						<MailCheck class="w-5 h-5" />
					</div>
					<div class="min-w-0">
						<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Sending Queue</span>
						<span class="text-xl font-extrabold text-slate-900 mt-1 block tracking-tight truncate">
							{#if batchStatus}
								{batchStatus.sent} / {batchStatus.total}
							{:else}
								Inactive
							{/if}
						</span>
						<span class="text-[10px] text-slate-400 font-medium block mt-1 truncate">
							{#if batchStatus}
								Campaign in progress
							{:else}
								No active send queue
							{/if}
						</span>
					</div>
				</div>
			</div>

			<!-- Scheduled Count Card -->
			<div class="p-1.5 bg-[#090d16]/5 border border-slate-200/45 rounded-2xl transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-0.5 hover:border-indigo-100/80 group">
				<div class="p-5 bg-white border border-slate-100/60 rounded-[calc(1rem-0.125rem)] shadow-soft flex items-start gap-4 h-full relative overflow-hidden">
					<div class="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-violet-50/20 opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
					<div class="p-2.5 bg-violet-50 border border-violet-100 rounded-xl text-violet-600 shrink-0 transition-transform duration-300 group-hover:scale-105">
						<Clock class="w-5 h-5" />
					</div>
					<div class="min-w-0">
						<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Scheduled Sends</span>
						<span class="text-xl font-extrabold text-slate-900 mt-1 block tracking-tight truncate">
							{scheduledJobs.length}
						</span>
						<span class="text-[10px] text-slate-400 font-medium block mt-1 truncate">
							Upcoming campaigns
						</span>
					</div>
				</div>
			</div>

			<!-- Total Emails Sent Card -->
			<div class="p-1.5 bg-[#090d16]/5 border border-slate-200/45 rounded-2xl transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-0.5 hover:border-indigo-100/80 group">
				<div class="p-5 bg-white border border-slate-100/60 rounded-[calc(1rem-0.125rem)] shadow-soft flex items-start gap-4 h-full relative overflow-hidden">
					<div class="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-indigo-50/20 opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
					<div class="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0 transition-transform duration-300 group-hover:scale-105">
						<BarChart2 class="w-5 h-5" />
					</div>
					<div class="min-w-0">
						<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Attempts</span>
						<span class="text-xl font-extrabold text-slate-900 mt-1 block tracking-tight truncate">
							{stats.total}
						</span>
						<span class="text-[10px] text-slate-400 font-medium block mt-1 truncate">
							All campaign dispatches
						</span>
					</div>
				</div>
			</div>

			<!-- Delivery Success Rate Card -->
			<div class="p-1.5 bg-[#090d16]/5 border border-slate-200/45 rounded-2xl transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-0.5 hover:border-indigo-100/80 group">
				<div class="p-5 bg-white border border-slate-100/60 rounded-[calc(1rem-0.125rem)] shadow-soft flex items-start gap-4 h-full relative overflow-hidden">
					<div class="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-blue-50/20 opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
					<div class="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 shrink-0 transition-transform duration-300 group-hover:scale-105">
						<CheckCircle class="w-5 h-5" />
					</div>
					<div class="min-w-0">
						<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Success Rate</span>
						<span class="text-xl font-extrabold text-slate-900 mt-1 block tracking-tight truncate">
							{stats.successRate}
						</span>
						<span class="text-[10px] text-slate-400 font-medium block mt-1 truncate">
							Delivery accuracy rate
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Live Send Monitor (Progress Bar) -->
		{#if batchStatus}
			<div class="p-1.5 bg-[#090d16]/5 border border-slate-200/40 rounded-[2rem] transition-all duration-300 hover:border-slate-200 shadow-soft">
				<div class="bg-white border border-slate-100 p-6 md:p-8 rounded-[calc(2rem-0.375rem)] space-y-6">
					<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div>
							<span class="bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-[9px] tracking-[0.12em] uppercase px-3 py-1 rounded-full inline-block mb-2">
								{#if batchStatus.isPaused}
									PAUSED
								{:else}
									ACTIVE DISPATCH CAMPAIGN
								{/if}
							</span>
							<h3 class="font-extrabold text-lg text-slate-900 tracking-tight">Campaign Dispatch Progress</h3>
						</div>
						<div class="flex gap-2.5 self-stretch sm:self-auto">
							{#if batchStatus.isPaused}
								<button 
									on:click={resumeBatch}
									class="flex-grow sm:flex-grow-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-emerald-600/15"
								>
									<Play class="w-3.5 h-3.5 fill-white" />
									Resume Send
								</button>
							{:else}
								<button 
									on:click={pauseBatch}
									class="flex-grow sm:flex-grow-0 bg-amber-500 hover:bg-amber-650 text-white font-bold px-4 py-2.5 rounded-xl text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-amber-500/15"
								>
									<Pause class="w-3.5 h-3.5 fill-white" />
									Pause Send
								</button>
							{/if}
							<button 
								on:click={cancelBatch}
								class="flex-grow sm:flex-grow-0 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-bold px-4 py-2.5 rounded-xl text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
							>
								<Trash2 class="w-3.5 h-3.5" />
								Cancel Queue
							</button>
						</div>
					</div>

					<!-- Progress bar layout -->
					<div class="space-y-3 pt-2">
						<div class="flex justify-between text-xs font-semibold">
							<span class="text-slate-500">Sent emails: <strong class="text-slate-800">{batchStatus.sent}</strong> / <strong class="text-slate-800">{batchStatus.total}</strong></span>
							<span class="text-indigo-600 font-bold tracking-tight">{percentComplete}% Complete</span>
						</div>
						<div class="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5 border border-slate-200/50 shadow-inner">
							<div 
								class="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] relative overflow-hidden" 
								style="width: {percentComplete}%"
							>
								<!-- Light beam overlay for running progress -->
								{#if !batchStatus.isPaused}
									<div class="absolute inset-0 bg-white/20 animate-pulse"></div>
								{/if}
							</div>
						</div>
					</div>

					<!-- Secondary details -->
					<div class="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-100 text-xs">
						<div class="space-y-1">
							<span class="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Delivered</span>
							<span class="font-extrabold text-emerald-600 text-base block">{batchStatus.sent - batchStatus.failed}</span>
						</div>
						<div class="space-y-1">
							<span class="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Failed Sends</span>
							<span class="font-extrabold text-rose-600 text-base block">{batchStatus.failed}</span>
						</div>
						<div class="space-y-1">
							<span class="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Time Remaining</span>
							<span class="font-extrabold text-slate-800 text-base block">{timeRemainingText()}</span>
						</div>
						<div class="space-y-1">
							<span class="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Rate delay</span>
							<span class="font-extrabold text-slate-800 text-base block">{batchStatus.emailDelay}s / email</span>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Scheduled Campaigns List -->
		{#if scheduledJobs.length > 0}
			<div class="p-1.5 bg-[#090d16]/5 border border-slate-200/40 rounded-[2rem] shadow-soft">
				<div class="bg-white border border-slate-100 p-6 rounded-[calc(2rem-0.375rem)] space-y-5">
					<div class="flex items-center justify-between border-b border-slate-100 pb-3">
						<h3 class="font-extrabold text-slate-900 text-base tracking-tight">Scheduled Campaigns</h3>
						<span class="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">
							{scheduledJobs.length} active
						</span>
					</div>
					<div class="overflow-x-auto -mx-6 md:mx-0">
						<table class="w-full text-left border-collapse min-w-[650px] md:min-w-0">
							<thead>
								<tr class="text-[10px] uppercase text-slate-400 font-bold border-b border-slate-100/80 bg-slate-50/50">
									<th class="px-6 py-4 font-bold tracking-wider">Subject / Name</th>
									<th class="px-6 py-4 font-bold tracking-wider">Scheduled Time</th>
									<th class="px-6 py-4 font-bold tracking-wider">Recipient Count</th>
									<th class="px-6 py-4 font-bold tracking-wider">Notify Email</th>
									<th class="px-6 py-4 font-bold tracking-wider">Status</th>
									<th class="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-100/60 text-xs">
								{#each scheduledJobs as job (job.id)}
									<tr class="hover:bg-slate-50/40 transition-all duration-200 group">
										<td class="px-6 py-4 font-bold text-slate-800">{job.subject || 'Campaign'}</td>
										<td class="px-6 py-4 text-slate-500 font-medium">{new Date(job.scheduled_time).toLocaleString()}</td>
										<td class="px-6 py-4 text-slate-700 font-semibold">{job.contact_count || 'All contacts'}</td>
										<td class="px-6 py-4 text-slate-500 font-medium">{job.notify_email || 'None'}</td>
										<td class="px-6 py-4">
											{#if job.status === 'running'}
												<span class="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-600 font-extrabold text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-full animate-pulse">
													<span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
													Running
												</span>
											{:else}
												<span class="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-600 font-extrabold text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-full">
													<span class="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
													Scheduled
												</span>
											{/if}
										</td>
										<td class="px-6 py-4 text-right">
											<button 
												on:click={() => cancelScheduledJob(job.id)}
												class="p-2 text-rose-500 hover:text-rose-600 bg-transparent hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-95 group-hover:opacity-100 md:opacity-80"
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
			</div>
		{/if}

		<!-- Empty State when nothing is processing -->
		{#if !batchStatus && scheduledJobs.length === 0}
			<div class="p-1.5 bg-[#090d16]/5 border border-slate-200/30 rounded-[2rem] shadow-soft max-w-2xl mx-auto mt-6">
				<div class="bg-white border border-slate-100 rounded-[calc(2rem-0.375rem)] p-12 text-center flex flex-col items-center">
					<!-- Custom visual mail vector illustration -->
					<div class="relative w-24 h-24 mb-6 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-3xl shadow-sm">
						<!-- Mail icon vector backdrop -->
						<div class="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-3xl opacity-60"></div>
						<div class="absolute -top-2 -right-2 p-1.5 bg-emerald-500 text-white rounded-xl shadow-sm shadow-emerald-500/10">
							<CheckCircle class="w-4 h-4" />
						</div>
						<LayoutDashboard class="w-10 h-10 text-slate-400 relative z-10" />
					</div>
					
					<h3 class="text-xl font-extrabold text-slate-900 tracking-tight">All Campaigns Dispatched</h3>
					<p class="text-slate-500 text-xs md:text-sm mt-2 max-w-sm leading-relaxed font-medium">There are no campaigns currently active or scheduled in the queue. You can compose a new one to start sending.</p>
					
					<!-- Island CTA Button -->
					<a 
						href="/compose"
						class="mt-8 group inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white text-[11px] font-bold uppercase tracking-wider px-6 py-3.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
					>
						<span>Compose Campaign</span>
						<!-- Button in button trailing icon -->
						<span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
							<svg class="w-3 h-3 text-white fill-none stroke-current" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
						</span>
					</a>
				</div>
			</div>
		{/if}
	{/if}
</div>
