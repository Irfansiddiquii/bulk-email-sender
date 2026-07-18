<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { toastStore } from '$lib/stores/toastStore';
	import Header from '$lib/components/layout/Header.svelte';
	import { User, Mail, Shield, ShieldCheck, Key, CheckCircle, Database } from 'lucide-svelte';

	let sessionActiveSince = '';

	onMount(() => {
		sessionActiveSince = new Date().toLocaleString();
	});
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<Header title="My User Profile" subtitle="Manage your bulk sender account details and security settings" />

	{#if $authStore.user}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- Account Information Card -->
			<div class="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm md:col-span-2 space-y-6">
				<div class="flex items-center gap-4 border-b border-slate-100 pb-5">
					<div class="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
						<User class="w-8 h-8" />
					</div>
					<div>
						<h3 class="text-lg font-bold text-slate-800">{$authStore.user.name}</h3>
						<span class="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active Account</span>
					</div>
				</div>

				<div class="space-y-4">
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1">
						<span class="text-sm font-semibold text-slate-400">User Email Address</span>
						<span class="text-sm font-bold text-slate-800 sm:col-span-2 flex items-center gap-1.5">
							<Mail class="w-4 h-4 text-slate-400 shrink-0" />
							{$authStore.user.email}
						</span>
					</div>
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1">
						<span class="text-sm font-semibold text-slate-400">Database Account ID</span>
						<span class="text-sm font-mono font-bold text-slate-700 sm:col-span-2 select-all">
							{$authStore.user.id}
						</span>
					</div>
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1">
						<span class="text-sm font-semibold text-slate-400">Current Login Session</span>
						<span class="text-sm font-bold text-slate-800 sm:col-span-2">
							Active since {sessionActiveSince}
						</span>
					</div>
				</div>
			</div>

			<!-- System Safety Card -->
			<div class="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm space-y-4 flex flex-col justify-between">
				<div class="space-y-3">
					<div class="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 inline-block">
						<ShieldCheck class="w-6 h-6" />
					</div>
					<h4 class="font-bold text-slate-800 text-base">Security Protocols</h4>
					<p class="text-xs text-slate-500 leading-relaxed">Your account session is encrypted and protected using HTTP-Only cookies with HMAC signatures. Password values are hashed with argon2 before saving in SQLite.</p>
				</div>
				<div class="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center gap-2">
					<Database class="w-5 h-5 text-indigo-500 shrink-0" />
					<div class="text-[11px] text-slate-500">
						<span class="font-bold text-slate-700 block">SQLite Engine</span>
						Encrypted session checks
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
