<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { toastStore } from '$lib/stores/toastStore';
	import Toast from '$lib/components/layout/Toast.svelte';
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
	<div class="fixed inset-0 flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
		<div class="absolute inset-0 pointer-events-none opacity-30 select-none z-0">
			<div class="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-[120px]"></div>
			<div class="absolute -top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-secondary/10 to-transparent blur-[120px]"></div>
		</div>
		<div class="flex flex-col items-center relative z-10 select-none">
			<div class="w-12 h-12 rounded-full border-4 border-slate-100 border-t-primary animate-spin"></div>
			<p class="mt-4 text-slate-500 text-sm font-semibold uppercase tracking-wider animate-pulse">Initializing Application...</p>
		</div>
	</div>
{:else}
	<slot />
{/if}

<!-- Toast Notifications Container -->
<Toast />
