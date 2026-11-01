import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "mobile-tab-bar",
  title: "Mobile Tab Bar",
  word: "mobile",
  blurb: "A bottom navigation bar for mobile layouts with a lens that glides to the active tab, a press scale and optional badges.",
  extendsRadix: null,
  props: [
    {
      component: "MobileTabBar",
      rows: [
        { name: "items", type: "{ value: string; label: string; icon: ReactNode; badge?: string | number; href?: string }[]", description: "Three to five tabs. Items with href render as links, the rest as buttons." },
        { name: "value / defaultValue", type: "string", description: "Active tab, controlled or initial. Defaults to the first item." },
        { name: "onValueChange", type: "(value: string) => void", description: "Fires when a tab is pressed." },
        GLASS_PROP("the bar"),
      ],
    },
  ],
  a11y: [
    "A labelled nav landmark of plain buttons or links; the active one carries aria-current=\"page\" (no tablist roles).",
    "Tab moves between items in order, Enter and Space activate, and each shows a visible focus ring.",
    "Badges add visually hidden text (\"3 new\") so the count is announced with the tab name.",
    "The lens slide and press scale are removed under prefers-reduced-motion; the active state is still shown by colour and the lens.",
  ],
  optics: "BAR_OPTICS: scale -48, chroma 3, border 0.16, mapBlur 7, blur 2, saturate 1.35, fallbackBlur 3. Small-control range so the scrolling content behind bends visibly without smearing labels. The lens is a plain highlight that slides on transform, so the glass map is never regenerated while it moves.",
  e2e: { surface: '[data-slot="mobile-tab-bar"]' },
};
