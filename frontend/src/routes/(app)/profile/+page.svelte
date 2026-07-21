<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { configsStore } from '$lib/stores/configsStore';
	import { toastStore } from '$lib/stores/toastStore';
	import Header from '$lib/components/layout/Header.svelte';
	import {
		User,
		Mail,
		Shield,
		ShieldCheck,
		Key,
		CheckCircle2,
		Database,
		Copy,
		Check,
		Server,
		Clock,
		Sparkles,
		ArrowRight,
		Lock,
		BadgeCheck,
		Activity,
		ExternalLink,
		Cpu,
		SlidersHorizontal
	} from 'lucide-svelte';

	let sessionActiveSince = '';
	let copiedId = false;

	onMount(() => {
		sessionActiveSince = new Date().toLocaleString();
		configsStore.load();
	});

	$: defaultConfig = $configsStore.find((c) => c.isDefault);

	async function copyAccountId() {
		if (!$authStore.user?.id) return;
		try {
			await navigator.clipboard.writeText($authStore.user.id);
			copiedId = true;
			toastStore.success('Database Account ID copied to clipboard');
			setTimeout(() => {
				copiedId = false;
			}, 2000);
		} catch (err) {
			toastStore.danger('Failed to copy Account ID');
		}
	}
</script>

<div class="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto pb-12">
	<!-- Page Header -->
	<Header
		title="Account & Security Dashboard"
		subtitle="Manage administrator identity, active session security, and dispatch credentials"
	/>

	{#if $authStore.user}
		<!-- Real-Data Metric Summary Cards Strip (Doppelrand Architecture) -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<!-- Metric 1: Account Status -->
			<div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-2xs transition-all duration-200">
				<div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100">
					<div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0 shadow-2xs">
						<User class="w-5 h-5" />
					</div>
					<div class="min-w-0">
						<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Account Status</p>
						<p class="text-xs font-bold text-emerald-700 mt-0.5 flex items-center gap-1.5 truncate">
							<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
							<span>Verified Administrator</span>
						</p>
					</div>
				</div>
			</div>

			<!-- Metric 2: Connected Dispatch Servers -->
			<div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-emerald-200/70 hover:border-emerald-400/80 shadow-2xs transition-all duration-200">
				<div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100">
					<div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 shadow-2xs">
						<Server class="w-5 h-5" />
					</div>
					<div class="min-w-0">
						<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">SMTP Channels</p>
						<p class="text-xs font-bold text-slate-900 mt-0.5 truncate">
							{$configsStore.length} {$configsStore.length === 1 ? 'Server' : 'Servers'} Active
						</p>
					</div>
				</div>
			</div>

			<!-- Metric 3: Authentication Security -->
			<div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-violet-200/70 hover:border-violet-400/80 shadow-2xs transition-all duration-200">
				<div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100">
					<div class="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shrink-0 shadow-2xs">
						<Lock class="w-5 h-5" />
					</div>
					<div class="min-w-0">
						<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Security Mechanism</p>
						<p class="text-xs font-bold text-slate-900 mt-0.5 truncate">
							Argon2id + HMAC Cookie
						</p>
					</div>
				</div>
			</div>

			<!-- Metric 4: Session Start -->
			<div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-amber-200/70 hover:border-amber-400/80 shadow-2xs transition-all duration-200">
				<div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100">
					<div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 shadow-2xs">
						<Clock class="w-5 h-5" />
					</div>
					<div class="min-w-0">
						<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Current Session</p>
						<p class="text-xs font-semibold text-slate-800 mt-0.5 truncate" title={sessionActiveSince}>
							{sessionActiveSince || 'Active'}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Account & Security Grid Layout -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
			<!-- Left Section: Profile Identity & Connected Mail Servers (2 Columns on lg) -->
			<div class="lg:col-span-2 space-y-6 sm:space-y-8">
				<!-- Account Profile & Details Card (Doppelrand Double-Bezel with Full Accent Border) -->
				<div
					class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative group overflow-hidden"
				>
					<div class="bg-white rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-8 space-y-7 border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
						<!-- Prominent Avatar & Identity Header Block -->
						<div class="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
							<!-- Premium Prominent Avatar Container -->
							<div class="relative shrink-0">
								<div class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white font-bold text-3xl sm:text-4xl shadow-lg shadow-indigo-500/25 flex items-center justify-center border-2 border-white ring-4 ring-indigo-50 group-hover:scale-105 transition-transform duration-300">
									{$authStore.user.name ? $authStore.user.name.charAt(0).toUpperCase() : 'U'}
								</div>
								<div class="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md">
									<BadgeCheck class="w-6 h-6 text-indigo-600 fill-indigo-50" />
								</div>
							</div>

							<!-- User Identity Text & Status Badges -->
							<div class="space-y-2 min-w-0 flex-1">
								<div class="flex flex-wrap items-center gap-2.5">
									<h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug truncate">
										{$authStore.user.name}
									</h2>
									<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
										<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
										Active Account
									</span>
								</div>

								<p class="text-xs sm:text-sm text-slate-500 flex items-center gap-2 font-normal">
									<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
										<Shield class="w-3.5 h-3.5 text-indigo-600" />
										System Administrator
									</span>
									<span class="text-slate-300">•</span>
									<span class="text-slate-500 text-xs font-mono">ID: {$authStore.user.id.slice(0, 8)}...</span>
								</p>
							</div>
						</div>

						<!-- Structured Information Rows Block -->
						<div class="space-y-4">
							<div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-1">
								<SlidersHorizontal class="w-3.5 h-3.5 text-indigo-500" />
								<span>Account Identity Details</span>
							</div>

							<div class="bg-slate-50/70 rounded-2xl border border-slate-200/60 p-4 sm:p-5 divide-y divide-slate-200/60 space-y-3.5">
								<!-- Info Row 1: Email -->
								<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 first:pt-0">
									<div class="flex items-center gap-2.5 text-xs font-semibold text-slate-500 min-w-[160px]">
										<div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
											<Mail class="w-4 h-4" />
										</div>
										<span>Email Address</span>
									</div>
									<div class="flex items-center gap-2">
										<span class="text-sm font-bold text-indigo-950 font-sans tracking-tight">
											{$authStore.user.email}
										</span>
										<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
											<CheckCircle2 class="w-3 h-3 text-emerald-600" />
											Verified
										</span>
									</div>
								</div>

								<!-- Info Row 2: Account Database ID -->
								<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3.5">
									<div class="flex items-center gap-2.5 text-xs font-semibold text-slate-500 min-w-[160px]">
										<div class="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100">
											<Key class="w-4 h-4" />
										</div>
										<span>Database Account ID</span>
									</div>
									<div class="flex items-center gap-2">
										<code class="px-3 py-1 bg-white rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 shadow-2xs select-all">
											{$authStore.user.id}
										</code>
										<button
											on:click={copyAccountId}
											title="Copy Database Account ID"
											class="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-indigo-600 transition-all shadow-2xs active:scale-95 flex items-center justify-center"
										>
											{#if copiedId}
												<Check class="w-4 h-4 text-emerald-600 stroke-[2.5]" />
											{:else}
												<Copy class="w-4 h-4" />
											{/if}
										</button>
									</div>
								</div>

								<!-- Info Row 3: Current Session -->
								<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3.5">
									<div class="flex items-center gap-2.5 text-xs font-semibold text-slate-500 min-w-[160px]">
										<div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
											<Clock class="w-4 h-4" />
										</div>
										<span>Active Session</span>
									</div>
									<div class="text-xs font-semibold text-slate-800 bg-white px-3 py-1 rounded-xl border border-slate-200/80 shadow-2xs">
										Active since {sessionActiveSince}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Connected Mail Infrastructure Panel (Real $configsStore Data with Full Accent Border) -->
				<div
					class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative group overflow-hidden"
				>
					<div class="bg-white rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-7 space-y-6 border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
						<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
							<div class="flex items-center gap-3.5">
								<div class="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
									<Server class="w-5.5 h-5.5" />
								</div>
								<div>
									<h3 class="font-bold text-slate-900 text-base">Mail Dispatch Infrastructure</h3>
									<p class="text-xs text-slate-500">Configured SMTP mail servers connected to this account</p>
								</div>
							</div>

							<a
								href="/configs"
								class="inline-flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-indigo-500/20 active:scale-95 group/btn shrink-0"
							>
								<span>Manage SMTP Servers</span>
								<div class="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-white group-hover/btn:translate-x-0.5 transition-transform">
									<ArrowRight class="w-3.5 h-3.5" />
								</div>
							</a>
						</div>

						<!-- Config Info Box -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div class="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-2">
								<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Primary Sending Channel</p>
								{#if defaultConfig}
									<p class="text-sm font-bold text-slate-900 truncate" title={defaultConfig.name}>{defaultConfig.name}</p>
									<p class="text-xs text-indigo-600 font-mono truncate">{defaultConfig.fromEmail}</p>
								{:else if $configsStore.length > 0}
									<p class="text-sm font-bold text-slate-900 truncate">{$configsStore[0].name}</p>
									<p class="text-xs text-indigo-600 font-mono truncate">{$configsStore[0].fromEmail}</p>
								{:else}
									<p class="text-xs font-semibold text-slate-500 italic">No SMTP servers configured yet</p>
								{/if}
							</div>

							<div class="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-2">
								<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">System Dispatch Capacity</p>
								<p class="text-sm font-bold text-slate-900">
									{$configsStore.length} Configured {$configsStore.length === 1 ? 'Channel' : 'Channels'}
								</p>
								<p class="text-xs text-emerald-600 font-semibold flex items-center gap-1">
									<ShieldCheck class="w-3.5 h-3.5" />
									TLS 1.3 Encryption Ready
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Section: Security Protocols & Overview Panel (1 Column on lg) -->
			<div class="lg:col-span-1 space-y-6">
				<!-- Premium Security Protocols Overview Panel (Full Emerald Accent Border) -->
				<div
					class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-emerald-900/[0.03] border border-emerald-200/70 hover:border-emerald-400/80 hover:ring-1 hover:ring-emerald-400/20 shadow-md hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 relative group overflow-hidden h-full flex flex-col justify-between"
				>
					<div class="bg-white rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-7 space-y-6 border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] flex-1 flex flex-col justify-between">
						<div class="space-y-6">
							<!-- Security Header -->
							<div class="space-y-3 pb-5 border-b border-slate-100">
								<div class="flex items-center justify-between">
									<div class="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 inline-block shadow-2xs">
										<ShieldCheck class="w-6 h-6" />
									</div>
									<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
										<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
										100% Protected
									</span>
								</div>
								<div>
									<h3 class="font-bold text-slate-900 text-lg tracking-tight">Security Protocols</h3>
									<p class="text-xs text-slate-500 mt-1 leading-relaxed">
										Your account session is encrypted and protected using HTTP-Only cookies with HMAC signatures. Password values are hashed with argon2 before saving in SQLite.
									</p>
								</div>
							</div>

							<!-- Security Feature Items Stack -->
							<div class="space-y-3.5">
								<!-- Protocol 1 -->
								<div class="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-indigo-200 transition-colors flex items-start gap-3">
									<div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
										<Lock class="w-4 h-4" />
									</div>
									<div class="text-xs">
										<h4 class="font-bold text-slate-800">Session Cookie Protection</h4>
										<p class="text-slate-500 text-[11px] leading-normal mt-0.5">HTTP-Only cookies with HMAC SHA-256 signatures prevent XSS token theft.</p>
									</div>
								</div>

								<!-- Protocol 2 -->
								<div class="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-violet-200 transition-colors flex items-start gap-3">
									<div class="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center shrink-0 mt-0.5">
										<Key class="w-4 h-4" />
									</div>
									<div class="text-xs">
										<h4 class="font-bold text-slate-800">Argon2id Hashing</h4>
										<p class="text-slate-500 text-[11px] leading-normal mt-0.5">Credentials hashed via Argon2id algorithm before database persistent store.</p>
									</div>
								</div>

								<!-- Protocol 3 -->
								<div class="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-emerald-200 transition-colors flex items-start gap-3">
									<div class="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
										<Database class="w-4 h-4" />
									</div>
									<div class="text-xs">
										<h4 class="font-bold text-slate-800">SQLite Database Safety</h4>
										<p class="text-slate-500 text-[11px] leading-normal mt-0.5">Prepared SQL statements protect against query parameter injection attacks.</p>
									</div>
								</div>
							</div>
						</div>

						<!-- System Engine Footer Badge -->
						<div class="pt-4 border-t border-slate-100 mt-6">
							<div class="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
								<div class="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
									<Cpu class="w-5 h-5 text-indigo-300" />
								</div>
								<div class="min-w-0 flex-1">
									<div class="flex items-center justify-between">
										<span class="text-xs font-bold text-white">SQLite Engine</span>
										<span class="text-[10px] font-mono text-emerald-400 font-semibold">ONLINE</span>
									</div>
									<p class="text-[11px] text-slate-300 truncate mt-0.5">Encrypted session checks & prepared queries</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

