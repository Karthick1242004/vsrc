import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "lens-cursor",
  title: "Lens Cursor",
  word: "focus",
  blurb: "A glass lens that trails the pointer inside a container and swells over anything marked data-lens=\"grow\".",
  extendsRadix: null,
  props: [
    {
      component: "LensCursorArea",
      rows: [
        { name: "size", type: "number", default: "40", description: "Resting diameter in px." },
        { name: "grownSize", type: "number", default: "88", description: `Diameter over elements marked data-lens="grow".` },
        GLASS_PROP("the lens"),
      ],
    },
    {
      component: "LensCursor",
      rows: [
        {
          name: "container",
          type: "RefObject<HTMLElement | null>",
          default: "parent element",
          description: "Element whose pointer movement is tracked. The default parent must be positioned (relative) and should clip overflow.",
        },
        { name: "size / grownSize / glass", type: "as above", description: "Same as LensCursorArea; use this form to track an element you already have." },
      ],
    },
  ],
  a11y: [
    "The lens is decorative (aria-hidden, pointer-events none) and never takes focus or intercepts clicks.",
    "It is hidden entirely on touch and hover-less devices, where there is no cursor to follow; the native cursor is always left visible.",
    "Under prefers-reduced-motion the lens follows the pointer instantly, with no trailing or size easing.",
    "Keyboard users are unaffected: nothing in the content depends on the lens.",
  ],
  optics:
    "LENS_OPTICS: scale −90, chroma 4, border 0.2, mapBlur 8, magnify 1.35, blur 0. The lens is laid out once at grownSize and shrunk with a transform, so growing and shrinking never regenerates the displacement map. A slightly stronger magnify makes link text visibly swell under the lens.",
  e2e: { surface: '[data-slot="lens-cursor"]' },
};
