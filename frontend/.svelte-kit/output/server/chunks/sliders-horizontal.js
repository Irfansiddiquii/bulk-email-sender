import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import { I as Icon } from "./Icon.js";
const Sliders_horizontal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "line",
      {
        "x1": "21",
        "x2": "14",
        "y1": "4",
        "y2": "4"
      }
    ],
    [
      "line",
      {
        "x1": "10",
        "x2": "3",
        "y1": "4",
        "y2": "4"
      }
    ],
    [
      "line",
      {
        "x1": "21",
        "x2": "12",
        "y1": "12",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "8",
        "x2": "3",
        "y1": "12",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "21",
        "x2": "16",
        "y1": "20",
        "y2": "20"
      }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "3",
        "y1": "20",
        "y2": "20"
      }
    ],
    [
      "line",
      {
        "x1": "14",
        "x2": "14",
        "y1": "2",
        "y2": "6"
      }
    ],
    [
      "line",
      {
        "x1": "8",
        "x2": "8",
        "y1": "10",
        "y2": "14"
      }
    ],
    [
      "line",
      {
        "x1": "16",
        "x2": "16",
        "y1": "18",
        "y2": "22"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "sliders-horizontal" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
export {
  Sliders_horizontal as S
};
