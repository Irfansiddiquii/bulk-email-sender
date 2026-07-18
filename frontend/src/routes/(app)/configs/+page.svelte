<script lang="ts">
	import { onMount } from 'svelte';
	import { configsStore, type SMTPConfig } from '$lib/stores/configsStore';
	import { toastStore } from '$lib/stores/toastStore';
	import { configApi } from '$lib/api/config';
	import Header from '$lib/components/layout/Header.svelte';
	import Modal from '$lib/components/layout/Modal.svelte';
	import Loader from '$lib/components/layout/Loader.svelte';
	import { Plus, Eye, Star, Trash2, Edit2, ShieldAlert, Sparkles, X, Wifi, Settings } from 'lucide-svelte';

	let loading = false;
	let showModal = false;
	let editMode = false;
	let selectedConfig: SMTPConfig | null = null;
	let showViewModal = false;
	let testingConnection = false;
	let showPassword = false;

	// Form values
	let configId = '';
	let name = '';
	let host = '';
	let port = 587;
	let secure = false;
	let user = '';
	let pass = '';
	let fromEmail = '';
	let fromName = '';
	let isDefault = false;

	onMount(() => {
		configsStore.load();
	});

	// Gmail App Password Helpers
	$: isGmail = host.toLowerCase().includes('gmail');
	$: cleanPassword = pass.replace(/\s+/g, '');
	$: isGmailPasswordValid = cleanPassword.length === 16 && /^[a-zA-Z0-9]+$/.test(cleanPassword);
	$: showGmailWarning = isGmail && pass.length > 0 && !isGmailPasswordValid;

	function openNewForm() {
		editMode = false;
		configId = '';
		name = '';
		host = '';
		port = 587;
		secure = false;
		user = '';
		pass = '';
		fromEmail = '';
		fromName = '';
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
		pass = ''; // Leave password blank for security
		fromEmail = config.fromEmail;
		fromName = config.fromName || '';
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
		if (hostname.toLowerCase().includes('gmail')) {
			return clean.replace(/\s+/g, '');
		}
		return clean;
	}

	async function testSMTPConnection() {
		if (!host || !user || (!editMode && !pass)) {
			toastStore.warning('Host, username, and password are required to test.');
			return;
		}

		testingConnection = true;
		toastStore.info('Testing SMTP connection...');

		const finalPass = editMode && !pass 
			? '' 
			: sanitizePassword(pass, host);

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
				toastStore.success('SMTP connection test successful! Server is reachable.');
			} else {
				toastStore.danger(res.data.message || 'SMTP connection failed.');
			}
		} catch (err: any) {
			toastStore.danger(err.response?.data?.message || 'SMTP connection failed.');
		} finally {
			testingConnection = false;
		}
	}

	async function saveConfiguration() {
		if (!name || !host || !user || !fromEmail) {
			toastStore.warning('Please fill in all required fields.');
			return;
		}

		if (isGmail && pass && !isGmailPasswordValid) {
			toastStore.warning('Gmail requires a 16-character alphanumeric App Password.');
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
				toastStore.success(editMode ? 'Configuration updated!' : 'Configuration created!');
				showModal = false;
				configsStore.load();
			} else {
				toastStore.danger(res.data.message || 'Failed to save configuration.');
			}
		} catch (err: any) {
			toastStore.danger(err.response?.data?.message || 'Failed to save configuration.');
		} finally {
			loading = false;
		}
	}

	async function makeDefault(id: string) {
		const success = await configsStore.setDefault(id);
		if (success) {
			toastStore.success('Default SMTP configuration updated.');
		} else {
			toastStore.danger('Failed to update default configuration.');
		}
	}

	async function deleteConfig(id: string, configName: string) {
		if (confirm(`Are you sure you want to delete configuration "${configName}"?`)) {
			const success = await configsStore.delete(id);
			if (success) {
				toastStore.success('Configuration deleted.');
			} else {
				toastStore.danger('Failed to delete configuration.');
			}
		}
	}
</script>

