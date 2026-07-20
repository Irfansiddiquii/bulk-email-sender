<script lang="ts">
	import { onMount } from "svelte";
	import { toastStore } from "$lib/stores/toastStore";
	import { reportApi } from "$lib/api/report";
	import Header from "$lib/components/layout/Header.svelte";
	import {
		History,
		Search,
		FileSpreadsheet,
		FileJson,
		Trash2,
		ChevronLeft,
		ChevronRight,
		RefreshCw,
		AlertCircle,
		Download,
		ChevronDown,
		Check,
	} from "lucide-svelte";

	let loading = true;
	let logs: any[] = [];
	let searchFilter = "";
	let statusFilter = "ALL";
	let currentPage = 1;
	let itemsPerPage = 20;

	// Dropdown states
	let exportDropdownOpen = false;
	let statusDropdownOpen = false;

	onMount(async () => {
		await loadHistory();
	});

	function toggleExportDropdown(e: MouseEvent) {
		e.stopPropagation();
		exportDropdownOpen = !exportDropdownOpen;
		statusDropdownOpen = false;
	}

	function toggleStatusDropdown(e: MouseEvent) {
		e.stopPropagation();
		statusDropdownOpen = !statusDropdownOpen;
		exportDropdownOpen = false;
	}

	function selectStatus(status: string) {
		statusFilter = status;
		statusDropdownOpen = false;
	}

	function closeAllDropdowns() {
		exportDropdownOpen = false;
		statusDropdownOpen = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			closeAllDropdowns();
		}
	}

	async function loadHistory(silent = false) {
		if (!silent) loading = true;
		try {
			const res = await reportApi.getReports();
			if (res.data.success) {
				logs = (res.data.data.logs || []).map((log: any) => {
					let message = log.message;
					if (!message) {
						if (log.status === "Sent") {
							message = `Email successfully sent to ${log.email} (MsgID: ${log.messageId || "N/A"})`;
						} else {
							message = `${log.status} status for ${log.email}`;
						}
					}
					return {
						...log,
						message,
					};
				});
			}
		} catch (err) {
			console.error("Error fetching history:", err);
		} finally {
			loading = false;
		}
	}

	function downloadCSV() {
		window.open(reportApi.getCSVExportURL(), "_blank");
		toastStore.success("CSV log export file download started.");
	}

	function downloadJSON() {
		window.open(reportApi.getJSONExportURL(), "_blank");
		toastStore.success("JSON log export file download started.");
	}

	async function purgeLogs() {
		if (
			confirm(
				"Clear entire campaign dispatch log history? This cannot be undone.",
			)
		) {
			try {
				const res = await reportApi.clearLogs();
				if (res.data.success) {
					toastStore.success("History logs purged.");
					await loadHistory();
				}
			} catch (err: any) {
				toastStore.danger(
					err.response?.data?.message ||
						"Failed to purge history logs.",
				);
			}
		}
	}

	$: filteredLogs = logs.filter((log) => {
		const matchesSearch =
			log.email?.toLowerCase().includes(searchFilter.toLowerCase()) ||
			log.subject?.toLowerCase().includes(searchFilter.toLowerCase()) ||
			log.message?.toLowerCase().includes(searchFilter.toLowerCase());

		if (statusFilter === "ALL") return matchesSearch;
		const logStatus = log.status?.toUpperCase();
		if (statusFilter === "SUCCESS") {
			return (
				matchesSearch &&
				(logStatus === "SUCCESS" || logStatus === "SENT")
			);
		}
		return matchesSearch && logStatus === statusFilter;
	});

	$: totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
	$: paginatedLogs = filteredLogs.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	$: if (searchFilter || statusFilter) {
		currentPage = 1;
	}
</script>

<svelte:window on:click={closeAllDropdowns} on:keydown={handleKeydown} />

