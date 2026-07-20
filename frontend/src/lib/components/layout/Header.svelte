<script lang="ts">
	import { authStore } from '$lib/stores/authStore';
	import { Search, Bell, ChevronDown, RefreshCw } from 'lucide-svelte';

	export let title = '';
	export let subtitle = '';
	export let lastUpdated = '';
	export let onRefresh: (() => void) | undefined = undefined;

	let searchQuery = '';
	let refreshing = false;

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

<div class="pb-5 mb-6 md:mb-8 border-b border-slate-200/80 backdrop-blur-sm bg-white/40 flex flex-col xl:flex-row xl:items-center justify-between gap-4 select-none relative z-10">
	<!-- Left Title Block -->
	<div class="flex items-start gap-3.5 min-w-0">
		<!-- Glowing Accent Pill -->
		<div class="w-1.5 self-stretch rounded-full bg-gradient-to-b from-indigo-500 via-indigo-600 to-violet-600 shadow-[0_0_8px_rgba(99,102,241,0.35)] shrink-0"></div>
		
		<div class="min-w-0">
			<h1 class="text-xl md:text-2xl font-bold tracking-tight text-slate-900 leading-tight flex items-center gap-2.5 truncate">
				{title}
			</h1>
			{#if subtitle}
				<p class="text-xs md:text-sm text-slate-500 font-medium mt-0.5 leading-relaxed truncate">{subtitle}</p>
			{/if}
		</div>
	</div>

	<!-- Right Unified Toolbar Enclosure -->
	<div class="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/70 border border-slate-200/80 shadow-2xs shrink-0 self-start xl:self-auto flex-wrap sm:flex-nowrap">
		<!-- Command Search Field -->
		<div class="relative flex items-center group">
			<Search class="w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500 absolute left-3 pointer-events-none transition-colors duration-200" />
			<input 
				type="text" 
				placeholder="Quick search..." 
				bind:value={searchQuery}
				aria-label="Quick search"
				class="h-9 w-36 sm:w-44 lg:w-56 pl-8 pr-7 bg-white/80 hover:bg-white focus:bg-white border border-slate-200/70 focus:border-indigo-500/40 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 shadow-2xs transition-all duration-200"
			/>
			<kbd class="hidden sm:inline-block absolute right-2.5 px-1 py-0.5 rounded text-[9px] font-mono font-semibold text-slate-400 bg-slate-100 border border-slate-200/80 pointer-events-none">⌘K</kbd>
		</div>

		<!-- Live Auto-Updated Badge -->
		{#if lastUpdated}
			<div class="h-9 px-2.5 rounded-xl bg-white/80 border border-slate-200/70 text-[10px] font-semibold text-slate-600 flex items-center gap-2 shrink-0 shadow-2xs">
				<span class="relative flex h-2 w-2">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
				</span>
				<span class="truncate max-w-[120px] font-mono uppercase tracking-wider text-[9px]">Live: {lastUpdated}</span>
			</div>
		{/if}

		<!-- Sync/Refresh Action Button -->
		{#if onRefresh}
			<button 
				on:click={handleRefresh}
				title="Sync Metrics"
				class="h-9 w-9 rounded-xl bg-white/80 hover:bg-white active:bg-slate-50 border border-slate-200/70 text-slate-600 hover:text-slate-900 transition-all duration-200 flex items-center justify-center shrink-0 shadow-2xs active:scale-95 group"
			>
				<RefreshCw class="w-3.5 h-3.5 transition-transform duration-500 {refreshing ? 'animate-spin text-indigo-600' : 'group-hover:rotate-180'}" />
			</button>
		{/if}

		<!-- Hairline Divider -->
		<div class="h-5 w-px bg-slate-200/80 mx-0.5 hidden sm:block"></div>

		<!-- Notification Button -->
		<a 
			href="/notifications" 
			title="Notifications"
			class="h-9 w-9 rounded-xl bg-white/80 hover:bg-white border border-slate-200/70 text-slate-600 hover:text-slate-900 transition-all duration-200 flex items-center justify-center relative shadow-2xs active:scale-95 shrink-0 group"
		>
			<Bell class="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-12" />
			<span class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-500 ring-2 ring-white shadow-[0_0_6px_rgba(99,102,241,0.6)]"></span>
		</a>

		<!-- User Profile Pill -->
		{#if $authStore?.user}
			<a 
				href="/profile" 
				title="My Account"
				class="h-9 flex items-center gap-2 px-1.5 rounded-xl bg-white/80 hover:bg-white border border-slate-200/70 shadow-2xs transition-all duration-200 group shrink-0 text-left"
			>
				<!-- Avatar container with active dot -->
				<div class="relative shrink-0">
					<div class="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-[11px] font-bold text-white shadow-2xs">
						{$authStore.user.name ? $authStore.user.name.charAt(0).toUpperCase() : 'U'}
					</div>
					<span class="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-white"></span>
				</div>

				<!-- User Info -->
				<div class="min-w-0 flex flex-col justify-center hidden sm:flex">
					<span class="text-[11px] font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors leading-none truncate max-w-[100px]">
						{$authStore.user.name}
					</span>
					<span class="text-[8px] font-semibold text-slate-400 leading-none mt-0.5 font-mono uppercase tracking-wider">
						Admin
					</span>
				</div>

				<ChevronDown class="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 group-hover:translate-y-0.5 shrink-0" />
			</a>
		{/if}
	</div>
</div>
