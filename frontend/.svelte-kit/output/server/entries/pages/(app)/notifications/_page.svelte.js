import { c as create_ssr_component, v as validate_component, s as subscribe, d as add_attribute, e as escape } from "../../../../chunks/ssr.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { c as configsStore } from "../../../../chunks/configsStore.js";
import "../../../../chunks/authStore.js";
import { H as Header, S as Search } from "../../../../chunks/Header.js";
import { B as Bell } from "../../../../chunks/bell.js";
import { M as Mail } from "../../../../chunks/mail.js";
import { C as Check_circle_2 } from "../../../../chunks/check-circle-2.js";
import { S as Sparkles } from "../../../../chunks/sparkles.js";
import { W as Wifi } from "../../../../chunks/wifi.js";
import { A as Activity } from "../../../../chunks/activity.js";
import { S as Sliders_horizontal } from "../../../../chunks/sliders-horizontal.js";
const Check = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "check" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Volume_2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "polygon",
      {
        "points": "11 5 6 9 2 9 2 15 6 15 11 19 11 5"
      }
    ],
    ["path", { "d": "M15.54 8.46a5 5 0 0 1 0 7.07" }],
    ["path", { "d": "M19.07 4.93a10 10 0 0 1 0 14.14" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "volume-2" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $configsStore, $$unsubscribe_configsStore;
  $$unsubscribe_configsStore = subscribe(configsStore, (value) => $configsStore = value);
  let testEmail = "";
  let filterQuery = "";
  $$unsubscribe_configsStore();
  return `<div class="space-y-6 w-full max-w-7xl mx-auto pb-12"> ${validate_component(Header, "Header").$$render(
    $$result,
    {
      title: "Notification Alert Preferences",
      subtitle: "Configure system notification triggers, verify desktop push alerts, and test SMTP email routing"
    },
    {},
    {}
  )}  <div class="p-1.5 rounded-[1.5rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-xs mb-8 backdrop-blur-xl transition-all duration-200"><div class="bg-white rounded-[calc(1.5rem-0.375rem)] p-3.5 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 shadow-2xs relative z-20"> <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">${validate_component(Bell, "Bell").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div data-svelte-h="svelte-1nfzyzs"><div class="flex items-center gap-2"><h2 class="font-bold text-slate-900 text-base">Alert Dispatch Engine</h2> <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
							Active Routing</span></div> <p class="text-xs text-slate-500">System event monitors &amp; webhook listeners operational</p></div></div>  <div class="flex items-center gap-3 shrink-0"><div class="relative min-w-[200px] sm:min-w-[260px] group">${validate_component(Search, "Search").$$render(
    $$result,
    {
      class: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors"
    },
    {},
    {}
  )} <input type="text" placeholder="Search alert rules &amp; channels..." class="w-full pl-9 pr-3 py-2 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-indigo-500/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-2xs transition-all"${add_attribute("value", filterQuery, 0)}></div> ${`<button class="relative group/btn overflow-hidden bg-slate-900 hover:bg-indigo-600 text-white font-semibold pl-4 pr-3 py-2 rounded-xl text-xs shadow-md shadow-slate-900/10 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center gap-2 shrink-0">${validate_component(Bell, "Bell").$$render(
    $$result,
    {
      class: "w-3.5 h-3.5 text-indigo-400 group-hover/btn:text-white transition-colors"
    },
    {},
    {}
  )} <span data-svelte-h="svelte-1m588zx">Enable Desktop Push</span></button>`}</div></div></div>  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"><div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-2xs transition-all duration-200"><div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100"><div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">${validate_component(Mail, "Mail").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono" data-svelte-h="svelte-p6bxzs">SMTP Mail Channels</p> <p class="text-xl font-bold text-slate-900 leading-none mt-1">${escape($configsStore.length)} Configured</p></div></div></div> <div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-violet-200/70 hover:border-violet-400/80 shadow-2xs transition-all duration-200"><div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100"><div class="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shrink-0">${validate_component(Volume_2, "Volume2").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono" data-svelte-h="svelte-1i0dcaw">Browser Push Alerts</p> <p class="text-xs font-semibold mt-1 capitalize flex items-center gap-1.5">${`${`<span class="w-2 h-2 rounded-full bg-amber-500"></span> <span class="text-amber-700 font-bold" data-svelte-h="svelte-1wzcwln">Permission Pending</span>`}`}</p></div></div></div> <div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-emerald-200/70 hover:border-emerald-400/80 shadow-2xs transition-all duration-200"><div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100"><div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">${validate_component(Check_circle_2, "CheckCircle2").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div data-svelte-h="svelte-1gvlmnr"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">System Health</p> <p class="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> <span>100% Operational</span></p></div></div></div></div>  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"> <div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl hover:shadow-indigo-500/15 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 group relative overflow-hidden"><div class="bg-white rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-7 space-y-6 border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] h-full flex flex-col justify-between"><div class="space-y-5"> <div class="flex items-start justify-between gap-4"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">${validate_component(Mail, "Mail").$$render($$result, { class: "w-6 h-6 text-white" }, {}, {})}</div> <div data-svelte-h="svelte-6narne"><div class="flex items-center gap-2"><h3 class="font-bold text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-indigo-600 transition-colors">System Email Verification Studio</h3></div> <p class="text-xs text-slate-500 mt-0.5">Test real-time mail dispatch &amp; SMTP delivery routing</p></div></div> <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100/80 shadow-2xs shrink-0">${validate_component(Sparkles, "Sparkles").$$render($$result, { class: "w-3.5 h-3.5 text-indigo-600" }, {}, {})}
							SMTP Studio</span></div> <p class="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 shadow-2xs" data-svelte-h="svelte-usggci">Dispatches real-time campaign summary logs, finished dispatch reports, and critical SMTP alert events directly to your specified administrative email address.</p>  <div class="space-y-2.5 pt-1"><label for="test-email" class="block text-xs font-bold uppercase tracking-wider text-slate-600 font-mono" data-svelte-h="svelte-157gg9z">Test Target Destination Email</label> <div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-slate-200/80 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/12 transition-all"><div class="bg-white rounded-xl p-1 flex flex-col sm:flex-row gap-2 border border-slate-100"><div class="relative flex-grow">${validate_component(Mail, "Mail").$$render(
    $$result,
    {
      class: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
    },
    {},
    {}
  )} <input id="test-email" type="email" placeholder="admin@company.com" class="w-full pl-10 pr-4 py-2.5 bg-transparent rounded-lg text-sm font-semibold text-slate-900 focus:outline-none placeholder-slate-400"${add_attribute("value", testEmail, 0)}></div>  <button ${"disabled"} class="relative group/btn overflow-hidden bg-slate-900 hover:bg-indigo-600 active:scale-[0.98] text-white font-bold pl-4 pr-3 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2.5 shadow-md shadow-slate-900/15 hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-200 disabled:opacity-50 shrink-0"><span class="tracking-tight text-white font-semibold">${`Send Test Alert`}</span> <div class="w-6 h-6 rounded-lg bg-white/10 border border-white/10 text-white flex items-center justify-center shrink-0 group-hover/btn:bg-white/20 group-hover/btn:scale-110 transition-all duration-200">${`${validate_component(Wifi, "Wifi").$$render($$result, { class: "w-3.5 h-3.5 text-white" }, {}, {})}`}</div></button></div></div></div></div> <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-4"><span class="font-mono text-[11px] font-semibold text-slate-600" data-svelte-h="svelte-134z7ak">Protocol: SMTP TLS Active</span> <span class="font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">${validate_component(Check_circle_2, "CheckCircle2").$$render($$result, { class: "w-3.5 h-3.5" }, {}, {})}
						Channel Ready</span></div></div></div>  <div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-violet-900/[0.03] border border-violet-200/70 hover:border-violet-400/80 hover:ring-1 hover:ring-violet-400/20 shadow-md hover:shadow-xl hover:shadow-violet-500/15 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 group relative overflow-hidden"><div class="bg-white rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-7 space-y-6 border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] h-full flex flex-col justify-between"><div class="space-y-5"> <div class="flex items-start justify-between gap-4"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/25 shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">${validate_component(Bell, "Bell").$$render($$result, { class: "w-6 h-6 text-white" }, {}, {})}</div> <div data-svelte-h="svelte-1ln022o"><div class="flex items-center gap-2"><h3 class="font-bold text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-violet-600 transition-colors">Desktop Push Notifications</h3></div> <p class="text-xs text-slate-500 mt-0.5">Native OS browser audio chimes &amp; pop-up banners</p></div></div> <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-50 text-violet-700 border border-violet-100/80 shadow-2xs shrink-0">${validate_component(Activity, "Activity").$$render($$result, { class: "w-3.5 h-3.5 text-violet-600" }, {}, {})}
							Push Web API</span></div> <p class="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 shadow-2xs" data-svelte-h="svelte-1lc07ys">Triggers instant desktop notification overlays when automated queue dispatches begin, finished mailings complete, or SMTP delivery errors occur.</p>  <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-3"><div class="flex items-center justify-between text-xs"><span class="font-bold text-slate-700 uppercase tracking-wider font-mono" data-svelte-h="svelte-ya9py9">Current Channel Status:</span> ${`${`<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200" data-svelte-h="svelte-pbi4n4"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
									Permission Requested</span>`}`}</div></div></div> <div class="pt-4 border-t border-slate-100 flex items-center justify-between mt-4"><span class="text-xs font-mono font-semibold text-slate-600" data-svelte-h="svelte-1iuf4vr">HTML5 Notification Engine</span> ${`<button class="relative group/btn overflow-hidden bg-slate-900 hover:bg-indigo-600 active:scale-[0.98] text-white font-bold pl-4 pr-3 py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200"><span data-svelte-h="svelte-ahw19b">Grant Permission</span> <div class="w-5 h-5 rounded-md bg-white/10 text-white flex items-center justify-center shrink-0 group-hover/btn:scale-110 transition-transform">${validate_component(Bell, "Bell").$$render($$result, { class: "w-3 h-3 text-white" }, {}, {})}</div></button>`}</div></div></div></div>  <div class="p-2 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.04] via-slate-900/[0.02] to-indigo-900/[0.04] border border-slate-200/90 shadow-md hover:shadow-xl hover:border-indigo-300 transition-all duration-300 mt-8 group relative overflow-hidden"><div class="bg-white rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-8 space-y-6 border border-slate-100"><div class="flex items-center justify-between border-b border-slate-100 pb-5"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform duration-300">${validate_component(Sliders_horizontal, "SlidersHorizontal").$$render($$result, { class: "w-6 h-6 text-white" }, {}, {})}</div> <div data-svelte-h="svelte-1cxkw5k"><h3 class="font-bold text-slate-900 text-base sm:text-lg tracking-tight">Automated Notification Triggers &amp; Rules</h3> <p class="text-xs text-slate-500 mt-0.5">Toggle automated system notifications for campaign lifecycle events</p></div></div> <span class="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider hidden sm:inline" data-svelte-h="svelte-1hz0o2z">Rules Engine</span></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div class="${"p-4 sm:p-5 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:shadow-md hover:shadow-indigo-500/10 hover:border-indigo-300/80 flex items-center justify-between gap-4 group/rule " + escape(
    "bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/30 border-indigo-200/90 shadow-sm shadow-indigo-500/5",
    true
  )}"><div class="space-y-1 min-w-0"><div class="flex items-center gap-2"><h4 class="font-bold text-slate-900 text-xs sm:text-sm truncate group-hover/rule:text-indigo-600 transition-colors" data-svelte-h="svelte-14tekj6">Campaign Completion Summary</h4> ${`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100/80 text-indigo-800 border border-indigo-200" data-svelte-h="svelte-1gf71iw"><span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
									Active</span>`}</div> <p class="text-[11px] text-slate-500 leading-relaxed" data-svelte-h="svelte-dcgt0c">Dispatch an email summary log when a scheduled campaign finishes sending.</p></div> <button type="button" class="${"w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 relative focus:outline-none focus:ring-4 focus:ring-indigo-500/20 " + escape(
    "bg-indigo-600 shadow-md shadow-indigo-500/30",
    true
  )}" aria-label="Toggle Campaign Completion Summary"><div class="${"w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out " + escape(
    "translate-x-6",
    true
  ) + " flex items-center justify-center"}">${`${validate_component(Check, "Check").$$render($$result, { class: "w-3 h-3 text-indigo-600" }, {}, {})}`}</div></button></div>  <div class="${"p-4 sm:p-5 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:shadow-md hover:shadow-indigo-500/10 hover:border-indigo-300/80 flex items-center justify-between gap-4 group/rule " + escape(
    "bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/30 border-indigo-200/90 shadow-sm shadow-indigo-500/5",
    true
  )}"><div class="space-y-1 min-w-0"><div class="flex items-center gap-2"><h4 class="font-bold text-slate-900 text-xs sm:text-sm truncate group-hover/rule:text-indigo-600 transition-colors" data-svelte-h="svelte-omfj87">SMTP Failure Connection Alerts</h4> ${`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100/80 text-indigo-800 border border-indigo-200" data-svelte-h="svelte-1gf71iw"><span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
									Active</span>`}</div> <p class="text-[11px] text-slate-500 leading-relaxed" data-svelte-h="svelte-ytfoq4">Alert immediately if an SMTP server rejects authentication or times out.</p></div> <button type="button" class="${"w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 relative focus:outline-none focus:ring-4 focus:ring-indigo-500/20 " + escape(
    "bg-indigo-600 shadow-md shadow-indigo-500/30",
    true
  )}" aria-label="Toggle SMTP Failure Alerts"><div class="${"w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out " + escape(
    "translate-x-6",
    true
  ) + " flex items-center justify-center"}">${`${validate_component(Check, "Check").$$render($$result, { class: "w-3 h-3 text-indigo-600" }, {}, {})}`}</div></button></div>  <div class="${"p-4 sm:p-5 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:shadow-md hover:shadow-indigo-500/10 hover:border-indigo-300/80 flex items-center justify-between gap-4 group/rule " + escape(
    "bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/30 border-indigo-200/90 shadow-sm shadow-indigo-500/5",
    true
  )}"><div class="space-y-1 min-w-0"><div class="flex items-center gap-2"><h4 class="font-bold text-slate-900 text-xs sm:text-sm truncate group-hover/rule:text-indigo-600 transition-colors" data-svelte-h="svelte-1ktlhgb">Scheduled Queue Execution Alerts</h4> ${`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100/80 text-indigo-800 border border-indigo-200" data-svelte-h="svelte-1gf71iw"><span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
									Active</span>`}</div> <p class="text-[11px] text-slate-500 leading-relaxed" data-svelte-h="svelte-1qwqxu3">Trigger push notification when a scheduled background queue starts.</p></div> <button type="button" class="${"w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 relative focus:outline-none focus:ring-4 focus:ring-indigo-500/20 " + escape(
    "bg-indigo-600 shadow-md shadow-indigo-500/30",
    true
  )}" aria-label="Toggle Scheduled Queue Execution Alerts"><div class="${"w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out " + escape(
    "translate-x-6",
    true
  ) + " flex items-center justify-center"}">${`${validate_component(Check, "Check").$$render($$result, { class: "w-3 h-3 text-indigo-600" }, {}, {})}`}</div></button></div>  <div class="${"p-4 sm:p-5 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:shadow-md hover:shadow-indigo-500/10 hover:border-indigo-300/80 flex items-center justify-between gap-4 group/rule " + escape(
    "bg-slate-50/60 border-slate-200/60 opacity-75 hover:opacity-100",
    true
  )}"><div class="space-y-1 min-w-0"><div class="flex items-center gap-2"><h4 class="font-bold text-slate-900 text-xs sm:text-sm truncate group-hover/rule:text-indigo-600 transition-colors" data-svelte-h="svelte-y3kxb3">Bounce &amp; Suppression Thresholds</h4> ${`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 text-slate-600 border border-slate-300" data-svelte-h="svelte-6vveik">Paused</span>`}</div> <p class="text-[11px] text-slate-500 leading-relaxed" data-svelte-h="svelte-lbe7g7">Notify when recipient bounce rates exceed safety thresholds.</p></div> <button type="button" class="${"w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 relative focus:outline-none focus:ring-4 focus:ring-indigo-500/20 " + escape(
    "bg-slate-300",
    true
  )}" aria-label="Toggle Bounce &amp; Suppression Thresholds"><div class="${"w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out " + escape(
    "translate-x-0",
    true
  ) + " flex items-center justify-center"}">${``}</div></button></div></div></div></div></div>`;
});
export {
  Page as default
};
