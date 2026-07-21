<script lang="ts">
	import { onMount } from "svelte";
	import { configsStore, type SMTPConfig } from "$lib/stores/configsStore";
	import { toastStore } from "$lib/stores/toastStore";
	import { configApi } from "$lib/api/config";
	import Header from "$lib/components/layout/Header.svelte";
	import Modal from "$lib/components/layout/Modal.svelte";
	import Loader from "$lib/components/layout/Loader.svelte";
	import {
		Plus,
		Eye,
		EyeOff,
		Star,
		Trash2,
		Edit2,
		ShieldAlert,
		Sparkles,
		X,
		Wifi,
		Settings,
		Search,
		Server,
		Mail,
		Lock,
		CheckCircle2,
		Activity,
		ShieldCheck,
		ArrowRight,
		Check,
		SlidersHorizontal,
		Send,
		RefreshCw
	} from "lucide-svelte";

	let loading = false;
	let showModal = false;
	let editMode = false;
	let selectedConfig: SMTPConfig | null = null;
	let showViewModal = false;
	let testingConnection = false;
	let showPassword = false;
	let searchQuery = "";

	// Form values
	let configId = "";
	let name = "";
	let host = "";
	let port = 587;
	let secure = false;
	let user = "";
	let pass = "";
	let fromEmail = "";
	let fromName = "";
	let isDefault = false;

	onMount(() => {
		configsStore.load();
	});

	// Lock body scrolling when modal opens
	$: if (typeof document !== "undefined") {
		if (showModal) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}

	// Filter configs
	$: filteredConfigs = $configsStore.filter((c) => {
		if (!searchQuery) return true;
		const q = searchQuery.toLowerCase();
		return (
			(c.name?.toLowerCase() || '').includes(q) ||
			(c.host?.toLowerCase() || '').includes(q) ||
			(c.user?.toLowerCase() || '').includes(q) ||
			(c.fromEmail?.toLowerCase() || '').includes(q)
		);
	});

	$: defaultConfig = $configsStore.find((c) => c.isDefault);

	// Gmail App Password Helpers
	$: isGmail = host.toLowerCase().includes("gmail");
	$: cleanPassword = pass.replace(/\s+/g, "");
	$: isGmailPasswordValid = cleanPassword.length === 16 && /^[a-zA-Z0-9]+$/.test(cleanPassword);
	$: showGmailWarning = isGmail && pass.length > 0 && !isGmailPasswordValid;

	function openNewForm() {
		editMode = false;
		configId = "";
		name = "";
		host = "";
		port = 587;
		secure = false;
		user = "";
		pass = "";
		fromEmail = "";
		fromName = "";
		isDefault = false;
		showPassword = false;
		showModal = true;
	}

	function openEditForm(config: SMTPConfig) {
		editMode = true;
		configId = config.id;
		name = config.name;
		host = config.host;
		port = config.port;
		secure = config.secure;
		user = config.user;
		pass = ""; // Leave password blank for security
		fromEmail = config.fromEmail;
		fromName = config.fromName || "";
		isDefault = config.isDefault;
		showPassword = false;
		showModal = true;
	}

	function openViewDetails(config: SMTPConfig) {
		selectedConfig = config;
		showViewModal = true;
	}

	function sanitizePassword(password: string, hostname: string): string {
		const clean = password.trim();
		if (hostname.toLowerCase().includes("gmail")) {
			return clean.replace(/\s+/g, "");
		}
		return clean;
	}

	async function testSMTPConnection() {
		if (!host || !user || (!editMode && !pass)) {
			toastStore.warning("Host, username, and password are required to test.");
			return;
		}

		testingConnection = true;
		toastStore.info("Testing SMTP connection...");

		const finalPass = editMode && !pass ? "" : sanitizePassword(pass, host);

		try {
			const testConfig = {
				host,
				port,
				secure,
				user,
				pass: finalPass
			};

			const res = await configApi.testSMTPConfig(testConfig);
			if (res.data.success) {
				toastStore.success("SMTP connection test successful! Server is reachable.");
			} else {
				toastStore.danger(res.data.message || "SMTP connection failed.");
			}
		} catch (err: any) {
			toastStore.danger(err.response?.data?.message || "SMTP connection failed.");
		} finally {
			testingConnection = false;
		}
	}

	async function saveConfiguration() {
		if (!name || !host || !user || !fromEmail) {
			toastStore.warning("Please fill in all required fields.");
			return;
		}

		if (isGmail && pass && !isGmailPasswordValid) {
			toastStore.warning("Gmail requires a 16-character alphanumeric App Password.");
			return;
		}

		loading = true;
		const finalPass = pass ? sanitizePassword(pass, host) : undefined;

		const payload = {
			name,
			host,
			port,
			secure,
			user,
			pass: finalPass,
			fromEmail,
			fromName,
			isDefault
		};

		try {
			let res;
			if (editMode) {
				res = await configApi.updateSMTPConfig(configId, payload);
			} else {
				res = await configApi.saveSMTPConfig(payload);
			}

			if (res.data.success) {
				toastStore.success(editMode ? "Configuration updated!" : "Configuration created!");
				showModal = false;
				configsStore.load();
			} else {
				toastStore.danger(res.data.message || "Failed to save configuration.");
			}
		} catch (err: any) {
			toastStore.danger(err.response?.data?.message || "Failed to save configuration.");
		} finally {
			loading = false;
		}
	}

	async function makeDefault(id: string) {
		const success = await configsStore.setDefault(id);
		if (success) {
			toastStore.success("Default SMTP configuration updated.");
		} else {
			toastStore.danger("Failed to update default configuration.");
		}
	}

	async function deleteConfig(id: string, configName: string) {
		if (confirm(`Are you sure you want to delete configuration "${configName}"?`)) {
			const success = await configsStore.delete(id);
			if (success) {
				toastStore.success("Configuration deleted.");
			} else {
				toastStore.danger("Failed to delete configuration.");
			}
		}
	}
