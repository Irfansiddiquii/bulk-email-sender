<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import { Sliders, Shield, Zap, Bell, Check, Save } from 'lucide-svelte';
	import { toastStore } from '$lib/stores/toastStore';

	let rateLimit = 100;
	let retryAttempts = 3;
	let enableAnalytics = true;
	let autoSaveDrafts = true;

	function saveSettings() {
		toastStore.success('System settings saved successfully.');
	}
</script>

<div class="space-y-6 sm:space-y-8 w-full">
	<!-- Page Header -->
	<Header 
		title="Account & System Settings" 
		subtitle="Configure system options, default rate limits, and application preferences" 
	/>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<!-- Main Settings Panel -->
		<div class="md:col-span-2 space-y-6">
			<!-- Dispatch Settings Card -->
			<div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
				<div class="flex items-center gap-3 border-b border-slate-100 pb-4">
					<div class="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
						<Zap class="w-4.5 h-4.5" />
					</div>
					<div>
						<h3 class="font-bold text-slate-900 text-sm">Campaign Dispatch Controls</h3>
						<p class="text-xs text-slate-500">Fine-tune sending rates and automated safety constraints.</p>
					</div>
				</div>

				<div class="space-y-5">
					<div>
						<label for="rate-limit" class="block text-xs font-semibold text-slate-700 mb-1.5">
							Default Batch Rate Limit (emails / minute)
						</label>
						<input 
							id="rate-limit"
							type="number" 
							bind:value={rateLimit} 
							min="10"
							max="1000"
							class="w-full sm:w-64 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all"
						/>
					</div>

					<div>
						<label for="retry-attempts" class="block text-xs font-semibold text-slate-700 mb-1.5">
							Failed Delivery Retry Attempts
						</label>
						<select 
							id="retry-attempts"
							bind:value={retryAttempts}
							class="w-full sm:w-64 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all bg-white"
						>
							<option value={1}>1 Retry</option>
							<option value={3}>3 Retries (Recommended)</option>
							<option value={5}>5 Retries</option>
						</select>
					</div>
				</div>
			</div>

			<!-- Preference Options -->
			<div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
				<div class="flex items-center gap-3 border-b border-slate-100 pb-4">
					<div class="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
						<Sliders class="w-4.5 h-4.5" />
					</div>
					<div>
						<h3 class="font-bold text-slate-900 text-sm">General Preferences</h3>
						<p class="text-xs text-slate-500">System behaviors and tracking preferences.</p>
					</div>
				</div>

				<div class="space-y-4">
					<label class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer">
						<div class="space-y-0.5">
							<span class="text-xs sm:text-sm font-semibold text-slate-800">Enable Open & Click Analytics</span>
							<p class="text-[11px] text-slate-400">Track delivery telemetry for campaign reporting.</p>
						</div>
						<input type="checkbox" bind:checked={enableAnalytics} class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
					</label>

					<label class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer">
						<div class="space-y-0.5">
							<span class="text-xs sm:text-sm font-semibold text-slate-800">Auto-save Campaign Drafts</span>
							<p class="text-[11px] text-slate-400">Automatically save draft emails while composing.</p>
						</div>
						<input type="checkbox" bind:checked={autoSaveDrafts} class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
					</label>
				</div>
			</div>

			<!-- Action Bar -->
			<div class="flex justify-end">
				<button 
					type="button"
					on:click={saveSettings}
					class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm shadow-indigo-600/20 transition-all flex items-center gap-2"
				>
					<Save class="w-4 h-4" />
					Save Preferences
				</button>
			</div>
		</div>

		<!-- Right Info Card -->
		<div class="space-y-6">
			<div class="bg-indigo-900 text-white rounded-2xl p-6 shadow-sm space-y-4 relative overflow-hidden">
				<div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl pointer-events-none"></div>
				<div class="flex items-center gap-3">
					<div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
						<Shield class="w-4 h-4 text-indigo-200" />
					</div>
					<h4 class="font-bold text-sm">System Security</h4>
				</div>
				<p class="text-xs text-indigo-200 leading-relaxed">
					All credentials and SMTP server keys are encrypted at rest using AES-256 standards.
				</p>
			</div>
		</div>
	</div>
</div>
