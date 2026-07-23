import { c as create_ssr_component, f as createEventDispatcher, o as onDestroy, d as add_attribute, s as subscribe, v as validate_component, b as each, e as escape } from "../../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { c as configsStore } from "../../../../chunks/configsStore.js";
import "../../../../chunks/Icon.js";
import "../../../../chunks/authStore.js";
import "@tiptap/starter-kit";
import "@tiptap/extension-placeholder";
/* empty css                                                           */
import { H as Header } from "../../../../chunks/Header.js";
import { M as Modal, L as Loader } from "../../../../chunks/Loader.js";
import { A as Alert_triangle } from "../../../../chunks/alert-triangle.js";
import { F as File_spreadsheet } from "../../../../chunks/file-spreadsheet.js";
import { F as File_text } from "../../../../chunks/file-text.js";
import { E as Eye } from "../../../../chunks/eye.js";
import { S as Send } from "../../../../chunks/send.js";
const css = {
  code: ".tiptap p.is-editor-empty:first-child::before{content:attr(data-placeholder);float:left;color:#94a3b8;pointer-events:none;height:0}.tiptap{min-height:250px}",
  map: `{"version":3,"file":"EmailEditor.svelte","sources":["EmailEditor.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { onMount, onDestroy } from \\"svelte\\";\\nimport { Editor } from \\"@tiptap/core\\";\\nimport StarterKit from \\"@tiptap/starter-kit\\";\\nimport Placeholder from \\"@tiptap/extension-placeholder\\";\\nimport { createEventDispatcher } from \\"svelte\\";\\nexport let value = \\"\\";\\nexport let placeholder = \\"Write email content here...\\";\\nconst dispatch = createEventDispatcher();\\nlet element;\\nlet editor;\\nonMount(() => {\\n  editor = new Editor({\\n    element,\\n    extensions: [\\n      StarterKit,\\n      Placeholder.configure({\\n        placeholder\\n      })\\n    ],\\n    content: value,\\n    onUpdate: ({ editor: editor2 }) => {\\n      value = editor2.getHTML();\\n      dispatch(\\"change\\", value);\\n    },\\n    editorProps: {\\n      attributes: {\\n        class: \\"prose prose-sm max-w-none focus:outline-none min-h-[250px] p-4 text-slate-800\\"\\n      }\\n    }\\n  });\\n});\\nonDestroy(() => {\\n  if (editor) {\\n    editor.destroy();\\n  }\\n});\\n$: if (editor && value !== editor.getHTML()) {\\n  editor.commands.setContent(value);\\n}\\n<\/script>\\n\\n<div class=\\"border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all\\">\\n\\t<!-- Simple Toolbar -->\\n\\t{#if editor}\\n\\t\\t<div class=\\"bg-slate-50 border-b border-slate-100 p-2 flex flex-wrap gap-1\\">\\n\\t\\t\\t<button \\n\\t\\t\\t\\ttype=\\"button\\"\\n\\t\\t\\t\\ton:click={() => editor.chain().focus().toggleBold().run()}\\n\\t\\t\\t\\tclass=\\"p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors font-bold text-xs\\"\\n\\t\\t\\t\\tclass:bg-slate-200={editor.isActive('bold')}\\n\\t\\t\\t>\\n\\t\\t\\t\\tBold\\n\\t\\t\\t</button>\\n\\t\\t\\t<button \\n\\t\\t\\t\\ttype=\\"button\\"\\n\\t\\t\\t\\ton:click={() => editor.chain().focus().toggleItalic().run()}\\n\\t\\t\\t\\tclass=\\"p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors italic text-xs\\"\\n\\t\\t\\t\\tclass:bg-slate-200={editor.isActive('italic')}\\n\\t\\t\\t>\\n\\t\\t\\t\\tItalic\\n\\t\\t\\t</button>\\n\\t\\t\\t<button \\n\\t\\t\\t\\ttype=\\"button\\"\\n\\t\\t\\t\\ton:click={() => editor.chain().focus().toggleStrike().run()}\\n\\t\\t\\t\\tclass=\\"p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors line-through text-xs\\"\\n\\t\\t\\t\\tclass:bg-slate-200={editor.isActive('strike')}\\n\\t\\t\\t>\\n\\t\\t\\t\\tStrike\\n\\t\\t\\t</button>\\n\\t\\t\\t<div class=\\"w-px h-5 bg-slate-200 mx-1 align-middle self-center\\"></div>\\n\\t\\t\\t<button \\n\\t\\t\\t\\ttype=\\"button\\"\\n\\t\\t\\t\\ton:click={() => editor.chain().focus().toggleBulletList().run()}\\n\\t\\t\\t\\tclass=\\"p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors text-xs\\"\\n\\t\\t\\t\\tclass:bg-slate-200={editor.isActive('bulletList')}\\n\\t\\t\\t>\\n\\t\\t\\t\\tBullet List\\n\\t\\t\\t</button>\\n\\t\\t\\t<button \\n\\t\\t\\t\\ttype=\\"button\\"\\n\\t\\t\\t\\ton:click={() => editor.chain().focus().toggleOrderedList().run()}\\n\\t\\t\\t\\tclass=\\"p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors text-xs\\"\\n\\t\\t\\t\\tclass:bg-slate-200={editor.isActive('orderedList')}\\n\\t\\t\\t>\\n\\t\\t\\t\\tNumbered List\\n\\t\\t\\t</button>\\n\\t\\t\\t<div class=\\"w-px h-5 bg-slate-200 mx-1 align-middle self-center\\"></div>\\n\\t\\t\\t<button \\n\\t\\t\\t\\ttype=\\"button\\"\\n\\t\\t\\t\\ton:click={() => editor.chain().focus().clearNodes().run()}\\n\\t\\t\\t\\tclass=\\"p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors text-xs\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\tClean Formatting\\n\\t\\t\\t</button>\\n\\t\\t</div>\\n\\t{/if}\\n\\t<div bind:this={element}></div>\\n</div>\\n\\n<style>\\n\\t:global(.tiptap p.is-editor-empty:first-child::before) {\\n\\t\\tcontent: attr(data-placeholder);\\n\\t\\tfloat: left;\\n\\t\\tcolor: #94a3b8;\\n\\t\\tpointer-events: none;\\n\\t\\theight: 0;\\n\\t}\\n\\t:global(.tiptap) {\\n\\t\\tmin-height: 250px;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAoGS,6CAA+C,CACtD,OAAO,CAAE,KAAK,gBAAgB,CAAC,CAC/B,KAAK,CAAE,IAAI,CACX,KAAK,CAAE,OAAO,CACd,cAAc,CAAE,IAAI,CACpB,MAAM,CAAE,CACT,CACQ,OAAS,CAChB,UAAU,CAAE,KACb"}`
};
const EmailEditor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { value = "" } = $$props;
  let { placeholder = "Write email content here..." } = $$props;
  createEventDispatcher();
  let element;
  onDestroy(() => {
  });
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  $$result.css.add(css);
  return `<div class="border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all"> ${``} <div${add_attribute("this", element, 0)}></div> </div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selectedConfig;
  let $$unsubscribe_configsStore;
  $$unsubscribe_configsStore = subscribe(configsStore, (value) => value);
  let loading = false;
  let configurations = [];
  let selectedConfigId = "";
  let templates = [];
  let subject = "";
  let htmlContent = "";
  let delay = 20;
  let columns = [];
  let useBatch = false;
  let scheduleEmail = false;
  let showPreviewModal = false;
  let previewSubjectText = "";
  let previewContentHTML = "";
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    selectedConfig = configurations.find((c) => c.id === selectedConfigId);
    selectedConfig?.host?.toLowerCase().includes("gmail");
    selectedConfig?.host?.toLowerCase().includes("outlook") || selectedConfig?.host?.toLowerCase().includes("hotmail");
    $$rendered = `<div class="space-y-6 sm:space-y-8 w-full"> ${validate_component(Header, "Header").$$render(
      $$result,
      {
        title: "Compose Email Campaign",
        subtitle: "Design your newsletter and dispatch to your subscriber database"
      },
      {},
      {}
    )} ${configurations.length === 0 ? `<div class="p-1 bg-slate-900/[0.03] border border-slate-200/60 rounded-[2rem] shadow-soft max-w-xl mx-auto my-8"><div class="bg-white border border-slate-100/80 rounded-[calc(2rem-0.25rem)] p-8 md:p-10 text-center flex flex-col items-center relative overflow-hidden"> <div class="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-500/5 blur-2xl pointer-events-none"></div> <div class="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-primary/5 blur-2xl pointer-events-none"></div>  <div class="relative mb-5"><div class="absolute inset-0 rounded-2xl bg-amber-500/20 blur-md scale-110 pointer-events-none"></div> <div class="w-14 h-14 bg-gradient-to-b from-amber-50 to-amber-100/60 border border-amber-200/80 rounded-2xl flex items-center justify-center relative z-10 shadow-xs shadow-amber-500/10">${validate_component(Alert_triangle, "AlertTriangle").$$render($$result, { class: "w-7 h-7 text-amber-600" }, {}, {})}</div></div>  <span class="bg-amber-50 border border-amber-200/60 text-amber-700 font-bold text-[10px] uppercase tracking-[0.14em] px-3 py-1 rounded-full mb-3 inline-block" data-svelte-h="svelte-1orjo42">SMTP Required</span>  <h3 class="text-xl font-extrabold text-slate-900 tracking-tight" data-svelte-h="svelte-10f4yom">No Sender Account Configured</h3> <p class="text-slate-500 text-xs md:text-sm mt-2 max-w-sm mx-auto leading-relaxed font-medium" data-svelte-h="svelte-1is89iv">You must configure an SMTP email provider (Gmail, Outlook, or custom server) before composing and dispatching email campaigns.</p>  <a href="/configs" class="mt-7 group inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white text-[11px] font-bold uppercase tracking-wider px-6 py-3.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-95 shadow-lg shadow-primary/20" data-svelte-h="svelte-kl2k55"><span>Configure Sender Account</span>  <span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"><svg class="w-3 h-3 text-white fill-none stroke-current" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg></span></a></div></div>` : `<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"> <div class="lg:col-span-2 space-y-6"> <div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group"><div class="bg-white p-6 rounded-[calc(2.25rem-0.5rem)] border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-4"><div class="flex justify-between items-center mb-2"><h3 class="font-bold text-slate-800 text-base" data-svelte-h="svelte-rctaxs">Campaign Content</h3>  ${templates.length > 0 ? `<div><select class="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-600 focus:outline-none"><option value="" data-svelte-h="svelte-1a07xyo">-- Apply Template --</option>${each(templates, (t) => {
      return `<option${add_attribute("value", t.id, 0)}>${escape(t.name)}</option>`;
    })}</select></div>` : ``}</div>  <div><label for="smtpConfig" class="block text-sm font-semibold text-slate-700 mb-2" data-svelte-h="svelte-5uwnw0">Sender Account *</label> <select id="smtpConfig" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white">${each(configurations, (config) => {
      return `<option${add_attribute("value", config.id, 0)}>${escape(config.name)} (${escape(config.fromEmail)})</option>`;
    })}</select></div>  <div><label for="subject" class="block text-sm font-semibold text-slate-700 mb-2" data-svelte-h="svelte-9ueem0">Email Subject *</label> <input id="subject" type="text" placeholder="Enter email subject line..." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" required${add_attribute("value", subject, 0)}></div>  <div><div class="flex justify-between items-center mb-2"><label class="block text-sm font-semibold text-slate-700" data-svelte-h="svelte-1vrw4dm">Email Body *</label> ${columns.length > 0 ? `<span class="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md" data-svelte-h="svelte-vyxzto">Dynamic Tags Available</span>` : ``}</div> ${validate_component(EmailEditor, "EmailEditor").$$render(
      $$result,
      { value: htmlContent },
      {
        value: ($$value) => {
          htmlContent = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>  ${columns.length > 0 ? `<div class="bg-slate-50 border border-slate-100 rounded-xl p-3.5"><span class="text-xs font-bold text-slate-400 block uppercase tracking-wider mb-2" data-svelte-h="svelte-ja9014">Insert Placeholders:</span> <div class="flex flex-wrap gap-2">${each(columns, (col) => {
      return `<button type="button" class="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5"><code>${escape(`{{${col}}}`)}</code> </button>`;
    })}</div></div>` : ``}</div></div>  <div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group"><div class="bg-white p-6 rounded-[calc(2.25rem-0.5rem)] border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-4"><h3 class="font-bold text-slate-800 text-base mb-2" data-svelte-h="svelte-1l3pvf1">Dispatch Adjustments</h3>  <div><label for="delay-slider" class="block text-sm font-semibold text-slate-700 mb-2" data-svelte-h="svelte-1ptoy5t">Delay between emails (seconds)</label> <div class="flex items-center gap-3"><input id="delay-slider" type="range" min="5" max="120" class="flex-grow accent-primary"${add_attribute("value", delay, 0)}> <span class="font-bold text-slate-800 text-sm bg-slate-100 px-3 py-1.5 rounded-lg shrink-0 w-16 text-center">${escape(delay)}s</span></div> <p class="text-xs text-slate-400 mt-1" data-svelte-h="svelte-16fuude">Pauses between emails to mimic human behavior and avoid trigger limits</p></div>  <div class="border-t border-slate-100 pt-4 space-y-4"><div class="flex items-center justify-between"><div data-svelte-h="svelte-p9e9o4"><span class="text-sm font-semibold text-slate-700 block">Enable Batch Spacing</span> <span class="text-xs text-slate-400">Splits campaign into batches with intervals between them</span></div> <input type="checkbox" class="w-10 h-5 accent-primary shrink-0 rounded-full"${add_attribute("checked", useBatch, 1)}></div> ${``}</div>  <div class="border-t border-slate-100 pt-4 space-y-4"><div class="flex items-center justify-between"><div data-svelte-h="svelte-ebkggw"><span class="text-sm font-semibold text-slate-700 block">Schedule Campaign for Later</span> <span class="text-xs text-slate-400">Auto-sends the campaign at a specified future date and time</span></div> <input type="checkbox" class="w-10 h-5 accent-primary shrink-0 rounded-full"${add_attribute("checked", scheduleEmail, 1)}></div> ${``}</div></div></div></div>  <div class="space-y-6"> <div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group"><div class="bg-white p-5 rounded-[calc(2.25rem-0.5rem)] border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-4"><h3 class="font-bold text-slate-800 text-base" data-svelte-h="svelte-al37s5">Recipient Database</h3>  <div class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary transition-colors relative cursor-pointer"><input type="file" accept=".xlsx, .xls" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"> ${validate_component(File_spreadsheet, "FileSpreadsheet").$$render(
      $$result,
      {
        class: "w-10 h-10 text-slate-400 mx-auto mb-3"
      },
      {},
      {}
    )} <span class="text-sm font-bold text-slate-700 block">${escape("Upload Recipient List")}</span> <span class="text-xs text-slate-400 mt-1 block" data-svelte-h="svelte-1etl0fj">Supports Excel spreadsheets (.xlsx, .xls)</span></div>  <div><label class="block text-sm font-semibold text-slate-700 mb-1.5" data-svelte-h="svelte-1w2om9v">Optional HTML Template</label> <div class="flex items-center gap-2"><input type="file" accept=".html, .htm" class="hidden" id="html-template"> <label for="html-template" class="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl cursor-pointer text-xs flex items-center gap-2 w-full justify-center transition-colors">${validate_component(File_text, "FileText").$$render($$result, { class: "w-4 h-4" }, {}, {})} ${escape("Upload HTML File")}</label> ${``}</div></div>  ${``}</div></div>  ${``}  <div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group"><div class="bg-white p-5 rounded-[calc(2.25rem-0.5rem)] border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-4"><button type="button" class="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all">${validate_component(Eye, "Eye").$$render($$result, { class: "w-4 h-4" }, {}, {})}
						Preview Email Layout</button> <button type="button" ${"disabled"} class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-bold py-4 px-4 rounded-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center gap-2">${validate_component(Send, "Send").$$render($$result, { class: "w-5 h-5" }, {}, {})} ${`Start Campaign Send`}</button></div></div></div></div>`}</div>  ${validate_component(Modal, "Modal").$$render(
      $$result,
      {
        show: showPreviewModal,
        title: "Campaign Email Preview",
        size: "lg"
      },
      {},
      {
        footer: () => {
          return `<div slot="footer"><button class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-sm" data-svelte-h="svelte-ozmr0b">Close Preview</button></div>`;
        },
        default: () => {
          return `<div class="space-y-4"><div class="border-b border-slate-100 pb-3"><span class="text-xs text-slate-400 block font-bold uppercase tracking-wider" data-svelte-h="svelte-1vket6z">Subject Line</span> <h4 class="font-bold text-slate-800 text-sm mt-1">${escape(previewSubjectText)}</h4></div> <div><span class="text-xs text-slate-400 block font-bold uppercase tracking-wider mb-2" data-svelte-h="svelte-u7jgla">Message Body</span> <div class="border border-slate-100 rounded-xl p-4 bg-slate-50 max-h-96 overflow-y-auto text-sm leading-relaxed text-slate-700 font-sans"><!-- HTML_TAG_START -->${previewContentHTML}<!-- HTML_TAG_END --></div></div></div>`;
        }
      }
    )}  ${validate_component(Loader, "Loader").$$render(
      $$result,
      {
        visible: loading,
        text: "Starting Dispatch Queue..."
      },
      {},
      {}
    )}`;
  } while (!$$settled);
  $$unsubscribe_configsStore();
  return $$rendered;
});
export {
  Page as default
};
