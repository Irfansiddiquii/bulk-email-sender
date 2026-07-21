<script lang="ts">
	import { onMount } from 'svelte';
	import { toastStore } from '$lib/stores/toastStore';
	import { sendApi } from '$lib/api/send';
	import Header from '$lib/components/layout/Header.svelte';
	import { 
		Users, 
		Plus, 
		Trash2, 
		Search, 
		FileSpreadsheet, 
		Download, 
		X, 
		User, 
		ChevronDown, 
		Mail, 
		Building2, 
		UserPlus, 
		Copy 
	} from 'lucide-svelte';

	let loading = false;
	let contacts: any[] = [];
	let searchFilter = '';
	
	// Add form bindings
	let showAddForm = false;
	let newName = '';
	let newEmail = '';
	let newCompany = '';

	// Dropdown and UI state
	let showActionsDropdown = false;
	let searchInputEl: HTMLInputElement;

	onMount(() => {
		loadContacts();
	});

	function loadContacts() {
		const stored = localStorage.getItem('crm_contacts');
		if (stored) {
			try {
				contacts = JSON.parse(stored);
			} catch (e) {
				contacts = [];
			}
		} else {
			// Populate with initial sample data if empty
			contacts = [
				{ id: '1', name: 'John Doe', email: 'john.doe@example.com', company: 'Acme Corp' },
				{ id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', company: 'Global Solutions' }
			];
			saveToStorage();
		}
	}

	function saveToStorage() {
		localStorage.setItem('crm_contacts', JSON.stringify(contacts));
	}

	function addContact() {
		if (!newEmail) {
			toastStore.warning('Email is required.');
			return;
		}

		const newContact = {
			id: Math.random().toString(36).substring(2),
			name: newName || 'Unnamed',
			email: newEmail,
			company: newCompany || '-'
		};

		contacts = [newContact, ...contacts];
		saveToStorage();
		toastStore.success(`Contact ${newEmail} added successfully.`);

		// Reset form
		newName = '';
		newEmail = '';
		newCompany = '';
		showAddForm = false;
	}

	function deleteContact(id: string, email: string) {
		if (confirm(`Remove contact ${email} from list?`)) {
			contacts = contacts.filter(c => c.id !== id);
			saveToStorage();
			toastStore.success('Contact removed.');
		}
	}

	async function handleExcelUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const file = target.files[0];
			loading = true;
			toastStore.info(`Parsing ${file.name} to import...`);

			try {
				const res = await sendApi.parseExcel(file);
				if (res.data.success) {
					const imported = (res.data.contacts || []).map((c: any) => ({
						id: Math.random().toString(36).substring(2),
						name: c.Name || c.name || 'Imported Contact',
						email: c.Email || c.email || '',
						company: c.Company || c.company || '-'
					})).filter((c: any) => c.email !== '');

					contacts = [...imported, ...contacts];
					saveToStorage();
					toastStore.success(`Imported ${imported.length} contacts from spreadsheet.`);
				} else {
					toastStore.danger(res.data.message || 'Failed to parse spreadsheet file.');
				}
			} catch (err: any) {
				toastStore.danger(err.response?.data?.message || 'Error processing spreadsheet file.');
			} finally {
				loading = false;
				target.value = '';
			}
		}
	}

	function exportToCSV() {
		if (contacts.length === 0) return;
		let csvContent = 'data:text/csv;charset=utf-8,Name,Email,Company\n';
		contacts.forEach(c => {
			csvContent += `"${c.name}","${c.email}","${c.company}"\n`;
		});
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', 'crm-contacts-export.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toastStore.success('Contacts CSV list downloaded.');
	}

	function toggleActionsDropdown() {
		showActionsDropdown = !showActionsDropdown;
	}

	function closeActionsDropdown() {
		showActionsDropdown = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			searchInputEl?.focus();
		} else if (e.key === 'Escape') {
			showActionsDropdown = false;
			showAddForm = false;
		}
	}

	function copyEmailToClipboard(email: string) {
		navigator.clipboard.writeText(email);
		toastStore.success(`Copied ${email} to clipboard.`);
	}

	function clickOutside(node: HTMLElement, callback: () => void) {
		const handleClick = (event: MouseEvent) => {
			if (node && !node.contains(event.target as Node)) {
				callback();
			}
		};
		document.addEventListener('click', handleClick, true);
		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

	$: filteredContacts = contacts.filter(c => {
		const query = searchFilter.toLowerCase();
		return (c.name?.toLowerCase() || '').includes(query) || 
		       (c.email?.toLowerCase() || '').includes(query) || 
		       (c.company?.toLowerCase() || '').includes(query);
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="space-y-6 sm:space-y-8 w-full">
	<!-- Page Header -->
	<Header 
		title="Contact Database Manager" 
		subtitle="Manage recipient lists, view imported databases, and import spreadsheet contacts" 
	/>

	<!-- Single Premium Unified Toolbar -->
	<div class="p-1.5 rounded-[1.5rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-xs backdrop-blur-xl transition-all duration-200 relative z-20">
		<div class="bg-white rounded-[calc(1.5rem-0.375rem)] p-2.5 sm:p-3 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
		
		<!-- Search Field with High Hierarchy -->
		<div class="relative flex-1 min-w-[240px] max-w-xl group">
			<div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
				<Search class="w-4 h-4" />
			</div>
			<input 
				bind:this={searchInputEl}
				type="text" 
				bind:value={searchFilter} 
				aria-label="Search contacts"
				placeholder="Search contacts by name, email address, or company..."
				class="w-full pl-10 pr-20 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-indigo-500/80 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-2xs transition-all duration-150"
			/>
			<div class="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5 pointer-events-none">
				{#if searchFilter}
					<button 
						type="button" 
						on:click={() => searchFilter = ''}
						class="pointer-events-auto text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
						title="Clear search"
					>
						<X class="w-3.5 h-3.5" />
					</button>
				{:else}
					<kbd class="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white border border-slate-200 shadow-2xs">
						<span class="text-[9px]">⌘</span>K
					</kbd>
				{/if}
			</div>
		</div>

		<!-- Actions Group: Counter + Compact Import/Export Dropdown + Add Contact Primary CTA -->
		<div class="flex items-center gap-2 sm:gap-2.5 shrink-0 justify-between md:justify-end">
			
			<!-- Contact Counter Badge -->
			<div class="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100/70 border border-slate-200/60 text-xs text-slate-600 font-medium select-none">
				<Users class="w-3.5 h-3.5 text-slate-500" />
				<span>
					<strong class="text-slate-900 font-semibold">{filteredContacts.length}</strong>
					<span class="text-slate-400">/</span>
					<span class="text-slate-500">{contacts.length}</span>
				</span>
			</div>

			<!-- Compact Import & Export Dropdown Action -->
			<div class="relative" use:clickOutside={closeActionsDropdown}>
				<button 
					type="button"
					on:click={toggleActionsDropdown}
					aria-expanded={showActionsDropdown}
					aria-haspopup="true"
					class="h-10 px-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200/90 text-slate-700 font-medium rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-2xs group"
				>
					<FileSpreadsheet class="w-4 h-4 text-indigo-600 group-hover:scale-105 transition-transform" />
					<span class="font-semibold text-slate-700">Data Actions</span>
					<ChevronDown class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 {showActionsDropdown ? 'rotate-180' : ''}" />
				</button>

				{#if showActionsDropdown}
					<div 
						class="absolute right-0 mt-2 w-56 bg-white border border-indigo-200/80 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 divide-y divide-slate-100"
					>
						<div class="py-1">
							<!-- Import Excel Option -->
							<div class="relative group">
								<input 
									type="file" 
									accept=".xlsx, .xls"
									on:change={(e) => { handleExcelUpload(e); closeActionsDropdown(); }}
									class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
									id="import-excel-dropdown"
								/>
								<label 
									for="import-excel-dropdown"
									class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-900 cursor-pointer transition-colors"
								>
									<div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
										<FileSpreadsheet class="w-3.5 h-3.5" />
									</div>
									<div class="flex flex-col min-w-0">
										<span class="font-semibold text-slate-800 group-hover:text-indigo-900">Import Excel</span>
										<span class="text-[10px] text-slate-400">Upload .xlsx or .xls file</span>
									</div>
								</label>
							</div>
						</div>

						<div class="py-1">
							<!-- Export CSV Option -->
							<button 
								type="button"
								on:click={() => { exportToCSV(); closeActionsDropdown(); }}
								disabled={contacts.length === 0}
								class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-900 disabled:opacity-40 disabled:pointer-events-none transition-colors text-left group"
							>
								<div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
									<Download class="w-3.5 h-3.5" />
								</div>
								<div class="flex flex-col min-w-0">
									<span class="font-semibold text-slate-800 group-hover:text-indigo-900">Export CSV</span>
									<span class="text-[10px] text-slate-400">Download formatted list</span>
								</div>
							</button>
						</div>
					</div>
				{/if}
			</div>

			<!-- Add Contact Primary CTA (Proper Sizing & Premium Styling) -->
			<button 
				type="button"
				on:click={() => showAddForm = !showAddForm}
				class="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-150 shrink-0"
			>
				{#if showAddForm}
					<X class="w-4 h-4 shrink-0" />
					<span>Close Form</span>
				{:else}
					<Plus class="w-4 h-4 shrink-0" />
					<span>Add Contact</span>
				{/if}
			</button>
		</div>
	</div>
</div>

	<!-- Add Contact Form Card (Refined Doppelrand Styling) -->
	{#if showAddForm}
		<div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-md transition-all duration-300 relative overflow-hidden group">
			<div class="bg-white border border-slate-100/90 p-5 sm:p-6 rounded-[calc(2.25rem-0.5rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-4">
				<div class="flex items-center justify-between border-b border-slate-100 pb-3">
					<div class="flex items-center gap-2">
						<div class="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
							<UserPlus class="w-4 h-4" />
						</div>
						<div>
							<h3 class="font-bold text-slate-900 text-sm">Add New Contact</h3>
							<p class="text-xs text-slate-500">Enter recipient information to add them to your database.</p>
						</div>
					</div>
					<button 
						type="button" 
						on:click={() => showAddForm = false}
						class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
						title="Cancel"
					>
						<X class="w-4 h-4" />
					</button>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
					<div>
						<label for="new-name" class="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
								<User class="w-3.5 h-3.5" />
							</div>
							<input 
								id="new-name"
								type="text" 
								bind:value={newName} 
								placeholder="Jane Doe"
								class="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all"
							/>
						</div>
					</div>
					<div>
						<label for="new-email" class="block text-xs font-semibold text-slate-700 mb-1.5">Email Address <span class="text-rose-500">*</span></label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
								<Mail class="w-3.5 h-3.5" />
							</div>
							<input 
								id="new-email"
								type="email" 
								bind:value={newEmail} 
								placeholder="jane.doe@example.com"
								class="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all"
								required
							/>
						</div>
					</div>
					<div>
						<label for="new-company" class="block text-xs font-semibold text-slate-700 mb-1.5">Company / Organization</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
								<Building2 class="w-3.5 h-3.5" />
							</div>
							<input 
								id="new-company"
								type="text" 
								bind:value={newCompany} 
								placeholder="Acme Inc."
								class="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all"
							/>
						</div>
					</div>
				</div>

				<div class="flex justify-end items-center gap-2 pt-2 border-t border-slate-100">
					<button 
						type="button" 
						on:click={() => showAddForm = false}
						class="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-all"
					>
						Cancel
					</button>
					<button 
						type="button" 
						on:click={addContact}
						class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition-all flex items-center gap-1.5"
					>
						<Plus class="w-3.5 h-3.5" />
						Save Contact
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Refined Contacts Table Container -->
	<div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
		<div class="bg-white border border-slate-100/90 rounded-[calc(2.25rem-0.5rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] overflow-hidden">
		
		<!-- Table Header Control Bar -->
		<div class="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
			<div class="flex items-center gap-2.5">
				<div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-xs">
					<Users class="w-3.5 h-3.5" />
				</div>
				<div>
					<h2 class="text-xs sm:text-sm font-bold text-slate-800 leading-tight">All Contacts</h2>
					<p class="text-[11px] text-slate-400">Total {filteredContacts.length} recipient records</p>
				</div>
			</div>

			{#if searchFilter}
				<div class="flex items-center gap-1.5 text-xs text-slate-500 bg-indigo-50/60 border border-indigo-100 px-2.5 py-1 rounded-lg">
					<span>Filtering by: <strong class="text-indigo-700">"{searchFilter}"</strong></span>
					<button 
						on:click={() => searchFilter = ''} 
						class="text-indigo-400 hover:text-indigo-600 p-0.5 rounded transition-colors"
						title="Clear filter"
					>
						<X class="w-3 h-3" />
					</button>
				</div>
			{/if}
		</div>

		{#if filteredContacts.length === 0}
			<!-- Polished Empty State -->
			<div class="py-16 px-4 text-center max-w-sm mx-auto">
				<div class="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
					<Users class="w-7 h-7" />
				</div>
				<h3 class="text-sm font-bold text-slate-800 mb-1">
					{searchFilter ? 'No matching contacts found' : 'No contacts in database'}
				</h3>
				<p class="text-xs text-slate-500 mb-6 leading-relaxed">
					{searchFilter 
						? `No contacts match your query "${searchFilter}". Try clearing your search filter.`
						: 'Import an Excel database or add individual contacts to get started with your mailings.'}
				</p>
				{#if searchFilter}
					<button 
						type="button"
						on:click={() => searchFilter = ''}
						class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
					>
						Clear Search Filter
					</button>
				{:else}
					<div class="flex items-center justify-center gap-2">
						<button 
							type="button"
							on:click={() => showAddForm = true}
							class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5"
						>
							<Plus class="w-3.5 h-3.5" />
							Add First Contact
						</button>
					</div>
				{/if}
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-left text-xs sm:text-sm border-collapse">
					<thead>
						<tr class="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider select-none">
							<th scope="col" class="px-5 py-3">Contact</th>
							<th scope="col" class="px-5 py-3">Email Address</th>
							<th scope="col" class="px-5 py-3">Company / Group</th>
							<th scope="col" class="px-5 py-3 text-right w-24">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#each filteredContacts as contact (contact.id)}
							<tr class="hover:bg-slate-50/80 transition-colors duration-150 group">
								
								<!-- Contact Name + Avatar -->
								<td class="px-5 py-3.5 font-medium text-slate-900">
									<div class="flex items-center gap-3">
										<div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
											{contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
										</div>
										<div class="flex flex-col min-w-0">
											<span class="font-semibold text-slate-800 truncate group-hover:text-indigo-900 transition-colors">
												{contact.name}
											</span>
										</div>
									</div>
								</td>

								<!-- Email Column with Copy Action -->
								<td class="px-5 py-3.5">
									<button 
										type="button"
										on:click={() => copyEmailToClipboard(contact.email)}
										class="font-mono text-xs text-slate-600 bg-slate-100/70 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200/80 px-2.5 py-1 rounded-lg border border-slate-200/60 inline-flex items-center gap-1.5 transition-all text-left group/email"
										title="Click to copy email"
									>
										<Mail class="w-3 h-3 text-slate-400 group-hover/email:text-indigo-500 shrink-0" />
										<span class="truncate max-w-[200px] sm:max-w-[280px]">{contact.email}</span>
										<Copy class="w-3 h-3 opacity-0 group-hover/email:opacity-100 text-indigo-500 shrink-0 transition-opacity ml-0.5" />
									</button>
								</td>

								<!-- Company Column -->
								<td class="px-5 py-3.5">
									{#if contact.company && contact.company !== '-'}
										<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium text-slate-600 bg-slate-100/60 border border-slate-200/50">
											<Building2 class="w-3 h-3 text-slate-400 shrink-0" />
											<span class="truncate max-w-[180px]">{contact.company}</span>
										</span>
									{:else}
										<span class="text-slate-300 text-xs italic">Unspecified</span>
									{/if}
								</td>

								<!-- Actions Column -->
								<td class="px-5 py-3.5 text-right">
									<button 
										type="button"
										on:click={() => deleteContact(contact.id, contact.email)}
										class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200/60 rounded-xl transition-all inline-flex items-center justify-center group/btn"
										title="Remove Contact"
										aria-label="Remove contact {contact.name}"
									>
										<Trash2 class="w-4 h-4 transition-transform group-hover/btn:scale-110" />
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
</div>

