import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "liquid-toggle",
  title: "Liquid Toggle",
  word: "liquid",
  blurb: "A glass switch whose thumb stretches as it travels and squishes as it lands, like a drop of liquid.",
  extendsRadix: null,
  props: [
    {
      component: "LiquidToggle",
      rows: [
        { name: "checked", type: "boolean", description: "Controlled state. Pair with onCheckedChange." },
        { name: "defaultChecked", type: "boolean", default: "false", description: "Initial state when uncontrolled." },
        { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called with the next state on click, Space or Enter." },
        { name: "disabled", type: "boolean", default: "false", description: "Dims the switch and removes it from interaction." },
        GLASS_PROP("the track"),
      ],
    },
  ],
  a11y: [
    "A native button with role=\"switch\" and aria-checked; name it with a wrapping <label>, aria-label or aria-labelledby.",
    "Space and Enter toggle it, with the standard button behaviour; Tab focuses it with a visible ring.",
    "Interrupting a flip mid-travel resumes from the thumb's current position rather than snapping.",
    "Under prefers-reduced-motion the thumb jumps to its place with no stretch, squish or press scale.",
  ],
  optics:
    "TOGGLE_OPTICS: scale −40, chroma 2, border 0.22, mapBlur 5, blur 2. A small control needs a tight, crisp rim. The liquid effect is scaleX and scaleY on the thumb only, so the track keeps one displacement map for its whole life.",
  e2e: { surface: '[data-slot="liquid-toggle"]' },
};
