import { c as create_ssr_component, v as validate_component, s as subscribe, b as each, e as escape } from "../../chunks/ssr.js";
import "../../chunks/authStore.js";
import { I as Icon, t as toastStore } from "../../chunks/Icon.js";
import { A as Alert_triangle } from "../../chunks/alert-triangle.js";
import { X } from "../../chunks/x.js";
const Alert_circle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    [
      "line",
      {
        "x1": "12",
        "x2": "12",
        "y1": "8",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "12.01",
        "y1": "16",
        "y2": "16"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "alert-circle" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Check_circle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M22 11.08V12a10 10 0 1 1-5.93-9.14"
      }
    ],
    ["path", { "d": "m9 11 3 3L22 4" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "check-circle" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Info = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "M12 16v-4" }],
    ["path", { "d": "M12 8h.01" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "info" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Toast = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $toastStore, $$unsubscribe_toastStore;
  $$unsubscribe_toastStore = subscribe(toastStore, (value) => $toastStore = value);
  $$unsubscribe_toastStore();
  return `<div class="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none select-none">${each($toastStore, (toast) => {
    return `<div class="${"p-4 rounded-2xl border text-sm font-semibold flex items-start gap-3 pointer-events-auto backdrop-blur-lg shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] transition-all duration-300 " + escape(
      toast.type === "success" ? "bg-emerald-50/90 border-emerald-250 text-emerald-900" : "",
      true
    ) + " " + escape(
      toast.type === "danger" ? "bg-rose-50/90 border-rose-250 text-rose-900" : "",
      true
    ) + " " + escape(
      toast.type === "info" ? "bg-blue-50/90 border-blue-250 text-blue-900" : "",
      true
    ) + " " + escape(
      toast.type === "warning" ? "bg-amber-50/90 border-amber-250 text-amber-900" : "",
      true
    )}"> <div class="shrink-0 mt-0.5">${toast.type === "success" ? `${validate_component(Check_circle, "CheckCircle").$$render($$result, { class: "w-4.5 h-4.5 text-emerald-600" }, {}, {})}` : `${toast.type === "danger" ? `${validate_component(Alert_circle, "AlertCircle").$$render($$result, { class: "w-4.5 h-4.5 text-rose-600" }, {}, {})}` : `${toast.type === "warning" ? `${validate_component(Alert_triangle, "AlertTriangle").$$render($$result, { class: "w-4.5 h-4.5 text-amber-600" }, {}, {})}` : `${validate_component(Info, "Info").$$render($$result, { class: "w-4.5 h-4.5 text-blue-600" }, {}, {})}`}`}`}</div> <div class="flex-grow leading-relaxed font-medium">${escape(toast.message)}</div> <button class="text-slate-400 hover:text-slate-650 transition-colors shrink-0 mt-0.5 p-0.5 hover:bg-slate-100 rounded-lg" aria-label="Close message">${validate_component(X, "X").$$render($$result, { class: "w-3.5 h-3.5" }, {}, {})}</button> </div>`;
  })}</div>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${`<div class="fixed inset-0 flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans" data-svelte-h="svelte-1mvvxwl"><div class="absolute inset-0 pointer-events-none opacity-30 select-none z-0"><div class="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-[120px]"></div> <div class="absolute -top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-secondary/10 to-transparent blur-[120px]"></div></div> <div class="flex flex-col items-center relative z-10 select-none"><div class="w-12 h-12 rounded-full border-4 border-slate-100 border-t-primary animate-spin"></div> <p class="mt-4 text-slate-500 text-sm font-semibold uppercase tracking-wider animate-pulse">Initializing Application...</p></div></div>`}  ${validate_component(Toast, "Toast").$$render($$result, {}, {}, {})}`;
});
export {
  Layout as default
};
