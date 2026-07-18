<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { toastStore } from '$lib/stores/toastStore';
	import { sendApi } from '$lib/api/send';
	import Header from '$lib/components/layout/Header.svelte';
	import { Calendar, Trash2, Clock, Mail, AlertCircle, RefreshCw } from 'lucide-svelte';

	let loading = true;
	let scheduledJobs: any[] = [];
	let timer: NodeJS.Timeout | null = null;

	onMount(async () => {
		await loadScheduledJobs();
		// Poll scheduled jobs every 15 seconds while on this page
		timer = setInterval(loadScheduledJobs, 15000);
	});

	onDestroy(() => {
		if (timer) {
			clearInterval(timer);
		}
	});

	async function loadScheduledJobs() {
		try {
			const res = await sendApi.getScheduledJobs();
			if (res.data.success) {
				scheduledJobs = res.data.data || [];
			}
		} catch (err) {
			console.error('Error fetching scheduled jobs:', err);
		} finally {
			loading = false;
		}
	}

	async function cancelJob(id: string, subject: string) {
		if (confirm(`Cancel scheduled campaign "${subject}"?`)) {
			try {
				const res = await sendApi.deleteScheduledJob(id);
				if (res.data.success) {
					toastStore.success('Scheduled campaign cancelled successfully.');
					await loadScheduledJobs();
				} else {
					toastStore.danger(res.data.message || 'Failed to cancel job.');
				}
			} catch (err: any) {
				toastStore.danger(err.response?.data?.message || 'Failed to cancel scheduled campaign.');
			}
		}
	}
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<Header title="Automation Scheduler" subtitle="View and manage automated campaigns set to dispatch in the future" />
		<button 
			on:click={loadScheduledJobs}
			class="bg-white border border-slate-200 hover:bg-slate-50 p-2.5 rounded-xl transition-all text-slate-600 shadow-sm"
			title="Refresh Schedules"
		>
			<RefreshCw class="w-4.5 h-4.5" />
		</button>
	</div>

	{#if loading}
		<div class="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center">
			<div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-3"></div>
			<p class="text-slate-500 text-sm">Retrieving active schedules...</p>
		</div>
	{:else}
		<div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
			{#if scheduledJobs.length === 0}
				<div class="text-center text-slate-400 py-12 text-sm flex flex-col items-center justify-center">
					<Calendar class="w-12 h-12 text-slate-300 mb-3" />
					<span>No upcoming campaigns currently scheduled.</span>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-sm text-left text-slate-500">
						<thead class="text-xs uppercase bg-slate-50 text-slate-400 border-b border-slate-100 font-bold">
							<tr>
								<th class="px-6 py-4 font-bold">Campaign Subject</th>
								<th class="px-6 py-4 font-bold">Scheduled Execution Time</th>
								<th class="px-6 py-4 font-bold">Recipients</th>
								<th class="px-6 py-4 font-bold">Notification Status</th>
								<th class="px-6 py-4 font-bold">Execution Status</th>
								<th class="px-6 py-4 font-bold text-right w-20">Cancel</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-100">
							{#each scheduledJobs as job (job.id)}
								<tr class="hover:bg-slate-50/50 transition-colors">
									<td class="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
										<Mail class="w-4 h-4 text-indigo-500 shrink-0" />
										{job.subject || 'Mailing Campaign'}
									</td>
									<td class="px-6 py-4 font-medium text-slate-700">
										{new Date(job.scheduled_time).toLocaleString()}
									</td>
									<td class="px-6 py-4 font-semibold text-slate-700">{job.contact_count || 'All'}</td>
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
											on:click={() => cancelJob(job.id, job.subject)}
											disabled={job.status === 'running'}
											class="p-2 text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
											title="Cancel Campaign"
										>
											<Trash2 class="w-4 h-4" />
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	{/if}
</div>
