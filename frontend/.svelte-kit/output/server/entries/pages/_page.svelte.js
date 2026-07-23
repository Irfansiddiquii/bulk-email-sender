import { c as create_ssr_component, s as subscribe } from "../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
import { a as authStore } from "../../chunks/authStore.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_authStore;
  $$unsubscribe_authStore = subscribe(authStore, (value) => value);
  $$unsubscribe_authStore();
  return `<div class="min-h-screen flex items-center justify-center bg-slate-50" data-svelte-h="svelte-1qvefrf"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>`;
});
export {
  Page as default
};
