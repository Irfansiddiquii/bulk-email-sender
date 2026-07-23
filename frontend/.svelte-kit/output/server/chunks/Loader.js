import { c as create_ssr_component, f as createEventDispatcher, e as escape, v as validate_component, h as compute_slots } from "./ssr.js";
import { X } from "./x.js";
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$slots = compute_slots(slots);
  let { show = false } = $$props;
  let { title = "Modal Title" } = $$props;
  let { size = "md" } = $$props;
  createEventDispatcher();
  if ($$props.show === void 0 && $$bindings.show && show !== void 0) $$bindings.show(show);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  return `${show ? `<div class="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4"><div class="${[
    "bg-white rounded-[2.25rem] shadow-2xl shadow-slate-950/30 w-full overflow-hidden border border-indigo-200/80 max-h-[90vh] flex flex-col transition-all transform scale-100 relative",
    (size === "sm" ? "max-w-sm" : "") + " " + (size === "md" ? "max-w-md" : "") + " " + (size === "lg" ? "max-w-lg" : "") + " " + (size === "xl" ? "max-w-2xl" : "")
  ].join(" ").trim()}"> <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0"><h3 class="font-bold text-slate-800 text-base">${escape(title)}</h3> <button class="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">${validate_component(X, "X").$$render($$result, { class: "w-5 h-5" }, {}, {})}</button></div>  <div class="p-6 overflow-y-auto flex-grow text-sm text-slate-600">${slots.default ? slots.default({}) : ``}</div>  ${$$slots.footer ? `<div class="p-5 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end gap-2.5 text-xs">${slots.footer ? slots.footer({}) : ``}</div>` : ``}</div></div>` : ``}`;
});
const Loader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { visible = false } = $$props;
  let { text = "Processing..." } = $$props;
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0) $$bindings.visible(visible);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0) $$bindings.text(text);
  return `${visible ? `<div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998] flex items-center justify-center transition-opacity"><div class="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center max-w-xs w-full border border-slate-100"><div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div> <p class="mt-4 text-sm font-semibold text-slate-700 text-center">${escape(text)}</p></div></div>` : ``}`;
});
export {
  Loader as L,
  Modal as M
};
