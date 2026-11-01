import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "date-picker",
  title: "Date Picker",
  word: "date",
  blurb: "A glass date field with a popover calendar, single or range selection, and full keyboard navigation, built without a date library.",
  extendsRadix: { label: "Radix Popover", href: "https://www.radix-ui.com/primitives/docs/components/popover" },
  props: [
    {
      component: "DatePicker",
      rows: [
        { name: "mode", type: '"single" | "range"', default: '"single"', description: "Single value is a Date; range value is { from?, to? }." },
        { name: "value / defaultValue", type: "Date | { from?: Date; to?: Date }", description: "Controlled or initial selection." },
        { name: "onValueChange", type: "(value) => void", description: "Fires on every change, including clearing. Range fires once per click." },
        { name: "min / max", type: "Date", description: "Earliest and latest selectable day." },
        { name: "disabled", type: "(date: Date) => boolean", description: "Return true to disable a day, for example weekends." },
        { name: "placeholder", type: "string", default: '"Pick a date"', description: "Trigger text when nothing is selected." },
        { name: "locale", type: "string", default: '"en-US"', description: "Intl locale for the trigger, month title and weekday names." },
        { name: "weekStartsOn", type: "0 | 1", default: "0", description: "First column of the grid: Sunday or Monday." },
        GLASS_PROP("the trigger and the calendar panel"),
      ],
    },
  ],
  a11y: [
    "The calendar is a role=\"grid\" of rows and gridcells with labelled column headers; each day button has a full-date accessible name and aria-current=\"date\" marks today.",
    "Roving tabindex: one Tab stop in the grid. Arrow keys move by day and week, Home and End by week edge, PageUp and PageDown by month, Shift plus PageUp or PageDown by year.",
    "Disabled days stay focusable with aria-disabled so keyboard travel is never blocked; they cannot be selected.",
    "Escape closes and returns focus to the trigger. The month slide is skipped under prefers-reduced-motion.",
  ],
  optics: "TRIGGER_OPTICS (scale -40, border 0.18, mapBlur 6) matches the free Input; PANEL_OPTICS (scale -80, border 0.08, mapBlur 12, fallbackBlur 6) is the large-panel range. Day buttons are plain, never nested glass. Today is computed after mount to avoid hydration mismatches.",
  e2e: { surface: '[data-slot="date-picker"]' },
};
