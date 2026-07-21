<script lang="ts">
	import { onMount } from 'svelte';
	import { toastStore } from '$lib/stores/toastStore';
	import { sendApi } from '$lib/api/send';
	import Header from '$lib/components/layout/Header.svelte';
	import { Bell, Mail, Wifi, ShieldAlert, Sparkles } from 'lucide-svelte';

	let testEmail = '';
	let loading = false;
	let browserPermission = 'default';

	onMount(() => {
		if ('Notification' in window) {
			browserPermission = Notification.permission;
		}
	});

	async function requestBrowserPermission() {
		if (!('Notification' in window)) {
			toastStore.warning('Desktop alerts are not supported by this browser.');
			return;
		}

		const permission = await Notification.requestPermission();
		browserPermission = permission;
		if (permission === 'granted') {
			toastStore.success('Browser notification permission granted.');
			new Notification('Bulk Email Sender', {
				body: 'Success! Push notifications are now configured.'
			});
		} else {
			toastStore.danger('Notification permission was denied.');
		}
	}

	async function sendTestEmail() {
		if (!testEmail) {
			toastStore.warning('Please enter a test email address.');
			return;
		}

		loading = true;
		try {
			const res = await sendApi.testNotification(testEmail);
			if (res.data.success) {
				toastStore.success('Test notification email dispatched successfully.');
			} else {
				toastStore.danger(res.data.message || 'Notification test failed.');
			}
		} catch (err: any) {
			toastStore.danger(err.response?.data?.message || 'Error executing notification test.');
		} finally {
			loading = false;
		}
	}
</script>

<div class="space-y-6 sm:space-y-8 w-full">
	<!-- Page Header -->
	<Header title="Notification Alert Preferences" subtitle="Configure system notification alerts and verify delivery connections" />

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Email Alerts Card -->
		<div class="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm space-y-4">
			<div class="flex items-center gap-3">
				<div class="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0">
					<Mail class="w-5 h-5" />
				</div>
				<h3 class="font-bold text-slate-800 text-sm">System Email Alerts</h3>
			</div>
			<p class="text-xs text-slate-500 leading-relaxed">Sends campaign summary logs and finished reports directly to your inbox upon campaign completions.</p>

			<div class="space-y-3 pt-2">
				<label for="test-email" class="block text-xs font-semibold text-slate-600">Test Email Address</label>
				<div class="flex gap-2">
					<input 
						id="test-email"
						type="email" 
						bind:value={testEmail}
						placeholder="receiver@example.com"
						class="flex-grow px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
					/>
					<button 
						on:click={sendTestEmail}
						disabled={loading || !testEmail}
						class="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
					>
						{#if loading}
							<div class="animate-spin rounded-full h-3.5 w-3.5 border-t-2 border-b-2 border-white"></div>
						{:else}
							<Wifi class="w-3.5 h-3.5" />
							Test
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Desktop Alerts Card -->
		<div class="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm space-y-4 flex flex-col justify-between">
			<div class="space-y-3">
				<div class="flex items-center gap-3">
					<div class="p-2.5 bg-violet-50 border border-violet-100 rounded-xl text-violet-600 shrink-0">
						<Bell class="w-5 h-5" />
					</div>
					<h3 class="font-bold text-slate-800 text-sm">Browser Push Alerts</h3>
				</div>
				<p class="text-xs text-slate-500 leading-relaxed">Triggers native desktop notification sound overlays and alerts when scheduled campaigns execute or complete.</p>
			</div>

			<div class="pt-4 border-t border-slate-100 flex items-center justify-between">
				<span class="text-xs font-bold text-slate-400 uppercase tracking-wider">
					Permission: 
					{#if browserPermission === 'granted'}
						<span class="text-emerald-600">Granted</span>
					{:else if browserPermission === 'denied'}
						<span class="text-rose-600">Denied</span>
					{:else}
						<span class="text-slate-500">Not Requested</span>
					{/if}
				</span>
				
				{#if browserPermission !== 'granted'}
					<button 
						on:click={requestBrowserPermission}
						class="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
					>
						Enable Alerts
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
