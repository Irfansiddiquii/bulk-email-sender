import { c as create_ssr_component, v as validate_component } from "../../../../chunks/ssr.js";
import "../../../../chunks/Icon.js";
import "../../../../chunks/authStore.js";
import { H as Header } from "../../../../chunks/Header.js";
let itemsPerPage = 20;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredLogs;
  let logs = [];
  let searchFilter = "";
  let currentPage = 1;
  filteredLogs = logs.filter((log) => {
    const matchesSearch = (log.email?.toLowerCase() || "").includes(searchFilter.toLowerCase()) || (log.subject?.toLowerCase() || "").includes(searchFilter.toLowerCase()) || (log.message?.toLowerCase() || "").includes(searchFilter.toLowerCase());
    return matchesSearch;
  });
  Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  {
    {
      currentPage = 1;
    }
  }
  filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return ` <div class="space-y-6 sm:space-y-8 w-full"> ${validate_component(Header, "Header").$$render(
    $$result,
    {
      title: "Delivery History Logs",
      subtitle: "Review full record of past campaign email dispatches and error traces"
    },
    {},
    {}
  )} ${`<div class="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center" data-svelte-h="svelte-17l5ycq"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-3"></div> <p class="text-slate-500 text-sm">Syncing history logs...</p></div>`}</div>`;
});
export {
  Page as default
};
