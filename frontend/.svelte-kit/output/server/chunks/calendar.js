import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import { I as Icon } from "./Icon.js";
const Calendar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "rect",
      {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "4",
        "rx": "2",
        "ry": "2"
      }
    ],
    [
      "line",
      {
        "x1": "16",
        "x2": "16",
        "y1": "2",
        "y2": "6"
      }
    ],
    [
      "line",
      {
        "x1": "8",
        "x2": "8",
        "y1": "2",
        "y2": "6"
      }
    ],
    [
      "line",
      {
        "x1": "3",
        "x2": "21",
        "y1": "10",
        "y2": "10"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "calendar" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
export {
  Calendar as C
};
