import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "card-stack",
  title: "Card Stack",
  word: "swipe",
  blurb: "A swipeable stack of picture cards: drag, tap Skip or Keep, or use the arrow keys, then undo if you slipped.",
  extendsRadix: null,
  props: [
    {
      component: "CardStack",
      rows: [
        { name: "items", type: "{ id: string; title: string; subtitle?: string; art: ReactNode }[]", description: "Cards in order; the first is on top. `art` fills the whole card behind the glass caption plate." },
        { name: "onSwipe", type: "(item, direction: \"left\" | \"right\") => void", description: "Fires once the card has left the stack. Left is skip, right is keep." },
        { name: "onUndo", type: "(item) => void", description: "Fires when the last card is restored." },
        { name: "onReset", type: "() => void", description: "Fires from the empty state's Start over button." },
        GLASS_PROP("each card's caption plate"),
      ],
    },
  ],
  a11y: [
    "The stack is a focusable group: Left arrow skips and Right arrow keeps, described to assistive tech by a hidden instruction. The labelled Skip, Keep and Undo last swipe buttons do the same without a pointer.",
    "Only the top card is exposed; the two behind it are aria-hidden. A polite live region announces \"Kept …\" or \"Skipped …\" with the number remaining.",
    "Dragging uses pointer capture with a distance and flick threshold; vertical touch scrolling still works over the card.",
    "Under prefers-reduced-motion cards leave and return instantly, with no travel or rotation animation.",
  ],
  optics:
    "PLATE_OPTICS: scale −56, chroma 3, border 0.12, mapBlur 8, blur 2. Only the caption plate is glass, laid over the card's art, so the lens always has a picture to bend. The card moves, rotates and scales with transform only, so no map is regenerated mid-gesture.",
  e2e: { surface: '[data-slot="card-stack-plate"]' },
};