</script>

<div class="space-y-6 w-full max-w-7xl mx-auto pb-12">
	<!-- Page Header -->
	<Header
		title="SMTP Configurations"
		subtitle="Manage email server credentials, TLS security ports, and primary campaign dispatch channels"
	/>

	<!-- Single Premium Unified Toolbar (Doppelrand Enclosure) -->
	<div class="p-1.5 rounded-[1.5rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-xs mb-8 backdrop-blur-xl transition-all duration-200">
		<div
			class="bg-white rounded-[calc(1.5rem-0.375rem)] p-3.5 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 shadow-2xs relative z-20"
		>
			<!-- Status / Overview Badge -->
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
					<Server class="w-5 h-5" />
				</div>
				<div>
					<div class="flex items-center gap-2">
						<h2 class="font-bold text-slate-900 text-base">Mail Dispatch Accounts</h2>
						<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
							<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
							{$configsStore.length} {$configsStore.length === 1 ? 'Channel' : 'Channels'} Active
						</span>
					</div>
					<p class="text-xs text-slate-500">Configure SMTP connections for campaign dispatch</p>
				</div>
			</div>

			<!-- Search & Primary Add Configuration CTA Button -->
			<div class="flex items-center justify-between sm:justify-end gap-3 shrink-0">
				<div class="relative min-w-[200px] sm:min-w-[260px] group">
					<Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search configs by name or host..."
						class="w-full pl-9 pr-3 py-2 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-indigo-500/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-2xs transition-all"
					/>
				</div>

				<button
					on:click={openNewForm}
					class="relative group/btn overflow-hidden bg-slate-900 hover:bg-indigo-600 active:scale-[0.98] text-white font-semibold pl-4 pr-3 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-slate-900/10 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-200 flex items-center justify-center gap-2.5 shrink-0"
				>
					<span class="tracking-tight text-white font-semibold">Add Configuration</span>
					<div class="w-6 h-6 rounded-lg bg-white/10 border border-white/10 text-white flex items-center justify-center shrink-0 group-hover/btn:bg-white/20 group-hover/btn:scale-110 transition-all duration-200">
						<Plus class="w-3.5 h-3.5 text-white" />
					</div>
				</button>
			</div>
		</div>
	</div>

	<!-- Real App Summary Metric Cards Strip -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
		<div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-2xs transition-all duration-200">
			<div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100">
				<div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
					<Server class="w-5 h-5" />
				</div>
				<div>
					<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Total SMTP Servers</p>
					<p class="text-xl font-bold text-slate-900 leading-none mt-1">{$configsStore.length}</p>
				</div>
			</div>
		</div>

		<div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-emerald-200/70 hover:border-emerald-400/80 shadow-2xs transition-all duration-200">
			<div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100">
				<div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
					<Star class="w-5 h-5" />
				</div>
				<div>
					<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Primary Default Channel</p>
					<p class="text-xs font-bold text-slate-900 leading-none mt-1 truncate max-w-[170px]">
						{defaultConfig ? defaultConfig.name : "None set"}
					</p>
				</div>
			</div>
		</div>

		<div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-violet-200/70 hover:border-violet-400/80 shadow-2xs transition-all duration-200">
			<div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100">
				<div class="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shrink-0">
					<ShieldCheck class="w-5 h-5" />
				</div>
				<div>
					<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Connection Security</p>
					<p class="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
						<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
						<span>TLS/SSL Engine Active</span>
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Configuration Cards / Rich Onboarding Empty State -->
	{#if $configsStore.length === 0}
		<!-- Premium Onboarding Experience Empty State Card with Refined Hero Interaction -->
		<div class="p-2 rounded-[2.5rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 overflow-hidden relative group">
			<!-- Subtle Top Gradient Accent Glow on Hover -->
			<div class="absolute top-0 left-12 right-12 h-[3px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-x-75 group-hover:scale-x-100"></div>

			<div class="bg-white rounded-[calc(2.5rem-0.5rem)] p-8 sm:p-12 text-center border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] max-w-4xl mx-auto space-y-10">
				
				<!-- Main Hero Onboarding Banner -->
				<div class="max-w-2xl mx-auto space-y-4">
					<div class="w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 group-hover:shadow-xl group-hover:shadow-indigo-500/35 group-hover:scale-105 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center mx-auto mb-6 shrink-0">
						<Server class="w-10 h-10 sm:w-11 sm:h-11 text-white" />
					</div>
					<h3 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
						Connect Your First Mail Server
					</h3>
					<p class="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
						<strong class="text-slate-700 font-semibold">SMTP (Simple Mail Transfer Protocol)</strong> is the core delivery engine of Bulk Email Sender. Setting up your server authorizes our system to dispatch marketing emails, newsletter updates, and automated campaigns on your behalf securely.
					</p>

					<!-- Primary Onboarding CTA Button -->
					<div class="pt-2">
						<button
							on:click={openNewForm}
							class="inline-flex items-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold px-8 py-4 rounded-2xl text-sm shadow-xl shadow-slate-900/15 hover:shadow-indigo-500/25 active:scale-[0.98] transition-all duration-300 group/cta"
						>
							<span class="tracking-tight text-white font-semibold">Add First Configuration</span>
							<div class="w-7 h-7 rounded-xl bg-white/10 border border-white/10 text-white flex items-center justify-center shrink-0 group-hover/cta:bg-white/20 group-hover/cta:scale-110 transition-all duration-200">
								<Plus class="w-4 h-4 text-white" />
							</div>
						</button>
					</div>

					<!-- Supported Providers Badges Strip -->
					<div class="pt-4 flex flex-wrap items-center justify-center gap-2">
						<span class="px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs">
							<CheckCircle2 class="w-3.5 h-3.5 text-indigo-600" />
							Gmail App Passwords
						</span>
						<span class="px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs">
							<CheckCircle2 class="w-3.5 h-3.5 text-indigo-600" />
							Amazon SES
						</span>
						<span class="px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs">
							<CheckCircle2 class="w-3.5 h-3.5 text-indigo-600" />
							SendGrid
						</span>
						<span class="px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs">
							<CheckCircle2 class="w-3.5 h-3.5 text-indigo-600" />
							Custom SMTP Servers
						</span>
					</div>
				</div>

				<!-- "Why Configure SMTP?" Concise Benefit Cards Grid -->
				<div class="border-t border-slate-100 pt-8 text-left space-y-6">
					<div class="text-center">
						<h4 class="font-bold text-slate-900 text-base">Why Configure SMTP?</h4>
						<p class="text-xs text-slate-500 mt-1">Essential capabilities unlocked once your mail server is connected</p>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<!-- Benefit 1 -->
						<div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300 space-y-2 group/card">
							<div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-2xs group-hover/card:bg-indigo-600 group-hover/card:text-white transition-colors duration-200">
								<Lock class="w-4.5 h-4.5" />
							</div>
							<h5 class="font-bold text-slate-900 text-xs sm:text-sm">Secure Authentication</h5>
							<p class="text-[11px] text-slate-500 leading-relaxed">
								Connect via TLS/SSL encrypted ports (465/587) and OAuth2/App Passwords for maximum domain security.
							</p>
						</div>

						<!-- Benefit 2 -->
						<div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-violet-300 hover:bg-violet-50/30 transition-all duration-300 space-y-2 group/card">
							<div class="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shadow-2xs group-hover/card:bg-violet-600 group-hover/card:text-white transition-colors duration-200">
								<Server class="w-4.5 h-4.5" />
							</div>
							<h5 class="font-bold text-slate-900 text-xs sm:text-sm">Multiple Senders</h5>
							<p class="text-[11px] text-slate-500 leading-relaxed">
								Configure multiple SMTP channels (Workspace, Gmail, SES) and switch sending profiles per campaign.
							</p>
						</div>

						<!-- Benefit 3 -->
						<div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-300 space-y-2 group/card">
							<div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-2xs group-hover/card:bg-emerald-600 group-hover/card:text-white transition-colors duration-200">
								<Wifi class="w-4.5 h-4.5" />
							</div>
							<h5 class="font-bold text-slate-900 text-xs sm:text-sm">Live Connection Test</h5>
							<p class="text-[11px] text-slate-500 leading-relaxed">
								Instantly verify server reachability and send preview test emails before launching mass dispatches.
							</p>
						</div>

						<!-- Benefit 4 -->
						<div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-amber-300 hover:bg-amber-50/30 transition-all duration-300 space-y-2 group/card">
							<div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-2xs group-hover/card:bg-amber-600 group-hover/card:text-white transition-colors duration-200">
								<Activity class="w-4.5 h-4.5" />
							</div>
							<h5 class="font-bold text-slate-900 text-xs sm:text-sm">Automated Scheduling</h5>
							<p class="text-[11px] text-slate-500 leading-relaxed">
								Background dispatch engines automatically route scheduled campaigns through your default account.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Main Configurations Cards Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredConfigs as config (config.id)}
				<div
					class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl hover:shadow-indigo-500/15 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 group relative overflow-hidden flex flex-col justify-between {config.isDefault ? 'ring-2 ring-emerald-500/40 border-emerald-300' : ''}"
				>
					<div class="bg-white rounded-[calc(2.25rem-0.5rem)] p-5 sm:p-6 space-y-5 border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] h-full flex flex-col justify-between">
						<div>
							<!-- Title & Default Badge Header -->
							<div class="flex items-start justify-between gap-3 mb-4">
								<div class="flex items-center gap-3">
									<div class="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
										<Server class="w-5 h-5" />
									</div>
									<div class="min-w-0">
										<h3 class="font-bold text-slate-900 text-base leading-snug truncate group-hover:text-indigo-600 transition-colors">
											{config.name}
										</h3>
										<p class="text-[11px] text-slate-400 font-mono truncate">{config.host}</p>
									</div>
								</div>

								{#if config.isDefault}
									<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
										<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
										Default
									</span>
								{/if}
							</div>

							<!-- Details Specification Box -->
							<div class="space-y-2 text-xs text-slate-600 mb-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60 shadow-2xs">
								<div class="flex justify-between items-center">
									<span class="text-slate-400 font-mono">Server Port</span>
									<span class="font-bold text-slate-800 font-mono bg-white px-2 py-0.5 rounded border border-slate-200/60">{config.host}:{config.port}</span>
								</div>
								<div class="flex justify-between items-center">
									<span class="text-slate-400 font-mono">Username</span>
									<span class="font-semibold text-slate-800 truncate max-w-[160px]" title={config.user}>{config.user}</span>
								</div>
								<div class="flex justify-between items-center">
									<span class="text-slate-400 font-mono">From Email</span>
									<span class="font-semibold text-indigo-600 truncate max-w-[160px]" title={config.fromEmail}>{config.fromEmail}</span>
								</div>
							</div>
						</div>

						<!-- Tactile Action Bar -->
						<div class="border-t border-slate-100 pt-3.5 flex items-center justify-between gap-2">
							<button
								on:click={() => openViewDetails(config)}
								title="View Details"
								class="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200/70 transition-all shadow-2xs flex-1 flex items-center justify-center active:scale-95"
							>
								<Eye class="w-4 h-4" />
							</button>

							<button
								on:click={() => makeDefault(config.id)}
								title="Set as Default"
								disabled={config.isDefault}
								class="p-2 rounded-xl border transition-all shadow-2xs flex-1 flex items-center justify-center active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed {config.isDefault ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 hover:bg-emerald-50 border-slate-200/70 hover:border-emerald-200 text-slate-600 hover:text-emerald-600'}"
							>
								<Star class="w-4 h-4 {config.isDefault ? 'fill-emerald-600' : ''}" />
							</button>

							<button
								on:click={() => openEditForm(config)}
								title="Edit Settings"
								class="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 rounded-xl border border-slate-200/70 transition-all shadow-2xs flex-1 flex items-center justify-center active:scale-95"
							>
								<Edit2 class="w-4 h-4" />
							</button>

							<button
								on:click={() => deleteConfig(config.id, config.name)}
								title="Delete Configuration"
								class="p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-200/70 hover:border-rose-200 transition-all shadow-2xs flex-1 flex items-center justify-center active:scale-95"
							>
								<Trash2 class="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

{#if showModal}
	<!-- Modal Backdrop Centered Relative to Dashboard Content Area (md:left-64) -->
	<div
		class="fixed inset-0 md:left-64 bg-slate-950/70 backdrop-blur-md z-40 p-4 sm:p-6 md:p-8 flex items-center justify-center select-none animate-in fade-in duration-200"
		on:click|self={() => (showModal = false)}
	>
		<!-- Double-Bezel Modal Container with Fixed Height Flex Layout (Zero Padding on Outer shell) -->
		<div
			class="relative w-full max-w-2xl bg-white rounded-[2.25rem] border border-slate-200/90 shadow-2xl shadow-slate-950/30 overflow-hidden h-[720px] max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 select-text"
		>
			<!-- Top Accent Glow Line -->
			<div class="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 z-20"></div>

			<!-- Fixed Modal Header (shrink-0) -->
			<div class="px-6 sm:px-8 pt-6 sm:pt-7 pb-4 border-b border-slate-100 bg-white shrink-0 z-10 flex justify-between items-center">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
						<Server class="w-6 h-6 text-white" />
					</div>
					<div>
						<div class="flex items-center gap-2.5">
							<h3 class="font-bold text-slate-900 text-lg sm:text-xl tracking-tight leading-snug">
								{editMode ? "Edit SMTP Configuration" : "Add SMTP Configuration"}
							</h3>
							<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100/80 shadow-2xs">
								<ShieldCheck class="w-3.5 h-3.5 text-indigo-600" />
								TLS 1.3 Security
							</span>
						</div>
						<p class="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">Configure server credentials, security ports, and sender profile</p>
					</div>
				</div>
				<button
					on:click={() => (showModal = false)}
					aria-label="Close modal"
					class="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Scrollable Modal Form Body ONLY (flex-1 min-h-0) -->
			<div
				class="overflow-y-auto flex-1 min-h-0 px-6 sm:px-8 py-6 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [scrollbar-width:thin] [scrollbar-color:theme(colors.slate.200)_transparent]"
			>
				<!-- Section 1: Configuration Identity -->
				<div class="space-y-3">
					<div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pb-1 border-b border-slate-100">
						<SlidersHorizontal class="w-3.5 h-3.5 text-indigo-500" />
						<span>1. Configuration Identity</span>
					</div>

					<div class="px-0.5 py-0.5">
						<label for="config-name" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono">
							Configuration Name <span class="text-rose-500">*</span>
						</label>
						<input
							id="config-name"
							type="text"
							bind:value={name}
							placeholder="e.g. Workspace Account, Gmail Marketing"
							class="w-full px-4 py-3 bg-slate-50/70 focus:bg-white rounded-xl border border-slate-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/12 focus:border-indigo-500 transition-all shadow-inner/5"
							required
						/>
					</div>
				</div>

				<!-- Section 2: SMTP Server Network -->
				<div class="space-y-4">
					<div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pb-1 border-b border-slate-100">
						<Server class="w-3.5 h-3.5 text-indigo-500" />
						<span>2. SMTP Server Network</span>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 px-0.5 py-0.5">
						<div class="sm:col-span-2">
							<label for="smtp-host" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono">
								SMTP Host Server <span class="text-rose-500">*</span>
							</label>
							<input
								id="smtp-host"
								type="text"
								bind:value={host}
								placeholder="smtp.gmail.com"
								class="w-full px-4 py-3 bg-slate-50/70 focus:bg-white rounded-xl border border-slate-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/12 focus:border-indigo-500 transition-all shadow-inner/5"
								required
							/>
						</div>
						<div>
							<label for="smtp-port" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono">
								Port <span class="text-rose-500">*</span>
							</label>
							<input
								id="smtp-port"
								type="number"
								bind:value={port}
								class="w-full px-4 py-3 bg-slate-50/70 focus:bg-white rounded-xl border border-slate-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/12 focus:border-indigo-500 transition-all shadow-inner/5"
								required
							/>
						</div>
					</div>

					<!-- Premium Security Checkbox -->
					<div
						class="flex items-start gap-3 cursor-pointer p-3.5 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 transition-all select-none group/chk min-h-[58px] shrink-0"
						on:click={() => (secure = !secure)}
						on:keydown={(e) => (e.key === ' ' || e.key === 'Enter') && (secure = !secure)}
						role="checkbox"
						aria-checked={secure}
						tabindex="0"
					>
						<div class="w-5 h-5 rounded-lg border transition-colors flex items-center justify-center shrink-0 mt-0.5 {secure ? 'bg-indigo-600 border-indigo-600 shadow-2xs' : 'bg-white border-slate-300 group-hover/chk:border-indigo-400'}">
							<Check class="w-3.5 h-3.5 text-white stroke-[3] transition-opacity duration-150 {secure ? 'opacity-100' : 'opacity-0'}" />
						</div>
						<div class="min-w-0 flex-grow">
							<p class="text-xs font-bold text-slate-800">Use SSL/TLS Security Encryption</p>
							<p class="text-[11px] text-slate-500 mt-0.5">Implicit secure port 465, or TLS/STARTTLS fallback on port 587</p>
						</div>
					</div>
				</div>

				<!-- Section 3: Server Authentication -->
				<div class="space-y-4">
					<div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pb-1 border-b border-slate-100">
						<Lock class="w-3.5 h-3.5 text-indigo-500" />
						<span>3. Server Authentication Credentials</span>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 px-0.5 py-0.5">
						<div>
							<label for="smtp-user" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono">
								SMTP Username / Email <span class="text-rose-500">*</span>
							</label>
							<input
								id="smtp-user"
								type="text"
								bind:value={user}
								placeholder="user@example.com"
								class="w-full px-4 py-3 bg-slate-50/70 focus:bg-white rounded-xl border border-slate-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/12 focus:border-indigo-500 transition-all shadow-inner/5"
								required
							/>
						</div>

						<div>
							<label for="smtp-pass" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono">
								SMTP Password {editMode ? "(Unchanged if blank)" : "*"}
							</label>
							<div class="relative">
								{#if showPassword}
									<input
										id="smtp-pass"
										type="text"
										bind:value={pass}
										placeholder={editMode ? "•••••••• (Keep existing)" : "Enter password"}
										class="w-full pl-4 pr-11 py-3 bg-slate-50/70 focus:bg-white rounded-xl border border-slate-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/12 focus:border-indigo-500 transition-all shadow-inner/5"
										required={!editMode}
									/>
								{:else}
									<input
										id="smtp-pass"
										type="password"
										bind:value={pass}
										placeholder={editMode ? "•••••••• (Keep existing)" : "Enter password"}
										class="w-full pl-4 pr-11 py-3 bg-slate-50/70 focus:bg-white rounded-xl border border-slate-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/12 focus:border-indigo-500 transition-all shadow-inner/5"
										required={!editMode}
									/>
								{/if}
								<button
									type="button"
									on:click={() => (showPassword = !showPassword)}
									class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
									title={showPassword ? "Hide password" : "Show password"}
								>
									{#if showPassword}
										<EyeOff class="w-4 h-4" />
									{:else}
										<Eye class="w-4 h-4" />
									{/if}
								</button>
							</div>
						</div>
					</div>

					<!-- Password validation notices -->
					{#if isGmail}
						<div class="bg-indigo-50/80 border border-indigo-200/80 rounded-xl p-3.5 flex items-start gap-3">
							<Sparkles class="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
							<div class="text-xs text-indigo-900 space-y-1">
								<p class="font-bold">Gmail Setup Guidance:</p>
								<p>1. Enable 2-Factor Authentication on your Google Account.</p>
								<p>2. Create a 16-character App Password under Google Account Settings → Security.</p>
								<p>3. Paste the code here (spaces will be automatically cleaned).</p>
							</div>
						</div>

						{#if showGmailWarning}
							<div class="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2 text-rose-700 text-xs">
								<Wifi class="w-4 h-4 mt-0.5 shrink-0" />
								<p>Gmail App Passwords must be exactly 16 alphanumeric characters. Currently length is {cleanPassword.length} (whitespaces excluded).</p>
							</div>
						{/if}
					{/if}
				</div>

				<!-- Section 4: Sender Identity & Default Settings -->
				<div class="space-y-4">
					<div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 font-mono pb-1 border-b border-slate-100">
						<Mail class="w-3.5 h-3.5 text-indigo-500" />
						<span>4. Sender Profile & Default Routing</span>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 px-0.5 py-0.5">
						<div>
							<label for="from-email" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono">
								From Email (Display Sender) <span class="text-rose-500">*</span>
							</label>
							<input
								id="from-email"
								type="email"
								bind:value={fromEmail}
								placeholder="marketing@example.com"
								class="w-full px-4 py-3 bg-slate-50/70 focus:bg-white rounded-xl border border-slate-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/12 focus:border-indigo-500 transition-all shadow-inner/5"
								required
							/>
						</div>

						<div>
							<label for="from-name" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono">
								From Name (Display Name)
							</label>
							<input
								id="from-name"
								type="text"
								bind:value={fromName}
								placeholder="e.g. Sales Team"
								class="w-full px-4 py-3 bg-slate-50/70 focus:bg-white rounded-xl border border-slate-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/12 focus:border-indigo-500 transition-all shadow-inner/5"
							/>
						</div>
					</div>

					<!-- Premium Default Channel Checkbox (Zero-Reflow Interactive Element) -->
					<div
						class="flex items-start gap-3 cursor-pointer p-3.5 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 transition-all select-none group/chk min-h-[58px] shrink-0"
						on:click={() => (isDefault = !isDefault)}
						on:keydown={(e) => (e.key === ' ' || e.key === 'Enter') && (isDefault = !isDefault)}
						role="checkbox"
						aria-checked={isDefault}
						tabindex="0"
					>
						<div class="w-5 h-5 rounded-lg border transition-colors flex items-center justify-center shrink-0 mt-0.5 {isDefault ? 'bg-indigo-600 border-indigo-600 shadow-2xs' : 'bg-white border-slate-300 group-hover/chk:border-indigo-400'}">
							<Check class="w-3.5 h-3.5 text-white stroke-[3] transition-opacity duration-150 {isDefault ? 'opacity-100' : 'opacity-0'}" />
						</div>
						<div class="min-w-0 flex-grow">
							<p class="text-xs font-bold text-slate-800">Set as Primary Default SMTP Configuration</p>
							<p class="text-[11px] text-slate-500 mt-0.5">Automated dispatches and scheduled campaigns will use this sender account by default</p>
						</div>
					</div>
				</div>

				<!-- Bottom Breathing Room Buffer -->
				<div class="h-2"></div>
			</div>

			<!-- Fixed Modal Footer Action Bar (shrink-0, z-10) -->
			<div class="px-6 sm:px-8 py-4 sm:py-5 border-t border-slate-100 bg-slate-50/90 backdrop-blur-sm shrink-0 z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
				<button
					type="button"
					on:click={testSMTPConnection}
					disabled={testingConnection}
					class="px-4.5 py-2.5 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200/80 text-slate-700 font-bold text-xs rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-2xs active:scale-95 disabled:opacity-50"
				>
					{#if testingConnection}
						<RefreshCw class="animate-spin h-4 w-4 text-indigo-600" />
						<span>Testing Connection...</span>
					{:else}
						<Wifi class="w-4 h-4 text-indigo-600" />
						<span>Test Connection</span>
					{/if}
				</button>

				<div class="flex items-center justify-end gap-3">
					<button
						type="button"
						on:click={() => (showModal = false)}
						class="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-2xs active:scale-95"
					>
						Cancel
					</button>
					<button
						type="button"
						on:click={saveConfiguration}
						disabled={loading}
						class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
					>
						{#if loading}
							<RefreshCw class="w-4 h-4 animate-spin text-white" />
							<span>Saving...</span>
						{:else}
							<Send class="w-4 h-4 text-white" />
							<span>Save Settings</span>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Reusable Modal for View Details -->
<Modal show={showViewModal && selectedConfig !== null} title="SMTP Details" size="lg" on:close={() => (showViewModal = false)}>
	{#if selectedConfig}
		<div class="space-y-4 text-slate-600">
			<div class="grid grid-cols-3 border-b border-slate-100 pb-3">
				<span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Name</span>
				<span class="text-sm font-bold text-slate-800 col-span-2">{selectedConfig.name}</span>
			</div>
			<div class="grid grid-cols-3 border-b border-slate-100 pb-3">
				<span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">SMTP Server</span>
				<span class="text-sm font-bold text-slate-800 font-mono col-span-2">{selectedConfig.host}:{selectedConfig.port}</span>
			</div>
			<div class="grid grid-cols-3 border-b border-slate-100 pb-3">
				<span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Security</span>
				<span class="col-span-2">
					{#if selectedConfig.secure}
						<span class="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-1 rounded-full font-bold">SSL/TLS Enabled</span>
					{:else}
						<span class="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full font-bold">No Encryption</span>
					{/if}
				</span>
			</div>
			<div class="grid grid-cols-3 border-b border-slate-100 pb-3">
				<span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Username</span>
				<span class="text-sm font-semibold text-slate-800 col-span-2 truncate">{selectedConfig.user}</span>
			</div>
			<div class="grid grid-cols-3 border-b border-slate-100 pb-3">
				<span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">From Email</span>
				<span class="text-sm font-semibold text-indigo-600 col-span-2 truncate">{selectedConfig.fromEmail}</span>
			</div>
			<div class="grid grid-cols-3">
				<span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Default Setting</span>
				<span class="col-span-2">
					{#if selectedConfig.isDefault}
						<span class="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full font-bold">Yes (Primary Server)</span>
					{:else}
						<span class="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-semibold">No</span>
					{/if}
				</span>
			</div>
		</div>
	{/if}
	<div slot="footer">
		<button
			type="button"
			on:click={() => (showViewModal = false)}
			class="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs shadow-2xs"
		>
			Close Details
		</button>
		{#if selectedConfig}
			<button
				type="button"
				on:click={() => {
					showViewModal = false;
					openEditForm(selectedConfig);
				}}
				class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
			>
				<Edit2 class="w-3.5 h-3.5" />
				Edit Config
			</button>
		{/if}
	</div>
</Modal>

<!-- Loader indicator -->
<Loader visible={loading} text="Saving Configuration..." />
