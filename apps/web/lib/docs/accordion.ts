import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "accordion",
  title: "Accordion",
  word: "unfold",
  blurb: "One glass panel holding collapsible rows, with Radix keyboard behavior intact.",
  extendsRadix: {
    label: "Radix Accordion",
    href: "https://www.radix-ui.com/primitives/docs/components/accordion",
  },
  props: [{ component: "Accordion", rows: [GLASS_PROP("the panel that holds every item")] }],
  a11y: [
    "Radix behavior untouched: the trigger is a button inside a heading, with aria-expanded and aria-controls.",
    "Arrow keys, Home and End move focus between triggers; Space and Enter toggle.",
    "The chevron is decorative and the open and close animation stops under prefers-reduced-motion.",
  ],
  optics:
    "ACCORDION_OPTICS: scale −56, chroma 4, border 0.08, mapBlur 10, blur 2. The whole stack is one pane; separate glass rows would nest filters for nothing, so rows are divided by a hairline.",
  e2e: { surface: '[data-slot="accordion"]' },
};
