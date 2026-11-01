import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "dynamic-island",
  title: "Dynamic Island",
  word: "dynamic",
  blurb: "A glass pill that springs between idle, incoming call, timer and now-playing, cross-fading its content.",
  extendsRadix: null,
  props: [
    {
      component: "DynamicIsland",
      rows: [
        { name: "state", type: `"idle" | "call" | "timer" | "playing"`, description: "Controlled state (exported as DynamicIslandState). Pair with onStateChange." },
        { name: "defaultState", type: "DynamicIslandState", default: `"idle"`, description: "Initial state when uncontrolled." },
        { name: "onStateChange", type: "(state: DynamicIslandState) => void", description: "Called when a button inside the island requests a new state: decline, answer or stop." },
        { name: "caller", type: "{ name: string; detail?: string }", description: "Who is calling in the call state." },
        { name: "track", type: "{ title: string; artist: string }", description: "What is playing in the playing state." },
        GLASS_PROP("the pill"),
      ],
    },
  ],
  a11y: [
    "A visually hidden role=\"status\" region announces each state politely (for example \"Incoming call from Maya Chen\"); the ticking timer digits are hidden from it so it never chatters.",
    "Only the active state's content is interactive: inactive layers are inert, so Tab never reaches hidden buttons.",
    "When a button inside the island changes the state, focus moves to the new state's primary action, or to the island if it has none.",
    "Icon buttons carry explicit names; the size spring, cross-fade and equalizer stop under prefers-reduced-motion, leaving an instant swap.",
  ],
  optics:
    "ISLAND_OPTICS: scale −48, chroma 3, border 0.2, mapBlur 7, blur 3. Resizing is the point of this component, so width and height animate with a spring-shaped CSS transition; the displacement map settles about 120 ms after the pill stops moving. Content layers cross-fade with opacity and a small blur and are never glass themselves.",
  e2e: { surface: '[data-slot="dynamic-island"]' },
};
