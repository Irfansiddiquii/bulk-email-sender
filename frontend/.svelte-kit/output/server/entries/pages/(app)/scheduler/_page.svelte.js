import { c as create_ssr_component, s as subscribe, o as onDestroy, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
import "../../../../chunks/Icon.js";
import { c as configsStore } from "../../../../chunks/configsStore.js";
import "../../../../chunks/authStore.js";
import { H as Header, R as Refresh_cw } from "../../../../chunks/Header.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { A as Activity } from "../../../../chunks/activity.js";
import { C as Check_circle_2 } from "../../../../chunks/check-circle-2.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $configsStore, $$unsubscribe_configsStore;
  $$unsubscribe_configsStore = subscribe(configsStore, (value) => $configsStore = value);
  let scheduledJobs = [];
  let templates = [];
  let selectedTemplateId = "";
  let selectedConfigId = "";
  let scheduledTime = "";
  let selectedDate = new Date(Date.now() + 3600 * 1e3);
  let selectedHour = 12;
  let selectedMinute = 0;
  onDestroy(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  });
  {
    if (typeof document !== "undefined") {
      {
        document.body.style.overflow = "";
      }
    }
  }
  {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      let h = selectedHour;
      const hours = String(h).padStart(2, "0");
      const minutes = String(selectedMinute).padStart(2, "0");
      scheduledTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  }
  templates.find((t) => t.id === selectedTemplateId);
  $configsStore.find((c) => c.id === selectedConfigId);
  scheduledTime ? (() => {
    try {
      const d = new Date(scheduledTime);
      return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return "";
    }
  })() : "";
  $$unsubscribe_configsStore();
  return `<div class="space-y-6 w-full max-w-7xl mx-auto pb-12"> ${validate_component(Header, "Header").$$render(
    $$result,
    {
      title: "Automation Scheduler",
      subtitle: "View and manage automated campaigns set to dispatch in the future"
    },
    {},
    {}
  )}  <div class="p-1.5 rounded-[1.5rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-xs mb-8 backdrop-blur-xl transition-all duration-200"><div class="bg-white rounded-[calc(1.5rem-0.375rem)] p-3.5 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 shadow-2xs relative z-20"> <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">${validate_component(Calendar, "Calendar").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div data-svelte-h="svelte-69520h"><div class="flex items-center gap-2"><h2 class="font-bold text-slate-900 text-base">Campaign Dispatch Queue</h2> <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
							Engine Live</span></div> <p class="text-xs text-slate-500">Automated queue evaluated continuously</p></div></div>  <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0"><button class="bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold px-3.5 py-2 rounded-xl border border-slate-200/80 text-xs transition-all duration-150 flex items-center gap-2 shadow-2xs shrink-0" title="Refresh Schedules">${validate_component(Refresh_cw, "RefreshCw").$$render(
    $$result,
    {
      class: "w-3.5 h-3.5 text-slate-500 "
    },
    {},
    {}
  )} <span class="hidden xs:inline" data-svelte-h="svelte-vw3oe">Refresh</span></button> <div class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100/80 border border-slate-200/60 text-xs font-semibold text-slate-700 select-none shrink-0">${validate_component(Clock, "Clock").$$render($$result, { class: "w-3.5 h-3.5 text-indigo-600" }, {}, {})} <span>${escape(scheduledJobs.length)} ${escape(scheduledJobs.length === 1 ? "Job" : "Jobs")}</span></div>  <button class="relative group overflow-hidden bg-slate-900 hover:bg-slate-800 text-white font-semibold pl-4 pr-2.5 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-slate-900/10 hover:shadow-xl hover:shadow-indigo-500/15 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 shrink-0"><span class="tracking-tight text-white font-semibold" data-svelte-h="svelte-znia48">Create Schedule</span> <div class="w-7 h-7 rounded-lg bg-white/10 border border-white/10 text-white flex items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:border-indigo-400 group-hover:scale-105 transition-all duration-200 shadow-2xs">${validate_component(Plus, "Plus").$$render(
    $$result,
    {
      class: "w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300"
    },
    {},
    {}
  )}</div></button></div></div></div>  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"><div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-2xs transition-all duration-200"><div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100"><div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">${validate_component(Clock, "Clock").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono" data-svelte-h="svelte-15s1761">Upcoming Jobs</p> <p class="text-xl font-bold text-slate-900 leading-none mt-1">${escape(scheduledJobs.length)}</p></div></div></div> <div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-blue-200/70 hover:border-blue-400/80 shadow-2xs transition-all duration-200"><div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100"><div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">${validate_component(Activity, "Activity").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono" data-svelte-h="svelte-1sudow7">Active Dispatch</p> <p class="text-xl font-bold text-slate-900 leading-none mt-1">${escape(scheduledJobs.filter((j) => j.status === "running").length)}</p></div></div></div> <div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-emerald-200/70 hover:border-emerald-400/80 shadow-2xs transition-all duration-200"><div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100"><div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">${validate_component(Check_circle_2, "CheckCircle2").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono" data-svelte-h="svelte-yk8w14">Polling Heartbeat</p> <p class="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> <span>Last checked ${escape("Just now")}</span></p></div></div></div></div> ${`<div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-md" data-svelte-h="svelte-5jozu1"><div class="bg-white rounded-[calc(2.25rem-0.5rem)] p-12 text-center flex flex-col items-center justify-center border border-slate-100"><div class="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-indigo-600 mb-4"></div> <p class="text-slate-600 font-semibold text-sm">Retrieving automated schedules...</p> <p class="text-slate-400 text-xs mt-1">Syncing with campaign queue background engine</p></div></div>`}</div> ${``}`;
});
export {
  Page as default
};
