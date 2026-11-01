import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "glass-navbar",
  title: "Glass Navbar",
  word: "navigate",
  blurb: "A glass bar that shrinks once its scroll container passes a threshold and folds into a menu button and glass panel on narrow widths.",
  extendsRadix: null,
  props: [
    {
      component: "GlassNavbar",
      rows: [
        { name: "links", type: "{ label: string; href: string; current?: boolean }[]", description: "Navigation links. `current` sets aria-current=\"page\"." },
        { name: "logo", type: "ReactNode", description: "Brand mark at the start of the bar." },
        { name: "cta", type: "ReactNode", description: "Call to action at the end of the bar; moves to the foot of the panel when collapsed." },
        { name: "threshold", type: "number", default: "24", description: "Scroll distance in px past which the bar shrinks (with a small dead band so it does not flicker)." },
        { name: "scrollContainer", type: "RefObject<HTMLElement> | HTMLElement", description: "Element whose scroll drives the shrink. Omit to follow the window." },
        { name: "position", type: `"fixed" | "sticky" | "absolute"`, default: `"fixed"; "sticky" with scrollContainer`, description: "Use sticky inside a scroll container; the bar reserves 4.5rem of height in flow." },
        { name: "navLabel", type: "string", default: `"Main"`, description: "aria-label of the nav landmark." },
        { name: "renderLink", type: "(props: ComponentProps<\"a\">) => ReactNode", description: "Render each link with your router's Link component." },
        GLASS_PROP("the bar and the collapsed panel"),
      ],
    },
  ],
  a11y: [
    "A single nav landmark with aria-label; the current link carries aria-current=\"page\".",
    "Below 36rem of container width the links fold into a toggle with aria-expanded and aria-controls; the closed panel is inert so it cannot take focus.",
    "Escape closes the panel and returns focus to the toggle; so does clicking outside or choosing a link.",
    "Under reduced motion the bar still changes size but without a transition, and the panel fades without travel.",
  ],
  optics:
    "NAV_OPTICS: scale −64, chroma 4, border 0.12, mapBlur 10, blur 1. PANEL_OPTICS: scale −80, border 0.08, mapBlur 14. The bar and the panel are siblings, never nested. The collapse breakpoint is a container query, so it follows the width of the bar's container, not the viewport.",
  e2e: { surface: '[data-slot="glass-navbar"]' },
};
