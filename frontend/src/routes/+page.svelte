<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';

	onMount(() => {
		if ($authStore.user) {
			goto('/dashboard');
		} else {
			goto('/login');
		}
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-slate-50">
	<div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
</div>
