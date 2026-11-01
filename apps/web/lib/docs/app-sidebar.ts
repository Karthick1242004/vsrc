import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "app-sidebar",
  title: "App Sidebar",
  word: "app",
  blurb: "A collapsible application sidebar that glides between a full panel and an icon rail, with grouped navigation, badges and a user block.",
  builtOn: { label: "shadcn Sidebar's API (SidebarProvider, useSidebar, SidebarTrigger)", href: "https://ui.shadcn.com/docs/components/sidebar" },
  extendsRadix: null,
  props: [
    {
      component: "SidebarProvider",
      rows: [
        { name: "open / defaultOpen", type: "boolean", default: "true", description: "Expanded state, as in shadcn's SidebarProvider. false shows the icon rail." },
        { name: "onOpenChange", type: "(open: boolean) => void", description: "Fires from the collapse button, SidebarTrigger and Ctrl/Cmd+B." },
        { name: "keyboardShortcut", type: "boolean", default: "true", description: "Ctrl/Cmd+B toggles the sidebar." },
      ],
    },
    {
      component: "useSidebar / SidebarTrigger",
      rows: [
        { name: "useSidebar()", type: "{ state; open; setOpen; toggleSidebar }", description: "Read or change the sidebar from anywhere under the provider, like shadcn's hook." },
        { name: "SidebarTrigger", type: "button props", description: "A toggle button for your header; announces aria-expanded." },
      ],
    },
    {
      component: "AppSidebar",
      rows: [
        { name: "groups", type: "{ label?: string; items: { value; label; icon; badge?; href? }[] }[]", description: "Navigation groups. Icons are any node; badges collapse to a dot on the rail." },
        { name: "header", type: "{ logo: ReactNode; title: string }", description: "Logo mark and product name at the top." },
        { name: "user", type: "{ name: string; detail?: string; avatar: ReactNode }", description: "Account block pinned to the bottom." },
        { name: "value / defaultValue", type: "string", description: "Active item value, marked with aria-current=\"page\"." },
        { name: "onValueChange", type: "(value: string) => void", description: "Fires when an item is chosen." },
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
  optics: "SIDEBAR_OPTICS: scale -72, chroma 3, border 0.08, mapBlur 12, blur 1, saturate 1.3, fallbackBlur 6. A tall panel wants the gentle large-surface bulge. Width is animated with a CSS transition, so the displacement map re-settles about 120 ms after the motion ends.",
  e2e: { surface: '[data-slot="app-sidebar"]' },
};
