import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "combobox",
  title: "Combobox",
  word: "combobox",
  blurb: "A searchable select with single and multiple modes, grouped options and removable chips, in a glass popover.",
  extendsRadix: { label: "Radix Popover + cmdk", href: "https://www.radix-ui.com/primitives/docs/components/popover" },
  props: [
    {
      component: "Combobox",
      rows: [
        { name: "options", type: "{ value: string; label: string; group?: string; disabled?: boolean }[]", description: "Options to search. Options sharing a group are listed under its heading." },
        { name: "multiple", type: "boolean", default: "false", description: "Multi-select: value becomes string[] and picks render as removable chips." },
        { name: "value / defaultValue", type: "string | string[]", description: "Controlled or initial selection. A string, or string[] when multiple." },
        { name: "onValueChange", type: "(value) => void", description: "Fires on every change. Single mode passes string | undefined." },
        { name: "placeholder", type: "string", default: '"Select…"', description: "Trigger text when nothing is selected." },
        { name: "emptyText", type: "string", default: '"No results found."', description: "Shown when the search matches nothing." },
        { name: "searchPlaceholder", type: "string", default: '"Search…"', description: "Placeholder of the search input in the panel." },
        GLASS_PROP("the field and the options panel"),
      ],
    },
  ],
  a11y: [
    "The trigger is a role=\"combobox\" with aria-expanded, aria-haspopup=\"listbox\" and aria-controls; cmdk supplies the labelled input and the listbox/option roles with an active descendant.",
    "Type to filter, Up and Down to move, Enter to choose, Escape to close with focus returned to the trigger. Backspace on an empty search or on the trigger removes the last chip.",
    "Each chip's remove button is named \"Remove <label>\"; a removal returns focus to the trigger.",
    "Disabled options are skipped by the keyboard and announced as disabled. Chip entrance and chevron rotation are static under prefers-reduced-motion.",
  ],
  optics: "FIELD_OPTICS (scale -40, border 0.18, mapBlur 6) for the always-visible field; PANEL_OPTICS (scale -72, border 0.08, mapBlur 12, fallbackBlur 6) for the options panel. Chips and options are flat, so no glass is nested.",
  e2e: { surface: '[data-slot="combobox"]' },
};
