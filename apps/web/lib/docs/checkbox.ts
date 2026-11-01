import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "checkbox",
  title: "Checkbox",
  word: "tick",
  blurb: "A glass box that fills red when checked, with an indeterminate state.",
  extendsRadix: {
    label: "Radix Checkbox",
    href: "https://www.radix-ui.com/primitives/docs/components/checkbox",
  },
  props: [{ component: "Checkbox", rows: [GLASS_PROP("the box")] }],
  a11y: [
    "Radix behavior untouched: role checkbox, aria-checked including mixed, Space toggles.",
    "Needs a label: wrap it in a label element or pass aria-label.",
    "The check mark pops in with a short scale animation that stops under reduced motion.",
  ],
  optics:
    "BOX_OPTICS: scale −28, chroma 2, border 0.24, mapBlur 4, blur 1. At 20px the band is most of the pane, so displacement stays faint and the box reads as glass without smearing the tick.",
  e2e: { surface: '[data-slot="checkbox"]' },
};
