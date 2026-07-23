<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { configsStore } from '$lib/stores/configsStore';
	import { toastStore } from '$lib/stores/toastStore';
	import { sendApi } from '$lib/api/send';
	import EmailEditor from '$lib/components/email/EmailEditor.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Modal from '$lib/components/layout/Modal.svelte';
	import Loader from '$lib/components/layout/Loader.svelte';
	import { FileSpreadsheet, Sparkles, Send, Calendar, Clock, AlertTriangle, Eye, FileText, X, Wifi } from 'lucide-svelte';

	let loading = false;
	let configurations: any[] = [];
	let selectedConfigId = '';
	let templates: any[] = [];
	let selectedTemplateId = '';

	// Campaign data
	let subject = '';
	let htmlContent = '';
	let delay = 20;

	// File attachments
	let excelFile: File | null = null;
	let htmlTemplateFile: File | null = null;

	// Excel parsing details
	let totalContacts = 0;
	let columns: string[] = [];
	let sampleContacts: any[] = [];
	let parsingExcel = false;

	// Range selections
	let rangeType: 'all' | 'first_n' | 'custom' = 'all';
	let firstNCount = 10;
	let rangeFrom = 1;
	let rangeTo = 10;

	// Batch settings
	let useBatch = false;
	let batchSize = 20;
	let batchDelay = 60; // minutes
	let emailDelay = 45; // seconds

	// Scheduling settings
	let scheduleEmail = false;
	let scheduledTime = '';
	let notifyEmail = '';
	let notifyBrowser = false;
	let testingNotification = false;

	// Preview Modal state
	let showPreviewModal = false;
	let previewSubjectText = '';
	let previewContentHTML = '';

	onMount(async () => {
		await configsStore.load();
		configurations = $configsStore;

		// Select default config
		const def = configurations.find(c => c.isDefault);
		if (def) {
			selectedConfigId = def.id;
		} else if (configurations.length > 0) {
			selectedConfigId = configurations[0].id;
		}

		// Load local templates
		const storedTemps = localStorage.getItem('campaign_templates');
		if (storedTemps) {
			try {
				templates = JSON.parse(storedTemps);
			} catch (e) {
				templates = [];
			}
		}
	});

	// Handle template selection
	$: if (selectedTemplateId) {
		const temp = templates.find(t => t.id === selectedTemplateId);
		if (temp) {
			subject = temp.subject;
			htmlContent = temp.body;
			toastStore.success(`Template "${temp.name}" loaded.`);
		}
	}

	// Dynamic calculation of selected range bounds
	$: emailRangeStart = rangeType === 'custom' ? Math.max(0, rangeFrom - 1) : 0;
	$: emailRangeCount = rangeType === 'all' 
		? totalContacts 
		: rangeType === 'first_n' 
			? Math.min(firstNCount, totalContacts) 
			: Math.max(1, rangeTo - rangeFrom + 1);

	$: finalEndIndex = Math.min(emailRangeStart + emailRangeCount, totalContacts);

	// Provider warning calculation
	$: selectedConfig = configurations.find(c => c.id === selectedConfigId);
	$: isGmail = selectedConfig?.host?.toLowerCase().includes('gmail');
	$: isOutlook = selectedConfig?.host?.toLowerCase().includes('outlook') || selectedConfig?.host?.toLowerCase().includes('hotmail');
	$: detectedProviderName = isGmail ? 'Gmail' : isOutlook ? 'Outlook' : 'Custom SMTP';
	$: maxAllowedContacts = isGmail ? (notifyEmail ? 99 : 100) : isOutlook ? (notifyEmail ? 299 : 300) : 500;
	$: showRangeWarning = emailRangeCount > maxAllowedContacts;

	async function handleExcelChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			excelFile = target.files[0];
			await parseExcel();
		}
	}

	function handleHtmlTemplateChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			htmlTemplateFile = target.files[0];
			const reader = new FileReader();
			reader.onload = (e) => {
				htmlContent = e.target?.result as string || '';
				toastStore.success('HTML template loaded into editor.');
			};
			reader.readAsText(htmlTemplateFile);
		}
	}

	async function parseExcel() {
		if (!excelFile) return;

		parsingExcel = true;
		try {
			const res = await sendApi.parseExcel(excelFile);
			if (res.data.success) {
				totalContacts = res.data.totalCount;
				const fullContacts = res.data.contacts || [];
				sampleContacts = fullContacts.slice(0, 5);
				if (fullContacts.length > 0) {
					columns = Object.keys(fullContacts[0]);
				}
				rangeTo = totalContacts;
				toastStore.success(`Excel file parsed: ${totalContacts} contacts found.`);
			} else {
				toastStore.danger(res.data.message || 'Failed to parse Excel file.');
				excelFile = null;
			}
		} catch (err: any) {
			toastStore.danger(err.response?.data?.message || 'Error parsing Excel file.');
			excelFile = null;
		} finally {
			parsingExcel = false;
		}
	}

	function previewEmail() {
		let sampleData = {
			FirstName: 'John',
			LastName: 'Doe',
			Company: 'Example Corp',
			Email: 'john.doe@example.com'
		};

		if (sampleContacts.length > 0) {
			sampleData = { ...sampleContacts[0] };
		}

		let pSubject = subject;
		let pBody = htmlContent;

		Object.keys(sampleData).forEach(key => {
			const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
			// @ts-ignore
			const val = sampleData[key] || '';
			pSubject = pSubject.replace(placeholder, val);
			pBody = pBody.replace(placeholder, val);
		});

		previewSubjectText = pSubject || '(No Subject)';
		previewContentHTML = pBody || '<p class="text-slate-400 italic">No email body content written yet.</p>';
		showPreviewModal = true;
	}

	async function testNotificationEmail() {
		if (!notifyEmail) {
			toastStore.warning('Please specify a notification email first.');
			return;
		}

		testingNotification = true;
		try {
			const res = await sendApi.testNotification(notifyEmail);
			if (res.data.success) {
				toastStore.success('Test notification email dispatched successfully.');
			} else {
				toastStore.danger(res.data.message || 'Test notification failed.');
			}
		} catch (err: any) {
			toastStore.danger(err.response?.data?.message || 'Test notification failed.');
		} finally {
			testingNotification = false;
		}
	}

	async function submitCampaign() {
		if (!selectedConfigId) {
			toastStore.warning('Please select an SMTP configuration.');
			return;
		}

		if (!excelFile) {
			toastStore.warning('Please upload a contact list (Excel file).');
			return;
		}

		if (!subject) {
			toastStore.warning('Please enter a campaign subject.');
			return;
		}

		if (!htmlTemplateFile && (!htmlContent || htmlContent === '<p><br></p>')) {
			toastStore.warning('Please provide email body content.');
			return;
		}

		if (scheduleEmail && !scheduledTime) {
			toastStore.warning('Please pick a date and time for scheduling.');
			return;
		}

		if (showRangeWarning) {
			toastStore.warning(`${detectedProviderName} limit exceeded. Maximum contacts allowed: ${maxAllowedContacts}.`);
			return;
		}

		loading = true;

		const formData = new FormData();
		formData.append('configId', selectedConfigId);
		formData.append('subject', subject);
		formData.append('htmlContent', htmlContent);
		formData.append('delay', String(delay));
		formData.append('emailRangeStart', String(emailRangeStart));
		formData.append('emailRangeCount', String(emailRangeCount));

		// Batching config
		formData.append('useBatch', useBatch ? 'on' : 'off');
		formData.append('batchSize', String(batchSize));
		formData.append('batchDelay', String(batchDelay));
		formData.append('emailDelay', String(emailDelay));

		// Scheduling config
		formData.append('scheduleEmail', scheduleEmail ? 'on' : 'off');
		if (scheduleEmail) {
			const utcTime = new Date(scheduledTime).toISOString();
			formData.append('scheduledTime', utcTime);
			formData.append('notifyEmail', notifyEmail);
			if (notifyBrowser) formData.append('notifyBrowser', 'on');
		}

		formData.append('excelFile', excelFile);
		if (htmlTemplateFile) {
			formData.append('htmlTemplate', htmlTemplateFile);
		}

		try {
			const res = await sendApi.sendCampaign(formData);
			if (res.data.success) {
				toastStore.success(res.data.message || 'Campaign processed successfully!');
				goto('/dashboard');
			} else {
				toastStore.danger(res.data.message || 'Failed to dispatch campaign.');
			}
		} catch (err: any) {
			toastStore.danger(err.response?.data?.message || 'Error processing campaign request.');
		} finally {
			loading = false;
		}
	}
