<script lang="ts">
	import { authStore } from '$lib/stores/authStore';
	import { Search, Bell, ChevronDown, RefreshCw } from 'lucide-svelte';

	export let title = '';
	export let subtitle = '';
	export let lastUpdated = '';
	export let onRefresh: (() => void) | undefined = undefined;

	let searchQuery = '';
	let refreshing = false;

	// Format time display to HH:MM (removing seconds)
	$: formattedLastUpdated = lastUpdated ? lastUpdated.replace(/(\d{1,2}:\d{2}):\d{2}/, '$1') : '';

	async function handleRefresh() {
		if (onRefresh && !refreshing) {
			refreshing = true;
			try {
				await onRefresh();
			} finally {
				setTimeout(() => { refreshing = false; }, 600);
			}
		}
	}
</script>

<!-- Floating Header Container -->
<div class="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl px-4 py-3.5 sm:px-6 sm:py-4 shadow-xs mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none relative z-10 max-w-full overflow-hidden">
	<!-- Left Title Block -->
	<div class="flex items-center gap-3 shrink-0 min-w-0">
		<div class="w-1 h-8 rounded-full bg-indigo-600 shrink-0"></div>
		<div class="min-w-0 flex flex-col justify-center">
			<h1 class="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 leading-snug truncate">
				{title}
			</h1>
			{#if subtitle}
				<p class="text-xs text-slate-500 font-normal leading-normal truncate max-w-xs sm:max-w-md">{subtitle}</p>
			{/if}
		</div>
	</div>

	<!-- Right Compact & Balanced SaaS Toolbar (Fits Inside Header Container) -->
	<div class="p-1.5 rounded-xl bg-slate-100/70 border border-slate-200/80 flex items-center gap-2 sm:gap-2.5 shrink-0 self-start md:self-auto max-w-full">
		<!-- Search Control -->
		<div class="relative flex items-center h-9 group shrink-0">
			<Search class="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 absolute left-3 pointer-events-none transition-colors duration-150" />
			<input 
				type="text" 
				placeholder="Search..." 
				bind:value={searchQuery}
				aria-label="Quick search"
				class="h-9 w-28 sm:w-36 md:w-44 lg:w-48 pl-9 pr-7 bg-white hover:bg-white focus:bg-white border border-slate-200/80 focus:border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 shadow-2xs transition-all duration-150"
			/>
			<kbd class="hidden sm:inline-block absolute right-2 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-400 bg-slate-50 border border-slate-200/80 pointer-events-none">⌘K</kbd>
		</div>

		<!-- Live Status & Refresh Block -->
		{#if formattedLastUpdated || onRefresh}
			<div class="h-4 w-px bg-slate-200/80 shrink-0"></div>

			<div class="h-9 px-2.5 rounded-lg bg-white border border-slate-200/80 flex items-center gap-2 shrink-0 shadow-2xs">
				{#if formattedLastUpdated}
					<div class="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
						<span class="relative flex h-2 w-2 shrink-0">
							<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
							<span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
						</span>
						<span class="font-mono text-[10px] sm:text-[11px] text-slate-600 truncate">Live • {formattedLastUpdated}</span>
					</div>
				{/if}

				{#if onRefresh}
					<button 
						on:click={handleRefresh}
						title="Refresh data"
						class="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200/60 transition-all duration-150 shrink-0"
					>
						<RefreshCw class="w-3.5 h-3.5 {refreshing ? 'animate-spin text-indigo-600' : ''}" />
					</button>
				{/if}
			</div>
		{/if}

		<!-- Divider -->
		<div class="h-4 w-px bg-slate-200/80 shrink-0"></div>

		<!-- Notifications Button -->
		<a 
			href="/notifications" 
			title="Notifications"
			class="h-9 w-9 rounded-lg bg-white border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-all duration-150 flex items-center justify-center relative shrink-0 shadow-2xs"
		>
			<Bell class="w-4 h-4" />
			<span class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-600 ring-2 ring-white"></span>
		</a>

		<!-- Profile Trigger -->
		{#if $authStore?.user}
			<div class="h-4 w-px bg-slate-200/80 shrink-0"></div>

			<a 
				href="/profile" 
				title="My Account"
				class="h-9 flex items-center gap-2 pl-1.5 pr-2.5 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 active:bg-slate-100 transition-all duration-150 shrink-0 shadow-2xs"
			>
				<div class="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white shrink-0">
					{$authStore.user.name ? $authStore.user.name.charAt(0).toUpperCase() : 'U'}
				</div>
				<div class="hidden sm:flex flex-col text-left leading-tight">
					<span class="text-xs font-medium text-slate-800 max-w-[90px] truncate">
						{$authStore.user.name}
					</span>
				</div>
				<ChevronDown class="w-3.5 h-3.5 text-slate-400 shrink-0" />
			</a>
		{/if}
	</div>
</div>
