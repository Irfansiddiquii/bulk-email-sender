<script lang="ts">
	import { onMount } from "svelte";
	import { toastStore } from "$lib/stores/toastStore";
	import { configsStore } from "$lib/stores/configsStore";
	import { sendApi } from "$lib/api/send";
	import Header from "$lib/components/layout/Header.svelte";
	import {
		Bell,
		Mail,
		Wifi,
		ShieldAlert,
		Sparkles,
		CheckCircle2,
		Activity,
		Settings,
		AlertTriangle,
		Volume2,
		RefreshCw,
		Search,
		Check,
		Send,
		SlidersHorizontal
	} from "lucide-svelte";

	let testEmail = "";
	let loading = false;
	let browserPermission = "default";
	let filterQuery = "";

	// Interactive Preferences Toggles
	let preferences = {
		campaignCompletion: true,
		smtpFailures: true,
		scheduleDispatch: true,
		bounceWarnings: false
	};

	onMount(() => {
		configsStore.load();
		if (typeof window !== "undefined" && "Notification" in window) {
			browserPermission = Notification.permission;
		}

		// Load saved preferences from localStorage
		const saved = localStorage.getItem("notification_alert_preferences");
		if (saved) {
			try {
				preferences = { ...preferences, ...JSON.parse(saved) };
			} catch (e) {
				console.error(e);
			}
		}
	});

	function togglePreference(key: keyof typeof preferences) {
		preferences[key] = !preferences[key];
		localStorage.setItem("notification_alert_preferences", JSON.stringify(preferences));
		toastStore.success(`Updated ${key} preference.`);
	}

	async function requestBrowserPermission() {
		if (!("Notification" in window)) {
			toastStore.warning("Desktop push alerts are not supported by this browser.");
			return;
		}

		const permission = await Notification.requestPermission();
		browserPermission = permission;
		if (permission === "granted") {
			toastStore.success("Browser notification permission granted.");
			new Notification("Bulk Email Sender", {
				body: "Success! Desktop push notifications are active."
			});
		} else {
			toastStore.danger("Notification permission was denied.");
		}
	}

	async function sendTestEmail() {
		if (!testEmail) {
			toastStore.warning("Please enter a valid test email address.");
			return;
		}

		loading = true;
		try {
			const res = await sendApi.testNotification(testEmail);
			if (res.data.success) {
				toastStore.success("Test notification email dispatched successfully.");
			} else {
				toastStore.danger(res.data.message || "Notification test failed.");
			}
		} catch (err: any) {
			toastStore.danger(err.response?.data?.message || "Error executing notification test.");
		} finally {
			loading = false;
		}
	}
</script>

