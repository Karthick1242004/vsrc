/**
 * The V-/Src wordmark. The -/ is the brand mark in signal red, its two glyphs
 * pulled together — Instrument Serif sets `-` and `/` with a gap, but the mark
 * (see the monogram) never has one. Renders inline glyphs only; the caller owns
 * the wrapping element and its font/size.
 */
export function Wordmark() {
  return (
    <>
      V<span className="text-signal">-<span className="-ml-[0.16em]">/</span></span>Src
    </>
  );
}
