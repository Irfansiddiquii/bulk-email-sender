<script lang="ts">
	import { onMount } from "svelte";
	import { toastStore } from "$lib/stores/toastStore";
	import Header from "$lib/components/layout/Header.svelte";
	import EmailEditor from "$lib/components/email/EmailEditor.svelte";
	import {
		FileText,
		Plus,
		Trash2,
		Edit2,
		Search,
		X,
		Save,
		Mail,
		Sparkles,
		Tag,
		LayoutTemplate,
		Code2,
		ChevronRight
	} from "lucide-svelte";

	let templates: any[] = [];
	let searchFilter = "";
	let showEditor = false;
	let editMode = false;
	let searchInputEl: HTMLInputElement;

	// Template Editor state
	let templateId = "";
	let templateName = "";
	let templateSubject = "";
	let templateBody = "";

	onMount(() => {
		loadTemplates();
	});

	function loadTemplates() {
		const stored = localStorage.getItem("campaign_templates");
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
					id: "1",
					name: "Welcome Newsletter",
					subject: "Welcome to our platform, {{Name}}!",
					body: "<h3>Hello {{Name}},</h3><p>Thank you for signing up with us at {{Company}}! We are thrilled to welcome you to our community.</p>",
				},
				{
					id: "2",
					name: "Marketing Campaign Notice",
					subject: "Special offer inside for {{Company}}",
					body: "<p>Hi {{Name}},</p><p>We are launching a new product line tailored directly for teams like yours. Enjoy a 15% discount today.</p>",
				},
			];
			saveToStorage();
		}
	}

	function saveToStorage() {
		localStorage.setItem("campaign_templates", JSON.stringify(templates));
	}

	function openCreateForm() {
		editMode = false;
		templateId = "";
		templateName = "";
		templateSubject = "";
		templateBody = "";
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
			toastStore.warning("Template name and subject are required.");
			return;
		}

		if (editMode) {
			templates = templates.map((t) => {
				if (t.id === templateId) {
					return {
						id: templateId,
						name: templateName,
						subject: templateSubject,
						body: templateBody,
					};
				}
				return t;
			});
			toastStore.success("Template updated.");
		} else {
			const newTemplate = {
				id: Math.random().toString(36).substring(2),
				name: templateName,
				subject: templateSubject,
				body: templateBody,
			};
			templates = [newTemplate, ...templates];
			toastStore.success("Template created.");
		}

		saveToStorage();
		showEditor = false;
	}

	function deleteTemplate(id: string, name: string) {
		if (confirm(`Are you sure you want to delete template "${name}"?`)) {
			templates = templates.filter((t) => t.id !== id);
			saveToStorage();
			toastStore.success("Template deleted.");
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === "k") {
			e.preventDefault();
			searchInputEl?.focus();
		} else if (e.key === "Escape" && showEditor) {
			showEditor = false;
		}
	}

	function extractVariables(text: string): string[] {
		if (!text) return [];
		const matches = text.match(/\{\{([^}]+)\}\}/g);
		if (!matches) return [];
		return Array.from(new Set(matches.map((m) => m.replace(/[\{\}]/g, "").trim())));
	}

	function stripHtml(html: string): string {
		if (!html) return "";
		return html.replace(/<[^>]*>?/gm, "").trim();
	}

	$: filteredTemplates = templates.filter((t) => {
		const query = searchFilter.toLowerCase();
		return (
			t.name.toLowerCase().includes(query) ||
			t.subject.toLowerCase().includes(query) ||
			t.body.toLowerCase().includes(query)
		);
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="space-y-6 w-full max-w-7xl mx-auto pb-12">
	<!-- Page Header -->
	<Header
		title="Campaign Email Templates"
		subtitle="Draft, edit, and select HTML email designs for campaign dispatches"
	/>

	<!-- Single Premium Unified Toolbar (Doppelrand / Double-Bezel Enclosure) -->
	<div class="p-1.5 rounded-[1.5rem] bg-slate-900/[0.03] border border-slate-200/80 shadow-xs mb-8 backdrop-blur-xl">
		<div
			class="bg-white rounded-[calc(1.5rem-0.375rem)] p-3 sm:p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 shadow-2xs relative z-20"
		>
			<!-- Search Field with Nested Icon Shell & Double Bezel -->
			<div class="relative flex-1 min-w-[240px] max-w-2xl group">
				<div class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-indigo-50/80 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0 group-focus-within:bg-indigo-600 group-focus-within:text-white group-focus-within:border-indigo-600 transition-all duration-200 shadow-2xs pointer-events-none">
					<Search class="w-4 h-4" />
				</div>
				<input
					type="text"
					bind:this={searchInputEl}
					bind:value={searchFilter}
					aria-label="Search templates"
					placeholder="Search templates by title, subject lines, or keyword content..."
					class="w-full pl-12 pr-24 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-indigo-500 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/12 transition-all duration-200 shadow-inner/5"
				/>
				<div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-auto">
					{#if searchFilter}
						<button
							on:click={() => (searchFilter = "")}
							aria-label="Clear search"
							class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
						>
							<X class="w-3.5 h-3.5" />
						</button>
					{/if}
					<kbd
						class="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white border border-slate-200/80 shadow-2xs pointer-events-none"
					>
						⌘K
					</kbd>
				</div>
			</div>

			<!-- Toolbar Meta & New Template Primary CTA -->
			<div class="flex items-center justify-between sm:justify-end gap-3 shrink-0">
				<!-- High-End Stats Counter Pill -->
				<div
					class="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100/90 border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs select-none"
				>
					<span class="relative flex h-2 w-2">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
					</span>
					<span class="font-mono text-indigo-600 font-bold bg-indigo-50 border border-indigo-100/80 px-2 py-0.5 rounded-md text-[11px] shadow-2xs">
						{filteredTemplates.length}
					</span>
					<span class="text-slate-600 font-medium hidden xs:inline">
						{filteredTemplates.length === 1 ? "Template" : "Templates"}
					</span>
				</div>

				{#if !showEditor}
					<!-- Button-in-Button Island Architecture CTA -->
					<button
						on:click={openCreateForm}
						class="relative group overflow-hidden bg-slate-900 hover:bg-slate-800 text-white font-semibold pl-4 pr-2.5 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-slate-900/10 hover:shadow-xl hover:shadow-indigo-500/15 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 shrink-0"
					>
						<span class="tracking-tight text-white font-semibold">New Template</span>
						<div class="w-7 h-7 rounded-lg bg-white/10 border border-white/10 text-white flex items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:border-indigo-400 group-hover:scale-105 transition-all duration-200 shadow-2xs">
							<Plus class="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
						</div>
					</button>
				{/if}
			</div>
		</div>
	</div>

	{#if showEditor}
		<!-- Template editor form -->
		<div
			class="p-1.5 rounded-[1.75rem] bg-slate-900/[0.03] border border-slate-200/80 shadow-lg mb-8 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 relative z-10"
		>
			<div
				class="bg-white rounded-[calc(1.75rem-0.375rem)] p-6 md:p-8 space-y-6 relative overflow-hidden"
			>
				<div
					class="flex justify-between items-center border-b border-slate-100 pb-4"
				>
					<div class="flex items-center gap-3.5">
						<div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
							<Edit2 class="w-5 h-5" />
						</div>
						<div>
							<div class="flex items-center gap-2.5">
								<h3 class="font-bold text-slate-900 text-lg">
									{editMode
										? "Edit Template Settings"
										: "Create Custom Template"}
								</h3>
								<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
									<Sparkles class="w-3 h-3 text-indigo-600" />
									{editMode ? "Editing Mode" : "New Template"}
								</span>
							</div>
							<p class="text-xs text-slate-500 mt-0.5">Configure template display attributes and HTML markup body</p>
						</div>
					</div>
					<button
						on:click={() => (showEditor = false)}
						aria-label="Close editor"
						class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
					>
						<X class="w-4.5 h-4.5" />
					</button>
				</div>

				<div class="space-y-5">
					<div>
						<label
							for="template-name"
							class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2"
						>
							Template Display Name <span class="text-rose-500">*</span>
						</label>
						<input
							id="template-name"
							type="text"
							bind:value={templateName}
							placeholder="e.g. Autumn Discount Notice, Event Welcome"
							class="w-full px-4 py-2.5 bg-slate-50/60 focus:bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 shadow-inner/5"
						/>
					</div>

					<div>
						<label
							for="template-subject"
							class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2"
						>
							Default Email Subject <span class="text-rose-500">*</span>
						</label>
						<input
							id="template-subject"
							type="text"
							bind:value={templateSubject}
							placeholder={"e.g. Exclusive Offer inside, {{Name}}!"}
							class="w-full px-4 py-2.5 bg-slate-50/60 focus:bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 shadow-inner/5"
						/>
						<p class="text-[11px] text-slate-400 mt-1">Use double curly braces like <code class="font-mono text-indigo-600 font-semibold">&#123;&#123;Name&#125;&#125;</code> for dynamic mail-merge fields.</p>
					</div>

					<div>
						<label
							class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2"
						>
							HTML Template Body
						</label>
						<div class="border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
							<EmailEditor bind:value={templateBody} />
						</div>
					</div>
				</div>

				<div class="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
					<button
						type="button"
						on:click={() => (showEditor = false)}
						class="bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold px-4.5 py-2.5 rounded-xl text-sm transition-colors duration-150"
					>
						Cancel
					</button>
					<button
						type="button"
						on:click={saveTemplate}
						class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all duration-150 flex items-center gap-2"
					>
						<Save class="w-4 h-4" />
						<span>Save Template</span>
					</button>
				</div>
			</div>
		</div>
	{:else}
		<!-- Grid cards list -->
		{#if filteredTemplates.length === 0}
			<div
				class="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs max-w-lg mx-auto my-8"
			>
				<div
					class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100/80 shadow-2xs"
				>
					<FileText class="w-8 h-8" />
				</div>
				<h3 class="text-lg font-bold text-slate-900">
					No Templates Found
				</h3>
				<p class="text-slate-500 text-sm mt-1.5 mb-6 max-w-sm mx-auto leading-relaxed">
					{searchFilter
						? `No templates match "${searchFilter}". Try adjusting your search query.`
						: "Create and save reusable HTML templates to streamline your campaign mailings."}
				</p>
				<button
					on:click={openCreateForm}
					class="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-md shadow-slate-900/10 active:scale-[0.98] transition-all"
				>
					<Plus class="w-4 h-4" />
					<span>Create First Template</span>
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredTemplates as temp (temp.id)}
					<!-- Doppelrand / Double Bezel Card Shell -->
					<div
						class="group relative bg-slate-50/70 p-1.5 rounded-[1.75rem] border border-slate-200/80 hover:border-indigo-300/80 shadow-2xs hover:shadow-2xl hover:shadow-indigo-500/12 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 flex flex-col overflow-hidden"
					>
						<!-- Subtle Gradient Accent Hairline on Hover -->
						<div
							class="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
						></div>

						<!-- Inner Concentric Card Core -->
						<div
							class="bg-white rounded-[calc(1.75rem-0.375rem)] p-5 sm:p-6 flex flex-col justify-between h-full border border-slate-100 space-y-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
						>
							<div>
								<!-- Header of Card -->
								<div class="flex items-start justify-between gap-3 mb-4">
									<div class="flex items-center gap-3.5 min-w-0">
										<div
											class="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0 group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white group-hover:border-indigo-500 transition-all duration-300 shadow-xs group-hover:shadow-md group-hover:shadow-indigo-500/25 flex-none"
										>
											<FileText class="w-5 h-5" />
										</div>
										<div class="min-w-0">
											<h3
												class="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors truncate"
												title={temp.name}
											>
												{temp.name}
											</h3>
											<span class="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-100/80 border border-slate-200/60 px-2.5 py-0.5 rounded-lg mt-1">
												<Code2 class="w-3 h-3 text-slate-400" />
												HTML Template
											</span>
										</div>
									</div>
								</div>

								<!-- Subject Line Box -->
								<div class="mb-4">
									<div class="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
										<Mail class="w-3.5 h-3.5 text-slate-400" />
										<span>Subject Line</span>
									</div>
									<div
										class="text-xs font-medium text-slate-700 bg-gradient-to-r from-slate-50 to-indigo-50/30 border-l-2 border-indigo-500 border-y border-r border-slate-200/60 rounded-r-xl p-3 line-clamp-2 leading-relaxed shadow-2xs"
									>
										{temp.subject}
									</div>
								</div>

								<!-- Body Preview -->
								{#if stripHtml(temp.body)}
									<div class="mb-4">
										<p class="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal bg-slate-50/40 p-2.5 rounded-xl border border-slate-100/80">
											{stripHtml(temp.body)}
										</p>
									</div>
								{/if}

								<!-- Detected Dynamic Tag Variables -->
								{#if extractVariables(temp.subject + " " + temp.body).length > 0}
									<div class="flex flex-wrap items-center gap-1.5">
										{#each extractVariables(temp.subject + " " + temp.body) as v}
											<span
												class="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100/80 shadow-2xs hover:bg-indigo-100 transition-colors"
											>
												<Tag class="w-2.5 h-2.5 text-indigo-500" />
												&#123;&#123;{v}&#125;&#125;
											</span>
										{/each}
									</div>
								{/if}
							</div>

							<!-- Action Footer -->
							<div class="border-t border-slate-100 pt-4 flex items-center justify-between gap-2.5">
								<button
									on:click={() => openEditForm(temp)}
									class="flex-1 bg-slate-900 hover:bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-xl border border-slate-800 hover:border-indigo-500 transition-all duration-200 flex items-center justify-center gap-2 text-xs shadow-sm shadow-slate-900/10 hover:shadow-md hover:shadow-indigo-500/20 group/edit active:scale-[0.98]"
								>
									<Edit2 class="w-3.5 h-3.5 text-white/70 group-hover/edit:text-white transition-colors" />
									<span>Edit Content</span>
									<ChevronRight class="w-3 h-3 text-white/50 group-hover/edit:text-white group-hover/edit:translate-x-0.5 transition-all" />
								</button>
								<button
									on:click={() => deleteTemplate(temp.id, temp.name)}
									title="Delete Template"
									aria-label="Delete template {temp.name}"
									class="w-10 h-10 bg-slate-50 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-xl transition-all duration-200 flex items-center justify-center shrink-0 shadow-2xs group/del active:scale-[0.95]"
								>
									<Trash2 class="w-4 h-4 transition-transform group-hover/del:scale-110" />
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
