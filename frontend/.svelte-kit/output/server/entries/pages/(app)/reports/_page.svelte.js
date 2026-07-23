import { c as create_ssr_component, v as validate_component } from "../../../../chunks/ssr.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import "../../../../chunks/authStore.js";
import { H as Header, R as Refresh_cw } from "../../../../chunks/Header.js";
import { F as File_spreadsheet } from "../../../../chunks/file-spreadsheet.js";
const File_json = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
      }
    ],
    ["polyline", { "points": "14 2 14 8 20 8" }],
    [
      "path",
      {
        "d": "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"
      }
    ],
    [
      "path",
      {
        "d": "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "file-json" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
let itemsPerPage = 20;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredLogs;
  let logs = [];
  let searchFilter = "";
  let currentPage = 1;
  filteredLogs = logs.filter((log) => {
    const matchesSearch = (log.message?.toLowerCase() || "").includes(searchFilter.toLowerCase()) || (log.level?.toLowerCase() || "").includes(searchFilter.toLowerCase()) || (log.timestamp || "").includes(searchFilter);
    return matchesSearch;
  });
  Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  {
    {
      currentPage = 1;
    }
  }
  filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return `<div class="space-y-6 sm:space-y-8 w-full"> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">${validate_component(Header, "Header").$$render(
    $$result,
    {
      title: "Delivery Reports & Logs",
      subtitle: "Review past dispatch statistics, delivery successes, and error logs"
    },
    {},
    {}
  )} <div class="flex gap-2 text-sm"><button ${logs.length === 0 ? "disabled" : ""} class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-40 shadow-sm">${validate_component(File_spreadsheet, "FileSpreadsheet").$$render(
    $$result,
    {
      class: "w-4 h-4 text-emerald-600 shrink-0"
    },
    {},
    {}
  )}
				Export CSV</button> <button ${logs.length === 0 ? "disabled" : ""} class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-40 shadow-sm">${validate_component(File_json, "FileJson").$$render(
    $$result,
    {
      class: "w-4 h-4 text-orange-500 shrink-0"
    },
    {},
    {}
  )}
				Export JSON</button> <button class="bg-white border border-slate-200 hover:bg-slate-50 p-2.5 rounded-xl transition-all text-slate-600 shadow-sm" title="Sync Reports">${validate_component(Refresh_cw, "RefreshCw").$$render($$result, { class: "w-4.5 h-4.5" }, {}, {})}</button></div></div> ${`<div class="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center" data-svelte-h="svelte-v4d91u"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-3"></div> <p class="text-slate-500 text-sm">Retrieving campaign logs...</p></div>`}</div>`;
});
export {
  Page as default
};
