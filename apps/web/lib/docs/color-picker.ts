import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "color-picker",
  title: "Color Picker",
  word: "color",
  blurb: "A swatch trigger that opens a glass panel with a saturation square, hue and opacity sliders, a validated hex field and a swatch row.",
  extendsRadix: {
    label: "Radix Popover",
    href: "https://www.radix-ui.com/primitives/docs/components/popover",
  },
  props: [
    {
      component: "ColorPicker",
      rows: [
        { name: "value", type: "string", description: "Controlled colour as hex: #rrggbb, or #rrggbbaa when `alpha` is on and opacity is below 100%." },
        { name: "defaultValue", type: "string", default: '"#e02723"', description: "Initial colour when uncontrolled." },
        { name: "onValueChange", type: "(hex: string) => void", description: "Fires on every drag step, key press, valid hex entry and swatch pick." },
        { name: "swatches", type: "string[]", default: "8 colours", description: "Quick-pick row. Pass an empty array to hide it." },
        { name: "alpha", type: "boolean", default: "false", description: "Adds an opacity slider." },
        { name: "label", type: "string", default: '"Choose colour"', description: "Accessible name of the trigger; the current hex is appended." },
        GLASS_PROP("the popover panel"),
      ],
    },
  ],
  a11y: [
    "The square, hue and opacity tracks are role=\"slider\" with aria-valuetext (for example \"Saturation 62%, brightness 88%\"); arrows move 1 step, Shift+arrows 10, Home/End jump to the ends.",
    "Dragging uses pointer capture, so it keeps tracking outside the control and works with touch and pen.",
    "The hex field is labelled, marks aria-invalid and announces a short error while the text is not a valid colour, and reverts to the current colour on blur.",
    "Radix handles Escape, focus entering the panel and returning to the trigger; thumb scaling is dropped under reduced motion.",
  ],
  optics:
    "PANEL_OPTICS: scale −88, border 0.07, mapBlur 14, blur 6, saturate 1.2 — a large calm panel, so the bend stays shallow and the saturation square is never fighting the lens. Only the portaled panel is glass; the trigger is the free Button and the controls inside the panel are plain.",
  e2e: {
    surface: '[data-slot="color-picker-panel"]',
    open: { action: "click", target: '[data-demo="color-picker"] [data-slot="button"]' },
  },
};