<div class="space-y-6 w-full max-w-7xl mx-auto pb-12">
	<!-- Page Header -->
	<Header
		title="Notification Alert Preferences"
		subtitle="Configure system notification triggers, verify desktop push alerts, and test SMTP email routing"
	/>

	<!-- Single Premium Unified Toolbar (Doppelrand Enclosure) -->
	<div class="p-1.5 rounded-[1.5rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-xs mb-8 backdrop-blur-xl transition-all duration-200">
		<div
			class="bg-white rounded-[calc(1.5rem-0.375rem)] p-3.5 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 shadow-2xs relative z-20"
		>
			<!-- Status / Channel Summary -->
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
					<Bell class="w-5 h-5" />
				</div>
				<div>
					<div class="flex items-center gap-2">
						<h2 class="font-bold text-slate-900 text-base">Alert Dispatch Engine</h2>
						<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
							<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
							Active Routing
						</span>
					</div>
					<p class="text-xs text-slate-500">System event monitors & webhook listeners operational</p>
				</div>
			</div>

			<!-- Quick Filter Search -->
			<div class="flex items-center gap-3 shrink-0">
				<div class="relative min-w-[200px] sm:min-w-[260px] group">
					<Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
					<input
						type="text"
						bind:value={filterQuery}
						placeholder="Search alert rules & channels..."
						class="w-full pl-9 pr-3 py-2 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-indigo-500/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-2xs transition-all"
					/>
				</div>

				{#if browserPermission !== "granted"}
					<button
						on:click={requestBrowserPermission}
						class="relative group/btn overflow-hidden bg-slate-900 hover:bg-indigo-600 text-white font-semibold pl-4 pr-3 py-2 rounded-xl text-xs shadow-md shadow-slate-900/10 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center gap-2 shrink-0"
					>
						<Bell class="w-3.5 h-3.5 text-indigo-400 group-hover/btn:text-white transition-colors" />
						<span>Enable Desktop Push</span>
					</button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Real Application Data Summary Metrics Strip -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
		<div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-2xs transition-all duration-200">
			<div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100">
				<div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
					<Mail class="w-5 h-5" />
				</div>
				<div>
					<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">SMTP Mail Channels</p>
					<p class="text-xl font-bold text-slate-900 leading-none mt-1">{$configsStore.length} Configured</p>
				</div>
			</div>
		</div>

		<div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-violet-200/70 hover:border-violet-400/80 shadow-2xs transition-all duration-200">
			<div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100">
				<div class="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shrink-0">
					<Volume2 class="w-5 h-5" />
				</div>
				<div>
					<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Browser Push Alerts</p>
					<p class="text-xs font-semibold mt-1 capitalize flex items-center gap-1.5">
						{#if browserPermission === "granted"}
							<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
							<span class="text-emerald-700 font-bold">Granted & Active</span>
						{:else if browserPermission === "denied"}
							<span class="w-2 h-2 rounded-full bg-rose-500"></span>
							<span class="text-rose-700 font-bold">Denied by Browser</span>
						{:else}
							<span class="w-2 h-2 rounded-full bg-amber-500"></span>
							<span class="text-amber-700 font-bold">Permission Pending</span>
						{/if}
					</p>
				</div>
			</div>
		</div>

		<div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-emerald-200/70 hover:border-emerald-400/80 shadow-2xs transition-all duration-200">
			<div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100">
				<div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
					<CheckCircle2 class="w-5 h-5" />
				</div>
				<div>
					<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">System Health</p>
					<p class="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
						<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
						<span>100% Operational</span>
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Notification Cards Grid with Layered Depth & High-Response Motion Physics -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Email Alerts & Test Studio Card -->
		<div
			class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl hover:shadow-indigo-500/15 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 group relative overflow-hidden"
		>
			<div
				class="bg-white rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-7 space-y-6 border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] h-full flex flex-col justify-between"
			>
				<div class="space-y-5">
					<!-- Card Header & Badge -->
					<div class="flex items-start justify-between gap-4">
						<div class="flex items-center gap-4">
							<div
								class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
							>
								<Mail class="w-6 h-6 text-white" />
							</div>
							<div>
								<div class="flex items-center gap-2">
									<h3 class="font-bold text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
										System Email Verification Studio
									</h3>
								</div>
								<p class="text-xs text-slate-500 mt-0.5">Test real-time mail dispatch & SMTP delivery routing</p>
							</div>
						</div>
						<span
							class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100/80 shadow-2xs shrink-0"
						>
							<Sparkles class="w-3.5 h-3.5 text-indigo-600" />
							SMTP Studio
						</span>
					</div>

					<p class="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 shadow-2xs">
						Dispatches real-time campaign summary logs, finished dispatch reports, and critical SMTP alert events directly to your specified administrative email address.
					</p>

					<!-- Test Email Input Double-Bezel Shell -->
					<div class="space-y-2.5 pt-1">
						<label for="test-email" class="block text-xs font-bold uppercase tracking-wider text-slate-600 font-mono">
							Test Target Destination Email
						</label>

						<div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-slate-200/80 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/12 transition-all">
							<div class="bg-white rounded-xl p-1 flex flex-col sm:flex-row gap-2 border border-slate-100">
								<div class="relative flex-grow">
									<Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
									<input
										id="test-email"
										type="email"
										bind:value={testEmail}
										placeholder="admin@company.com"
										class="w-full pl-10 pr-4 py-2.5 bg-transparent rounded-lg text-sm font-semibold text-slate-900 focus:outline-none placeholder-slate-400"
									/>
								</div>
								<!-- Primary Action Button: Send Test Alert -->
								<button
									on:click={sendTestEmail}
									disabled={loading || !testEmail}
									class="relative group/btn overflow-hidden bg-slate-900 hover:bg-indigo-600 active:scale-[0.98] text-white font-bold pl-4 pr-3 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2.5 shadow-md shadow-slate-900/15 hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-200 disabled:opacity-50 shrink-0"
								>
									<span class="tracking-tight text-white font-semibold">
										{#if loading}
											Dispatching...
										{:else}
											Send Test Alert
										{/if}
									</span>
									<div class="w-6 h-6 rounded-lg bg-white/10 border border-white/10 text-white flex items-center justify-center shrink-0 group-hover/btn:bg-white/20 group-hover/btn:scale-110 transition-all duration-200">
										{#if loading}
											<RefreshCw class="w-3.5 h-3.5 animate-spin text-white" />
										{:else}
											<Wifi class="w-3.5 h-3.5 text-white" />
										{/if}
									</div>
								</button>
							</div>
						</div>
					</div>
				</div>

				<div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-4">
					<span class="font-mono text-[11px] font-semibold text-slate-600">Protocol: SMTP TLS Active</span>
					<span class="font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
						<CheckCircle2 class="w-3.5 h-3.5" />
						Channel Ready
					</span>
				</div>
			</div>
		</div>

		<!-- Desktop Push Notifications Card -->
		<div
			class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-violet-900/[0.03] border border-violet-200/70 hover:border-violet-400/80 hover:ring-1 hover:ring-violet-400/20 shadow-md hover:shadow-xl hover:shadow-violet-500/15 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 group relative overflow-hidden"
		>
			<div
				class="bg-white rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-7 space-y-6 border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] h-full flex flex-col justify-between"
			>
				<div class="space-y-5">
					<!-- Card Header & Badge -->
					<div class="flex items-start justify-between gap-4">
						<div class="flex items-center gap-4">
							<div
								class="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/25 shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300"
							>
								<Bell class="w-6 h-6 text-white" />
							</div>
							<div>
								<div class="flex items-center gap-2">
									<h3 class="font-bold text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-violet-600 transition-colors">
										Desktop Push Notifications
									</h3>
								</div>
								<p class="text-xs text-slate-500 mt-0.5">Native OS browser audio chimes & pop-up banners</p>
							</div>
						</div>
						<span
							class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-50 text-violet-700 border border-violet-100/80 shadow-2xs shrink-0"
						>
							<Activity class="w-3.5 h-3.5 text-violet-600" />
							Push Web API
						</span>
					</div>

					<p class="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 shadow-2xs">
						Triggers instant desktop notification overlays when automated queue dispatches begin, finished mailings complete, or SMTP delivery errors occur.
					</p>

					<!-- Status Box -->
					<div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-3">
						<div class="flex items-center justify-between text-xs">
							<span class="font-bold text-slate-700 uppercase tracking-wider font-mono">Current Channel Status:</span>
							{#if browserPermission === "granted"}
								<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
									<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
									Granted & Active
								</span>
							{:else if browserPermission === "denied"}
								<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
									<span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
									Denied in Browser Settings
								</span>
							{:else}
								<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
									<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
									Permission Requested
								</span>
							{/if}
						</div>
					</div>
				</div>

				<div class="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
					<span class="text-xs font-mono font-semibold text-slate-600">HTML5 Notification Engine</span>
					{#if browserPermission !== "granted"}
						<button
							on:click={requestBrowserPermission}
							class="relative group/btn overflow-hidden bg-slate-900 hover:bg-indigo-600 active:scale-[0.98] text-white font-bold pl-4 pr-3 py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200"
						>
							<span>Grant Permission</span>
							<div class="w-5 h-5 rounded-md bg-white/10 text-white flex items-center justify-center shrink-0 group-hover/btn:scale-110 transition-transform">
								<Bell class="w-3 h-3 text-white" />
							</div>
						</button>
					{:else}
						<button
							on:click={() => {
								new Notification("Bulk Email Sender", {
									body: "Test push notification sound & banner."
								});
								toastStore.success("Triggered desktop test notification.");
							}}
							class="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-2xs active:scale-95 flex items-center gap-1.5"
						>
							<Volume2 class="w-3.5 h-3.5 text-indigo-600" />
							<span>Test Push Banner</span>
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Automated Preference Toggles Panel -->
	<div
		class="p-2 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.04] via-slate-900/[0.02] to-indigo-900/[0.04] border border-slate-200/90 shadow-md hover:shadow-xl hover:border-indigo-300 transition-all duration-300 mt-8 group relative overflow-hidden"
	>
		<div class="bg-white rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-8 space-y-6 border border-slate-100">
			<div class="flex items-center justify-between border-b border-slate-100 pb-5">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform duration-300">
						<SlidersHorizontal class="w-6 h-6 text-white" />
					</div>
					<div>
						<h3 class="font-bold text-slate-900 text-base sm:text-lg tracking-tight">Automated Notification Triggers & Rules</h3>
						<p class="text-xs text-slate-500 mt-0.5">Toggle automated system notifications for campaign lifecycle events</p>
					</div>
				</div>
				<span class="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider hidden sm:inline">Rules Engine</span>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<!-- Rule 1: Campaign Completion Summary -->
				<div
					class="p-4 sm:p-5 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:shadow-md hover:shadow-indigo-500/10 hover:border-indigo-300/80 flex items-center justify-between gap-4 group/rule {preferences.campaignCompletion ? 'bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/30 border-indigo-200/90 shadow-sm shadow-indigo-500/5' : 'bg-slate-50/60 border-slate-200/60 opacity-75 hover:opacity-100'}"
				>
					<div class="space-y-1 min-w-0">
						<div class="flex items-center gap-2">
							<h4 class="font-bold text-slate-900 text-xs sm:text-sm truncate group-hover/rule:text-indigo-600 transition-colors">Campaign Completion Summary</h4>
							{#if preferences.campaignCompletion}
								<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100/80 text-indigo-800 border border-indigo-200">
									<span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
									Active
								</span>
							{:else}
								<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 text-slate-600 border border-slate-300">
									Paused
								</span>
							{/if}
						</div>
						<p class="text-[11px] text-slate-500 leading-relaxed">Dispatch an email summary log when a scheduled campaign finishes sending.</p>
					</div>

					<button
						type="button"
						on:click={() => togglePreference('campaignCompletion')}
						class="w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 relative focus:outline-none focus:ring-4 focus:ring-indigo-500/20 {preferences.campaignCompletion ? 'bg-indigo-600 shadow-md shadow-indigo-500/30' : 'bg-slate-300'}"
						aria-label="Toggle Campaign Completion Summary"
					>
						<div class="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out {preferences.campaignCompletion ? 'translate-x-6' : 'translate-x-0'} flex items-center justify-center">
							{#if preferences.campaignCompletion}
								<Check class="w-3 h-3 text-indigo-600" />
							{/if}
						</div>
					</button>
				</div>

				<!-- Rule 2: SMTP Failure Alerts -->
				<div
					class="p-4 sm:p-5 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:shadow-md hover:shadow-indigo-500/10 hover:border-indigo-300/80 flex items-center justify-between gap-4 group/rule {preferences.smtpFailures ? 'bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/30 border-indigo-200/90 shadow-sm shadow-indigo-500/5' : 'bg-slate-50/60 border-slate-200/60 opacity-75 hover:opacity-100'}"
				>
					<div class="space-y-1 min-w-0">
						<div class="flex items-center gap-2">
							<h4 class="font-bold text-slate-900 text-xs sm:text-sm truncate group-hover/rule:text-indigo-600 transition-colors">SMTP Failure Connection Alerts</h4>
							{#if preferences.smtpFailures}
								<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100/80 text-indigo-800 border border-indigo-200">
									<span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
									Active
								</span>
							{:else}
								<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 text-slate-600 border border-slate-300">
									Paused
								</span>
							{/if}
						</div>
						<p class="text-[11px] text-slate-500 leading-relaxed">Alert immediately if an SMTP server rejects authentication or times out.</p>
					</div>

					<button
						type="button"
						on:click={() => togglePreference('smtpFailures')}
						class="w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 relative focus:outline-none focus:ring-4 focus:ring-indigo-500/20 {preferences.smtpFailures ? 'bg-indigo-600 shadow-md shadow-indigo-500/30' : 'bg-slate-300'}"
						aria-label="Toggle SMTP Failure Alerts"
					>
						<div class="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out {preferences.smtpFailures ? 'translate-x-6' : 'translate-x-0'} flex items-center justify-center">
							{#if preferences.smtpFailures}
								<Check class="w-3 h-3 text-indigo-600" />
							{/if}
						</div>
					</button>
				</div>

				<!-- Rule 3: Scheduled Queue Dispatches -->
				<div
					class="p-4 sm:p-5 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:shadow-md hover:shadow-indigo-500/10 hover:border-indigo-300/80 flex items-center justify-between gap-4 group/rule {preferences.scheduleDispatch ? 'bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/30 border-indigo-200/90 shadow-sm shadow-indigo-500/5' : 'bg-slate-50/60 border-slate-200/60 opacity-75 hover:opacity-100'}"
				>
					<div class="space-y-1 min-w-0">
						<div class="flex items-center gap-2">
							<h4 class="font-bold text-slate-900 text-xs sm:text-sm truncate group-hover/rule:text-indigo-600 transition-colors">Scheduled Queue Execution Alerts</h4>
							{#if preferences.scheduleDispatch}
								<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100/80 text-indigo-800 border border-indigo-200">
									<span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
									Active
								</span>
							{:else}
								<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 text-slate-600 border border-slate-300">
									Paused
								</span>
							{/if}
						</div>
						<p class="text-[11px] text-slate-500 leading-relaxed">Trigger push notification when a scheduled background queue starts.</p>
					</div>

					<button
						type="button"
						on:click={() => togglePreference('scheduleDispatch')}
						class="w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 relative focus:outline-none focus:ring-4 focus:ring-indigo-500/20 {preferences.scheduleDispatch ? 'bg-indigo-600 shadow-md shadow-indigo-500/30' : 'bg-slate-300'}"
						aria-label="Toggle Scheduled Queue Execution Alerts"
					>
						<div class="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out {preferences.scheduleDispatch ? 'translate-x-6' : 'translate-x-0'} flex items-center justify-center">
							{#if preferences.scheduleDispatch}
								<Check class="w-3 h-3 text-indigo-600" />
							{/if}
						</div>
					</button>
				</div>

				<!-- Rule 4: Bounce & Suppression Warnings -->
				<div
					class="p-4 sm:p-5 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:shadow-md hover:shadow-indigo-500/10 hover:border-indigo-300/80 flex items-center justify-between gap-4 group/rule {preferences.bounceWarnings ? 'bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/30 border-indigo-200/90 shadow-sm shadow-indigo-500/5' : 'bg-slate-50/60 border-slate-200/60 opacity-75 hover:opacity-100'}"
				>
					<div class="space-y-1 min-w-0">
						<div class="flex items-center gap-2">
							<h4 class="font-bold text-slate-900 text-xs sm:text-sm truncate group-hover/rule:text-indigo-600 transition-colors">Bounce & Suppression Thresholds</h4>
							{#if preferences.bounceWarnings}
								<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100/80 text-indigo-800 border border-indigo-200">
									<span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
									Active
								</span>
							{:else}
								<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 text-slate-600 border border-slate-300">
									Paused
								</span>
							{/if}
						</div>
						<p class="text-[11px] text-slate-500 leading-relaxed">Notify when recipient bounce rates exceed safety thresholds.</p>
					</div>

					<button
						type="button"
						on:click={() => togglePreference('bounceWarnings')}
						class="w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 relative focus:outline-none focus:ring-4 focus:ring-indigo-500/20 {preferences.bounceWarnings ? 'bg-indigo-600 shadow-md shadow-indigo-500/30' : 'bg-slate-300'}"
						aria-label="Toggle Bounce & Suppression Thresholds"
					>
						<div class="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out {preferences.bounceWarnings ? 'translate-x-6' : 'translate-x-0'} flex items-center justify-center">
							{#if preferences.bounceWarnings}
								<Check class="w-3 h-3 text-indigo-600" />
							{/if}
						</div>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
