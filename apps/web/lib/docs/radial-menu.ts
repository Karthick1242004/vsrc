import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "radial-menu",
  title: "Radial Menu",
  word: "radial",
  blurb: "A round trigger that fans three to eight glass buttons out along an arc, with a staggered spring and a caption for the focused item.",
  extendsRadix: null,
  props: [
    {
      component: "RadialMenu",
      rows: [
        { name: "items", type: "{ id: string; label: string; icon: ReactNode; onSelect?: () => void }[]", description: "Three to eight items; extras are ignored. `label` is the aria-label and the caption." },
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Initial state when uncontrolled." },
        { name: "onOpenChange", type: "(open: boolean) => void", description: "Called whenever the menu opens or closes." },
        { name: "radius", type: "number", default: "92", description: "Distance in px from the trigger centre to each item centre." },
        { name: "startAngle", type: "number", default: "-160", description: "Degrees; 0 is right, positive is clockwise, so -90 is straight up." },
        { name: "endAngle", type: "number", default: "-20", description: "Angle of the last item. Items are spaced evenly between start and end." },
        { name: "label", type: "string", default: `"Actions"`, description: "Accessible name of the trigger and of the item group." },
        GLASS_PROP("the trigger and every item"),
      ],
    },
  ],
  a11y: [
    "The trigger has aria-expanded and aria-controls; items are real buttons, each with an aria-label, inside a toolbar.",
    "Opening from the trigger moves focus to the first item. Arrow keys, Home and End rove focus with wrap-around; only one item is in the Tab order.",
    "Escape closes and returns focus to the trigger; so do choosing an item, clicking outside, and tabbing away.",
    "The closed fan is inert. Under reduced motion items do not travel, they only fade in at their final positions.",
  ],
  optics:
    "RADIAL_OPTICS: scale −48, chroma 4, border 0.18, mapBlur 6, blur 0.5, shared by the trigger and each item. Every button is its own sibling glass surface; items animate with translate, scale and opacity only, so their displacement maps never regenerate.",
  e2e: { surface: '[data-slot="radial-menu-trigger"]' },
};