</script>

<div class="space-y-6 sm:space-y-8 w-full">
	<!-- Page Header -->
	<Header title="Compose Email Campaign" subtitle="Design your newsletter and dispatch to your subscriber database" />

	{#if configurations.length === 0}
		<div class="p-1 bg-slate-900/[0.03] border border-slate-200/60 rounded-[2rem] shadow-soft max-w-xl mx-auto my-8">
			<div class="bg-white border border-slate-100/80 rounded-[calc(2rem-0.25rem)] p-8 md:p-10 text-center flex flex-col items-center relative overflow-hidden">
				<!-- Ambient background aura glow -->
				<div class="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-500/5 blur-2xl pointer-events-none"></div>
				<div class="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-primary/5 blur-2xl pointer-events-none"></div>

				<!-- Warning Icon Container (Nested Architecture / Double Enclosure) -->
				<div class="relative mb-5">
					<div class="absolute inset-0 rounded-2xl bg-amber-500/20 blur-md scale-110 pointer-events-none"></div>
					<div class="w-14 h-14 bg-gradient-to-b from-amber-50 to-amber-100/60 border border-amber-200/80 rounded-2xl flex items-center justify-center relative z-10 shadow-xs shadow-amber-500/10">
						<AlertTriangle class="w-7 h-7 text-amber-600" />
					</div>
				</div>

				<!-- Eyebrow Pill Badge -->
				<span class="bg-amber-50 border border-amber-200/60 text-amber-700 font-bold text-[10px] uppercase tracking-[0.14em] px-3 py-1 rounded-full mb-3 inline-block">
					SMTP Required
				</span>

				<!-- Heading & Content -->
				<h3 class="text-xl font-extrabold text-slate-900 tracking-tight">No Sender Account Configured</h3>
				<p class="text-slate-500 text-xs md:text-sm mt-2 max-w-sm mx-auto leading-relaxed font-medium">
					You must configure an SMTP email provider (Gmail, Outlook, or custom server) before composing and dispatching email campaigns.
				</p>

				<!-- Island Primary CTA Button -->
				<a 
					href="/configs"
					class="mt-7 group inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white text-[11px] font-bold uppercase tracking-wider px-6 py-3.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
				>
					<span>Configure Sender Account</span>
					<!-- Button-in-button trailing icon -->
					<span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
						<svg class="w-3 h-3 text-white fill-none stroke-current" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
					</span>
				</a>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
			<!-- Main compose panels -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Core Campaign details -->
				<div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
					<div class="bg-white p-6 rounded-[calc(2.25rem-0.5rem)] border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-4">
					<div class="flex justify-between items-center mb-2">
						<h3 class="font-bold text-slate-800 text-base">Campaign Content</h3>
						<!-- Template quick select -->
						{#if templates.length > 0}
							<div>
								<select 
									bind:value={selectedTemplateId}
									class="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-600 focus:outline-none"
								>
									<option value="">-- Apply Template --</option>
									{#each templates as t}
										<option value={t.id}>{t.name}</option>
									{/each}
								</select>
							</div>
						{/if}
					</div>

					<!-- SMTP Selection -->
					<div>
						<label for="smtpConfig" class="block text-sm font-semibold text-slate-700 mb-2">Sender Account *</label>
						<select 
							id="smtpConfig"
							bind:value={selectedConfigId}
							class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white"
						>
							{#each configurations as config}
								<option value={config.id}>{config.name} ({config.fromEmail})</option>
							{/each}
						</select>
					</div>

					<!-- Subject Line -->
					<div>
						<label for="subject" class="block text-sm font-semibold text-slate-700 mb-2">Email Subject *</label>
						<input 
							id="subject"
							type="text" 
							bind:value={subject}
							placeholder="Enter email subject line..."
							class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
							required
						/>
					</div>

					<!-- WYSIWYG editor -->
					<div>
						<div class="flex justify-between items-center mb-2">
							<label class="block text-sm font-semibold text-slate-700">Email Body *</label>
							{#if columns.length > 0}
								<span class="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">Dynamic Tags Available</span>
							{/if}
						</div>
						<EmailEditor bind:value={htmlContent} />
					</div>

					<!-- Tags helper widget -->
					{#if columns.length > 0}
						<div class="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
							<span class="text-xs font-bold text-slate-400 block uppercase tracking-wider mb-2">Insert Placeholders:</span>
							<div class="flex flex-wrap gap-2">
								{#each columns as col}
									<button 
										type="button" 
										class="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5"
										on:click={() => {
											htmlContent += ` {{${col}}}`;
										}}
									>
										<code>{`{{${col}}}`}</code>
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>
				</div>

				<!-- Sending Logic settings -->
				<div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
					<div class="bg-white p-6 rounded-[calc(2.25rem-0.5rem)] border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-4">
					<h3 class="font-bold text-slate-800 text-base mb-2">Dispatch Adjustments</h3>

					<!-- Delay between emails -->
					<div>
						<label for="delay-slider" class="block text-sm font-semibold text-slate-700 mb-2">Delay between emails (seconds)</label>
						<div class="flex items-center gap-3">
							<input 
								id="delay-slider"
								type="range" 
								min="5" 
								max="120" 
								bind:value={delay}
								class="flex-grow accent-primary"
							/>
							<span class="font-bold text-slate-800 text-sm bg-slate-100 px-3 py-1.5 rounded-lg shrink-0 w-16 text-center">{delay}s</span>
						</div>
						<p class="text-xs text-slate-400 mt-1">Pauses between emails to mimic human behavior and avoid trigger limits</p>
					</div>

					<!-- Batch settings toggle -->
					<div class="border-t border-slate-100 pt-4 space-y-4">
						<div class="flex items-center justify-between">
							<div>
								<span class="text-sm font-semibold text-slate-700 block">Enable Batch Spacing</span>
								<span class="text-xs text-slate-400">Splits campaign into batches with intervals between them</span>
							</div>
							<input 
								type="checkbox" 
								bind:checked={useBatch}
								class="w-10 h-5 accent-primary shrink-0 rounded-full"
							/>
						</div>

						{#if useBatch}
							<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
								<div>
									<label for="batch-size" class="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Batch Size</label>
									<input 
										id="batch-size"
										type="number" 
										bind:value={batchSize}
										min="1"
										class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
									/>
								</div>
								<div>
									<label for="batch-delay" class="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Batch Delay (min)</label>
									<input 
										id="batch-delay"
										type="number" 
										bind:value={batchDelay}
										min="1"
										class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
									/>
								</div>
								<div>
									<label for="email-delay" class="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Item Delay (sec)</label>
									<input 
										id="email-delay"
										type="number" 
										bind:value={emailDelay}
										min="1"
										class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
									/>
								</div>
							</div>
						{/if}
					</div>

					<!-- Scheduling Settings Toggle -->
					<div class="border-t border-slate-100 pt-4 space-y-4">
						<div class="flex items-center justify-between">
							<div>
								<span class="text-sm font-semibold text-slate-700 block">Schedule Campaign for Later</span>
								<span class="text-xs text-slate-400">Auto-sends the campaign at a specified future date and time</span>
							</div>
							<input 
								type="checkbox" 
								bind:checked={scheduleEmail}
								class="w-10 h-5 accent-primary shrink-0 rounded-full"
							/>
						</div>

						{#if scheduleEmail}
							<div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
								<div>
									<label for="scheduled-time" class="block text-sm font-semibold text-slate-700 mb-2">Schedule Time (Local Time)</label>
									<input 
										id="scheduled-time"
										type="datetime-local" 
										bind:value={scheduledTime}
										class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
									/>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
									<div>
										<label for="notify-email" class="block text-sm font-semibold text-slate-700 mb-2">Notification Email</label>
										<div class="relative">
											<input 
												id="notify-email"
												type="email" 
												bind:value={notifyEmail}
												placeholder="notify@example.com"
												class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm pr-20"
											/>
											<button 
												type="button"
												on:click={testNotificationEmail}
												disabled={testingNotification || !notifyEmail}
												class="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2 py-1 rounded-md text-[10px] uppercase tracking-wider transition-colors disabled:opacity-50"
											>
												{testingNotification ? '...' : 'Test'}
											</button>
										</div>
									</div>
									<div class="flex items-center gap-2 pt-6">
										<input 
											type="checkbox" 
											id="notifyBrowser"
											bind:checked={notifyBrowser}
											class="w-4 h-4 text-primary rounded"
										/>
										<label for="notifyBrowser" class="text-sm font-semibold text-slate-700">Receive browser alerts</label>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
				</div>
			</div>

			<!-- Sidebar controls (Uploader, Ranges, Previews) -->
			<div class="space-y-6">
				<!-- Spreadsheet file uploader -->
				<div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
					<div class="bg-white p-5 rounded-[calc(2.25rem-0.5rem)] border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-4">
					<h3 class="font-bold text-slate-800 text-base">Recipient Database</h3>

					<!-- File Dropzone -->
					<div class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary transition-colors relative cursor-pointer">
						<input 
							type="file" 
							accept=".xlsx, .xls"
							on:change={handleExcelChange}
							class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
						/>
						<FileSpreadsheet class="w-10 h-10 text-slate-400 mx-auto mb-3" />
						<span class="text-sm font-bold text-slate-700 block">
							{excelFile ? excelFile.name : 'Upload Recipient List'}
						</span>
						<span class="text-xs text-slate-400 mt-1 block">Supports Excel spreadsheets (.xlsx, .xls)</span>
					</div>

					<!-- Optional HTML template file upload -->
					<div>
						<label class="block text-sm font-semibold text-slate-700 mb-1.5">Optional HTML Template</label>
						<div class="flex items-center gap-2">
							<input 
								type="file" 
								accept=".html, .htm"
								on:change={handleHtmlTemplateChange}
								class="hidden"
								id="html-template"
							/>
							<label 
								for="html-template"
								class="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl cursor-pointer text-xs flex items-center gap-2 w-full justify-center transition-colors"
							>
								<FileText class="w-4 h-4" />
								{htmlTemplateFile ? htmlTemplateFile.name : 'Upload HTML File'}
							</label>
							{#if htmlTemplateFile}
								<button 
									type="button" 
									on:click={() => htmlTemplateFile = null}
									class="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600"
								>
									<X class="w-4 h-4" />
								</button>
							{/if}
						</div>
					</div>

					<!-- Excel preview rows -->
					{#if excelFile && sampleContacts.length > 0}
						<div class="border-t border-slate-100 pt-4 space-y-3">
							<div class="flex justify-between items-center text-xs">
								<span class="text-slate-400 uppercase tracking-wider font-bold">Preview Contacts:</span>
								<span class="bg-indigo-50 border border-indigo-200 text-indigo-600 px-2 py-0.5 rounded-full font-bold">{totalContacts} records</span>
							</div>

							<div class="max-h-48 overflow-y-auto border border-slate-100 rounded-lg p-2 space-y-1.5 bg-slate-50">
								{#each sampleContacts as c}
									<div class="bg-white p-2 rounded border border-slate-100/50 text-[11px] leading-tight flex justify-between gap-2">
										<span class="font-bold text-slate-700 truncate">{c.Name || c.name || 'Recipient'}</span>
										<span class="text-slate-400 truncate max-w-[120px]">{c.Email || c.email}</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
				</div>

				<!-- Range selection panel -->
				{#if excelFile && totalContacts > 0}
					<div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
						<div class="bg-white p-5 rounded-[calc(2.25rem-0.5rem)] border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-4">
						<h3 class="font-bold text-slate-800 text-base">Recipient Subset Selection</h3>

						<!-- Select bounds options -->
						<div class="space-y-3">
							<div class="flex items-center gap-2">
								<input 
									type="radio" 
									id="rangeAll" 
									name="rangeType" 
									value="all" 
									bind:group={rangeType}
									class="w-4 h-4 text-primary focus:ring-primary"
								/>
								<label for="rangeAll" class="text-sm font-semibold text-slate-700">Send to All ({totalContacts})</label>
							</div>

							<div class="flex items-center gap-2">
								<input 
									type="radio" 
									id="rangeFirstN" 
									name="rangeType" 
									value="first_n" 
									bind:group={rangeType}
									class="w-4 h-4 text-primary focus:ring-primary"
								/>
								<label for="rangeFirstN" class="text-sm font-semibold text-slate-700">Send to First N contacts</label>
							</div>

							{#if rangeType === 'first_n'}
								<div class="pl-6">
									<input 
										id="first-n-count"
										type="number" 
										bind:value={firstNCount}
										min="1"
										max={totalContacts}
										aria-label="First N contacts"
										class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
									/>
								</div>
							{/if}

							<div class="flex items-center gap-2">
								<input 
									type="radio" 
									id="rangeCustom" 
									name="rangeType" 
									value="custom" 
									bind:group={rangeType}
									class="w-4 h-4 text-primary focus:ring-primary"
								/>
								<label for="rangeCustom" class="text-sm font-semibold text-slate-700">Send to Custom Row Range</label>
							</div>

							{#if rangeType === 'custom'}
								<div class="grid grid-cols-2 gap-2 pl-6">
									<div>
										<label for="range-from" class="block text-[10px] font-bold text-slate-400 uppercase mb-1">From Row</label>
										<input 
											id="range-from"
											type="number" 
											bind:value={rangeFrom}
											min="1"
											max={totalContacts}
											class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
										/>
									</div>
									<div>
										<label for="range-to" class="block text-[10px] font-bold text-slate-400 uppercase mb-1">To Row</label>
										<input 
											id="range-to"
											type="number" 
											bind:value={rangeTo}
											min="1"
											max={totalContacts}
											class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
										/>
									</div>
								</div>
							{/if}
						</div>

						<!-- Selected Range Stats -->
						<div class="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-700 space-y-1">
							<div class="flex justify-between font-bold">
								<span>Selected Emails:</span>
								<span>{emailRangeCount}</span>
							</div>
							<p>Slices rows {emailRangeStart + 1} to {finalEndIndex} of the Excel file.</p>
						</div>

						<!-- Provider limit validation check warning -->
						{#if showRangeWarning}
							<div class="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-start gap-2">
								<AlertTriangle class="w-4.5 h-4.5 shrink-0 mt-0.5" />
								<div>
									<p class="font-bold">{detectedProviderName} Limits Warning:</p>
									<p class="mt-1">Your selected subset ({emailRangeCount} recipients) exceeds the provider safety limit of {maxAllowedContacts} sends. Reduce range or enable batching.</p>
								</div>
							</div>
						{/if}
					</div>
					</div>
				{/if}

				<!-- Action triggers -->
				<div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
					<div class="bg-white p-5 rounded-[calc(2.25rem-0.5rem)] border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-4">
					<button 
						type="button" 
						on:click={previewEmail}
						class="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
					>
						<Eye class="w-4 h-4" />
						Preview Email Layout
					</button>

					<button 
						type="button" 
						on:click={submitCampaign}
						disabled={loading || !selectedConfigId || !excelFile}
						class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-bold py-4 px-4 rounded-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
					>
						<Send class="w-5 h-5" />
						{#if scheduleEmail}
							Schedule Campaign
						{:else}
							Start Campaign Send
						{/if}
					</button>
				</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Reusable Modal for Email Previews -->
<Modal show={showPreviewModal} title="Campaign Email Preview" size="lg" on:close={() => showPreviewModal = false}>
	<div class="space-y-4">
		<div class="border-b border-slate-100 pb-3">
			<span class="text-xs text-slate-400 block font-bold uppercase tracking-wider">Subject Line</span>
			<h4 class="font-bold text-slate-800 text-sm mt-1">{previewSubjectText}</h4>
		</div>
		<div>
			<span class="text-xs text-slate-400 block font-bold uppercase tracking-wider mb-2">Message Body</span>
			<div class="border border-slate-100 rounded-xl p-4 bg-slate-50 max-h-96 overflow-y-auto text-sm leading-relaxed text-slate-700 font-sans">
				{@html previewContentHTML}
			</div>
		</div>
	</div>
	<div slot="footer">
		<button 
			on:click={() => showPreviewModal = false}
			class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-sm"
		>
			Close Preview
		</button>
	</div>
</Modal>

<!-- Loading indicators -->
<Loader visible={loading} text={scheduleEmail ? 'Scheduling Campaign...' : 'Starting Dispatch Queue...'} />
