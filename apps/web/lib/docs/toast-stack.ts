import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "toast-stack",
  title: "Toast Stack",
  word: "toast",
  blurb: "iOS-style stacked toasts: the newest sits on top, older ones tuck behind, and hovering or focusing the stack fans it open.",
  builtOn: { label: "sonner, the toast library shadcn uses", href: "https://ui.shadcn.com/docs/components/sonner" },
  extendsRadix: null,
  props: [
    {
      component: "ToastStackProvider",
      rows: [{ name: "limit", type: "number", default: "4", description: "Most toasts kept at once; the oldest is dropped when exceeded." }],
    },
    {
      component: "ToastStackViewport",
      rows: [
        { name: "contained", type: "boolean", default: "false", description: "Position absolutely inside the nearest relative ancestor instead of fixed to the viewport." },
        { name: "placement", type: '"top" | "bottom"', default: '"top"', description: "Which edge the stack anchors to; older toasts tuck away from it." },
        GLASS_PROP("each toast"),
      ],
    },
    {
      component: "useToastStack()",
      rows: [
        { name: "push", type: "({ title, description?, action?, duration? }) => string", description: "Adds a toast and returns its id. `duration` is in ms (default 5000); `Infinity` keeps it until dismissed. `action` is `{ label, onClick }`." },
        { name: "dismiss", type: "(id: string) => void", description: "Animates one toast out." },
        { name: "dismissAll", type: "() => void", description: "Animates every toast out." },
      ],
    },
  ],
  a11y: [
    "The viewport is a role=\"status\" polite live region, so new toasts are announced without taking focus; older toasts behind the front one are inert until the stack expands.",
    "Hover or keyboard focus anywhere in the stack expands it and pauses every auto-dismiss timer, which resume with their remaining time. Escape dismisses the newest toast.",
    "Every toast has a named dismiss button and works without swiping; horizontal swipe is an extra, with a distance and velocity threshold so a stray drag springs back.",
    "Under prefers-reduced-motion the stack still reorders, but without travel, scale or fade transitions.",
  ],
  optics:
    "TOAST_OPTICS: scale −56, chroma 3, border 0.14, mapBlur 8, blur 2, saturate 1.3. Each toast is its own glass pane, a sibling of the others (never nested), capped by `limit`. Toasts move by transform, translate and clip-path only, so their displacement maps are not rebuilt as the stack reflows.",
  e2e: {
    surface: '[data-slot="toast-stack-item"]',
    open: { action: "click", target: '[data-demo="toast-stack"] [data-slot="button"]' },
  },
};
