<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';

	onMount(() => {
		if (!$authStore.user) {
			goto('/login');
		}
	});

	$: if (!$authStore.user) {
		goto('/login');
	}
</script>

{#if $authStore.user}
	<div class="min-h-screen bg-slate-50/60 flex flex-col md:flex-row text-slate-800 relative overflow-hidden font-sans">
		<!-- Mesh gradient backgrounds for depth -->
		<div class="absolute inset-0 pointer-events-none opacity-40 select-none z-0">
			<div class="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-[120px]"></div>
			<div class="absolute -top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-secondary/10 to-transparent blur-[120px]"></div>
		</div>

		<!-- Sidebar for desktop -->
		<Sidebar />

		<!-- Mobile Header Navbar -->
		<Navbar />

		<!-- Main app body content -->
		<main class="flex-grow overflow-y-auto w-full relative z-10">
			<div class="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 md:py-8 max-w-7xl mx-auto w-full min-h-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
				<slot />
			</div>
		</main>
	</div>
{/if}