<div class="space-y-6">
	<!-- Header Panel -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<Header title="SMTP Configurations" subtitle="Manage multiple email server configurations for sending campaigns" />
		<button 
			on:click={openNewForm}
			class="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-3 rounded-xl transition-all duration-200 shadow-md shadow-primary/10 flex items-center gap-2 text-sm"
		>
			<Plus class="w-4 h-4" />
			Add Configuration
		</button>
	</div>

	<!-- Cards list -->
	{#if $configsStore.length === 0}
		<div class="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
			<div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
				<Settings class="w-8 h-8 text-slate-400" />
			</div>
			<h3 class="text-lg font-bold text-slate-800">No SMTP Configurations</h3>
			<p class="text-slate-500 text-sm mt-1 max-w-sm mx-auto">You must add at least one SMTP configuration to start composing and sending email campaigns.</p>
			<button 
				on:click={openNewForm}
				class="mt-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
			>
				Create First Configuration
			</button>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each $configsStore as config (config.id)}
				<div 
					class="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between {config.isDefault ? 'border-emerald-500 ring-2 ring-emerald-500/10' : ''}"
				>
					<div>
						<!-- Title header -->
						<div class="flex items-start justify-between gap-3 mb-4">
							<h3 class="font-bold text-slate-800 text-base leading-snug line-clamp-1">{config.name}</h3>
							{#if config.isDefault}
								<span class="bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-200">Default</span>
							{/if}
						</div>

						<!-- Details -->
						<div class="space-y-2 text-sm text-slate-600 mb-5">
							<div class="flex justify-between">
								<span class="text-slate-400">Server</span>
								<span class="font-medium text-slate-800">{config.host}:{config.port}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-slate-400">Username</span>
								<span class="font-medium text-slate-800 truncate max-w-[150px]" title={config.user}>{config.user}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-slate-400">From Email</span>
								<span class="font-medium text-slate-800 truncate max-w-[150px]" title={config.fromEmail}>{config.fromEmail}</span>
							</div>
						</div>
					</div>

					<!-- Actions panel -->
					<div class="border-t border-slate-100 pt-4 flex gap-2">
						<button 
							on:click={() => openViewDetails(config)}
							title="View Details"
							class="flex-grow bg-slate-50 hover:bg-slate-100 text-slate-600 p-2.5 rounded-xl border border-slate-200/50 transition-colors flex items-center justify-center"
						>
							<Eye class="w-4 h-4" />
						</button>
						<button 
							on:click={() => makeDefault(config.id)}
							title="Set as Default"
							disabled={config.isDefault}
							class="flex-grow p-2.5 rounded-xl border border-slate-200/50 transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
							class:bg-emerald-50={config.isDefault}
							class:text-emerald-600={config.isDefault}
							class:bg-slate-50={!config.isDefault}
							class:text-slate-600={!config.isDefault}
							class:hover:bg-slate-100={!config.isDefault}
						>
							<Star class="w-4 h-4 {config.isDefault ? 'fill-emerald-600' : ''}" />
						</button>
						<button 
							on:click={() => openEditForm(config)}
							title="Edit Settings"
							class="flex-grow bg-slate-50 hover:bg-slate-100 text-slate-600 p-2.5 rounded-xl border border-slate-200/50 transition-colors flex items-center justify-center"
						>
							<Edit2 class="w-4 h-4" />
						</button>
						<button 
							on:click={() => deleteConfig(config.id, config.name)}
							title="Delete"
							class="flex-grow bg-rose-50 hover:bg-rose-100 text-rose-600 p-2.5 rounded-xl border border-rose-100/50 transition-colors flex items-center justify-center"
						>
							<Trash2 class="w-4 h-4" />
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Reusable Modal for Add/Edit Form -->
<Modal show={showModal} title={editMode ? 'Edit SMTP Configuration' : 'Add SMTP Configuration'} size="xl" on:close={() => showModal = false}>
	<div class="space-y-4">
		<!-- Name config -->
		<div>
			<label class="block text-sm font-semibold text-slate-700 mb-2">Configuration Name *</label>
			<input 
				type="text" 
				bind:value={name} 
				placeholder="e.g. Workspace Account, Gmail Marketing"
				class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
				required
			/>
		</div>

		<!-- Host & Port -->
		<div class="grid grid-cols-3 gap-4">
			<div class="col-span-2">
				<label class="block text-sm font-semibold text-slate-700 mb-2">SMTP Host *</label>
				<input 
					type="text" 
					bind:value={host} 
					placeholder="smtp.gmail.com"
					class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
					required
				/>
			</div>
			<div>
				<label class="block text-sm font-semibold text-slate-700 mb-2">Port *</label>
				<input 
					type="number" 
					bind:value={port} 
					class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
					required
				/>
			</div>
		</div>

		<!-- Security checkbox -->
		<div class="flex items-center gap-2">
			<input 
				type="checkbox" 
				id="secure" 
				bind:checked={secure}
				class="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded"
			/>
			<label for="secure" class="text-sm font-semibold text-slate-700">Use SSL/TLS (Implicit secure port 465, or TLS/STARTTLS fallback on port 587)</label>
		</div>

		<!-- Username & Password -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-semibold text-slate-700 mb-2">SMTP User (Username/Email) *</label>
				<input 
					type="text" 
					bind:value={user} 
					placeholder="user@example.com"
					class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
					required
				/>
			</div>
			<div>
				<label class="block text-sm font-semibold text-slate-700 mb-2">
					SMTP Password {editMode ? '(Leave blank to keep existing)' : '*'}
				</label>
				<div class="relative">
					{#if showPassword}
						<input 
							type="text" 
							bind:value={pass} 
							placeholder={editMode ? '••••••••' : 'Enter password'}
							class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm pr-12"
							required={!editMode}
						/>
					{:else}
						<input 
							type="password" 
							bind:value={pass} 
							placeholder={editMode ? '••••••••' : 'Enter password'}
							class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm pr-12"
							required={!editMode}
						/>
					{/if}
					<button 
						type="button"
						on:click={() => showPassword = !showPassword}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-semibold"
					>
						{showPassword ? 'Hide' : 'Show'}
					</button>
				</div>
			</div>
		</div>

		<!-- Password validation notices -->
		{#if isGmail}
			<div class="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-start gap-3">
				<Sparkles class="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
				<div class="text-xs text-blue-700 space-y-1">
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

		<!-- From Email & From Name -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-semibold text-slate-700 mb-2">From Email (Display Sender Address) *</label>
				<input 
					type="email" 
					bind:value={fromEmail} 
					placeholder="marketing@example.com"
					class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
					required
				/>
			</div>
			<div>
				<label class="block text-sm font-semibold text-slate-700 mb-2">From Name (Display Sender Name)</label>
				<input 
					type="text" 
					bind:value={fromName} 
					placeholder="e.g. Sales Team"
					class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
				/>
			</div>
		</div>

		<!-- Set default checkbox -->
		<div class="flex items-center gap-2">
			<input 
				type="checkbox" 
				id="isDefault" 
				bind:checked={isDefault}
				class="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded"
			/>
			<label for="isDefault" class="text-sm font-semibold text-slate-700">Set as default configuration</label>
		</div>
	</div>

	<div slot="footer" class="w-full flex justify-between gap-3 text-xs">
		<button 
			type="button" 
			on:click={testSMTPConnection}
			disabled={testingConnection}
			class="border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
		>
			{#if testingConnection}
				<div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-slate-600"></div>
				Testing...
			{:else}
				<Wifi class="w-4 h-4" />
				Test Connection
			{/if}
		</button>

		<div class="flex gap-2.5">
			<button 
				type="button" 
				on:click={() => showModal = false}
				class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-750 font-bold px-4 py-2.5 rounded-xl transition-colors"
			>
				Cancel
			</button>
			<button 
				type="button" 
				on:click={saveConfiguration}
				class="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md shadow-primary/10"
			>
				Save Settings
			</button>
		</div>
	</div>
</Modal>

<!-- Reusable Modal for View Details -->
<Modal show={showViewModal && selectedConfig !== null} title="SMTP Details" size="lg" on:close={() => showViewModal = false}>
	{#if selectedConfig}
		<div class="space-y-4 text-slate-600">
			<div class="grid grid-cols-3 border-b border-slate-50 pb-3">
				<span class="text-sm font-semibold text-slate-400">Name</span>
				<span class="text-sm font-bold text-slate-800 col-span-2">{selectedConfig.name}</span>
			</div>
			<div class="grid grid-cols-3 border-b border-slate-50 pb-3">
				<span class="text-sm font-semibold text-slate-400">SMTP Server</span>
				<span class="text-sm font-bold text-slate-800 col-span-2">{selectedConfig.host}:{selectedConfig.port}</span>
			</div>
			<div class="grid grid-cols-3 border-b border-slate-50 pb-3">
				<span class="text-sm font-semibold text-slate-400">Security</span>
				<span class="col-span-2">
					{#if selectedConfig.secure}
						<span class="text-xs bg-indigo-50 border border-indigo-200 text-indigo-600 px-2 py-0.5 rounded-md font-semibold">SSL/TLS Enabled</span>
					{:else}
						<span class="text-xs bg-amber-50 border border-amber-200 text-amber-600 px-2 py-0.5 rounded-md font-semibold">No Encryption</span>
					{/if}
				</span>
			</div>
			<div class="grid grid-cols-3 border-b border-slate-50 pb-3">
				<span class="text-sm font-semibold text-slate-400">Username</span>
				<span class="text-sm font-bold text-slate-800 col-span-2 truncate">{selectedConfig.user}</span>
			</div>
			<div class="grid grid-cols-3 border-b border-slate-50 pb-3">
				<span class="text-sm font-semibold text-slate-400">From Email</span>
				<span class="text-sm font-bold text-slate-800 col-span-2 truncate">{selectedConfig.fromEmail}</span>
			</div>
			<div class="grid grid-cols-3">
				<span class="text-sm font-semibold text-slate-400">Default Setting</span>
				<span class="col-span-2">
					{#if selectedConfig.isDefault}
						<span class="text-xs bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-0.5 rounded-md font-semibold">Yes (Primary Server)</span>
					{:else}
						<span class="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md font-semibold">No</span>
					{/if}
				</span>
			</div>
		</div>
	{/if}
	<div slot="footer">
		<button 
			type="button" 
			on:click={() => showViewModal = false}
			class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-705 font-bold px-4 py-2.5 rounded-xl text-sm"
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
				class="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md shadow-primary/10 flex items-center gap-1.5"
			>
				<Edit2 class="w-4 h-4" />
				Edit Config
			</button>
		{/if}
	</div>
</Modal>

<!-- Loader indicator -->
<Loader visible={loading} text="Saving Configuration..." />
