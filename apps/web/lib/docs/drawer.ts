import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "drawer",
  title: "Drawer",
  word: "drawer",
  blurb: "A bottom sheet with a drag handle, snap points and velocity-based dismiss, built on vaul.",
  builtOn: { label: "vaul, the library behind shadcn Drawer", href: "https://ui.shadcn.com/docs/components/drawer" },
  extendsRadix: {
    label: "Radix Dialog",
    href: "https://www.radix-ui.com/primitives/docs/components/dialog",
  },
  props: [
    {
      component: "Drawer",
      rows: [
        { name: "open / defaultOpen / onOpenChange", type: "Radix Dialog props", description: "Same as Dialog. Dragging the sheet away calls onOpenChange(false)." },
        { name: "snapPoints", type: "(number | string)[]", description: "vaul snap points: fractions of the viewport or px strings. The sheet opens at the first; drag or flick between them." },
      ],
    },
    {
      component: "DrawerContent",
      rows: [
        GLASS_PROP("the sheet"),
      ],
    },
  ],
  a11y: [
    "Radix supplies the focus trap, Escape to close, scroll lock and focus return; DrawerTitle and DrawerDescription are required for the dialog's name and description.",
    "vaul renders the sheet as a Radix Dialog: focus is trapped while open, Escape and a tap on the overlay close it, and focus returns to the trigger. Snap points change by dragging or flicking the handle.",
    "The body scrolls independently with overscroll contained, so long content never drags the page behind it.",
    "Under prefers-reduced-motion the slide, snap and dim animations are removed; the sheet simply appears and moves.",
  ],
  optics:
    "SHEET_OPTICS: scale −96, chroma 3, border 0.07, mapBlur 14, blur 4, saturate 1.2 — a large panel, so a soft wide edge. The glass element has one fixed size (the tallest snap) and only translates, so its displacement map is built once. Content inside is plain: no second glass surface.",
  e2e: {
    surface: '[data-slot="drawer-content"]',
    open: { action: "click", target: '[data-demo="drawer"] [data-slot="button"]' },
  },
};
