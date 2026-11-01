import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "elastic-slider",
  title: "Elastic Slider",
  word: "elastic",
  blurb: "A single-value slider whose track stretches like a rubber band when dragged past either end and springs back on release.",
  extendsRadix: null,
  props: [
    {
      component: "ElasticSlider",
      rows: [
        { name: "value", type: "number", description: "Controlled value." },
        { name: "defaultValue", type: "number", default: "min", description: "Initial value when uncontrolled." },
        { name: "onValueChange", type: "(value: number) => void", description: "Fires when the snapped value changes, not on every pixel." },
        { name: "min / max", type: "number", default: "0 / 100", description: "Range. Dragging beyond it stretches the track; the value stays clamped." },
        { name: "step", type: "number", default: "1", description: "Snap increment; also the arrow-key step." },
        { name: "label", type: "string", description: "Required. Shown above the track and used as the slider's accessible name." },
        { name: "format", type: "(value: number) => string", description: "Formats the readout and aria-valuetext (units, signs, decimals)." },
        { name: "disabled", type: "boolean", default: "false", description: "Dims the control and ignores input." },
        GLASS_PROP("the thumb"),
      ],
    },
  ],
  a11y: [
    "The thumb is role=\"slider\" with aria-valuemin, aria-valuemax, aria-valuenow and a formatted aria-valuetext, named by the visible label.",
    "Arrows move one step; PageUp/PageDown move a tenth of the range; Home/End jump to the ends. Pushing against an end gives a small elastic nudge.",
    "Pointer dragging uses pointer capture, so the thumb keeps tracking outside the control; touch scrolling is disabled on the track only.",
    "Under prefers-reduced-motion the stretch and spring are skipped entirely; the value and readout behave the same.",
  ],
  optics:
    "THUMB_OPTICS: scale −72, chroma 5, border 0.18, mapBlur 5, blur 0, saturate 1.5 — the same small strong lens as the free Slider. Blur is 0 so the lens bends the coloured track crisply instead of fogging it. The thumb only ever moves by transform, so its displacement map is generated once; the stretch is a scale on the track beneath it.",
  e2e: { surface: '[data-slot="elastic-slider-thumb"]' },
};
