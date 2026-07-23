import { c as create_ssr_component, v as validate_component, d as add_attribute } from "../../../../chunks/ssr.js";
import { H as Header } from "../../../../chunks/Header.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { S as Shield } from "../../../../chunks/shield.js";
const Save = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
      }
    ],
    ["polyline", { "points": "17 21 17 13 7 13 7 21" }],
    ["polyline", { "points": "7 3 7 8 15 8" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "save" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Sliders = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "line",
      {
        "x1": "4",
        "x2": "4",
        "y1": "21",
        "y2": "14"
      }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "4",
        "y1": "10",
        "y2": "3"
      }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "12",
        "y1": "21",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "12",
        "y1": "8",
        "y2": "3"
      }
    ],
    [
      "line",
      {
        "x1": "20",
        "x2": "20",
        "y1": "21",
        "y2": "16"
      }
    ],
    [
      "line",
      {
        "x1": "20",
        "x2": "20",
        "y1": "12",
        "y2": "3"
      }
    ],
    [
      "line",
      {
        "x1": "2",
        "x2": "6",
        "y1": "14",
        "y2": "14"
      }
    ],
    [
      "line",
      {
        "x1": "10",
        "x2": "14",
        "y1": "8",
        "y2": "8"
      }
    ],
    [
      "line",
      {
        "x1": "18",
        "x2": "22",
        "y1": "16",
        "y2": "16"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "sliders" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Zap = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "polygon",
      {
        "points": "13 2 3 14 12 14 11 22 21 10 12 10 13 2"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "zap" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let rateLimit = 100;
  let enableAnalytics = true;
  let autoSaveDrafts = true;
  return `<div class="space-y-6 sm:space-y-8 w-full"> ${validate_component(Header, "Header").$$render(
    $$result,
    {
      title: "Account & System Settings",
      subtitle: "Configure system options, default rate limits, and application preferences"
    },
    {},
    {}
  )} <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> <div class="md:col-span-2 space-y-6"> <div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md transition-all duration-300 relative overflow-hidden group"><div class="bg-white border border-slate-100/90 rounded-[calc(2.25rem-0.5rem)] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-6"><div class="flex items-center gap-3 border-b border-slate-100 pb-4"><div class="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">${validate_component(Zap, "Zap").$$render($$result, { class: "w-4.5 h-4.5" }, {}, {})}</div> <div data-svelte-h="svelte-14d1nmi"><h3 class="font-bold text-slate-900 text-sm">Campaign Dispatch Controls</h3> <p class="text-xs text-slate-500">Fine-tune sending rates and automated safety constraints.</p></div></div> <div class="space-y-5"><div><label for="rate-limit" class="block text-xs font-semibold text-slate-700 mb-1.5" data-svelte-h="svelte-a1wci9">Default Batch Rate Limit (emails / minute)</label> <input id="rate-limit" type="number" min="10" max="1000" class="w-full sm:w-64 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all"${add_attribute("value", rateLimit, 0)}></div> <div><label for="retry-attempts" class="block text-xs font-semibold text-slate-700 mb-1.5" data-svelte-h="svelte-yvord2">Failed Delivery Retry Attempts</label> <select id="retry-attempts" class="w-full sm:w-64 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all bg-white"><option${add_attribute("value", 1, 0)} data-svelte-h="svelte-y8tuis">1 Retry</option><option${add_attribute("value", 3, 0)} data-svelte-h="svelte-ihkt6e">3 Retries (Recommended)</option><option${add_attribute("value", 5, 0)} data-svelte-h="svelte-1fdbhck">5 Retries</option></select></div></div></div></div>  <div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md transition-all duration-300 relative overflow-hidden group"><div class="bg-white border border-slate-100/90 rounded-[calc(2.25rem-0.5rem)] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-6"><div class="flex items-center gap-3 border-b border-slate-100 pb-4"><div class="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">${validate_component(Sliders, "Sliders").$$render($$result, { class: "w-4.5 h-4.5" }, {}, {})}</div> <div data-svelte-h="svelte-826s3"><h3 class="font-bold text-slate-900 text-sm">General Preferences</h3> <p class="text-xs text-slate-500">System behaviors and tracking preferences.</p></div></div> <div class="space-y-4"><label class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer"><div class="space-y-0.5" data-svelte-h="svelte-1dxfxa5"><span class="text-xs sm:text-sm font-semibold text-slate-800">Enable Open &amp; Click Analytics</span> <p class="text-[11px] text-slate-400">Track delivery telemetry for campaign reporting.</p></div> <input type="checkbox" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"${add_attribute("checked", enableAnalytics, 1)}></label> <label class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer"><div class="space-y-0.5" data-svelte-h="svelte-15oe178"><span class="text-xs sm:text-sm font-semibold text-slate-800">Auto-save Campaign Drafts</span> <p class="text-[11px] text-slate-400">Automatically save draft emails while composing.</p></div> <input type="checkbox" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"${add_attribute("checked", autoSaveDrafts, 1)}></label></div></div></div>  <div class="flex justify-end"><button type="button" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm shadow-indigo-600/20 transition-all flex items-center gap-2">${validate_component(Save, "Save").$$render($$result, { class: "w-4 h-4" }, {}, {})}
					Save Preferences</button></div></div>  <div class="space-y-6"><div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/30 hover:border-indigo-400/50 shadow-md transition-all duration-300 relative overflow-hidden group"><div class="p-6 rounded-[calc(2.25rem-0.5rem)] text-white space-y-4 relative overflow-hidden"><div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl pointer-events-none"></div> <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">${validate_component(Shield, "Shield").$$render($$result, { class: "w-4 h-4 text-indigo-200" }, {}, {})}</div> <h4 class="font-bold text-sm" data-svelte-h="svelte-vcacbz">System Security</h4></div> <p class="text-xs text-indigo-200 leading-relaxed" data-svelte-h="svelte-n24c0r">All credentials and SMTP server keys are encrypted at rest using AES-256 standards.</p></div></div></div></div></div>`;
});
export {
  Page as default
};
