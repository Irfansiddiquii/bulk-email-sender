import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import { I as Icon } from "./Icon.js";
const Building_2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"
      }
    ],
    [
      "path",
      {
        "d": "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"
      }
    ],
    [
      "path",
      {
        "d": "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"
      }
    ],
    ["path", { "d": "M10 6h4" }],
    ["path", { "d": "M10 10h4" }],
    ["path", { "d": "M10 14h4" }],
    ["path", { "d": "M10 18h4" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "building-2" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
export {
  Building_2 as B
};
