import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "stat-cards",
  title: "Stat Cards",
  word: "metrics",
  blurb: "A grid of KPI glass cards with count-up numbers, delta chips and sparklines, plus an interactive area chart card.",
  extendsRadix: null,
  props: [
    {
      component: "StatCards",
      rows: [
        { name: "stats", type: "Stat[]", description: "Cards to render: id, label, value, delta (percent), trend (sparkline values), plus optional format (Intl.NumberFormat options), invertDelta and period." },
        { name: "series", type: "{ label: string; value: number }[]", description: "When given, an AreaChartCard is rendered below the grid." },
        { name: "chartTitle / chartDescription / chartFormat", type: "string / string / Intl.NumberFormatOptions", description: "Heading, subtitle and number format for the chart card." },
        { name: "locale", type: "string", default: '"en-US"', description: "Locale for every formatted number." },
        GLASS_PROP("every card"),
      ],
    },
    {
      component: "AreaChartCard",
      rows: [
        { name: "title", type: "string", description: "Card heading; also the accessible name of the chart." },
        { name: "series", type: "{ label: string; value: number }[]", description: "Points, oldest first." },
        { name: "valueFormat", type: "Intl.NumberFormatOptions", description: "Format for readouts and the data table." },
        GLASS_PROP("the card"),
      ],
    },
  ],
  a11y: [
    "Numbers count up only once the card scrolls into view; under prefers-reduced-motion the final value renders immediately and the sparkline and chart appear without the sweep.",
    "Each delta chip carries visually hidden text such as \"up 12.4 percent\"; the arrow is decorative and direction is never colour alone.",
    "The chart SVG is role=\"img\" with a generated summary and is described by a visually hidden data table.",
    "A role=\"slider\" scrubber over the chart takes focus: Arrow keys move one point, Home and End jump to the ends, and the current point is announced as aria-valuetext.",
  ],
  optics: "CARD_OPTICS (scale −80, chroma 3, border 0.07, mapBlur 12, blur 0.5, saturate 1.3): the large-panel recipe, so each wide card bends the backdrop gently without smearing the numbers. The sparkline and chart are plain SVG inside their card, never a second glass surface.",
  e2e: { surface: '[data-slot="stat-card"]' },
};
