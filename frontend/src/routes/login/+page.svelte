<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import { toastStore } from '$lib/stores/toastStore';
	import { apiClient } from '$lib/api/client';

	let email = '';
	let password = '';
	let loading = false;

	onMount(() => {
		if ($authStore.user) {
			goto('/dashboard');
		}
	});

	async function handleLogin() {
		if (!email || !password) {
			toastStore.warning('Please enter email and password.');
			return;
		}

		loading = true;
		try {
			const res = await apiClient.post('/auth/login', { email, password });
			if (res.data.success) {
				authStore.setUser(res.data.user);
				toastStore.success('Logged in successfully!');
				goto('/dashboard');
			} else {
				toastStore.danger(res.data.message || 'Login failed.');
			}
		} catch (err: any) {
			toastStore.danger(err.response?.data?.message || 'Login failed. Please check your credentials.');
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
	<div class="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Email Sender</h1>
			<p class="text-slate-500 text-sm mt-2">Secure bulk email management</p>
		</div>

		<form on:submit|preventDefault={handleLogin} class="space-y-5">
			<div>
				<label for="email" class="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
				<div class="relative">
					<input 
						id="email"
						type="email" 
						bind:value={email}
						placeholder="you@example.com"
						class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-slate-800"
						required
					/>
				</div>
			</div>

			<div>
				<label for="password" class="block text-sm font-semibold text-slate-700 mb-2">Password</label>
				<input 
					id="password"
					type="password" 
					bind:value={password}
					placeholder="••••••••"
					class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-slate-800"
					required
				/>
			</div>

			<button 
				type="submit" 
				disabled={loading}
				class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-bold py-3.5 px-4 rounded-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
			>
				{#if loading}
					<div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
					Signing In...
				{:else}
					Sign In
				{/if}
			</button>
		</form>

		<div class="mt-6 text-center text-sm text-slate-500">
			Don't have an account? 
			<a href="/register" class="text-primary font-semibold hover:underline">Sign Up</a>
		</div>
	</div>
</div>
