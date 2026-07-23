import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import { I as Icon } from "./Icon.js";
const Activity = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M22 12h-4l-3 9L9 3l-3 9H2" }]];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "activity" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
export {
  Activity as A
};
