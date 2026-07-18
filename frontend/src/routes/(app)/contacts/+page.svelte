<script lang="ts">
	import { onMount } from 'svelte';
	import { toastStore } from '$lib/stores/toastStore';
	import { sendApi } from '$lib/api/send';
	import Header from '$lib/components/layout/Header.svelte';
	import { Users, Plus, Trash2, Search, FileSpreadsheet, Download, RefreshCw, X, User } from 'lucide-svelte';

	let loading = false;
	let contacts: any[] = [];
	let searchFilter = '';
	
	// Add form bindings
	let showAddForm = false;
	let newName = '';
	let newEmail = '';
	let newCompany = '';

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

	$: filteredContacts = contacts.filter(c => {
		const query = searchFilter.toLowerCase();
		return c.name.toLowerCase().includes(query) || 
		       c.email.toLowerCase().includes(query) || 
		       c.company.toLowerCase().includes(query);
	});
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<Header title="Contact Database Manager" subtitle="Manage recipient lists, view imported databases, and import spreadsheet contacts" />
		<div class="flex gap-2">
			<!-- Excel file import button -->
			<div class="relative">
				<input 
					type="file" 
					accept=".xlsx, .xls"
					on:change={handleExcelUpload}
					class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					id="import-excel"
				/>
				<label 
					for="import-excel"
					class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl cursor-pointer text-sm flex items-center gap-1.5 transition-all shadow-sm"
				>
					<FileSpreadsheet class="w-4 h-4 text-emerald-600 shrink-0" />
					Import Excel
				</label>
			</div>

			<button 
				on:click={exportToCSV}
				disabled={contacts.length === 0}
				class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-40"
			>
				<Download class="w-4 h-4 text-primary shrink-0" />
				Export CSV
			</button>
		</div>
	</div>

	<!-- Add Contact and Search Panel -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
		<!-- Search filter -->
		<div class="relative sm:col-span-2">
			<span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
				<Search class="w-4 h-4" />
			</span>
			<input 
				type="text" 
				bind:value={searchFilter} 
				placeholder="Search contacts by name, email, or company..."
				class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
			/>
		</div>

		<!-- Toggle add form button -->
		<button 
			on:click={() => showAddForm = !showAddForm}
			class="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/10 transition-colors"
		>
			{#if showAddForm}
				<X class="w-4 h-4" />
				Close Panel
			{:else}
				<Plus class="w-4 h-4" />
				Add Contact
			{/if}
		</button>
	</div>

	<!-- Add Contact Form -->
	{#if showAddForm}
		<div class="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm space-y-4">
			<h3 class="font-bold text-slate-800 text-sm">Add New Mailing Recipient</h3>
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div>
					<label class="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
					<input 
						type="text" 
						bind:value={newName} 
						placeholder="Jane Doe"
						class="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none"
					/>
				</div>
				<div>
					<label class="block text-xs font-semibold text-slate-500 mb-1">Email Address *</label>
					<input 
						type="email" 
						bind:value={newEmail} 
						placeholder="jane.doe@example.com"
						class="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none"
						required
					/>
				</div>
				<div>
					<label class="block text-xs font-semibold text-slate-500 mb-1">Company / Group</label>
					<input 
						type="text" 
						bind:value={newCompany} 
						placeholder="Optional Corp"
						class="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none"
					/>
				</div>
			</div>
			<div class="flex justify-end gap-2.5">
				<button 
					type="button" 
					on:click={() => showAddForm = false}
					class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-all"
				>
					Cancel
				</button>
				<button 
					type="button" 
					on:click={addContact}
					class="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10"
				>
					Save Contact
				</button>
			</div>
		</div>
	{/if}

	<!-- Contacts Table -->
	<div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
		{#if filteredContacts.length === 0}
			<div class="text-center text-slate-400 py-12 text-sm">
				No contacts found in list. Import a spreadsheet to populate mailing databases.
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left text-slate-500">
					<thead class="text-xs uppercase bg-slate-50 text-slate-400 border-b border-slate-100 font-bold">
						<tr>
							<th class="px-6 py-4 font-bold">Name</th>
							<th class="px-6 py-4 font-bold">Email</th>
							<th class="px-6 py-4 font-bold">Company</th>
							<th class="px-6 py-4 font-bold text-right w-20">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#each filteredContacts as contact (contact.id)}
							<tr class="hover:bg-slate-50/50 transition-colors">
								<td class="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
									<div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/50 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">
										{contact.name.charAt(0).toUpperCase()}
									</div>
									{contact.name}
								</td>
								<td class="px-6 py-4 select-all font-mono text-xs">{contact.email}</td>
								<td class="px-6 py-4">{contact.company}</td>
								<td class="px-6 py-4 text-right">
									<button 
										on:click={() => deleteContact(contact.id, contact.email)}
										class="p-2 text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all"
										title="Remove Contact"
									>
										<Trash2 class="w-4 h-4" />
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
