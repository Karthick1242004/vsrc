import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "notification-centre",
  title: "Notification Centre",
  word: "notification",
  blurb: "A bell with an unread badge that opens a glass panel of notifications grouped into Today and Earlier.",
  extendsRadix: {
    label: "Radix Popover",
    href: "https://www.radix-ui.com/primitives/docs/components/popover",
  },
  props: [
    {
      component: "NotificationCentre",
      rows: [
        { name: "notifications", type: "{ id; name; text; time; group: \"today\" | \"earlier\"; read }[]", description: "Controlled list. `time` is a ready-made string such as \"12 min ago\"; the component never reads a clock." },
        { name: "onRead", type: "(ids: string[]) => void", description: "One id for a row, every unread id for \"Mark all read\". You update `read` in your state." },
        { name: "onClear", type: "() => void", description: "Fires from the Clear button; empty your list to show the empty state." },
        GLASS_PROP("the popover panel"),
      ],
    },
  ],
  a11y: [
    "The bell's accessible name carries the count (\"Notifications, 2 unread\"); the visual badge is hidden from assistive tech so it is not read twice.",
    "Rows are one tab stop. ArrowUp/ArrowDown, Home and End move between them across both groups; Enter or Space marks the focused row read.",
    "Each group is a labelled section with a heading, unread rows add \"unread\" as screen-reader text, and every mark-read dot has a descriptive name.",
    "Radix handles Escape and returning focus to the bell; \"Mark all read\" and \"Clear\" disable themselves when there is nothing to do.",
  ],
  optics:
    "PANEL_OPTICS: scale −88, chroma 3, border 0.07, mapBlur 14, blur 6, saturate 1.2 — a large panel with a shallow bend. Only the panel is glass; the rows are plain so scrolling text never sits inside a second filter. The badge is a sibling of the bell, not a child, because the glass button clips its own overflow.",
  e2e: {
    surface: '[data-slot="notification-centre-panel"]',
    open: { action: "click", target: '[data-demo="notification-centre"] [data-slot="button"]' },
  },
};
