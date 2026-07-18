<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Toast from '$lib/components/layout/Toast.svelte';

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
	<div class="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
		<!-- Sidebar for desktop -->
		<Sidebar />

		<!-- Mobile Header Navbar -->
		<Navbar />

		<!-- Main app body content -->
		<main class="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
			<slot />
		</main>
	</div>
{/if}

<!-- Toast Alerts Overlay Container -->
<Toast />
