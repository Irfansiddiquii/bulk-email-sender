import { c as create_ssr_component, v as validate_component, d as add_attribute, e as escape, b as each } from "../../../../chunks/ssr.js";
import "../../../../chunks/Icon.js";
import "../../../../chunks/authStore.js";
import { H as Header, S as Search, C as Chevron_down } from "../../../../chunks/Header.js";
import { U as Users } from "../../../../chunks/users.js";
import { F as File_spreadsheet } from "../../../../chunks/file-spreadsheet.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { M as Mail } from "../../../../chunks/mail.js";
import { C as Copy } from "../../../../chunks/copy.js";
import { B as Building_2 } from "../../../../chunks/building-2.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredContacts;
  let contacts = [];
  let searchFilter = "";
  let showActionsDropdown = false;
  let searchInputEl;
  filteredContacts = contacts.filter((c) => {
    const query = searchFilter.toLowerCase();
    return (c.name?.toLowerCase() || "").includes(query) || (c.email?.toLowerCase() || "").includes(query) || (c.company?.toLowerCase() || "").includes(query);
  });
  return ` <div class="space-y-6 sm:space-y-8 w-full"> ${validate_component(Header, "Header").$$render(
    $$result,
    {
      title: "Contact Database Manager",
      subtitle: "Manage recipient lists, view imported databases, and import spreadsheet contacts"
    },
    {},
    {}
  )}  <div class="p-1.5 rounded-[1.5rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-xs backdrop-blur-xl transition-all duration-200 relative z-20"><div class="bg-white rounded-[calc(1.5rem-0.375rem)] p-2.5 sm:p-3 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3"> <div class="relative flex-1 min-w-[240px] max-w-xl group"><div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">${validate_component(Search, "Search").$$render($$result, { class: "w-4 h-4" }, {}, {})}</div> <input type="text" aria-label="Search contacts" placeholder="Search contacts by name, email address, or company..." class="w-full pl-10 pr-20 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-indigo-500/80 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-2xs transition-all duration-150"${add_attribute("this", searchInputEl, 0)}${add_attribute("value", searchFilter, 0)}> <div class="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5 pointer-events-none">${`<kbd class="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white border border-slate-200 shadow-2xs" data-svelte-h="svelte-zu92va"><span class="text-[9px]">⌘</span>K</kbd>`}</div></div>  <div class="flex items-center gap-2 sm:gap-2.5 shrink-0 justify-between md:justify-end"> <div class="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100/70 border border-slate-200/60 text-xs text-slate-600 font-medium select-none">${validate_component(Users, "Users").$$render($$result, { class: "w-3.5 h-3.5 text-slate-500" }, {}, {})} <span><strong class="text-slate-900 font-semibold">${escape(filteredContacts.length)}</strong> <span class="text-slate-400" data-svelte-h="svelte-c71ycm">/</span> <span class="text-slate-500">${escape(contacts.length)}</span></span></div>  <div class="relative"><button type="button"${add_attribute("aria-expanded", showActionsDropdown, 0)} aria-haspopup="true" class="h-10 px-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200/90 text-slate-700 font-medium rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-2xs group">${validate_component(File_spreadsheet, "FileSpreadsheet").$$render(
    $$result,
    {
      class: "w-4 h-4 text-indigo-600 group-hover:scale-105 transition-transform"
    },
    {},
    {}
  )} <span class="font-semibold text-slate-700" data-svelte-h="svelte-gxe0co">Data Actions</span> ${validate_component(Chevron_down, "ChevronDown").$$render(
    $$result,
    {
      class: "w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 "
    },
    {},
    {}
  )}</button> ${``}</div>  <button type="button" class="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-150 shrink-0">${`${validate_component(Plus, "Plus").$$render($$result, { class: "w-4 h-4 shrink-0" }, {}, {})} <span data-svelte-h="svelte-1qt7mn3">Add Contact</span>`}</button></div></div></div>  ${``}  <div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group"><div class="bg-white border border-slate-100/90 rounded-[calc(2.25rem-0.5rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] overflow-hidden"> <div class="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4"><div class="flex items-center gap-2.5"><div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-xs">${validate_component(Users, "Users").$$render($$result, { class: "w-3.5 h-3.5" }, {}, {})}</div> <div><h2 class="text-xs sm:text-sm font-bold text-slate-800 leading-tight" data-svelte-h="svelte-19jppm2">All Contacts</h2> <p class="text-[11px] text-slate-400">Total ${escape(filteredContacts.length)} recipient records</p></div></div> ${``}</div> ${filteredContacts.length === 0 ? ` <div class="py-16 px-4 text-center max-w-sm mx-auto"><div class="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">${validate_component(Users, "Users").$$render($$result, { class: "w-7 h-7" }, {}, {})}</div> <h3 class="text-sm font-bold text-slate-800 mb-1">${escape("No contacts in database")}</h3> <p class="text-xs text-slate-500 mb-6 leading-relaxed">${escape("Import an Excel database or add individual contacts to get started with your mailings.")}</p> ${`<div class="flex items-center justify-center gap-2"><button type="button" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5">${validate_component(Plus, "Plus").$$render($$result, { class: "w-3.5 h-3.5" }, {}, {})}
							Add First Contact</button></div>`}</div>` : `<div class="overflow-x-auto"><table class="w-full text-left text-xs sm:text-sm border-collapse"><thead data-svelte-h="svelte-1vwaq6e"><tr class="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider select-none"><th scope="col" class="px-5 py-3">Contact</th> <th scope="col" class="px-5 py-3">Email Address</th> <th scope="col" class="px-5 py-3">Company / Group</th> <th scope="col" class="px-5 py-3 text-right w-24">Actions</th></tr></thead> <tbody class="divide-y divide-slate-100">${each(filteredContacts, (contact) => {
    return `<tr class="hover:bg-slate-50/80 transition-colors duration-150 group"> <td class="px-5 py-3.5 font-medium text-slate-900"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">${escape(contact.name ? contact.name.charAt(0).toUpperCase() : "?")}</div> <div class="flex flex-col min-w-0"><span class="font-semibold text-slate-800 truncate group-hover:text-indigo-900 transition-colors">${escape(contact.name)} </span></div> </div></td>  <td class="px-5 py-3.5"><button type="button" class="font-mono text-xs text-slate-600 bg-slate-100/70 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200/80 px-2.5 py-1 rounded-lg border border-slate-200/60 inline-flex items-center gap-1.5 transition-all text-left group/email" title="Click to copy email">${validate_component(Mail, "Mail").$$render(
      $$result,
      {
        class: "w-3 h-3 text-slate-400 group-hover/email:text-indigo-500 shrink-0"
      },
      {},
      {}
    )} <span class="truncate max-w-[200px] sm:max-w-[280px]">${escape(contact.email)}</span> ${validate_component(Copy, "Copy").$$render(
      $$result,
      {
        class: "w-3 h-3 opacity-0 group-hover/email:opacity-100 text-indigo-500 shrink-0 transition-opacity ml-0.5"
      },
      {},
      {}
    )} </button></td>  <td class="px-5 py-3.5">${contact.company && contact.company !== "-" ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium text-slate-600 bg-slate-100/60 border border-slate-200/50">${validate_component(Building_2, "Building2").$$render($$result, { class: "w-3 h-3 text-slate-400 shrink-0" }, {}, {})} <span class="truncate max-w-[180px]">${escape(contact.company)}</span> </span>` : `<span class="text-slate-300 text-xs italic" data-svelte-h="svelte-23phlc">Unspecified</span>`}</td>  <td class="px-5 py-3.5 text-right"><button type="button" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200/60 rounded-xl transition-all inline-flex items-center justify-center group/btn" title="Remove Contact" aria-label="${"Remove contact " + escape(contact.name, true)}">${validate_component(Trash_2, "Trash2").$$render(
      $$result,
      {
        class: "w-4 h-4 transition-transform group-hover/btn:scale-110"
      },
      {},
      {}
    )} </button></td> </tr>`;
  })}</tbody></table></div>`}</div></div></div>`;
});
export {
  Page as default
};
