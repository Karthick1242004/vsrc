import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "pill-nav",
  title: "Pill Nav",
  word: "glide",
  blurb: "A pill of real links with a single glass lens that glides to the hovered or focused link and rests on the current page.",
  extendsRadix: null,
  props: [
    {
      component: "PillNav",
      rows: [
        { name: "items", type: "{ label: string; href: string; value?: string }[]", description: "The links. `value` defaults to href." },
        { name: "value", type: "string", description: "Controlled current item." },
        { name: "defaultValue", type: "string", description: "Initial current item when uncontrolled. Defaults to the first." },
        { name: "onValueChange", type: "(value: string) => void", description: "Called when a link is clicked." },
        { name: "renderLink", type: "(props: ComponentProps<\"a\">) => ReactNode", description: "Render each link with your router's Link; it must forward className, href and data-* props." },
        GLASS_PROP("the lens"),
      ],
    },
  ],
  a11y: [
    "Plain nav, list and anchors: Tab walks the links, Enter follows them. Give the nav an aria-label.",
    "The current link carries aria-current=\"page\"; the lens is aria-hidden and pointer-events-none.",
    "Keyboard focus moves the lens exactly like hover, and it returns to the current link when focus leaves.",
    "Touch taps do not trigger hover travel; under reduced motion the lens jumps without gliding.",
  ],
  optics:
    "LENS_OPTICS: scale −40, chroma 3, border 0.12, mapBlur 4, blur 0.5. The lens is about 40px tall, so the rim band stays near a third of its height and the label reads clearly through the middle. Only the lens is glass; the track behind it is a plain translucent pill, since glass inside glass is not allowed. The lens sits above the labels so it visibly bends them as it passes.",
  e2e: { surface: '[data-slot="pill-nav-lens"]' },
};
