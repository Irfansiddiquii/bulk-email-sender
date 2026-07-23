import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import { I as Icon } from "./Icon.js";
const Send = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "m22 2-7 20-4-9-9-4Z" }], ["path", { "d": "M22 2 11 13" }]];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "send" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
export {
  Send as S
};
