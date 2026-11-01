import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "glass-orb-loader",
  title: "Glass Orb Loader",
  word: "glass",
  blurb: "A loading indicator: a glass sphere wobbles around a rotating ring of type, bending the letters as it passes.",
  extendsRadix: null,
  props: [
    {
      component: "GlassOrbLoader",
      rows: [
        { name: "size", type: `"sm" | "md" | "lg" | number`, default: `"md"`, description: "Overall diameter: 56, 88 or 128 px, or an exact pixel number (minimum 32)." },
        { name: "label", type: "string", default: `"Loading"`, description: "Accessible name announced by the status region. Also set around the ring as type." },
        { name: "showLabel", type: "boolean", default: "false", description: "Show the label as visible text under the orb." },
        GLASS_PROP("the orb"),
      ],
    },
  ],
  a11y: [
    "The root is role=\"status\" and contains the label as screen-reader text; the ring, type and orb are aria-hidden.",
    "Render it only while loading and unmount it when done, so assistive tech announces the change.",
    "Under reduced motion the orb stops at rest and slowly pulses its opacity instead of orbiting; the ring stops turning.",
  ],
  optics:
    "ORB_OPTICS: scale −72, chroma 5, border 0.2, mapBlur 7, blur 1. A round lens at 24–54px needs a stronger bend than a button to visibly stretch the type under it. The ring is a sibling under the orb, not inside it.",
  e2e: { surface: '[data-slot="glass-orb-loader-orb"]' },
};
