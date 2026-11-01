import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "data-table",
  title: "Data Table",
  word: "table",
  blurb: "A typed table with sorting, filtering, row selection and pagination, inside one glass panel with plain rows.",
  builtOn: { label: "TanStack Table, the engine behind shadcn Data Table", href: "https://ui.shadcn.com/docs/components/data-table" },
  extendsRadix: { label: "Radix Scroll Area", href: "https://www.radix-ui.com/primitives/docs/components/scroll-area" },
  props: [
    {
      component: "DataTable<T>",
      rows: [
        { name: "columns", type: "{ key: string; header: string; cell?: (row: T) => ReactNode; sortable?: boolean; align?: \"left\" | \"center\" | \"right\"; width?: number | string; sortValue?: (row: T) => string | number }[]", description: "Column definitions. `key` is read from each row for filtering and sorting; `cell` customises display and `sortValue` the sort key." },
        { name: "data", type: "T[]", description: "Rows. Sorting and filtering are client-side." },
        { name: "getRowId", type: "(row: T, index: number) => string", description: "Stable id for selection. Defaults to the index in `data`; provide one if data can reorder." },
        { name: "pageSize / pageSizeOptions", type: "number / number[]", default: "8 / [5, 10, 25]", description: "Initial rows per page and the choices in the footer select." },
        { name: "selectable / onSelectionChange", type: "boolean / (ids: string[]) => void", default: "false", description: "Adds a checkbox column. The header box selects the current page and shows a mixed state; selection persists across pages and filters." },
        { name: "loading", type: "boolean", default: "false", description: "Shows skeleton rows and sets aria-busy." },
        { name: "caption", type: "string", default: "\"Data table\"", description: "Visually hidden caption that names the table." },
        { name: "filterPlaceholder / emptyMessage / actions", type: "string / ReactNode / ReactNode", description: "Filter placeholder, empty-state content, and toolbar slot at the end of the filter row." },
        GLASS_PROP("the panel"),
      ],
    },
  ],
  a11y: [
    "A semantic table: a hidden caption, th scope=\"col\", and aria-sort on sortable headers. Each sortable header is a button that cycles ascending, descending, none.",
    "The scrollable region is focusable and labelled so the keyboard can scroll it; the header stays sticky while the body scrolls.",
    "Every checkbox has a name (\"Select all rows on this page\", \"Select INV-2041\"); the header box exposes a mixed state. The range text is a polite live region that also reports the sort.",
    "Rows hold no glass and never animate; skeleton pulses stop under prefers-reduced-motion.",
  ],
  optics:
    "TABLE_OPTICS: scale −80, chroma 3, border 0.07, mapBlur 14, blur 3. One large panel; rows and the sticky header are plain so text never sits on a refracting edge. The panel's height follows the row count, so its map regenerates once after a page change that shortens the list.",
  e2e: { surface: '[data-slot="data-table"]' },
};
