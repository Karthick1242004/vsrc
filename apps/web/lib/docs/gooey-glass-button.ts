import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "gooey-glass-button",
  title: "Gooey Glass Button",
  word: "gooey",
  blurb: "A glass button whose crisp face buds soft blobs at its edge on hover and pulls them back in when pressed.",
  extendsRadix: null,
  props: [
    {
      component: "GooeyGlassButton",
      rows: [
        { name: "variant", type: `"default" | "primary"`, default: `"default"`, description: "Clear glass, or red glass for the one primary action." },
        { name: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Face height and padding." },
        { name: "asChild", type: "boolean", default: "false", description: "Render the face as your own element (for example a Next.js Link) via Radix Slot." },
        GLASS_PROP("the button face"),
      ],
    },
  ],
  a11y: [
    "The face is a native button (or your asChild element): Enter and Space, focus ring and disabled all behave natively.",
    "The goo layer, its SVG filter and every blob are aria-hidden and pointer-events-none; they carry no content.",
    "Keyboard focus triggers the same blob animation as hover.",
    "Under reduced motion the whole goo layer is removed and only the glass face remains.",
  ],
  optics:
    "GOOEY_OPTICS: scale −52, chroma 4, border 0.16, mapBlur 7, blur 2. Same small-control band as Button. The SVG goo filter (blur 5, alpha matrix 20 / −8) is applied only to a decorative sibling layer behind the face, never to the glass, so the label stays sharp and the refraction is untouched.",
  e2e: { surface: '[data-slot="gooey-glass-button"]' },
};
