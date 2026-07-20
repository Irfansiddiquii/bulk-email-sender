<script lang="ts">
	import { onMount } from 'svelte';
	import { toastStore } from '$lib/stores/toastStore';
	import { reportApi } from '$lib/api/report';
	import Header from '$lib/components/layout/Header.svelte';
	import { History, Search, FileSpreadsheet, FileJson, Trash2, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-svelte';

	let loading = true;
	let logs: any[] = [];
	let searchFilter = '';
	let statusFilter = 'ALL';
	let currentPage = 1;
	let itemsPerPage = 20;

	onMount(async () => {
		await loadHistory();
	});

	async function loadHistory(silent = false) {
		if (!silent) loading = true;
		try {
			const res = await reportApi.getReports();
			if (res.data.success) {
				logs = (res.data.data.logs || []).map((log: any) => {
					let message = log.message;
					if (!message) {
						if (log.status === 'Sent') {
							message = `Email successfully sent to ${log.email} (MsgID: ${log.messageId || 'N/A'})`;
						} else {
							message = `${log.status} status for ${log.email}`;
						}
					}
					return {
						...log,
						message
					};
				});
			}
		} catch (err) {
			console.error('Error fetching history:', err);
		} finally {
			loading = false;
		}
	}

	function downloadCSV() {
		window.open(reportApi.getCSVExportURL(), '_blank');
		toastStore.success('CSV log export file download started.');
	}

	function downloadJSON() {
		window.open(reportApi.getJSONExportURL(), '_blank');
		toastStore.success('JSON log export file download started.');
	}

	async function purgeLogs() {
		if (confirm('Clear entire campaign dispatch log history? This cannot be undone.')) {
			try {
				const res = await reportApi.clearLogs();
				if (res.data.success) {
					toastStore.success('History logs purged.');
					await loadHistory();
				}
			} catch (err: any) {
				toastStore.danger(err.response?.data?.message || 'Failed to purge history logs.');
			}
		}
	}

	$: filteredLogs = logs.filter(log => {
		const matchesSearch = log.email?.toLowerCase().includes(searchFilter.toLowerCase()) || 
		                      log.subject?.toLowerCase().includes(searchFilter.toLowerCase()) ||
		                      log.message?.toLowerCase().includes(searchFilter.toLowerCase());

		if (statusFilter === 'ALL') return matchesSearch;
		const logStatus = log.status?.toUpperCase();
		if (statusFilter === 'SUCCESS') {
			return matchesSearch && (logStatus === 'SUCCESS' || logStatus === 'SENT');
		}
		return matchesSearch && logStatus === statusFilter;
	});

	$: totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
	$: paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	$: if (searchFilter || statusFilter) {
		currentPage = 1;
	}
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<Header title="Delivery History Logs" subtitle="Review full record of past campaign email dispatches and error traces" />
		<div class="flex gap-2">
			<button 
				on:click={downloadCSV}
				disabled={logs.length === 0}
				class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-40"
			>
				<FileSpreadsheet class="w-4 h-4 text-emerald-600 shrink-0" />
				CSV Export
			</button>
			<button 
				on:click={downloadJSON}
				disabled={logs.length === 0}
				class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-40"
			>
				<FileJson class="w-4 h-4 text-orange-500 shrink-0" />
				JSON Export
			</button>
			<button 
				on:click={() => loadHistory(false)}
				class="bg-white border border-slate-200 hover:bg-slate-50 p-2.5 rounded-xl transition-all text-slate-600 shadow-sm"
				title="Sync Logs"
			>
				<RefreshCw class="w-4.5 h-4.5" />
			</button>
		</div>
	</div>

	{#if loading}
		<div class="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center">
			<div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-3"></div>
			<p class="text-slate-500 text-sm">Syncing history logs...</p>
		</div>
	{:else}
		<!-- Search and status filters -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<div class="relative sm:col-span-2">
				<span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
					<Search class="w-4 h-4" />
				</span>
				<input 
					type="text" 
					bind:value={searchFilter} 
					aria-label="Search history logs"
					placeholder="Search history by recipient, subject, or campaign keyword..."
					class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
				/>
			</div>

			<div>
				<select 
					bind:value={statusFilter}
					aria-label="Filter by status"
					class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white text-slate-700 font-semibold"
				>
					<option value="ALL">All Statuses</option>
					<option value="SUCCESS">Success</option>
					<option value="FAILED">Failed</option>
					<option value="ERROR">Error</option>
				</select>
			</div>
		</div>

		<!-- Log list table card -->
		<div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
			<div class="flex justify-between items-center border-b border-slate-100 pb-3">
				<h3 class="font-bold text-slate-800 text-base">Campaign Delivery Reports</h3>
				{#if logs.length > 0}
					<button 
						on:click={purgeLogs}
						class="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
					>
						<Trash2 class="w-3.5 h-3.5" />
						Purge History Logs
					</button>
				{/if}
			</div>

			{#if filteredLogs.length === 0}
				<div class="text-center text-slate-400 py-12 text-sm flex flex-col items-center justify-center">
					<History class="w-12 h-12 text-slate-300 mb-3" />
					<span>No matching log history records found.</span>
				</div>
			{:else}
				<div class="overflow-x-auto border border-slate-100 rounded-xl">
					<table class="w-full text-xs text-left text-slate-500">
						<thead class="bg-slate-50 text-[10px] uppercase text-slate-400 border-b border-slate-100 font-bold">
							<tr>
								<th class="px-5 py-3 font-bold w-40">Timestamp</th>
								<th class="px-5 py-3 font-bold">Recipient Email</th>
								<th class="px-5 py-3 font-bold">Subject Line</th>
								<th class="px-5 py-3 font-bold w-24">Status</th>
								<th class="px-5 py-3 font-bold">Log Details</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-100">
							{#each paginatedLogs as log}
								<tr class="hover:bg-slate-50/50 transition-colors align-top font-medium">
									<td class="px-5 py-3 text-slate-400 font-mono select-all">
										{new Date(log.timestamp).toLocaleString()}
									</td>
									<td class="px-5 py-3 text-slate-800 select-all font-mono font-bold">{log.email}</td>
									<td class="px-5 py-3 text-slate-700 truncate max-w-[150px] font-semibold">{log.subject || '-'}</td>
									<td class="px-5 py-3 w-24">
										{#if log.status?.toUpperCase() === 'SUCCESS' || log.status?.toUpperCase() === 'SENT'}
											<span class="bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[9px]">Success</span>
										{:else if log.status?.toUpperCase() === 'FAILED'}
											<span class="bg-rose-50 border border-rose-200 text-rose-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[9px]">Failed</span>
										{:else}
											<span class="bg-amber-50 border border-amber-200 text-amber-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[9px]">Error</span>
										{/if}
									</td>
									<td class="px-5 py-3 text-slate-500 font-mono leading-relaxed select-all">{log.message || '-'}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Pagination footer -->
				{#if totalPages > 1}
					<div class="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
						<span class="text-slate-400 font-semibold">
							Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
						</span>
						<div class="flex items-center gap-1">
							<button 
								on:click={() => currentPage = Math.max(1, currentPage - 1)}
								disabled={currentPage === 1}
								class="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
							>
								<ChevronLeft class="w-4 h-4 text-slate-600" />
							</button>
							<span class="px-3 font-bold text-slate-700">Page {currentPage} of {totalPages}</span>
							<button 
								on:click={() => currentPage = Math.min(totalPages, currentPage + 1)}
								disabled={currentPage === totalPages}
								class="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
							>
								<ChevronRight class="w-4 h-4 text-slate-600" />
							</button>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>
