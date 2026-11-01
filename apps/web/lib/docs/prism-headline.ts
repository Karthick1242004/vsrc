import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "prism-headline",
  title: "Prism Headline",
  word: "prism",
  blurb: "A real heading in display type with a glass bar that sweeps across it, bending the letters as it passes.",
  extendsRadix: null,
  props: [
    {
      component: "PrismHeadline",
      rows: [
        { name: "as", type: `"h1" | "h2" | "h3"`, default: `"h2"`, description: "Heading element to render." },
        { name: "children", type: "ReactNode", description: "The headline text. It stays real, selectable text." },
        {
          name: "trigger",
          type: `"auto" | "hover" | "inview"`,
          default: `"auto"`,
          description: "auto loops with a rest between sweeps; hover sweeps once on pointer hover or focus-within; inview sweeps once when 60% visible.",
        },
        { name: "progress", type: "number", description: "0 to 1. Drives the bar directly (tie it to scroll, a slider or a timeline); overrides trigger." },
        GLASS_PROP("the bar"),
      ],
    },
  ],
  a11y: [
    "The headline is a genuine h1–h3 element with its text intact, so selection, find-in-page and heading navigation all work.",
    "The glass bar is aria-hidden, pointer-events none, and never takes focus or blocks text selection.",
    "The hover trigger also fires on keyboard focus of anything inside the heading, such as a link.",
    "Under prefers-reduced-motion the bar is hidden and no sweep runs; the headline is unchanged.",
  ],
  optics:
    "BAR_OPTICS: scale −120, chroma 8, border 0.3, mapBlur 12, magnify 1.15, blur 0. A wide border fraction on a narrow bar bends the whole bar like a cylinder lens, and chroma 8 splits colour at the edges so letters flash a prism fringe. The sweep is a transform animation, so the displacement map is generated once.",
  e2e: { surface: '[data-slot="prism-headline-bar"]' },
};
