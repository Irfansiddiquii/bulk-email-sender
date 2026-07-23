import { c as create_ssr_component, v as validate_component, d as add_attribute, e as escape, b as each } from "../../../../chunks/ssr.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { H as Header, S as Search } from "../../../../chunks/Header.js";
import "@tiptap/starter-kit";
import "@tiptap/extension-placeholder";
/* empty css                                                           */
import { P as Plus } from "../../../../chunks/plus.js";
import { F as File_text } from "../../../../chunks/file-text.js";
import { S as Sparkles } from "../../../../chunks/sparkles.js";
import { M as Mail } from "../../../../chunks/mail.js";
import { U as User } from "../../../../chunks/user.js";
import { B as Building_2 } from "../../../../chunks/building-2.js";
import { P as Pen } from "../../../../chunks/pen.js";
import { A as Arrow_right } from "../../../../chunks/arrow-right.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
const Braces = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"
      }
    ],
    [
      "path",
      {
        "d": "M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "braces" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const File_code = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
      }
    ],
    ["polyline", { "points": "14 2 14 8 20 8" }],
    ["path", { "d": "m10 13-2 2 2 2" }],
    ["path", { "d": "m14 17 2-2-2-2" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "file-code" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Tag = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"
      }
    ],
    ["path", { "d": "M7 7h.01" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "tag" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
function extractVariables(text) {
  if (!text) return [];
  const matches = text.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];
  return Array.from(new Set(matches.map((m) => m.replace(/[\{\}]/g, "").trim())));
}
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredTemplates;
  let templates = [];
  let searchFilter = "";
  let searchInputEl;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    filteredTemplates = templates.filter((t) => {
      const query = searchFilter.toLowerCase();
      return (t.name?.toLowerCase() || "").includes(query) || (t.subject?.toLowerCase() || "").includes(query) || (t.body?.toLowerCase() || "").includes(query);
    });
    $$rendered = ` <div class="space-y-6 w-full max-w-7xl mx-auto pb-12"> ${validate_component(Header, "Header").$$render(
      $$result,
      {
        title: "Campaign Email Templates",
        subtitle: "Draft, edit, and select HTML email designs for campaign dispatches"
      },
      {},
      {}
    )}  <div class="p-1.5 rounded-[1.5rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-xs mb-8 backdrop-blur-xl transition-all duration-200"><div class="bg-white rounded-[calc(1.5rem-0.375rem)] p-3 sm:p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 shadow-2xs relative z-20"> <div class="relative flex-1 min-w-[240px] max-w-2xl group"><div class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-indigo-50/80 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0 group-focus-within:bg-indigo-600 group-focus-within:text-white group-focus-within:border-indigo-600 transition-all duration-200 shadow-2xs pointer-events-none">${validate_component(Search, "Search").$$render($$result, { class: "w-4 h-4" }, {}, {})}</div> <input type="text" aria-label="Search templates" placeholder="Search templates by title, subject lines, or keyword content..." class="w-full pl-12 pr-24 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-indigo-500 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/12 transition-all duration-200 shadow-inner/5"${add_attribute("this", searchInputEl, 0)}${add_attribute("value", searchFilter, 0)}> <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-auto">${``} <kbd class="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white border border-slate-200/80 shadow-2xs pointer-events-none" data-svelte-h="svelte-1c05i9n">⌘K</kbd></div></div>  <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0"> <div class="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100/90 border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs select-none"><span class="relative flex h-2 w-2" data-svelte-h="svelte-1su8owh"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span> <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span></span> <span class="font-mono text-indigo-600 font-bold bg-indigo-50 border border-indigo-100/80 px-2 py-0.5 rounded-md text-[11px] shadow-2xs">${escape(filteredTemplates.length)}</span> <span class="text-slate-600 font-medium hidden xs:inline">${escape(filteredTemplates.length === 1 ? "Template" : "Templates")}</span></div> ${` <button class="relative group overflow-hidden bg-slate-900 hover:bg-slate-800 text-white font-semibold pl-4 pr-2.5 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-slate-900/10 hover:shadow-xl hover:shadow-indigo-500/15 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 shrink-0"><span class="tracking-tight text-white font-semibold" data-svelte-h="svelte-16i9g4v">New Template</span> <div class="w-7 h-7 rounded-lg bg-white/10 border border-white/10 text-white flex items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:border-indigo-400 group-hover:scale-105 transition-all duration-200 shadow-2xs">${validate_component(Plus, "Plus").$$render(
      $$result,
      {
        class: "w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300"
      },
      {},
      {}
    )}</div></button>`}</div></div></div> ${` ${filteredTemplates.length === 0 ? `<div class="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs max-w-lg mx-auto my-8"><div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100/80 shadow-2xs">${validate_component(File_text, "FileText").$$render($$result, { class: "w-8 h-8" }, {}, {})}</div> <h3 class="text-lg font-bold text-slate-900" data-svelte-h="svelte-5xpgnp">No Templates Found</h3> <p class="text-slate-500 text-sm mt-1.5 mb-6 max-w-sm mx-auto leading-relaxed">${escape("Create and save reusable HTML templates to streamline your campaign mailings.")}</p> <button class="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-md shadow-slate-900/10 active:scale-[0.98] transition-all">${validate_component(Plus, "Plus").$$render($$result, { class: "w-4 h-4" }, {}, {})} <span data-svelte-h="svelte-7sxhkm">Create First Template</span></button></div>` : `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${each(filteredTemplates, (temp) => {
      return ` <div class="group relative p-2 rounded-[2rem] bg-gradient-to-b from-slate-100/80 via-slate-50/50 to-indigo-50/20 border border-slate-200/80 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 flex flex-col overflow-hidden"> <div class="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>  <div class="bg-white rounded-[calc(2rem-0.5rem)] p-6 flex flex-col justify-between h-full border border-slate-100/90 space-y-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]"><div> <div class="flex items-start justify-between gap-3.5 mb-5"><div class="flex items-center gap-3.5 min-w-0"><div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:rotate-1 transition-all duration-300">${validate_component(File_text, "FileText").$$render($$result, { class: "w-6 h-6 text-white" }, {}, {})}</div> <div class="min-w-0"><h3 class="font-bold text-slate-900 text-base sm:text-lg leading-snug group-hover:text-indigo-600 transition-colors truncate"${add_attribute("title", temp.name, 0)}>${escape(temp.name)}</h3> <span class="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-indigo-700 bg-indigo-50/80 border border-indigo-100/80 px-2.5 py-0.5 rounded-full mt-1">${validate_component(Sparkles, "Sparkles").$$render($$result, { class: "w-3 h-3 text-indigo-500" }, {}, {})}
												HTML Layout
											</span></div> </div></div>  <div class="mb-4"><div class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono"><span class="flex items-center gap-1.5 text-slate-500">${validate_component(Mail, "Mail").$$render($$result, { class: "w-3.5 h-3.5 text-indigo-500" }, {}, {})}
											Default Subject
										</span></div> <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-50 via-slate-50/80 to-indigo-50/20 border border-slate-200/70 p-3.5 shadow-2xs group-hover:border-indigo-200/80 transition-colors border-l-4 border-l-indigo-500"><p class="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 leading-relaxed tracking-tight">${escape(temp.subject)}</p> </div></div>  ${stripHtml(temp.body) ? `<div class="mb-4"><div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">${validate_component(File_code, "FileCode").$$render($$result, { class: "w-3.5 h-3.5 text-slate-400" }, {}, {})} <span data-svelte-h="svelte-tuwj17">Markup Snippet</span></div> <div class="relative bg-slate-50/60 rounded-xl p-3.5 border border-slate-100 text-xs text-slate-600 leading-relaxed shadow-inner/5"><p class="line-clamp-2 text-slate-600 font-normal text-xs">${escape(stripHtml(temp.body))} </p></div> </div>` : ``}  ${extractVariables(temp.subject + " " + temp.body).length > 0 ? `<div><div class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">${validate_component(Braces, "Braces").$$render($$result, { class: "w-3.5 h-3.5 text-indigo-500" }, {}, {})} <span data-svelte-h="svelte-9rex3p">Supported Merge Fields</span></div> <div class="flex flex-wrap items-center gap-2">${each(extractVariables(temp.subject + " " + temp.body), (v) => {
        return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border border-slate-200/80 hover:border-indigo-200/80 shadow-2xs text-xs font-semibold tracking-tight transition-all duration-200 hover:scale-[1.02]"><div class="w-4 h-4 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0">${v.toLowerCase().includes("name") || v.toLowerCase().includes("user") ? `${validate_component(User, "User").$$render($$result, { class: "w-2.5 h-2.5 text-indigo-600" }, {}, {})}` : `${v.toLowerCase().includes("company") || v.toLowerCase().includes("org") || v.toLowerCase().includes("business") ? `${validate_component(Building_2, "Building2").$$render($$result, { class: "w-2.5 h-2.5 text-indigo-600" }, {}, {})}` : `${v.toLowerCase().includes("email") || v.toLowerCase().includes("mail") ? `${validate_component(Mail, "Mail").$$render($$result, { class: "w-2.5 h-2.5 text-indigo-600" }, {}, {})}` : `${validate_component(Tag, "Tag").$$render($$result, { class: "w-2.5 h-2.5 text-indigo-600" }, {}, {})}`}`}`}</div> <span>${escape(v)}</span> </span>`;
      })}</div> </div>` : ``}</div>  <div class="border-t border-slate-100 pt-4 flex items-center justify-between gap-3"><button class="relative group/btn flex-1 overflow-hidden bg-slate-900 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-slate-900/10 hover:shadow-lg hover:shadow-indigo-500/20 border border-slate-800 hover:border-indigo-500 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 text-xs tracking-tight"><div class="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">${validate_component(Pen, "Edit2").$$render($$result, { class: "w-3.5 h-3.5 text-white" }, {}, {})}</div> <span data-svelte-h="svelte-1t54p7f">Edit Content</span> ${validate_component(Arrow_right, "ArrowRight").$$render(
        $$result,
        {
          class: "w-3.5 h-3.5 text-white/50 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all"
        },
        {},
        {}
      )}</button> <button title="Delete Template" aria-label="${"Delete template " + escape(temp.name, true)}" class="w-11 h-11 rounded-xl bg-slate-100 hover:bg-rose-50 hover:border-rose-200 border border-slate-200/70 text-slate-400 hover:text-rose-600 flex items-center justify-center shrink-0 transition-all duration-200 shadow-2xs group/del active:scale-[0.95]">${validate_component(Trash_2, "Trash2").$$render(
        $$result,
        {
          class: "w-4 h-4 transition-transform group-hover/del:scale-110"
        },
        {},
        {}
      )}</button> </div></div> </div>`;
    })}</div>`}`}</div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
