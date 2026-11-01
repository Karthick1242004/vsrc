import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "radio-group",
  title: "Radio Group",
  word: "choose",
  blurb: "Glass radio dots in a Radix group, one choice at a time.",
  extendsRadix: {
    label: "Radix Radio Group",
    href: "https://www.radix-ui.com/primitives/docs/components/radio-group",
  },
  props: [{ component: "RadioGroupItem", rows: [GLASS_PROP("each dot")] }],
  a11y: [
    "Radix behavior untouched: role radiogroup and radio, with roving focus on the arrow keys.",
    "Label the group with aria-label and each item with a wrapping label.",
    "The selected dot animates in and the animation stops under reduced motion.",
  ],
  optics:
    "RADIO_OPTICS: scale −28, chroma 2, border 0.3, mapBlur 4, blur 1. Same tuning as Checkbox with a wider band, since a circle has no flat edge to hold.",
  e2e: { surface: '[data-slot="radio-group-item"]' },
};