<div class="space-y-6">
	<!-- Page Header -->
	<Header
		title="Delivery History Logs"
		subtitle="Review full record of past campaign email dispatches and error traces"
	/>

	{#if loading}
		<div
			class="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center"
		>
			<div
				class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-3"
			></div>
			<p class="text-slate-500 text-sm">Syncing history logs...</p>
		</div>
	{:else}
		<!-- Unified Filter & Action Toolbar -->
		<div
			class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3"
		>
			<div
				class="flex flex-col sm:flex-row items-center gap-3 flex-grow max-w-3xl"
			>
				<!-- Search History Input -->
				<div class="relative flex-grow w-full">
					<span
						class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"
					>
						<Search class="w-4 h-4" />
					</span>
					<input
						type="text"
						bind:value={searchFilter}
						aria-label="Search history logs"
						placeholder="Search history by recipient, subject, or campaign keyword..."
						class="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white text-slate-800 shadow-2xs placeholder:text-slate-400"
					/>
				</div>

				<!-- Premium Custom Status Filter Dropdown -->
				<div class="relative w-full sm:w-48 shrink-0 select-none">
					<button
						type="button"
						on:click={toggleStatusDropdown}
						aria-expanded={statusDropdownOpen}
						aria-haspopup="true"
						class="w-full h-10 px-3.5 bg-white hover:bg-slate-50/90 border border-slate-200 text-xs md:text-sm font-semibold text-slate-700 flex items-center justify-between rounded-xl transition-all duration-200 shadow-2xs active:scale-[0.98] group"
					>
						<div class="flex items-center gap-2 truncate">
							<span
								class="w-2 h-2 rounded-full shrink-0 {statusFilter ===
								'ALL'
									? 'bg-slate-400'
									: statusFilter === 'SUCCESS'
										? 'bg-emerald-500'
										: statusFilter === 'FAILED'
											? 'bg-rose-500'
											: 'bg-amber-500'}"
							></span>
							<span class="truncate"
								>{statusFilter === "ALL"
									? "All Status"
									: statusFilter === "SUCCESS"
										? "Success"
										: statusFilter === "FAILED"
											? "Failed"
											: "Error"}</span
							>
						</div>
						<ChevronDown
							class="w-3.5 h-3.5 text-slate-400 transition-transform duration-300 group-hover:text-slate-600 {statusDropdownOpen
								? 'rotate-180 text-primary'
								: ''}"
						/>
					</button>

					{#if statusDropdownOpen}
						<div
							class="absolute left-0 sm:right-0 top-full mt-2 w-full min-w-[180px] bg-white border border-slate-200/90 rounded-2xl p-1.5 shadow-xl shadow-slate-900/10 z-40 space-y-1 transition-all duration-200 animate-in fade-in slide-in-from-top-2"
							on:click|stopPropagation
						>
							<button
								type="button"
								on:click={() => selectStatus("ALL")}
								class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors {statusFilter ===
								'ALL'
									? 'bg-indigo-50/80 text-indigo-700 font-bold'
									: 'text-slate-700 hover:bg-slate-50'}"
							>
								<div class="flex items-center gap-2">
									<span
										class="w-2 h-2 rounded-full bg-slate-400"
									></span>
									<span>All Status</span>
								</div>
								{#if statusFilter === "ALL"}
									<Check
										class="w-3.5 h-3.5 text-indigo-600"
									/>
								{/if}
							</button>

							<button
								type="button"
								on:click={() => selectStatus("SUCCESS")}
								class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors {statusFilter ===
								'SUCCESS'
									? 'bg-emerald-50/80 text-emerald-700 font-bold'
									: 'text-slate-700 hover:bg-slate-50'}"
							>
								<div class="flex items-center gap-2">
									<span
										class="w-2 h-2 rounded-full bg-emerald-500"
									></span>
									<span>Success</span>
								</div>
								{#if statusFilter === "SUCCESS"}
									<Check
										class="w-3.5 h-3.5 text-emerald-600"
									/>
								{/if}
							</button>

							<button
								type="button"
								on:click={() => selectStatus("FAILED")}
								class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors {statusFilter ===
								'FAILED'
									? 'bg-rose-50/80 text-rose-700 font-bold'
									: 'text-slate-700 hover:bg-slate-50'}"
							>
								<div class="flex items-center gap-2">
									<span
										class="w-2 h-2 rounded-full bg-rose-500"
									></span>
									<span>Failed</span>
								</div>
								{#if statusFilter === "FAILED"}
									<Check class="w-3.5 h-3.5 text-rose-600" />
								{/if}
							</button>

							<button
								type="button"
								on:click={() => selectStatus("ERROR")}
								class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors {statusFilter ===
								'ERROR'
									? 'bg-amber-50/80 text-amber-700 font-bold'
									: 'text-slate-700 hover:bg-slate-50'}"
							>
								<div class="flex items-center gap-2">
									<span
										class="w-2 h-2 rounded-full bg-amber-500"
									></span>
									<span>Error</span>
								</div>
								{#if statusFilter === "ERROR"}
									<Check class="w-3.5 h-3.5 text-amber-600" />
								{/if}
							</button>
						</div>
					{/if}
				</div>
			</div>

			<!-- Compact Export & Sync Actions -->
			<div
				class="flex items-center gap-2 shrink-0 self-end md:self-auto select-none"
			>
				<!-- Export Dropdown -->
				<div class="relative">
					<button
						type="button"
						on:click={toggleExportDropdown}
						aria-expanded={exportDropdownOpen}
						aria-haspopup="true"
						class="h-10 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold px-3.5 rounded-xl text-xs md:text-sm flex items-center gap-2 transition-all shadow-2xs active:scale-[0.98] group"
					>
						<Download
							class="w-4 h-4 text-indigo-600 transition-transform duration-300 group-hover:-translate-y-0.5 shrink-0"
						/>
						<span>Export</span>
						<ChevronDown
							class="w-3.5 h-3.5 text-slate-400 transition-transform duration-300 group-hover:text-slate-600 {exportDropdownOpen
								? 'rotate-180 text-indigo-600'
								: ''}"
						/>
					</button>

					<!-- Export Dropdown Menu -->
					{#if exportDropdownOpen}
						<div
							class="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200/90 rounded-2xl p-1.5 shadow-xl shadow-slate-900/10 z-40 space-y-1 focus:outline-none transition-all duration-200 animate-in fade-in slide-in-from-top-2"
							on:click|stopPropagation
						>
							<div
								class="px-3 py-1.5 border-b border-slate-100 mb-1"
							>
								<span
									class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block"
									>Export Options</span
								>
							</div>

							<!-- CSV Export Option -->
							<button
								type="button"
								on:click={() => {
									downloadCSV();
									closeAllDropdowns();
								}}
								class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2.5 group"
							>
								<div
									class="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
								>
									<FileSpreadsheet class="w-3.5 h-3.5" />
								</div>
								<div>
									<span
										class="text-xs font-bold text-slate-800 block group-hover:text-emerald-700 transition-colors"
										>Export CSV</span
									>
									<span
										class="text-[10px] font-medium text-slate-400 block"
										>Spreadsheet (.csv)</span
									>
								</div>
							</button>

							<!-- JSON Export Option -->
							<button
								type="button"
								on:click={() => {
									downloadJSON();
									closeAllDropdowns();
								}}
								class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2.5 group"
							>
								<div
									class="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
								>
									<FileJson class="w-3.5 h-3.5" />
								</div>
								<div>
									<span
										class="text-xs font-bold text-slate-800 block group-hover:text-amber-700 transition-colors"
										>Export JSON</span
									>
									<span
										class="text-[10px] font-medium text-slate-400 block"
										>Raw data (.json)</span
									>
								</div>
							</button>
						</div>
					{/if}
				</div>

				<!-- Sync Button -->
				<button
					type="button"
					on:click={() => loadHistory(false)}
					class="h-10 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-3.5 rounded-xl text-xs md:text-sm flex items-center gap-2 transition-all shadow-2xs active:scale-[0.98] group"
					title="Sync Delivery Logs"
				>
					<RefreshCw
						class="w-3.5 h-3.5 text-slate-500 transition-transform duration-500 group-hover:rotate-180 group-hover:text-slate-800 {loading
							? 'animate-spin text-indigo-600'
							: ''}"
					/>
					<span>Sync</span>
				</button>
			</div>
		</div>

		<!-- Log list table card -->
		<div
			class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
		>
			<div
				class="flex justify-between items-center border-b border-slate-100 pb-3"
			>
				<h3 class="font-bold text-slate-800 text-base">
					Campaign Delivery Reports
				</h3>
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
				<div
					class="text-center text-slate-400 py-12 text-sm flex flex-col items-center justify-center"
				>
					<History class="w-12 h-12 text-slate-300 mb-3" />
					<span>No matching log history records found.</span>
				</div>
			{:else}
				<div class="overflow-x-auto border border-slate-100 rounded-xl">
					<table class="w-full text-xs text-left text-slate-500">
						<thead
							class="bg-slate-50 text-[10px] uppercase text-slate-400 border-b border-slate-100 font-bold"
						>
							<tr>
								<th class="px-5 py-3 font-bold w-40"
									>Timestamp</th
								>
								<th class="px-5 py-3 font-bold"
									>Recipient Email</th
								>
								<th class="px-5 py-3 font-bold">Subject Line</th
								>
								<th class="px-5 py-3 font-bold w-24">Status</th>
								<th class="px-5 py-3 font-bold">Log Details</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-100">
							{#each paginatedLogs as log}
								<tr
									class="hover:bg-slate-50/50 transition-colors align-top font-medium"
								>
									<td
										class="px-5 py-3 text-slate-400 font-mono select-all"
									>
										{new Date(
											log.timestamp,
										).toLocaleString()}
									</td>
									<td
										class="px-5 py-3 text-slate-800 select-all font-mono font-bold"
										>{log.email}</td
									>
									<td
										class="px-5 py-3 text-slate-700 truncate max-w-[150px] font-semibold"
										>{log.subject || "-"}</td
									>
									<td class="px-5 py-3 w-24">
										{#if log.status?.toUpperCase() === "SUCCESS" || log.status?.toUpperCase() === "SENT"}
											<span
												class="bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[9px]"
												>Success</span
											>
										{:else if log.status?.toUpperCase() === "FAILED"}
											<span
												class="bg-rose-50 border border-rose-200 text-rose-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[9px]"
												>Failed</span
											>
										{:else}
											<span
												class="bg-amber-50 border border-amber-200 text-amber-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[9px]"
												>Error</span
											>
										{/if}
									</td>
									<td
										class="px-5 py-3 text-slate-500 font-mono leading-relaxed select-all"
										>{log.message || "-"}</td
									>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Pagination footer -->
				{#if totalPages > 1}
					<div
						class="flex items-center justify-between border-t border-slate-100 pt-4 text-xs"
					>
						<span class="text-slate-400 font-semibold">
							Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(
								currentPage * itemsPerPage,
								filteredLogs.length,
							)} of {filteredLogs.length} logs
						</span>
						<div class="flex items-center gap-1">
							<button
								on:click={() =>
									(currentPage = Math.max(
										1,
										currentPage - 1,
									))}
								disabled={currentPage === 1}
								class="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
							>
								<ChevronLeft class="w-4 h-4 text-slate-600" />
							</button>
							<span class="px-3 font-bold text-slate-700"
								>Page {currentPage} of {totalPages}</span
							>
							<button
								on:click={() =>
									(currentPage = Math.min(
										totalPages,
										currentPage + 1,
									))}
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
