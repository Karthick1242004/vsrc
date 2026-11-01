import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "drawer",
  title: "Drawer",
  word: "drawer",
  blurb: "A bottom sheet with a drag handle, snap points and velocity-based dismiss, built on Radix Dialog.",
  extendsRadix: {
    label: "Radix Dialog",
    href: "https://www.radix-ui.com/primitives/docs/components/dialog",
  },
  props: [
    {
      component: "Drawer",
      rows: [
        { name: "open / defaultOpen / onOpenChange", type: "Radix Dialog props", description: "Same as Dialog. Dragging the sheet away calls onOpenChange(false)." },
      ],
    },
    {
      component: "DrawerContent",
      rows: [
        { name: "snapPoints", type: "number[]", default: "[0.4, 0.9]", description: "Visible heights as fractions of the viewport (or `container`). The tallest sets the sheet's size." },
        { name: "defaultSnap", type: "number", default: "smallest", description: "Snap point to open at; must be one of `snapPoints`." },
        { name: "container", type: "HTMLElement | null", description: "Portal into this element and position absolutely, for contained previews. Omit to portal to the body, fixed to the viewport." },
        GLASS_PROP("the sheet"),
      ],
    },
  ],
  a11y: [
    "Radix supplies the focus trap, Escape to close, scroll lock and focus return; DrawerTitle and DrawerDescription are required for the dialog's name and description.",
    "The drag handle is a button named \"Resize sheet\": click or Enter steps between snap points, ArrowUp/ArrowDown move up and down. Dragging is an enhancement, not the only way.",
    "Focus lands on the sheet when it opens, not on the handle, and the body scrolls independently with overscroll contained.",
    "Under prefers-reduced-motion the slide, snap and dim animations are removed; the sheet simply appears and moves.",
  ],
  optics:
    "SHEET_OPTICS: scale −96, chroma 3, border 0.07, mapBlur 14, blur 8, saturate 1.2 — a large panel, so a soft wide edge. The glass element has one fixed size (the tallest snap) and only translates, so its displacement map is built once. Content inside is plain: no second glass surface.",
  e2e: {
    surface: '[data-slot="drawer-content"]',
    open: { action: "click", target: '[data-demo="drawer"] [data-slot="button"]' },
  },
};
