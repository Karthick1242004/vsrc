"use client";

import * as React from "react";
import Lenis from "lenis";

/**
 * Site-wide inertial scrolling. Wheel input is smoothed; touch and keyboard
 * stay native (Lenis default — the correct a11y call). Reduced motion: never
 * instantiated, the plain browser scroll remains.
 *
 * In-page anchors are handled here, NOT via Lenis's `anchors` option: that
 * option never preventDefaults, so the browser's own hash jump races the
 * glide and strands it partway (verified). We kill the default jump, keep
 * the URL deep-linkable via pushState, and let scrollTo honor the target's
 * scroll-margin-top (the sections' scroll-mt-24) for the landing offset.
 */
// ponytail: page behind an open dialog still wheel-scrolls (native behavior
// too); wire lenis.stop()/start() to Radix open state if it ever matters.
export function SmoothScroll() {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true });
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const anchor = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const hash = anchor?.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const node = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!node) return;
      e.preventDefault();
      history.pushState(null, "", hash);
      // Absolute target from window.scrollY, not scrollTo(node): Lenis would
      // add its internal animatedScroll to the rect, and that value lags real
      // scroll for a frame after any native scroll (focus jump, scrollIntoView)
      // — the glide then lands short by exactly that lag (verified).
      const margin = Number.parseFloat(getComputedStyle(node).scrollMarginTop) || 0;
      lenis.scrollTo(node.getBoundingClientRect().top + window.scrollY - margin);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);
  return null;
}
