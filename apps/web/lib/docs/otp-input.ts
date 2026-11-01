import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "otp-input",
  title: "OTP Input",
  word: "otp",
  blurb: "A row of glass cells for one-time codes with auto-advance, paste distribution, an error shake and an onComplete callback.",
  extendsRadix: null,
  builtOn: { label: "input-otp, the library behind shadcn Input OTP", href: "https://ui.shadcn.com/docs/components/input-otp" },
  props: [
    {
      component: "OtpInput",
      rows: [
        { name: "length", type: "number", default: "6", description: "Number of digit cells." },
        { name: "value / defaultValue", type: "string", description: "Controlled or initial code. Non-digits are stripped." },
        { name: "onValueChange", type: "(value: string) => void", description: "Fires whenever the code changes." },
        { name: "onComplete", type: "(value: string) => void", description: "Fires once when the last cell is filled." },
        { name: "invalid", type: "boolean", default: "false", description: "Sets aria-invalid on every cell, draws a signal ring and shakes the row." },
        { name: "disabled", type: "boolean", default: "false", description: "Disables all cells." },
        { name: "label", type: "string", default: '"One-time code"', description: "Accessible name of the input." },
        { name: "name", type: "string", description: "Adds a hidden input so the code submits with a form." },
        GLASS_PROP("each cell"),
      ],
    },
  ],
  a11y: [
    "One real input (input-otp) carries the label, inputMode=\"numeric\" and autoComplete=\"one-time-code\", so SMS autofill, paste and screen readers see a single field; the glass cells only draw its state.",
    "Typing advances, Backspace clears and steps back, Left and Right move, Home and End jump; pasting a full code fills every cell.",
    "Roving tabindex gives the row a single Tab stop at the next empty cell.",
    "invalid sets aria-invalid; the shake is skipped under prefers-reduced-motion and the ring remains.",
  ],
  optics: "CELL_OPTICS: scale -40, chroma 3, border 0.18, mapBlur 6, blur 0.5, saturate 1.3, fallbackBlur 2, the same small-control values as the free Input. Each cell is its own sibling glass surface; the shake moves the row with transform so no map is regenerated.",
  e2e: { surface: '[data-slot="otp-input-cell"]' },
};
