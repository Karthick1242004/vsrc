import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "app-sidebar",
  title: "App Sidebar",
  word: "app",
  blurb: "A collapsible application sidebar that glides between a full panel and an icon rail, with grouped navigation, badges and a user block.",
  extendsRadix: null,
  props: [
    {
      component: "AppSidebar",
      rows: [
        { name: "groups", type: "{ label?: string; items: { value; label; icon; badge?; href? }[] }[]", description: "Navigation groups. Icons are any node; badges collapse to a dot on the rail." },
        { name: "header", type: "{ logo: ReactNode; title: string }", description: "Logo mark and product name at the top." },
        { name: "user", type: "{ name: string; detail?: string; avatar: ReactNode }", description: "Account block pinned to the bottom." },
        { name: "collapsed / defaultCollapsed", type: "boolean", default: "false", description: "Controlled or initial state of the icon rail." },
        { name: "onCollapsedChange", type: "(collapsed: boolean) => void", description: "Fires when the toggle button or shortcut changes the state." },
        { name: "value / defaultValue", type: "string", description: "Active item value, marked with aria-current=\"page\"." },
        { name: "onValueChange", type: "(value: string) => void", description: "Fires when an item is chosen." },
        { name: "shortcut", type: "boolean", default: "false", description: "Toggle with Ctrl/Cmd+B." },
        GLASS_PROP("the sidebar panel"),
      ],
    },
  ],
  a11y: [
    "Rendered as an aside landmark containing a labelled nav; the active item carries aria-current=\"page\".",
    "The collapse button exposes aria-expanded and aria-controls, and its name changes between Expand and Collapse.",
    "Item labels stay in the DOM when collapsed, so every icon-only item keeps its accessible name; a native title shows on hover.",
    "Width and label transitions are removed under prefers-reduced-motion.",
  ],
  optics: "SIDEBAR_OPTICS: scale -72, chroma 3, border 0.08, mapBlur 12, blur 3, saturate 1.3, fallbackBlur 6. A tall panel wants the gentle large-surface bulge. Width is animated with a CSS transition, so the displacement map re-settles about 120 ms after the motion ends.",
  e2e: { surface: '[data-slot="app-sidebar"]' },
};
