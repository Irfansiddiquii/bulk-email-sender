import { c as create_ssr_component, v as validate_component, s as subscribe, b as each, e as escape, d as add_attribute, m as missing_component } from "../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { a as authStore } from "../../../chunks/authStore.js";
import { p as page } from "../../../chunks/stores.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { M as Mail } from "../../../chunks/mail.js";
import { U as User } from "../../../chunks/user.js";
import { S as Send } from "../../../chunks/send.js";
import { U as Users } from "../../../chunks/users.js";
import { F as File_text } from "../../../chunks/file-text.js";
import { C as Calendar } from "../../../chunks/calendar.js";
import { B as Bell } from "../../../chunks/bell.js";
function goto(url, opts = {}) {
  {
    throw new Error("Cannot call goto(...) on the server");
  }
}
const History = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      }
    ],
    ["path", { "d": "M3 3v5h5" }],
    ["path", { "d": "M12 7v5l4 2" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "history" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Layout_dashboard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "rect",
      {
        "width": "7",
        "height": "9",
        "x": "3",
        "y": "3",
        "rx": "1"
      }
    ],
    [
      "rect",
      {
        "width": "7",
        "height": "5",
        "x": "14",
        "y": "3",
        "rx": "1"
      }
    ],
    [
      "rect",
      {
        "width": "7",
        "height": "9",
        "x": "14",
        "y": "12",
        "rx": "1"
      }
    ],
    [
      "rect",
      {
        "width": "7",
        "height": "5",
        "x": "3",
        "y": "16",
        "rx": "1"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "layout-dashboard" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Log_out = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
      }
    ],
    ["polyline", { "points": "16 17 21 12 16 7" }],
    [
      "line",
      {
        "x1": "21",
        "x2": "9",
        "y1": "12",
        "y2": "12"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "log-out" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Menu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "12",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "6",
        "y2": "6"
      }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "18",
        "y2": "18"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "menu" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Settings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      }
    ],
    ["circle", { "cx": "12", "cy": "12", "r": "3" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "settings" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Sidebar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $authStore, $$unsubscribe_authStore;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_authStore = subscribe(authStore, (value) => $authStore = value);
  const menuGroups = [
    {
      title: "Overview",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: Layout_dashboard
        },
        {
          name: "Compose Campaign",
          path: "/compose",
          icon: Send
        },
        {
          name: "History Logs",
          path: "/history",
          icon: History
        }
      ]
    },
    {
      title: "Management",
      items: [
        {
          name: "Contact Manager",
          path: "/contacts",
          icon: Users
        },
        {
          name: "Templates Store",
          path: "/templates",
          icon: File_text
        },
        {
          name: "Active Scheduler",
          path: "/scheduler",
          icon: Calendar
        }
      ]
    },
    {
      title: "System & Profile",
      items: [
        {
          name: "Alert Notification",
          path: "/notifications",
          icon: Bell
        },
        {
          name: "SMTP Configurations",
          path: "/configs",
          icon: Settings
        },
        {
          name: "My Profile",
          path: "/profile",
          icon: User
        }
      ]
    }
  ];
  $$unsubscribe_page();
  $$unsubscribe_authStore();
  return `<aside class="hidden md:flex flex-col w-64 bg-[#0A0E17] text-slate-300 shrink-0 border-r border-slate-800/60 h-screen sticky top-0 relative z-20 shadow-[1px_0_16px_rgba(0,0,0,0.3)] select-none font-sans"> <div class="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.03] via-transparent to-transparent pointer-events-none"></div>  <div class="px-5 py-4 border-b border-slate-800/60 flex items-center justify-between gap-3 relative z-10"><div class="flex items-center gap-3 min-w-0"> <div class="p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] shrink-0 transition-transform duration-300 hover:scale-105"> <div class="p-1.5 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 rounded-lg flex items-center justify-center shadow-[0_2px_8px_rgba(99,102,241,0.35)]">${validate_component(Mail, "Mail").$$render($$result, { class: "w-4 h-4 text-white" }, {}, {})}</div></div> <div class="min-w-0" data-svelte-h="svelte-1ygs8b3"><h1 class="font-semibold text-sm leading-tight tracking-tight text-white truncate">Bulk Email Sender</h1> <span class="text-[10px] text-slate-400 font-medium tracking-wider uppercase block mt-0.5 opacity-80">Enterprise SaaS</span></div></div> <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase shrink-0" data-svelte-h="svelte-1spd6sr">PRO</span></div>  <nav class="flex-grow px-3 py-3 space-y-4 overflow-y-auto relative z-10">${each(menuGroups, (group) => {
    return `<div><div class="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-mono">${escape(group.title)}</div> <div class="space-y-0.5">${each(group.items, (item) => {
      let isActive = $page.url.pathname === item.path;
      return ` <a${add_attribute("href", item.path, 0)} class="${"flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group relative " + escape(
        isActive ? "bg-indigo-500/10 text-white font-semibold border border-indigo-500/20 shadow-[0_1px_8px_rgba(99,102,241,0.12)]" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent",
        true
      )}">${isActive ? `<div class="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>` : ``} ${validate_component(item.icon || missing_component, "svelte:component").$$render(
        $$result,
        {
          class: "w-4 h-4 shrink-0 transition-colors duration-200 " + (isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200")
        },
        {},
        {}
      )} <span class="truncate">${escape(item.name)}</span> </a>`;
    })}</div> </div>`;
  })}</nav>  <div class="p-3 border-t border-slate-800/60 bg-[#070A10]/60 relative z-10"><div class="p-2.5 rounded-xl border border-slate-800/80 bg-slate-900/40 flex items-center justify-between gap-2.5 transition-all duration-200 hover:border-slate-700/80 hover:bg-slate-900/60">${$authStore.user ? `<div class="flex items-center gap-2.5 min-w-0"> <div class="relative shrink-0"><div class="p-0.5 bg-white/[0.04] border border-white/[0.08] rounded-lg"><div class="w-7 h-7 rounded-[6px] bg-indigo-950/80 border border-indigo-500/20 flex items-center justify-center">${validate_component(User, "User").$$render($$result, { class: "w-3.5 h-3.5 text-indigo-300" }, {}, {})}</div></div> <span class="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#070A10]"></span></div> <div class="min-w-0"><p class="font-semibold text-xs text-slate-200 truncate leading-none">${escape($authStore.user.name)}</p> <p class="text-[10px] text-slate-400 truncate mt-1 leading-none font-normal">${escape($authStore.user.email)}</p></div></div>` : ``} <button title="Log Out" class="p-1.5 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg text-slate-400 hover:text-rose-400 transition-all duration-200 active:scale-95 shrink-0">${validate_component(Log_out, "LogOut").$$render($$result, { class: "w-3.5 h-3.5" }, {}, {})}</button></div></div></aside>`;
});
const Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_page;
  let $$unsubscribe_authStore;
  $$unsubscribe_page = subscribe(page, (value) => value);
  $$unsubscribe_authStore = subscribe(authStore, (value) => value);
  $$unsubscribe_page();
  $$unsubscribe_authStore();
  return `<header class="md:hidden bg-[#090d16] text-white flex items-center justify-between px-5 py-4 border-b border-slate-900 sticky top-0 z-50 shadow-lg shrink-0"><div class="flex items-center gap-2.5"><div class="p-1.5 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center">${validate_component(Mail, "Mail").$$render($$result, { class: "w-4.5 h-4.5 text-white" }, {}, {})}</div> <span class="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent" data-svelte-h="svelte-8eydu9">Bulk Email Sender</span></div> <button class="p-2 hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded-xl transition-all duration-300 active:scale-90" aria-label="Toggle Menu">${`${validate_component(Menu, "Menu").$$render($$result, { class: "w-5 h-5 text-slate-300" }, {}, {})}`}</button></header> ${``}`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $authStore, $$unsubscribe_authStore;
  $$unsubscribe_authStore = subscribe(authStore, (value) => $authStore = value);
  {
    if (!$authStore.user) {
      goto();
    }
  }
  $$unsubscribe_authStore();
  return `${$authStore.user ? `<div class="h-screen max-h-screen w-full bg-slate-50/60 flex flex-col md:flex-row text-slate-800 relative overflow-hidden font-sans"> <div class="absolute inset-0 pointer-events-none opacity-40 select-none z-0" data-svelte-h="svelte-3twrn9"><div class="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-[120px]"></div> <div class="absolute -top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-secondary/10 to-transparent blur-[120px]"></div></div>  ${validate_component(Sidebar, "Sidebar").$$render($$result, {}, {}, {})}  ${validate_component(Navbar, "Navbar").$$render($$result, {}, {}, {})}  <main class="flex-grow h-full overflow-y-auto w-full relative z-10"><div class="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 md:py-8 max-w-7xl mx-auto w-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">${slots.default ? slots.default({}) : ``}</div></main></div>` : ``}`;
});
export {
  Layout as default
};
