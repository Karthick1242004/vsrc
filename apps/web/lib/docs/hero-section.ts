import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "hero-section",
  title: "Hero Section",
  word: "hero",
  blurb: "A contained landing hero: display headline, two calls to action, and a large lens pane that bends giant words scrolling behind it.",
  extendsRadix: null,
  props: [
    {
      component: "HeroSection",
      rows: [
        { name: "headline", type: "ReactNode", default: '"Light, bent on purpose."', description: "Display headline set in font-display; written to fit two lines." },
        { name: "description", type: "ReactNode", description: "Supporting sentence under the headline. Pass null to omit." },
        { name: "primaryAction / secondaryAction", type: "ReactNode", default: "free Button, primary + default", description: "Call-to-action slots. Pass null to hide one." },
        { name: "backdropWords", type: "string[]", default: '["Refract", "Reflect", "Bend"]', description: "Words that scroll behind the lens pane." },
        { name: "headingAs", type: '"h1" | "h2"', default: '"h2"', description: "Heading element for the headline." },
        GLASS_PROP("the lens pane"),
      ],
    },
  ],
  a11y: [
    "The scrolling words and the lens pane are decorative and hidden from assistive technology; the headline, description and actions are plain, focusable document content.",
    "The entrance rise and the marquee are CSS animations declared inside a prefers-reduced-motion: no-preference query, so reduced-motion users get the finished layout with no movement.",
    "The calls to action are real buttons (or whatever element you pass) with the free Button's visible focus ring.",
  ],
  optics: "LENS_OPTICS (scale −104, chroma 5, border 0.07, mapBlur 14, blur 1, saturate 1.35): the large-panel recipe pushed to the strong end, because the point of this pane is to visibly bend big type. Only the pane is glass; the call-to-action buttons sit above the copy as siblings, never inside it.",
  e2e: { surface: '[data-slot="hero-section-lens"]' },
};
