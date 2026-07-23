import { c as create_ssr_component, v as validate_component, s as subscribe, e as escape, d as add_attribute } from "../../../../chunks/ssr.js";
import { a as authStore } from "../../../../chunks/authStore.js";
import { c as configsStore } from "../../../../chunks/configsStore.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { H as Header } from "../../../../chunks/Header.js";
import { U as User } from "../../../../chunks/user.js";
import { S as Server, a as Shield_check } from "../../../../chunks/shield-check.js";
import { L as Lock } from "../../../../chunks/lock.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { S as Shield } from "../../../../chunks/shield.js";
import { S as Sliders_horizontal } from "../../../../chunks/sliders-horizontal.js";
import { M as Mail } from "../../../../chunks/mail.js";
import { C as Check_circle_2 } from "../../../../chunks/check-circle-2.js";
import { C as Copy } from "../../../../chunks/copy.js";
import { A as Arrow_right } from "../../../../chunks/arrow-right.js";
const Badge_check = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
      }
    ],
    ["path", { "d": "m9 12 2 2 4-4" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "badge-check" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Cpu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "rect",
      {
        "x": "4",
        "y": "4",
        "width": "16",
        "height": "16",
        "rx": "2"
      }
    ],
    [
      "rect",
      {
        "x": "9",
        "y": "9",
        "width": "6",
        "height": "6"
      }
    ],
    ["path", { "d": "M15 2v2" }],
    ["path", { "d": "M15 20v2" }],
    ["path", { "d": "M2 15h2" }],
    ["path", { "d": "M2 9h2" }],
    ["path", { "d": "M20 15h2" }],
    ["path", { "d": "M20 9h2" }],
    ["path", { "d": "M9 2v2" }],
    ["path", { "d": "M9 20v2" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "cpu" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Database = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "ellipse",
      {
        "cx": "12",
        "cy": "5",
        "rx": "9",
        "ry": "3"
      }
    ],
    ["path", { "d": "M3 5V19A9 3 0 0 0 21 19V5" }],
    ["path", { "d": "M3 12A9 3 0 0 0 21 12" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "database" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Key = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "7.5", "cy": "15.5", "r": "5.5" }],
    ["path", { "d": "m21 2-9.6 9.6" }],
    ["path", { "d": "m15.5 7.5 3 3L22 7l-3-3" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "key" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let defaultConfig;
  let $authStore, $$unsubscribe_authStore;
  let $configsStore, $$unsubscribe_configsStore;
  $$unsubscribe_authStore = subscribe(authStore, (value) => $authStore = value);
  $$unsubscribe_configsStore = subscribe(configsStore, (value) => $configsStore = value);
  let sessionActiveSince = "";
  defaultConfig = $configsStore.find((c) => c.isDefault);
  $$unsubscribe_authStore();
  $$unsubscribe_configsStore();
  return `<div class="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto pb-12"> ${validate_component(Header, "Header").$$render(
    $$result,
    {
      title: "Account & Security Dashboard",
      subtitle: "Manage administrator identity, active session security, and dispatch credentials"
    },
    {},
    {}
  )} ${$authStore.user ? ` <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> <div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-2xs transition-all duration-200"><div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100"><div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0 shadow-2xs">${validate_component(User, "User").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div class="min-w-0" data-svelte-h="svelte-1glromm"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Account Status</p> <p class="text-xs font-bold text-emerald-700 mt-0.5 flex items-center gap-1.5 truncate"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span> <span>Verified Administrator</span></p></div></div></div>  <div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-emerald-200/70 hover:border-emerald-400/80 shadow-2xs transition-all duration-200"><div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100"><div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 shadow-2xs">${validate_component(Server, "Server").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div class="min-w-0"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono" data-svelte-h="svelte-f0ni13">SMTP Channels</p> <p class="text-xs font-bold text-slate-900 mt-0.5 truncate">${escape($configsStore.length)} ${escape($configsStore.length === 1 ? "Server" : "Servers")} Active</p></div></div></div>  <div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-violet-200/70 hover:border-violet-400/80 shadow-2xs transition-all duration-200"><div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100"><div class="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shrink-0 shadow-2xs">${validate_component(Lock, "Lock").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div class="min-w-0" data-svelte-h="svelte-1wzc68f"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Security Mechanism</p> <p class="text-xs font-bold text-slate-900 mt-0.5 truncate">Argon2id + HMAC Cookie</p></div></div></div>  <div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-amber-200/70 hover:border-amber-400/80 shadow-2xs transition-all duration-200"><div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100"><div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 shadow-2xs">${validate_component(Clock, "Clock").$$render($$result, { class: "w-5 h-5" }, {}, {})}</div> <div class="min-w-0"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono" data-svelte-h="svelte-geqoqa">Current Session</p> <p class="text-xs font-semibold text-slate-800 mt-0.5 truncate"${add_attribute("title", sessionActiveSince, 0)}>${escape("Active")}</p></div></div></div></div>  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start"> <div class="lg:col-span-2 space-y-6 sm:space-y-8"> <div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative group overflow-hidden"><div class="bg-white rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-8 space-y-7 border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]"> <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100"> <div class="relative shrink-0"><div class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white font-bold text-3xl sm:text-4xl shadow-lg shadow-indigo-500/25 flex items-center justify-center border-2 border-white ring-4 ring-indigo-50 group-hover:scale-105 transition-transform duration-300">${escape($authStore.user.name ? $authStore.user.name.charAt(0).toUpperCase() : "U")}</div> <div class="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md">${validate_component(Badge_check, "BadgeCheck").$$render(
    $$result,
    {
      class: "w-6 h-6 text-indigo-600 fill-indigo-50"
    },
    {},
    {}
  )}</div></div>  <div class="space-y-2 min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2.5"><h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug truncate">${escape($authStore.user.name)}</h2> <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs" data-svelte-h="svelte-xtq4wb"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
										Active Account</span></div> <p class="text-xs sm:text-sm text-slate-500 flex items-center gap-2 font-normal"><span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">${validate_component(Shield, "Shield").$$render($$result, { class: "w-3.5 h-3.5 text-indigo-600" }, {}, {})}
										System Administrator</span> <span class="text-slate-300" data-svelte-h="svelte-1czdxsa">•</span> <span class="text-slate-500 text-xs font-mono">ID: ${escape($authStore.user.id.slice(0, 8))}...</span></p></div></div>  <div class="space-y-4"><div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-1">${validate_component(Sliders_horizontal, "SlidersHorizontal").$$render($$result, { class: "w-3.5 h-3.5 text-indigo-500" }, {}, {})} <span data-svelte-h="svelte-sl3m6n">Account Identity Details</span></div> <div class="bg-slate-50/70 rounded-2xl border border-slate-200/60 p-4 sm:p-5 divide-y divide-slate-200/60 space-y-3.5"> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 first:pt-0"><div class="flex items-center gap-2.5 text-xs font-semibold text-slate-500 min-w-[160px]"><div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">${validate_component(Mail, "Mail").$$render($$result, { class: "w-4 h-4" }, {}, {})}</div> <span data-svelte-h="svelte-1pum4x2">Email Address</span></div> <div class="flex items-center gap-2"><span class="text-sm font-bold text-indigo-950 font-sans tracking-tight">${escape($authStore.user.email)}</span> <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">${validate_component(Check_circle_2, "CheckCircle2").$$render($$result, { class: "w-3 h-3 text-emerald-600" }, {}, {})}
											Verified</span></div></div>  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3.5"><div class="flex items-center gap-2.5 text-xs font-semibold text-slate-500 min-w-[160px]"><div class="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100">${validate_component(Key, "Key").$$render($$result, { class: "w-4 h-4" }, {}, {})}</div> <span data-svelte-h="svelte-1qncc2n">Database Account ID</span></div> <div class="flex items-center gap-2"><code class="px-3 py-1 bg-white rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 shadow-2xs select-all">${escape($authStore.user.id)}</code> <button title="Copy Database Account ID" class="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-indigo-600 transition-all shadow-2xs active:scale-95 flex items-center justify-center">${`${validate_component(Copy, "Copy").$$render($$result, { class: "w-4 h-4" }, {}, {})}`}</button></div></div>  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3.5"><div class="flex items-center gap-2.5 text-xs font-semibold text-slate-500 min-w-[160px]"><div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">${validate_component(Clock, "Clock").$$render($$result, { class: "w-4 h-4" }, {}, {})}</div> <span data-svelte-h="svelte-18km96w">Active Session</span></div> <div class="text-xs font-semibold text-slate-800 bg-white px-3 py-1 rounded-xl border border-slate-200/80 shadow-2xs">Active since ${escape(sessionActiveSince)}</div></div></div></div></div></div>  <div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative group overflow-hidden"><div class="bg-white rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-7 space-y-6 border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100"><div class="flex items-center gap-3.5"><div class="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">${validate_component(Server, "Server").$$render($$result, { class: "w-5.5 h-5.5" }, {}, {})}</div> <div data-svelte-h="svelte-1axc2ah"><h3 class="font-bold text-slate-900 text-base">Mail Dispatch Infrastructure</h3> <p class="text-xs text-slate-500">Configured SMTP mail servers connected to this account</p></div></div> <a href="/configs" class="inline-flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-indigo-500/20 active:scale-95 group/btn shrink-0"><span data-svelte-h="svelte-bk26ft">Manage SMTP Servers</span> <div class="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-white group-hover/btn:translate-x-0.5 transition-transform">${validate_component(Arrow_right, "ArrowRight").$$render($$result, { class: "w-3.5 h-3.5" }, {}, {})}</div></a></div>  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-2"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono" data-svelte-h="svelte-2crpv4">Primary Sending Channel</p> ${defaultConfig ? `<p class="text-sm font-bold text-slate-900 truncate"${add_attribute("title", defaultConfig.name, 0)}>${escape(defaultConfig.name)}</p> <p class="text-xs text-indigo-600 font-mono truncate">${escape(defaultConfig.fromEmail)}</p>` : `${$configsStore.length > 0 ? `<p class="text-sm font-bold text-slate-900 truncate">${escape($configsStore[0].name)}</p> <p class="text-xs text-indigo-600 font-mono truncate">${escape($configsStore[0].fromEmail)}</p>` : `<p class="text-xs font-semibold text-slate-500 italic" data-svelte-h="svelte-1uhq6ml">No SMTP servers configured yet</p>`}`}</div> <div class="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-2"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono" data-svelte-h="svelte-1ami682">System Dispatch Capacity</p> <p class="text-sm font-bold text-slate-900">${escape($configsStore.length)} Configured ${escape($configsStore.length === 1 ? "Channel" : "Channels")}</p> <p class="text-xs text-emerald-600 font-semibold flex items-center gap-1">${validate_component(Shield_check, "ShieldCheck").$$render($$result, { class: "w-3.5 h-3.5" }, {}, {})}
									TLS 1.3 Encryption Ready</p></div></div></div></div></div>  <div class="lg:col-span-1 space-y-6"> <div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-emerald-900/[0.03] border border-emerald-200/70 hover:border-emerald-400/80 hover:ring-1 hover:ring-emerald-400/20 shadow-md hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 relative group overflow-hidden h-full flex flex-col justify-between"><div class="bg-white rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-7 space-y-6 border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] flex-1 flex flex-col justify-between"><div class="space-y-6"> <div class="space-y-3 pb-5 border-b border-slate-100"><div class="flex items-center justify-between"><div class="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 inline-block shadow-2xs">${validate_component(Shield_check, "ShieldCheck").$$render($$result, { class: "w-6 h-6" }, {}, {})}</div> <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200" data-svelte-h="svelte-19h7b7q"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
										100% Protected</span></div> <div data-svelte-h="svelte-1oweqea"><h3 class="font-bold text-slate-900 text-lg tracking-tight">Security Protocols</h3> <p class="text-xs text-slate-500 mt-1 leading-relaxed">Your account session is encrypted and protected using HTTP-Only cookies with HMAC signatures. Password values are hashed with argon2 before saving in SQLite.</p></div></div>  <div class="space-y-3.5"> <div class="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-indigo-200 transition-colors flex items-start gap-3"><div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">${validate_component(Lock, "Lock").$$render($$result, { class: "w-4 h-4" }, {}, {})}</div> <div class="text-xs" data-svelte-h="svelte-1t34zd9"><h4 class="font-bold text-slate-800">Session Cookie Protection</h4> <p class="text-slate-500 text-[11px] leading-normal mt-0.5">HTTP-Only cookies with HMAC SHA-256 signatures prevent XSS token theft.</p></div></div>  <div class="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-violet-200 transition-colors flex items-start gap-3"><div class="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center shrink-0 mt-0.5">${validate_component(Key, "Key").$$render($$result, { class: "w-4 h-4" }, {}, {})}</div> <div class="text-xs" data-svelte-h="svelte-1ya0sks"><h4 class="font-bold text-slate-800">Argon2id Hashing</h4> <p class="text-slate-500 text-[11px] leading-normal mt-0.5">Credentials hashed via Argon2id algorithm before database persistent store.</p></div></div>  <div class="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-emerald-200 transition-colors flex items-start gap-3"><div class="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">${validate_component(Database, "Database").$$render($$result, { class: "w-4 h-4" }, {}, {})}</div> <div class="text-xs" data-svelte-h="svelte-1jat563"><h4 class="font-bold text-slate-800">SQLite Database Safety</h4> <p class="text-slate-500 text-[11px] leading-normal mt-0.5">Prepared SQL statements protect against query parameter injection attacks.</p></div></div></div></div>  <div class="pt-4 border-t border-slate-100 mt-6"><div class="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-sm flex items-center gap-3.5"><div class="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">${validate_component(Cpu, "Cpu").$$render($$result, { class: "w-5 h-5 text-indigo-300" }, {}, {})}</div> <div class="min-w-0 flex-1" data-svelte-h="svelte-1np2tek"><div class="flex items-center justify-between"><span class="text-xs font-bold text-white">SQLite Engine</span> <span class="text-[10px] font-mono text-emerald-400 font-semibold">ONLINE</span></div> <p class="text-[11px] text-slate-300 truncate mt-0.5">Encrypted session checks &amp; prepared queries</p></div></div></div></div></div></div></div>` : ``}</div>`;
});
export {
  Page as default
};
