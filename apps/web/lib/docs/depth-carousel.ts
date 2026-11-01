import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "depth-carousel",
  title: "Depth Carousel",
  word: "depth",
  blurb: "A carousel where the centre card sits forward and its neighbours tilt, shrink and fade behind it.",
  extendsRadix: null,
  props: [
    {
      component: "DepthCarousel",
      rows: [
        { name: "items", type: "{ id: string; title: string; caption?: string; art: ReactNode }[]", description: "Cards. `art` fills the card's picture area (use size-full); keep the list to a dozen or fewer, as up to five glass cards are mounted at once." },
        { name: "value / defaultValue / onValueChange", type: "number", default: "0", description: "Index of the centred card." },
        { name: "label", type: "string", default: "\"Gallery\"", description: "Accessible name of the carousel region." },
        GLASS_PROP("each card"),
      ],
    },
  ],
  a11y: [
    "The wrapper is role=\"region\" with aria-roledescription=\"carousel\" and is focusable; Left and Right arrow keys move one card.",
    "Each card is a role=\"group\" with aria-roledescription=\"slide\" and aria-label \"i of n\". Off-centre cards are aria-hidden and hold nothing focusable; clicking one brings it forward.",
    "Previous/next buttons and dot buttons (aria-current) are labelled and reachable by Tab; the ends disable their arrow.",
    "Dragging and swiping use pointer events with a flick and snap; transitions are removed under prefers-reduced-motion.",
  ],
  optics:
    "CARD_OPTICS: scale −64, chroma 3, border 0.1, mapBlur 10. Cards are sibling panes over the page, never nested. Depth comes only from perspective, translate3d, rotateY, scale and opacity, so card sizes never change and the maps are generated once; only cards within about two places of the centre are mounted.",
  e2e: { surface: '[data-slot="depth-carousel-card"]' },
};
