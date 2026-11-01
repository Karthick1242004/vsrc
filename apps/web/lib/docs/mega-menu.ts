import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "mega-menu",
  title: "Mega Menu",
  word: "mega",
  blurb: "A glass navigation bar whose triggers open one wide panel of link columns and a featured card, resizing smoothly between sections.",
  extendsRadix: {
    label: "Radix Navigation Menu",
    href: "https://www.radix-ui.com/primitives/docs/components/navigation-menu",
  },
  props: [
    {
      component: "MegaMenu",
      rows: [
        {
          name: "sections",
          type: "MegaMenuSection[]",
          description: "Data-driven items: { label, columns?: { title, links: { label, href, description?, icon?, current? }[] }[], featured?: { title, description, href, art? }, href? }. A section with columns opens a panel; one with only href is a plain link.",
        },
        { name: "contentClassName", type: "string", description: "Extra classes for the panel content, for example a different width. Default is 40rem on sm and up." },
        GLASS_PROP("the bar and the panel"),
      ],
    },
  ],
  a11y: [
    "Radix Navigation Menu behavior untouched: triggers have aria-expanded, Left and Right move between items, Down enters the panel, Escape closes and returns focus to the trigger.",
    "The root is a nav; pass aria-label. The current link gets aria-current=\"page\" via `current`.",
    "Link descriptions are hidden below the sm breakpoint and the featured card drops out, keeping the mobile panel short; the links themselves remain.",
    "Panel and content animations are removed under reduced motion.",
  ],
  optics:
    "BAR_OPTICS: scale −48, chroma 4, border 0.16, mapBlur 8. PANEL_OPTICS: scale −96, chroma 4, border 0.07, mapBlur 14, blur 2 for the large pane. The viewport is positioned absolutely inside the menu root (not the page), and its width and height transition to the open content, so the displacement map settles just after each resize.",
  e2e: {
    open: { action: "click", target: '[data-demo="mega-menu"] [data-slot="mega-menu-trigger"]' },
    surface: '[data-slot="mega-menu-viewport"]',
  },
};
