"use client";

import * as React from "react";
import { liquidGlass } from "./engine";
import type { GlassMode, LiquidGlassOptions } from "./engine";

export type { GlassMode, LiquidGlassOptions };

/**
 * Apply liquid glass to the element in `ref`. Returns the active mode
 * ("refract" | "frosted" | "reduced" | "none") once mounted, so callers can
 * adapt styling. Pass `false` instead of options to disable the effect (e.g.
 * a ghost variant) — hooks can't be called conditionally, a sentinel can.
 * The effect re-applies when option values change and cleans up on unmount.
 */
export function useLiquidGlass<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  options?: LiquidGlassOptions | false,
): GlassMode {
  const [mode, setMode] = React.useState<GlassMode>("none");
  // Key on option values, not object identity — inline objects would
  // otherwise tear down and rebuild the filter every render.
  const optionsKey = JSON.stringify(options ?? {});

  React.useEffect(() => {
    const el = ref.current;
    if (!el || optionsKey === "false") return;
    const glass = liquidGlass(el, JSON.parse(optionsKey) as LiquidGlassOptions);
    setMode(glass.mode);
    return () => {
      glass.destroy();
      setMode("none");
    };
  }, [ref, optionsKey]);

  return mode;
}

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optics options forwarded to the engine; `false` disables the effect. */
  glass?: LiquidGlassOptions | false;
}

/**
 * Unstyled refraction primitive: a div with the liquid-glass effect wired up.
 * Material dressing (tint, speculars, shadows, radius) is the caller's CSS —
 * the registry's `glass-surface` component adds the styled V-/Src material.
 */
export const GlassSurface = React.forwardRef<HTMLDivElement, GlassSurfaceProps>(
  function GlassSurface({ glass, ...props }, forwardedRef) {
    const localRef = React.useRef<HTMLDivElement | null>(null);
    useLiquidGlass(localRef, glass);
    const composedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );
    return <div ref={composedRef} {...props} />;
  },
);
