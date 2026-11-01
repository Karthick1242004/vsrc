import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "refraction-marquee",
  title: "Refraction Marquee",
  word: "drift",
  blurb: "An endless line of display type scrolling beneath a stationary glass band that bends each word as it passes.",
  extendsRadix: null,
  props: [
    {
      component: "RefractionMarquee",
      rows: [
        { name: "items", type: "string[]", description: "The words or phrases to scroll. Repeated automatically until they fill the width." },
        { name: "speed", type: "number", default: "90", description: "Scroll speed in px per second." },
        { name: "direction", type: `"left" | "right"`, default: `"left"`, description: "Direction the text travels." },
        { name: "bandWidth", type: "number", default: "200", description: "Width of the glass band in px (capped at 80% of the marquee)." },
        { name: "label", type: "string", default: `"Highlights"`, description: "Accessible name of the region." },
        GLASS_PROP("the band"),
      ],
    },
  ],
  a11y: [
    "Each item is exposed once as real list text; every repeat used to fill the loop is aria-hidden, and so is the glass band.",
    "The marquee eases to a stop on pointer hover and on keyboard focus, then eases back up to speed.",
    "Under prefers-reduced-motion nothing scrolls: the items render once, centred and wrapped, with no band.",
    "The region is focusable so keyboard users can pause it; touch taps do not latch the pause.",
  ],
  optics:
    "BAND_OPTICS: scale −104, chroma 6, border 0.24, mapBlur 14, magnify 1.2, blur 0. The band is tall and narrow, so a wide border fraction gives a dome-like bend across its whole width and the passing letters stay sharp (blur 0). The scrolling is a transform animation on the text track, so the band's displacement map is generated once.",
  e2e: { surface: '[data-slot="refraction-marquee-band"]' },
};
