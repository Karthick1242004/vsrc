"use client";

import * as React from "react";

/**
 * Boot loader, shown on every full document load: the monogram's two strokes
 * draw themselves, then "V" and "Src" resolve in around them — the mark
 * becoming the wordmark. Pure CSS animation (globals.css) so it plays from
 * first paint, before hydration; JS only decides when to lift the overlay
 * (window loaded + one full animation cycle). Client-side route changes
 * never remount the layout, so internal navigation skips it by design.
 *
 * Mark hygiene: single color, level, never behind glass — the draw-in is a
 * reveal, the final lockup is exact.
 */
export function SiteLoader() {
  const [exiting, setExiting] = React.useState(false);
  const [gone, setGone] = React.useState(false);

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minTime = reduce ? 0 : 1700;
    const mounted = performance.now();
    let lift = 0;
    let safety = 0;
    const finish = () => {
      const wait = Math.max(0, minTime - (performance.now() - mounted));
      lift = window.setTimeout(() => {
        // Boot signal for <Reveal>: hero rises through the fading overlay.
        // The attribute outlives the loader, so client-side navigations
        // reveal on viewport alone.
        document.documentElement.setAttribute("data-booted", "");
        window.dispatchEvent(new Event("vsrc:booted"));
        // Reduced motion gets no exit fade either — remove immediately.
        if (reduce) setGone(true);
        else {
          setExiting(true);
          // transitionend can be missed (tab hidden); never strand the overlay.
          safety = window.setTimeout(() => setGone(true), 900);
        }
      }, wait);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(lift);
      clearTimeout(safety);
    };
  }, []);

  if (gone) return null;
  return (
    <div
      aria-hidden
      data-exiting={exiting || undefined}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "opacity") setGone(true);
      }}
      className="site-loader fixed inset-0 z-[55] flex items-center justify-center bg-background"
    >
      {/* No-JS visitors must never be stranded behind the overlay — nor
          behind permanently-hidden reveals. */}
      <noscript>
        <style>{".site-loader{display:none}[data-reveal]{opacity:1;translate:none}"}</style>
      </noscript>
      <p className="site-loader-lockup flex items-center font-display text-[clamp(3.5rem,10vw,6.5rem)] leading-none text-foreground">
        <span className="site-loader-v">V</span>
        <svg
          viewBox="0 0 100 100"
          className="site-loader-mark mx-[-0.06em] size-[0.82em] text-signal"
        >
          <path
            className="site-loader-dash"
            d="M22 50 H55"
            fill="none"
            stroke="currentColor"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            className="site-loader-slash"
            d="M46 76 L80 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="13"
            strokeLinecap="round"
          />
        </svg>
        <span className="site-loader-src">Src</span>
      </p>
    </div>
  );
}
