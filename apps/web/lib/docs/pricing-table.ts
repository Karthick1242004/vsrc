import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "pricing-table",
  title: "Pricing Table",
  word: "pricing",
  blurb: "Three plan cards with a monthly or yearly toggle that computes the saving, and a raised, recommended plan.",
  extendsRadix: { label: "Radix Switch", href: "https://www.radix-ui.com/primitives/docs/components/switch" },
  props: [
    {
      component: "PricingTable",
      rows: [
        { name: "plans", type: "Plan[]", default: "Starter / Studio / Team", description: "Each plan: id, name, description, monthly (price per month), yearly (price per year), features, optional cta and recommended." },
        { name: "interval / defaultInterval", type: '"month" | "year"', default: '"month"', description: "Controlled or initial billing interval." },
        { name: "onIntervalChange", type: "(interval) => void", description: "Fires when the toggle flips." },
        { name: "onSelect", type: "(planId: string, interval) => void", description: "Fires when a plan's button is pressed, with the interval on screen." },
        { name: "currency / locale", type: "string", default: '"USD" / "en-US"', description: "Passed to Intl.NumberFormat." },
        GLASS_PROP("every plan card (the recommended card uses a stronger base)"),
      ],
    },
  ],
  a11y: [
    "The interval toggle is the free Switch (role=switch, Space and Enter toggle it) labelled \"Bill yearly\", with the visible Monthly and Yearly captions as its description.",
    "A polite live region announces \"Showing yearly prices\" or \"Showing monthly prices\" when the interval changes.",
    "Plan buttons carry the billing interval in visually hidden text; the recommended plan is marked with text (\"Most popular\"), not just elevation or colour.",
    "The price swap animation is declared inside prefers-reduced-motion: no-preference, so reduced-motion users see the new price immediately.",
  ],
  optics: "PLAN_OPTICS (scale −80, chroma 3, border 0.07, mapBlur 12): the large-panel recipe for the standard cards. FEATURED_OPTICS (scale −112, chroma 4, border 0.14, mapBlur 14, saturate 1.4) bends harder and lights the rim so the recommended card reads as the raised one. The plan buttons are plain styled elements, never glass nested in a glass card; the toggle Switch is a sibling above the cards.",
  e2e: { surface: '[data-slot="pricing-plan-featured"]' },
};
