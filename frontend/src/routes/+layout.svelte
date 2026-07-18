<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { toastStore } from '$lib/stores/toastStore';
	import '../app.css';

	let loading = true;

	onMount(async () => {
		try {
			await authStore.init();
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<div class="fixed inset-0 flex items-center justify-center bg-slate-50">
		<div class="flex flex-col items-center">
			<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			<p class="mt-4 text-slate-500 font-medium animate-pulse">Initializing Application...</p>
		</div>
	</div>
{:else}
	<slot />
{/if}

<!-- Toast Notifications Container -->
<div class="fixed top-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full">
	{#each $toastStore as toast (toast.id)}
		<div 
			class="p-4 rounded-xl shadow-lg border text-white flex items-start gap-3 transition-all duration-300 transform translate-y-0"
			class:bg-emerald-600={toast.type === 'success'}
			class:border-emerald-700={toast.type === 'success'}
			class:bg-rose-600={toast.type === 'danger'}
			class:border-rose-700={toast.type === 'danger'}
			class:bg-blue-600={toast.type === 'info'}
			class:border-blue-700={toast.type === 'info'}
			class:bg-amber-500={toast.type === 'warning'}
			class:border-amber-600={toast.type === 'warning'}
		>
			<div class="flex-grow text-sm font-medium">
				{toast.message}
			</div>
			<button 
				class="text-white hover:text-slate-200 transition-colors"
				on:click={() => toastStore.dismiss(toast.id)}
			>
				✕
			</button>
		</div>
	{/each}
</div>
