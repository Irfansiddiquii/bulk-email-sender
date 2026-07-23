import { c as create_ssr_component, v as validate_component, s as subscribe, e as escape, d as add_attribute } from "./ssr.js";
import { a as authStore } from "./authStore.js";
import { I as Icon } from "./Icon.js";
import { B as Bell } from "./bell.js";
const Chevron_down = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "m6 9 6 6 6-6" }]];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "chevron-down" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Refresh_cw = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
      }
    ],
    ["path", { "d": "M21 3v5h-5" }],
    [
      "path",
      {
        "d": "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
      }
    ],
    ["path", { "d": "M8 16H3v5" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "refresh-cw" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Search = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "11", "cy": "11", "r": "8" }],
    ["path", { "d": "m21 21-4.3-4.3" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "search" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let formattedLastUpdated;
  let $authStore, $$unsubscribe_authStore;
  $$unsubscribe_authStore = subscribe(authStore, (value) => $authStore = value);
  let { title = "" } = $$props;
  let { subtitle = "" } = $$props;
  let { lastUpdated = "" } = $$props;
  let { onRefresh = void 0 } = $$props;
  let searchQuery = "";
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.subtitle === void 0 && $$bindings.subtitle && subtitle !== void 0) $$bindings.subtitle(subtitle);
  if ($$props.lastUpdated === void 0 && $$bindings.lastUpdated && lastUpdated !== void 0) $$bindings.lastUpdated(lastUpdated);
  if ($$props.onRefresh === void 0 && $$bindings.onRefresh && onRefresh !== void 0) $$bindings.onRefresh(onRefresh);
  formattedLastUpdated = lastUpdated ? lastUpdated.replace(/(\d{1,2}:\d{2}):\d{2}/, "$1") : "";
  $$unsubscribe_authStore();
  return ` <div class="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl px-4 py-3.5 sm:px-6 sm:py-4 shadow-xs mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none relative z-10 max-w-full overflow-hidden"> <div class="flex items-center gap-3 shrink-0 min-w-0"><div class="w-1 h-8 rounded-full bg-indigo-600 shrink-0"></div> <div class="min-w-0 flex flex-col justify-center"><h1 class="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 leading-snug truncate">${escape(title)}</h1> ${subtitle ? `<p class="text-xs text-slate-500 font-normal leading-normal truncate max-w-xs sm:max-w-md">${escape(subtitle)}</p>` : ``}</div></div>  <div class="p-1.5 rounded-xl bg-slate-100/70 border border-slate-200/80 flex items-center gap-2 sm:gap-2.5 shrink-0 self-start md:self-auto max-w-full"> <div class="relative flex items-center h-9 group shrink-0">${validate_component(Search, "Search").$$render(
    $$result,
    {
      class: "w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 absolute left-3 pointer-events-none transition-colors duration-150"
    },
    {},
    {}
  )} <input type="text" placeholder="Search..." aria-label="Quick search" class="h-9 w-28 sm:w-36 md:w-44 lg:w-48 pl-9 pr-7 bg-white hover:bg-white focus:bg-white border border-slate-200/80 focus:border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 shadow-2xs transition-all duration-150"${add_attribute("value", searchQuery, 0)}> <kbd class="hidden sm:inline-block absolute right-2 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-400 bg-slate-50 border border-slate-200/80 pointer-events-none" data-svelte-h="svelte-1cw7wfv">⌘K</kbd></div>  ${formattedLastUpdated || onRefresh ? `<div class="h-4 w-px bg-slate-200/80 shrink-0"></div> <div class="h-9 px-2.5 rounded-lg bg-white border border-slate-200/80 flex items-center gap-2 shrink-0 shadow-2xs">${formattedLastUpdated ? `<div class="flex items-center gap-1.5 text-xs text-slate-600 font-medium"><span class="relative flex h-2 w-2 shrink-0" data-svelte-h="svelte-tkmp19"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span> <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span> <span class="font-mono text-[10px] sm:text-[11px] text-slate-600 truncate">Live • ${escape(formattedLastUpdated)}</span></div>` : ``} ${onRefresh ? `<button title="Refresh data" class="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200/60 transition-all duration-150 shrink-0">${validate_component(Refresh_cw, "RefreshCw").$$render(
    $$result,
    {
      class: "w-3.5 h-3.5 "
    },
    {},
    {}
  )}</button>` : ``}</div>` : ``}  <div class="h-4 w-px bg-slate-200/80 shrink-0"></div>  <a href="/notifications" title="Notifications" class="h-9 w-9 rounded-lg bg-white border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-all duration-150 flex items-center justify-center relative shrink-0 shadow-2xs">${validate_component(Bell, "Bell").$$render($$result, { class: "w-4 h-4" }, {}, {})} <span class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-600 ring-2 ring-white"></span></a>  ${$authStore?.user ? `<div class="h-4 w-px bg-slate-200/80 shrink-0"></div> <a href="/profile" title="My Account" class="h-9 flex items-center gap-2 pl-1.5 pr-2.5 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 active:bg-slate-100 transition-all duration-150 shrink-0 shadow-2xs"><div class="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white shrink-0">${escape($authStore.user.name ? $authStore.user.name.charAt(0).toUpperCase() : "U")}</div> <div class="hidden sm:flex flex-col text-left leading-tight"><span class="text-xs font-medium text-slate-800 max-w-[90px] truncate">${escape($authStore.user.name)}</span></div> ${validate_component(Chevron_down, "ChevronDown").$$render(
    $$result,
    {
      class: "w-3.5 h-3.5 text-slate-400 shrink-0"
    },
    {},
    {}
  )}</a>` : ``}</div></div>`;
});
export {
  Chevron_down as C,
  Header as H,
  Refresh_cw as R,
  Search as S
};
