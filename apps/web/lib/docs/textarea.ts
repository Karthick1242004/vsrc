import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "textarea",
  title: "Textarea",
  word: "write",
  blurb: "A glass multi-line field that keeps the text calm over a moving backdrop.",
  extendsRadix: null,
  props: [{ component: "Textarea", rows: [GLASS_PROP("the field")] }],
  a11y: [
    "A native textarea: pair it with a visible label or aria-label.",
    "The text sits in the still interior while the edge band does the bending.",
    "Visible focus-visible border change; resizable vertically by default.",
  ],
  optics:
    "TEXTAREA_OPTICS: scale −40, chroma 3, border 0.14, mapBlur 6, blur 2. Same family as Input; a slightly thinner band because the pane is taller.",
  e2e: { surface: '[data-slot="textarea"]' },
};
