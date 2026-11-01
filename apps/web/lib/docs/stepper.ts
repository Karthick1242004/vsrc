import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "stepper",
  title: "Stepper",
  word: "stepper",
  blurb: "A multi-step flow with a glass lens that glides to the current step, per-step validation gates and Back/Next controls.",
  builtOn: { label: "MUI Stepper's API (activeStep, StepLabel optional)", href: "https://mui.com/material-ui/react-stepper/" },
  extendsRadix: null,
  props: [
    {
      component: "Stepper",
      rows: [
        { name: "steps", type: "{ id; label; optional?; content; canProceed?; hint? }[]", description: "The flow. `content` is the panel for that step; `canProceed: false` disables Next, and `hint` explains why." },
        { name: "activeStep", type: "number", description: "Controlled zero-based index of the current step (MUI Stepper name)." },
        { name: "defaultActiveStep", type: "number", default: "0", description: "Initial step when uncontrolled." },
        { name: "onActiveStepChange", type: "(index: number) => void", description: "Fires on Next, Back, or when a completed step is clicked." },
        { name: "onComplete", type: "() => void", description: "Fires when Next is pressed on the last step." },
        { name: "backLabel / nextLabel / finishLabel", type: "string", default: '"Back" / "Next" / "Finish"', description: "Button copy." },
        GLASS_PROP("the progress lens"),
      ],
    },
  ],
  a11y: [
    "Steps are an ordered list; the current item carries aria-current=\"step\" and completed or upcoming state is added as screen-reader text, not colour alone.",
    "A polite live region announces \"Step 2 of 4: Region\" on every change, and focus moves to the step panel so a button that just disabled never strands the keyboard.",
    "Completed steps are buttons you can return to; the current and upcoming ones are not interactive, so you cannot skip past a gate.",
    "The lens, rail fill and panel slide are dropped under prefers-reduced-motion.",
  ],
  optics:
    "LENS_OPTICS: scale −56, chroma 4, border 0.18, mapBlur 6, blur 0.5, saturate 1.4 — a small fixed-size 48px lens. It moves by translating one cell-width per step, so its displacement map is built once. It sits under the step markers, so the numbers stay crisp while the rail and backdrop bend through it. Buttons are the free Button, siblings of the lens.",
  e2e: { surface: '[data-slot="stepper-lens"]' },
};
