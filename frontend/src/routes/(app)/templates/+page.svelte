<script lang="ts">
	import { onMount } from 'svelte';
	import { toastStore } from '$lib/stores/toastStore';
	import Header from '$lib/components/layout/Header.svelte';
	import EmailEditor from '$lib/components/email/EmailEditor.svelte';
	import { FileText, Plus, Trash2, Edit2, Search, X, Check, Save } from 'lucide-svelte';

	let templates: any[] = [];
	let searchFilter = '';
	let showEditor = false;
	let editMode = false;

	// Template Editor state
	let templateId = '';
	let templateName = '';
	let templateSubject = '';
	let templateBody = '';

	onMount(() => {
		loadTemplates();
	});

	function loadTemplates() {
		const stored = localStorage.getItem('campaign_templates');
		if (stored) {
			try {
				templates = JSON.parse(stored);
			} catch (e) {
				templates = [];
			}
		} else {
			// Preset default templates
			templates = [
				{
					id: '1',
					name: 'Welcome Newsletter',
					subject: 'Welcome to our platform, {{Name}}!',
					body: '<h3>Hello {{Name}},</h3><p>Thank you for signing up with us at {{Company}}! We are thrilled to welcome you to our community.</p>'
				},
				{
					id: '2',
					name: 'Marketing Campaign Notice',
					subject: 'Special offer inside for {{Company}}',
					body: '<p>Hi {{Name}},</p><p>We are launching a new product line tailored directly for teams like yours. Enjoy a 15% discount today.</p>'
				}
			];
			saveToStorage();
		}
	}

	function saveToStorage() {
		localStorage.setItem('campaign_templates', JSON.stringify(templates));
	}

	function openCreateForm() {
		editMode = false;
		templateId = '';
		templateName = '';
		templateSubject = '';
		templateBody = '';
		showEditor = true;
	}

	function openEditForm(t: any) {
		editMode = true;
		templateId = t.id;
		templateName = t.name;
		templateSubject = t.subject;
		templateBody = t.body;
		showEditor = true;
	}

	function saveTemplate() {
		if (!templateName || !templateSubject) {
			toastStore.warning('Template name and subject are required.');
			return;
		}

		if (editMode) {
			templates = templates.map(t => {
				if (t.id === templateId) {
					return {
						id: templateId,
						name: templateName,
						subject: templateSubject,
						body: templateBody
					};
				}
				return t;
			});
			toastStore.success('Template updated.');
		} else {
			const newTemplate = {
				id: Math.random().toString(36).substring(2),
				name: templateName,
				subject: templateSubject,
				body: templateBody
			};
			templates = [newTemplate, ...templates];
			toastStore.success('Template created.');
		}

		saveToStorage();
		showEditor = false;
	}

	function deleteTemplate(id: string, name: string) {
		if (confirm(`Are you sure you want to delete template "${name}"?`)) {
			templates = templates.filter(t => t.id !== id);
			saveToStorage();
			toastStore.success('Template deleted.');
		}
	}

	$: filteredTemplates = templates.filter(t => {
		const query = searchFilter.toLowerCase();
		return t.name.toLowerCase().includes(query) || 
		       t.subject.toLowerCase().includes(query) || 
		       t.body.toLowerCase().includes(query);
	});
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<Header title="Campaign Email Templates" subtitle="Draft, edit, and select HTML email designs for campaign dispatches" />
		{#if !showEditor}
			<button 
				on:click={openCreateForm}
				class="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-3 rounded-xl transition-all duration-200 shadow-md shadow-primary/10 flex items-center gap-2 text-sm"
			>
				<Plus class="w-4 h-4" />
				New Template
			</button>
		{/if}
	</div>

	{#if showEditor}
		<!-- Template editor form -->
		<div class="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm space-y-4">
			<div class="flex justify-between items-center border-b border-slate-100 pb-3">
				<h3 class="font-bold text-slate-800 text-base">
					{editMode ? 'Edit Template Settings' : 'Create Custom Template'}
				</h3>
				<button 
					on:click={() => showEditor = false}
					class="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<div class="space-y-4">
				<div>
					<label for="template-name" class="block text-sm font-semibold text-slate-700 mb-2">Template Display Name *</label>
					<input 
						id="template-name"
						type="text" 
						bind:value={templateName}
						placeholder="e.g. Autumn Discount Notice, Event Welcome"
						class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
					/>
				</div>

				<div>
					<label for="template-subject" class="block text-sm font-semibold text-slate-700 mb-2">Default Email Subject *</label>
					<input 
						id="template-subject"
						type="text" 
						bind:value={templateSubject}
						placeholder={"e.g. Exclusive Offer inside, {{Name}}!"}
						class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
					/>
				</div>

				<div>
					<label class="block text-sm font-semibold text-slate-700 mb-2">HTML Template Body</label>
					<EmailEditor bind:value={templateBody} />
				</div>
			</div>

			<div class="flex justify-end gap-2.5 pt-4">
				<button 
					type="button" 
					on:click={() => showEditor = false}
					class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-sm"
				>
					Cancel
				</button>
				<button 
					type="button" 
					on:click={saveTemplate}
					class="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md shadow-primary/10 flex items-center gap-1.5"
				>
					<Save class="w-4 h-4" />
					Save Template
				</button>
			</div>
		</div>
	{:else}
		<!-- Search filter -->
		<div class="relative">
			<span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
				<Search class="w-4 h-4" />
			</span>
			<input 
				type="text" 
				bind:value={searchFilter} 
				aria-label="Search templates"
				placeholder="Search templates by title, subject lines, or keyword content..."
				class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
			/>
		</div>

		<!-- Grid cards list -->
		{#if filteredTemplates.length === 0}
			<div class="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
				<div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
					<FileText class="w-8 h-8 text-slate-400" />
				</div>
				<h3 class="text-lg font-bold text-slate-800">No Templates Found</h3>
				<p class="text-slate-500 text-sm mt-1 max-w-sm mx-auto">Create and save templates to reuse them across sending campaigns.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredTemplates as temp (temp.id)}
					<div class="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
						<div>
							<div class="flex items-start justify-between gap-3 mb-3">
								<h3 class="font-bold text-slate-800 text-base leading-snug line-clamp-1">{temp.name}</h3>
								<div class="p-1.5 bg-slate-50 rounded-lg text-slate-400 border border-slate-200/50">
									<FileText class="w-4.5 h-4.5" />
								</div>
							</div>
							<p class="text-xs text-slate-400 font-semibold mb-1">SUBJECT LINE:</p>
							<p class="text-sm font-semibold text-slate-700 line-clamp-2 leading-relaxed mb-4">{temp.subject}</p>
						</div>

						<div class="border-t border-slate-100 pt-4 flex gap-2">
							<button 
								on:click={() => openEditForm(temp)}
								class="flex-grow bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold p-2.5 rounded-xl border border-slate-200/50 transition-colors flex items-center justify-center gap-1.5 text-xs"
							>
								<Edit2 class="w-3.5 h-3.5" />
								Edit Content
							</button>
							<button 
								on:click={() => deleteTemplate(temp.id, temp.name)}
								class="p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-xl transition-all"
								title="Delete Template"
							>
								<Trash2 class="w-4 h-4" />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
