<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore';
	import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
</script>

<div class="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none select-none">
	{#each $toastStore as toast (toast.id)}
		<div 
			in:fly={{ y: -20, duration: 400, easing: backOut }}
			out:fade={{ duration: 150 }}
			class="p-4 rounded-2xl border text-sm font-semibold flex items-start gap-3 pointer-events-auto backdrop-blur-lg shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] transition-all duration-300
			{toast.type === 'success' ? 'bg-emerald-50/90 border-emerald-250 text-emerald-900' : ''}
			{toast.type === 'danger' ? 'bg-rose-50/90 border-rose-250 text-rose-900' : ''}
			{toast.type === 'info' ? 'bg-blue-50/90 border-blue-250 text-blue-900' : ''}
			{toast.type === 'warning' ? 'bg-amber-50/90 border-amber-250 text-amber-900' : ''}
			"
		>
			<!-- Icon indicator -->
			<div class="shrink-0 mt-0.5">
				{#if toast.type === 'success'}
					<CheckCircle class="w-4.5 h-4.5 text-emerald-600" />
				{:else if toast.type === 'danger'}
					<AlertCircle class="w-4.5 h-4.5 text-rose-600" />
				{:else if toast.type === 'warning'}
					<AlertTriangle class="w-4.5 h-4.5 text-amber-600" />
				{:else}
					<Info class="w-4.5 h-4.5 text-blue-600" />
				{/if}
			</div>

			<div class="flex-grow leading-relaxed font-medium">
				{toast.message}
			</div>

			<button 
				class="text-slate-400 hover:text-slate-650 transition-colors shrink-0 mt-0.5 p-0.5 hover:bg-slate-100 rounded-lg"
				on:click={() => toastStore.dismiss(toast.id)}
				aria-label="Close message"
			>
				<X class="w-3.5 h-3.5" />
			</button>
		</div>
	{/each}
</div>
