<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import { toastStore } from '$lib/stores/toastStore';
	import { apiClient } from '$lib/api/client';

	let name = '';
	let email = '';
	let password = '';
	let loading = false;

	onMount(() => {
		if ($authStore.user) {
			goto('/dashboard');
		}
	});

	async function handleRegister() {
		if (!name || !email || !password) {
			toastStore.warning('Please fill in all fields.');
			return;
		}

		if (password.length < 6) {
			toastStore.warning('Password must be at least 6 characters.');
			return;
		}

		loading = true;
		try {
			const res = await apiClient.post('/auth/register', { name, email, password });
			if (res.data.success) {
				authStore.setUser(res.data.user);
				toastStore.success('Account created successfully!');
				goto('/dashboard');
			} else {
				toastStore.danger(res.data.message || 'Registration failed.');
			}
		} catch (err: any) {
			toastStore.danger(err.response?.data?.message || 'Registration failed. Please try again.');
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
	<div class="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Email Sender</h1>
			<p class="text-slate-500 text-sm mt-2">Create your bulk sending account</p>
		</div>

		<form on:submit|preventDefault={handleRegister} class="space-y-5">
			<div>
				<label for="name" class="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
				<input 
					id="name"
					type="text" 
					bind:value={name}
					placeholder="John Doe"
					class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-slate-800"
					required
				/>
			</div>

			<div>
				<label for="email" class="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
				<input 
					id="email"
					type="email" 
					bind:value={email}
					placeholder="you@example.com"
					class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-slate-800"
					required
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-semibold text-slate-700 mb-2">Password</label>
				<input 
					id="password"
					type="password" 
					bind:value={password}
					placeholder="•••••••• (min 6 characters)"
					minlength="6"
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
					Creating Account...
				{:else}
					Create Account
				{/if}
			</button>
		</form>

		<div class="mt-6 text-center text-sm text-slate-500">
			Already have an account? 
			<a href="/login" class="text-primary font-semibold hover:underline">Sign In</a>
		</div>
	</div>
</div>
