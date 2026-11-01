import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "lightbox",
  title: "Lightbox",
  word: "lightbox",
  blurb: "A full-screen image viewer opened from any thumbnail, with glass controls and caption floating over the picture.",
  extendsRadix: { label: "Radix Dialog", href: "https://www.radix-ui.com/primitives/docs/components/dialog" },
  props: [
    {
      component: "Lightbox",
      rows: [
        { name: "items", type: "{ id: string; src?: ReactNode; title: string; caption?: string }[]", description: "The gallery. `src` is any node: pass real photos as `<img className=\"size-full object-cover\" />`. It renders in the stage and the thumbnail strip, so it must fill its box." },
        { name: "open / defaultOpen / onOpenChange", type: "boolean", description: "Controlled or uncontrolled open state." },
        { name: "index / defaultIndex / onIndexChange", type: "number", default: "0", description: "Current image. Navigation wraps around." },
        GLASS_PROP("the controls and caption bar"),
      ],
    },
    {
      component: "LightboxTrigger",
      rows: [{ name: "index", type: "number", default: "0", description: "Image shown when this trigger opens the lightbox. Put the thumbnail inside it." }],
    },
  ],
  a11y: [
    "Dialog semantics from Radix: focus is trapped, Escape closes, and focus returns to the thumbnail that opened it. The image title is the dialog name and the caption its description.",
    "Left and Right arrow keys, the labelled previous/next buttons, thumbnails (aria-current) and touch swipe all change the image; the counter is a polite live region.",
    "Zoom is a toggle button with aria-pressed; clicking the image also toggles it, and pointer movement pans while zoomed.",
    "Slide and zoom transitions are removed under prefers-reduced-motion; the content still changes.",
  ],
  optics:
    "CONTROL_OPTICS (scale −44, chroma 3, border 0.2, mapBlur 6) for the four round buttons; BAR_OPTICS (scale −72, border 0.09, mapBlur 12) for the caption bar. All sit over the picture, never inside each other, and slide only by transform so the maps are generated once.",
  e2e: {
    surface: '[data-slot="lightbox-caption"]',
    open: { action: "click", target: '[data-demo="lightbox"] [data-slot="lightbox-trigger"]' },
  },
};
