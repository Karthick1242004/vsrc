import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "glass-loupe",
  title: "Glass Loupe",
  word: "glass",
  blurb: "A draggable magnifier pane that enlarges and bends whatever it is moved over.",
  extendsRadix: null,
  props: [
    {
      component: "GlassLoupe",
      rows: [
        { name: "size", type: "number", default: "168", description: "Diameter (or side length) of the lens in px." },
        { name: "shape", type: `"circle" | "rounded"`, default: `"circle"`, description: "Lens outline." },
        {
          name: "container",
          type: "RefObject<HTMLElement | null>",
          default: "parent element",
          description: "Element the loupe is clamped inside. The default parent must be positioned (relative).",
        },
        {
          name: "defaultPosition",
          type: "{ x: number; y: number }",
          default: "centre",
          description: "Initial centre of the lens, in px from the container's top-left.",
        },
        { name: "label", type: "string", default: `"Magnifier"`, description: "Accessible name of the draggable group." },
        { name: "children", type: "ReactNode", description: "Optional short caption drawn inside the lens." },
        GLASS_PROP("the lens"),
      ],
    },
  ],
  a11y: [
    "The lens is a focusable group named by `label`, with a screen-reader hint describing the controls.",
    "Arrow keys move it by 16px; Shift+Arrow moves it by 64px. It never leaves its container.",
    "Pointer capture keeps a drag attached when the finger or cursor outruns the lens, and touch-action is disabled so touch drags do not scroll the page.",
    "Position changes made with the keyboard glide briefly; under prefers-reduced-motion they jump.",
  ],
  optics:
    "LOUPE_OPTICS: scale −128, chroma 5, border 0.14, mapBlur 10, magnify 1.6, blur 0. Strong rim bend plus a 1.6x centre magnification is what makes small body copy readable through the lens; blur stays at 0 so the enlarged text is crisp. Dragging moves the element with transform only, so the displacement map is never regenerated.",
  e2e: { surface: '[data-slot="glass-loupe-lens"]' },
};
