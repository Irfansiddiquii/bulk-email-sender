<script lang="ts">
	import { onMount } from 'svelte';
	import { toastStore } from '$lib/stores/toastStore';
	import { reportApi } from '$lib/api/report';
	import Header from '$lib/components/layout/Header.svelte';
	import { BarChart3, MailCheck, ShieldAlert, Sparkles, FileSpreadsheet, FileJson, Trash2, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-svelte';

	let loading = true;
	let logs: any[] = [];
	let stats = {
		total: 0,
		success: 0,
		failed: 0,
		successRate: '0%'
	};

	// Search & Filter
	let searchFilter = '';
	let levelFilter = 'ALL';
	let currentPage = 1;
	let itemsPerPage = 20;

	onMount(async () => {
		await loadReportData();
	});

	async function loadReportData(silent = false) {
		if (!silent) loading = true;
		try {
			const res = await reportApi.getReports();
			if (res.data.success) {
				const rawLogs = res.data.data.logs || [];
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

				logs = rawLogs.map((log: any) => {
					const isErr = log.status === 'Failed' || log.status === 'Error';
					const level = isErr ? 'ERROR' : 'INFO';
					let message = log.message;
					if (!message) {
						if (log.status === 'Sent') {
							message = `Email successfully sent to ${log.email} (Subject: "${log.subject || ''}", MsgID: ${log.messageId || 'N/A'})`;
						} else {
							message = `${log.status} status for ${log.email}`;
						}
					}
					return {
						...log,
						level,
						message
					};
				});
			}
		} catch (err) {
			console.error('Error fetching report:', err);
			toastStore.danger('Failed to load campaign analytics reports.');
		} finally {
			loading = false;
		}
	}

	async function clearLogs() {
		if (confirm('Are you sure you want to purge all delivery logs? This action is irreversible.')) {
			try {
				const res = await reportApi.clearLogs();
				if (res.data.success) {
					toastStore.success('Logs purged successfully.');
					await loadReportData();
				}
			} catch (err: any) {
				toastStore.danger(err.response?.data?.message || 'Failed to purge logs.');
			}
		}
	}

	function downloadCSV() {
		window.open(reportApi.getCSVExportURL(), '_blank');
		toastStore.success('CSV export file download started.');
	}

	function downloadJSON() {
		window.open(reportApi.getJSONExportURL(), '_blank');
		toastStore.success('JSON export file download started.');
	}

	// Filter & Paginate
	$: filteredLogs = logs.filter(log => {
		const matchesSearch = log.message?.toLowerCase().includes(searchFilter.toLowerCase()) || 
		                      log.level?.toLowerCase().includes(searchFilter.toLowerCase()) ||
		                      log.timestamp?.includes(searchFilter);
		
		if (levelFilter === 'ALL') return matchesSearch;
		if (levelFilter === 'INFO') return matchesSearch && log.level?.toUpperCase() === 'INFO';
		if (levelFilter === 'ERROR') return matchesSearch && log.level?.toUpperCase() === 'ERROR';
		if (levelFilter === 'WARN') return matchesSearch && (log.level?.toUpperCase() === 'WARN' || log.level?.toUpperCase() === 'WARNING');
		return matchesSearch;
	});

	$: totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
	$: paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	$: if (searchFilter || levelFilter) {
		currentPage = 1;
	}
</script>

<div class="space-y-6 sm:space-y-8 w-full">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<Header title="Delivery Reports & Logs" subtitle="Review past dispatch statistics, delivery successes, and error logs" />
		<div class="flex gap-2 text-sm">
			<button 
				on:click={downloadCSV}
				disabled={logs.length === 0}
				class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-40 shadow-sm"
			>
				<FileSpreadsheet class="w-4 h-4 text-emerald-600 shrink-0" />
				Export CSV
			</button>
			<button 
				on:click={downloadJSON}
				disabled={logs.length === 0}
				class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-40 shadow-sm"
			>
				<FileJson class="w-4 h-4 text-orange-500 shrink-0" />
				Export JSON
			</button>
			<button 
				on:click={() => loadReportData(false)}
				class="bg-white border border-slate-200 hover:bg-slate-50 p-2.5 rounded-xl transition-all text-slate-600 shadow-sm"
				title="Sync Reports"
			>
				<RefreshCw class="w-4.5 h-4.5" />
			</button>
		</div>
	</div>

	{#if loading}
		<div class="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center">
			<div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-3"></div>
			<p class="text-slate-500 text-sm">Retrieving campaign logs...</p>
		</div>
	{:else}
		<!-- Stats Grid -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
			<!-- Total Sent -->
			<div class="bg-white rounded-2xl border border-slate-200/60 p-4.5 shadow-sm flex items-start gap-4">
				<div class="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0">
					<BarChart3 class="w-5 h-5" />
				</div>
				<div>
					<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Attempts</span>
					<span class="text-xl font-bold text-slate-800 mt-1 block">{stats.total}</span>
				</div>
			</div>

			<!-- Success -->
			<div class="bg-white rounded-2xl border border-slate-200/60 p-4.5 shadow-sm flex items-start gap-4">
				<div class="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 shrink-0">
					<MailCheck class="w-5 h-5" />
				</div>
				<div>
					<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Successful Sends</span>
					<span class="text-xl font-bold text-slate-800 mt-1 block">{stats.success}</span>
				</div>
			</div>

			<!-- Failed -->
			<div class="bg-white rounded-2xl border border-slate-200/60 p-4.5 shadow-sm flex items-start gap-4">
				<div class="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0">
					<ShieldAlert class="w-5 h-5" />
				</div>
				<div>
					<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Failed Sends</span>
					<span class="text-xl font-bold text-slate-800 mt-1 block">{stats.failed}</span>
				</div>
			</div>

			<!-- Success Rate -->
			<div class="bg-white rounded-2xl border border-slate-200/60 p-4.5 shadow-sm flex items-start gap-4">
				<div class="p-2.5 bg-violet-50 border border-violet-100 rounded-xl text-violet-600 shrink-0">
					<Sparkles class="w-5 h-5" />
				</div>
				<div>
					<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delivery Rate</span>
					<span class="text-xl font-bold text-slate-800 mt-1 block">{stats.successRate}</span>
				</div>
			</div>
		</div>

		<!-- Log Viewer Panel -->
		<div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
			<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<h3 class="font-bold text-slate-800 text-base">Detailed Activity Logs</h3>
				{#if logs.length > 0}
					<button 
						on:click={clearLogs}
						class="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors self-end"
					>
						<Trash2 class="w-3.5 h-3.5" />
						Purge Logs
					</button>
				{/if}
			</div>

			<!-- Search / filters -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<!-- Search box -->
				<div class="relative sm:col-span-2">
					<span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
						<Search class="w-4 h-4" />
					</span>
					<input 
						type="text" 
						bind:value={searchFilter} 
						aria-label="Search logs"
						placeholder="Search logs by message details or timestamp..."
						class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
					/>
				</div>

				<!-- Level drop filter -->
				<div>
					<select 
						bind:value={levelFilter}
						aria-label="Filter by level"
						class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
					>
						<option value="ALL">All Levels</option>
						<option value="INFO">Info</option>
						<option value="WARN">Warnings</option>
						<option value="ERROR">Errors</option>
					</select>
				</div>
			</div>

			<!-- Logs table list -->
			{#if filteredLogs.length === 0}
				<div class="border border-slate-100 rounded-xl p-12 text-center text-slate-400 text-sm bg-slate-50/50">
					No matching log entries found.
				</div>
			{:else}
				<div class="overflow-x-auto border border-slate-100 rounded-xl">
					<table class="w-full text-xs text-left text-slate-500">
						<thead class="bg-slate-50 text-[10px] uppercase text-slate-400 border-b border-slate-100 font-bold">
							<tr>
								<th class="px-5 py-3 font-bold">Timestamp</th>
								<th class="px-5 py-3 font-bold w-20">Level</th>
								<th class="px-5 py-3 font-bold">Log Details</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-100">
							{#each paginatedLogs as log}
								<tr class="hover:bg-slate-50/50 transition-colors align-top font-medium">
									<td class="px-5 py-3 text-slate-400 select-all font-mono">
										{new Date(log.timestamp).toLocaleString()}
									</td>
									<td class="px-5 py-3 w-20">
										{#if log.level?.toUpperCase() === 'ERROR'}
											<span class="bg-rose-50 border border-rose-200 text-rose-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[9px]">Error</span>
										{:else}
											<span class="bg-indigo-50 border border-indigo-200 text-indigo-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[9px]">Info</span>
										{/if}
									</td>
									<td class="px-5 py-3 text-slate-700 whitespace-pre-wrap select-all font-mono leading-relaxed">{log.message}</td>
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
