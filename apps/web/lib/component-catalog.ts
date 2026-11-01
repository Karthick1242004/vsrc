import type { Group, Tier } from "@/lib/docs/types";

/**
 * The library's full line-up, in display order. Free components are the
 * public shadcn registry; Pro components are shown in full on the site but
 * their source is not published (licensing is not wired up yet). Order here
 * drives the docs index, the sidebar, the playground and the sitemap.
 */
export interface CatalogEntry {
  slug: string;
  tier: Tier;
  group: Group;
}

const free = (group: Group, ...slugs: string[]): CatalogEntry[] =>
  slugs.map((slug) => ({ slug, tier: "free", group }));
const pro = (group: Group, ...slugs: string[]): CatalogEntry[] =>
  slugs.map((slug) => ({ slug, tier: "pro", group }));

export const CATALOG: CatalogEntry[] = [
  ...free("Core", "glass-surface", "button", "card", "accordion"),
  ...free("Forms", "input", "textarea", "checkbox", "radio-group", "select", "switch", "slider"),
  ...pro(
    "Forms",
    "date-picker",
    "combobox",
    "otp-input",
    "file-dropzone",
    "color-picker",
    "elastic-slider",
    "stepper",
  ),
  ...free("Navigation", "tabs", "dock"),
  ...pro("Navigation", "glass-navbar", "pill-nav", "mega-menu", "app-sidebar", "radial-menu", "mobile-tab-bar"),
  ...free(
    "Overlay",
    "tooltip",
    "popover",
    "hover-card",
    "dropdown-menu",
    "context-menu",
    "dialog",
    "alert-dialog",
    "sheet",
    "command",
  ),
  ...pro("Overlay", "drawer"),
  ...free("Feedback", "toast"),
  ...pro("Feedback", "toast-stack", "notification-centre"),
  ...pro(
    "Optics",
    "glass-loupe",
    "lens-cursor",
    "liquid-toggle",
    "dynamic-island",
    "refraction-marquee",
    "prism-headline",
    "gooey-glass-button",
    "glass-orb-loader",
  ),
  ...pro("Media", "lightbox", "glass-window", "now-playing", "depth-carousel", "card-stack"),
  ...pro("Data", "data-table", "stat-cards"),
  ...pro("Blocks", "hero-section", "pricing-table", "auth-card", "chat-composer"),
];

export const GROUP_ORDER: Group[] = [
  "Core",
  "Forms",
  "Navigation",
  "Overlay",
  "Feedback",
  "Optics",
  "Media",
  "Data",
  "Blocks",
];
