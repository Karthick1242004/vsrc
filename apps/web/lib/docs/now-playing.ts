import { GLASS_PROP, type DocBody } from "@/lib/docs/types";

export const doc: DocBody = {
  slug: "now-playing",
  title: "Now Playing",
  word: "playing",
  blurb: "A music player card with a seekable scrubber, transport controls and a live equaliser, driven by a simulated clock.",
  extendsRadix: null,
  props: [
    {
      component: "NowPlaying",
      rows: [
        { name: "track", type: "{ title: string; artist: string; duration: number; art?: ReactNode }", description: "Current track; `duration` is in seconds. Changing it resets the clock to 0:00." },
        { name: "playing / defaultPlaying / onPlayingChange", type: "boolean", default: "false", description: "Controlled or uncontrolled play state. The clock only runs while playing." },
        { name: "onPrevious / onNext", type: "() => void", description: "Previous restarts the track when more than 3s in. onNext also fires when a track ends; without it the card stops at 0:00." },
        { name: "onSeek", type: "(seconds: number) => void", description: "Fires on pointer scrub and keyboard seeking." },
        GLASS_PROP("the card"),
      ],
    },
  ],
  a11y: [
    "The scrubber is role=\"slider\" with aria-valuenow, aria-valuemax and a spoken aria-valuetext like \"1:12 of 3:34\". Left/Down and Right/Up move 5 seconds, Page Up/Down 15, Home and End jump to the ends.",
    "One play button whose label swaps between Play and Pause; previous and next are labelled icon buttons.",
    "The equaliser is decorative (aria-hidden); the title block is a polite live region so track changes are announced.",
    "The clock uses requestAnimationFrame only while playing and is cancelled on pause and unmount. Under reduced motion the equaliser holds still and the art stops scaling.",
  ],
  optics:
    "CARD_OPTICS: scale −72, chroma 3, border 0.08, mapBlur 12, blur 3. One calm pane, with the art and controls sitting on it rather than in second surfaces. The bar moves by scaleX and the thumb by left, so the displacement map is never regenerated while playing.",
  e2e: { surface: '[data-slot="now-playing"]' },
};
