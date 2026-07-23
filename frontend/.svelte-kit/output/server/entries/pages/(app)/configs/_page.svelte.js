import { c as create_ssr_component, v as validate_component, s as subscribe, e as escape, d as add_attribute, b as each } from "../../../../chunks/ssr.js";
import { c as configsStore } from "../../../../chunks/configsStore.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import "../../../../chunks/authStore.js";
import { H as Header, S as Search } from "../../../../chunks/Header.js";
import { M as Modal, L as Loader } from "../../../../chunks/Loader.js";
import { S as Server, a as Shield_check } from "../../../../chunks/shield-check.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { C as Check_circle_2 } from "../../../../chunks/check-circle-2.js";
import { L as Lock } from "../../../../chunks/lock.js";
import { W as Wifi } from "../../../../chunks/wifi.js";
import { A as Activity } from "../../../../chunks/activity.js";
import { E as Eye } from "../../../../chunks/eye.js";
import { P as Pen } from "../../../../chunks/pen.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
const Star = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "polygon",
      {
        "points": "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "star" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredConfigs;
  let defaultConfig;
  let cleanPassword;
  let $configsStore, $$unsubscribe_configsStore;
  $$unsubscribe_configsStore = subscribe(configsStore, (value) => $configsStore = value);
  let loading = false;
  let showViewModal = false;
  let searchQuery = "";
  let pass = "";
  {
    if (typeof document !== "undefined") {
      {
        document.body.style.overflow = "";
      }
    }
  }
  filteredConfigs = $configsStore.filter((c) => {
    return true;
  });
  defaultConfig = $configsStore.find((c) => c.isDefault);
  cleanPassword = pass.replace(/\s+/g, "");
  cleanPassword.length === 16 && /^[a-zA-Z0-9]+$/.test(cleanPassword);
  $$unsubscribe_configsStore();
  return `<div class="space-y-6 w-full max-w-7xl mx-auto pb-12"> ${validate_component(Header, "Header").$$render(
    $$result,
    {
      title: "SMTP Configurations",
      subtitle: "Manage email server credentials, TLS security ports, and primary campaign dispatch channels"
    },
    {},
    {}
  )}  <div class="p-1.5 rounded-[1.5rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-xs mb-8 backdrop-blur-xl transition-all duration-200"><div class="bg-white rounded-[calc(1.5rem-0.375rem)] p-3.5 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 shadow-2xs relative z-20"> <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">${validate_component(Server, "Server").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div><div class="flex items-center gap-2"><h2 class="font-bold text-slate-900 text-base" data-svelte-h="svelte-1no2m4f">Mail Dispatch Accounts</h2> <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ${escape($configsStore.length)} ${escape($configsStore.length === 1 ? "Channel" : "Channels")} Active</span></div> <p class="text-xs text-slate-500" data-svelte-h="svelte-bltyir">Configure SMTP connections for campaign dispatch</p></div></div>  <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0"><div class="relative min-w-[200px] sm:min-w-[260px] group">${validate_component(Search, "Search").$$render(
    $$result,
    {
      class: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors"
    },
    {},
    {}
  )} <input type="text" placeholder="Search configs by name or host..." class="w-full pl-9 pr-3 py-2 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-indigo-500/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-2xs transition-all"${add_attribute("value", searchQuery, 0)}></div> <button class="relative group/btn overflow-hidden bg-slate-900 hover:bg-indigo-600 active:scale-[0.98] text-white font-semibold pl-4 pr-3 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-slate-900/10 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-200 flex items-center justify-center gap-2.5 shrink-0"><span class="tracking-tight text-white font-semibold" data-svelte-h="svelte-yzpvq0">Add Configuration</span> <div class="w-6 h-6 rounded-lg bg-white/10 border border-white/10 text-white flex items-center justify-center shrink-0 group-hover/btn:bg-white/20 group-hover/btn:scale-110 transition-all duration-200">${validate_component(Plus, "Plus").$$render($$result, { class: "w-3.5 h-3.5 text-white" }, {}, {})}</div></button></div></div></div>  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"><div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-2xs transition-all duration-200"><div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100"><div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">${validate_component(Server, "Server").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono" data-svelte-h="svelte-7h4ssl">Total SMTP Servers</p> <p class="text-xl font-bold text-slate-900 leading-none mt-1">${escape($configsStore.length)}</p></div></div></div> <div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-emerald-200/70 hover:border-emerald-400/80 shadow-2xs transition-all duration-200"><div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100"><div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">${validate_component(Star, "Star").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono" data-svelte-h="svelte-1yfvg9f">Primary Default Channel</p> <p class="text-xs font-bold text-slate-900 leading-none mt-1 truncate max-w-[170px]">${escape(defaultConfig ? defaultConfig.name : "None set")}</p></div></div></div> <div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-violet-200/70 hover:border-violet-400/80 shadow-2xs transition-all duration-200"><div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100"><div class="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shrink-0">${validate_component(Shield_check, "ShieldCheck").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div data-svelte-h="svelte-1m15cro"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Connection Security</p> <p class="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> <span>TLS/SSL Engine Active</span></p></div></div></div></div>  ${$configsStore.length === 0 ? ` <div class="p-2 rounded-[2.5rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 overflow-hidden relative group"> <div class="absolute top-0 left-12 right-12 h-[3px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-x-75 group-hover:scale-x-100"></div> <div class="bg-white rounded-[calc(2.5rem-0.5rem)] p-8 sm:p-12 text-center border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] max-w-4xl mx-auto space-y-10"> <div class="max-w-2xl mx-auto space-y-4"><div class="w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 group-hover:shadow-xl group-hover:shadow-indigo-500/35 group-hover:scale-105 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center mx-auto mb-6 shrink-0">${validate_component(Server, "Server").$$render(
    $$result,
    {
      class: "w-10 h-10 sm:w-11 sm:h-11 text-white"
    },
    {},
    {}
  )}</div> <h3 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug" data-svelte-h="svelte-1hf0ruy">Connect Your First Mail Server</h3> <p class="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal" data-svelte-h="svelte-1c3h4dx"><strong class="text-slate-700 font-semibold">SMTP (Simple Mail Transfer Protocol)</strong> is the core delivery engine of Bulk Email Sender. Setting up your server authorizes our system to dispatch marketing emails, newsletter updates, and automated campaigns on your behalf securely.</p>  <div class="pt-2"><button class="inline-flex items-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold px-8 py-4 rounded-2xl text-sm shadow-xl shadow-slate-900/15 hover:shadow-indigo-500/25 active:scale-[0.98] transition-all duration-300 group/cta"><span class="tracking-tight text-white font-semibold" data-svelte-h="svelte-7r0uea">Add First Configuration</span> <div class="w-7 h-7 rounded-xl bg-white/10 border border-white/10 text-white flex items-center justify-center shrink-0 group-hover/cta:bg-white/20 group-hover/cta:scale-110 transition-all duration-200">${validate_component(Plus, "Plus").$$render($$result, { class: "w-4 h-4 text-white" }, {}, {})}</div></button></div>  <div class="pt-4 flex flex-wrap items-center justify-center gap-2"><span class="px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs">${validate_component(Check_circle_2, "CheckCircle2").$$render($$result, { class: "w-3.5 h-3.5 text-indigo-600" }, {}, {})}
							Gmail App Passwords</span> <span class="px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs">${validate_component(Check_circle_2, "CheckCircle2").$$render($$result, { class: "w-3.5 h-3.5 text-indigo-600" }, {}, {})}
							Amazon SES</span> <span class="px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs">${validate_component(Check_circle_2, "CheckCircle2").$$render($$result, { class: "w-3.5 h-3.5 text-indigo-600" }, {}, {})}
							SendGrid</span> <span class="px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs">${validate_component(Check_circle_2, "CheckCircle2").$$render($$result, { class: "w-3.5 h-3.5 text-indigo-600" }, {}, {})}
							Custom SMTP Servers</span></div></div>  <div class="border-t border-slate-100 pt-8 text-left space-y-6"><div class="text-center" data-svelte-h="svelte-wnthjw"><h4 class="font-bold text-slate-900 text-base">Why Configure SMTP?</h4> <p class="text-xs text-slate-500 mt-1">Essential capabilities unlocked once your mail server is connected</p></div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300 space-y-2 group/card"><div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-2xs group-hover/card:bg-indigo-600 group-hover/card:text-white transition-colors duration-200">${validate_component(Lock, "Lock").$$render($$result, { class: "w-4.5 h-4.5" }, {}, {})}</div> <h5 class="font-bold text-slate-900 text-xs sm:text-sm" data-svelte-h="svelte-1lo7oh">Secure Authentication</h5> <p class="text-[11px] text-slate-500 leading-relaxed" data-svelte-h="svelte-1bzhmuh">Connect via TLS/SSL encrypted ports (465/587) and OAuth2/App Passwords for maximum domain security.</p></div>  <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-violet-300 hover:bg-violet-50/30 transition-all duration-300 space-y-2 group/card"><div class="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shadow-2xs group-hover/card:bg-violet-600 group-hover/card:text-white transition-colors duration-200">${validate_component(Server, "Server").$$render($$result, { class: "w-4.5 h-4.5" }, {}, {})}</div> <h5 class="font-bold text-slate-900 text-xs sm:text-sm" data-svelte-h="svelte-1aa87ak">Multiple Senders</h5> <p class="text-[11px] text-slate-500 leading-relaxed" data-svelte-h="svelte-19hqsz6">Configure multiple SMTP channels (Workspace, Gmail, SES) and switch sending profiles per campaign.</p></div>  <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-300 space-y-2 group/card"><div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-2xs group-hover/card:bg-emerald-600 group-hover/card:text-white transition-colors duration-200">${validate_component(Wifi, "Wifi").$$render($$result, { class: "w-4.5 h-4.5" }, {}, {})}</div> <h5 class="font-bold text-slate-900 text-xs sm:text-sm" data-svelte-h="svelte-1t16ei8">Live Connection Test</h5> <p class="text-[11px] text-slate-500 leading-relaxed" data-svelte-h="svelte-twlfgo">Instantly verify server reachability and send preview test emails before launching mass dispatches.</p></div>  <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-amber-300 hover:bg-amber-50/30 transition-all duration-300 space-y-2 group/card"><div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-2xs group-hover/card:bg-amber-600 group-hover/card:text-white transition-colors duration-200">${validate_component(Activity, "Activity").$$render($$result, { class: "w-4.5 h-4.5" }, {}, {})}</div> <h5 class="font-bold text-slate-900 text-xs sm:text-sm" data-svelte-h="svelte-1w6a7we">Automated Scheduling</h5> <p class="text-[11px] text-slate-500 leading-relaxed" data-svelte-h="svelte-d8frqo">Background dispatch engines automatically route scheduled campaigns through your default account.</p></div></div></div></div></div>` : ` <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${each(filteredConfigs, (config) => {
    return `<div class="${"p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl hover:shadow-indigo-500/15 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 group relative overflow-hidden flex flex-col justify-between " + escape(
      config.isDefault ? "ring-2 ring-emerald-500/40 border-emerald-300" : "",
      true
    )}"><div class="bg-white rounded-[calc(2.25rem-0.5rem)] p-5 sm:p-6 space-y-5 border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] h-full flex flex-col justify-between"><div> <div class="flex items-start justify-between gap-3 mb-4"><div class="flex items-center gap-3"><div class="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">${validate_component(Server, "Server").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div class="min-w-0"><h3 class="font-bold text-slate-900 text-base leading-snug truncate group-hover:text-indigo-600 transition-colors">${escape(config.name)}</h3> <p class="text-[11px] text-slate-400 font-mono truncate">${escape(config.host)}</p> </div></div> ${config.isDefault ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0" data-svelte-h="svelte-85w5m9"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
										Default
									</span>` : ``}</div>  <div class="space-y-2 text-xs text-slate-600 mb-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60 shadow-2xs"><div class="flex justify-between items-center"><span class="text-slate-400 font-mono" data-svelte-h="svelte-1qp9cws">Server Port</span> <span class="font-bold text-slate-800 font-mono bg-white px-2 py-0.5 rounded border border-slate-200/60">${escape(config.host)}:${escape(config.port)}</span></div> <div class="flex justify-between items-center"><span class="text-slate-400 font-mono" data-svelte-h="svelte-3sm3e2">Username</span> <span class="font-semibold text-slate-800 truncate max-w-[160px]"${add_attribute("title", config.user, 0)}>${escape(config.user)}</span></div> <div class="flex justify-between items-center"><span class="text-slate-400 font-mono" data-svelte-h="svelte-1firm2i">From Email</span> <span class="font-semibold text-indigo-600 truncate max-w-[160px]"${add_attribute("title", config.fromEmail, 0)}>${escape(config.fromEmail)}</span></div> </div></div>  <div class="border-t border-slate-100 pt-3.5 flex items-center justify-between gap-2"><button title="View Details" class="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200/70 transition-all shadow-2xs flex-1 flex items-center justify-center active:scale-95">${validate_component(Eye, "Eye").$$render($$result, { class: "w-4 h-4" }, {}, {})}</button> <button title="Set as Default" ${config.isDefault ? "disabled" : ""} class="${"p-2 rounded-xl border transition-all shadow-2xs flex-1 flex items-center justify-center active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed " + escape(
      config.isDefault ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-50 hover:bg-emerald-50 border-slate-200/70 hover:border-emerald-200 text-slate-600 hover:text-emerald-600",
      true
    )}">${validate_component(Star, "Star").$$render(
      $$result,
      {
        class: "w-4 h-4 " + (config.isDefault ? "fill-emerald-600" : "")
      },
      {},
      {}
    )}</button> <button title="Edit Settings" class="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 rounded-xl border border-slate-200/70 transition-all shadow-2xs flex-1 flex items-center justify-center active:scale-95">${validate_component(Pen, "Edit2").$$render($$result, { class: "w-4 h-4" }, {}, {})}</button> <button title="Delete Configuration" class="p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-200/70 hover:border-rose-200 transition-all shadow-2xs flex-1 flex items-center justify-center active:scale-95">${validate_component(Trash_2, "Trash2").$$render($$result, { class: "w-4 h-4" }, {}, {})}</button> </div></div> </div>`;
  })}</div>`}</div> ${``}  ${validate_component(Modal, "Modal").$$render(
    $$result,
    {
      show: showViewModal,
      title: "SMTP Details",
      size: "lg"
    },
    {},
    {
      footer: () => {
        return `<div slot="footer"><button type="button" class="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs shadow-2xs" data-svelte-h="svelte-mxoc9n">Close Details</button> ${``}</div>`;
      },
      default: () => {
        return `${``}`;
      }
    }
  )}  ${validate_component(Loader, "Loader").$$render(
    $$result,
    {
      visible: loading,
      text: "Saving Configuration..."
    },
    {},
    {}
  )}`;
});
export {
  Page as default
};
