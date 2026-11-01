"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const BAR_OPTICS: LiquidGlassOptions = {
  scale: -120,
  chroma: 8,
  border: 0.3,
  mapBlur: 12,
  magnify: 1.15,
  blur: 0,
  saturate: 1.2,
  fallbackBlur: 1,
};

// The bar is 24% of the heading wide. translateX percentages are relative to the
// bar itself, so sliding from the left edge to the right edge is (100 - 24) / 24.
const BAR_PCT = 24;
const TRAVEL_PCT = ((100 - BAR_PCT) / BAR_PCT) * 100;
const SWEEP_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

export interface PrismHeadlineProps extends Omit<React.ComponentProps<"h2">, "children"> {
  as?: "h1" | "h2" | "h3";
  children: React.ReactNode;
  /** auto: loops; hover: sweeps on pointer hover or focus; inview: sweeps once when scrolled into view. */
  trigger?: "auto" | "hover" | "inview";
  /** 0 to 1. When set, the bar is driven by this value and `trigger` is ignored. */
  progress?: number;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function PrismHeadline({
  as: Tag = "h2",
  children,
  trigger = "auto",
  progress,
  glass,
  className,
  ref,
  onPointerEnter,
  onFocus,
  ...props
}: PrismHeadlineProps) {
  const rootRef = React.useRef<HTMLHeadingElement | null>(null);
  const barRef = React.useRef<HTMLSpanElement | null>(null);
  const runs = React.useRef<Animation[]>([]);

  const setRefs = React.useCallback(
    (node: HTMLHeadingElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const stop = React.useCallback(() => {
    runs.current.forEach((run) => run.cancel());
    runs.current = [];
  }, []);

  const sweep = React.useCallback(
    (loop: boolean) => {
      const bar = barRef.current;
      if (!bar || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      stop();
      // Looping sweeps rest off the end for 40% of the cycle before restarting.
      const duration = loop ? 4200 : 1200;
      const end = loop ? 0.6 : 1;
      const timing = { duration, iterations: loop ? Infinity : 1 };
      const move = bar.animate(
        [
          { transform: "translateX(0%)", easing: SWEEP_EASE },
          { transform: `translateX(${TRAVEL_PCT}%)`, offset: end },
          { transform: `translateX(${TRAVEL_PCT}%)` },
        ],
        timing,
      );
      const fade = bar.animate(
        [
          { opacity: 0, offset: 0 },
          { opacity: 1, offset: end * 0.14 },
          { opacity: 1, offset: end * 0.84 },
          { opacity: 0, offset: end },
          { opacity: 0, offset: 1 },
        ],
        { ...timing, easing: "linear" },
      );
      runs.current = [move, fade];
    },
    [stop],
  );

  React.useEffect(() => {
    if (progress !== undefined) return;
    if (trigger === "auto") sweep(true);
    if (trigger === "inview") {
      const root = rootRef.current;
      if (!root) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            sweep(false);
            io.disconnect();
          }
        },
        { threshold: 0.6 },
      );
      io.observe(root);
      return () => io.disconnect();
    }
    return stop;
  }, [trigger, progress, sweep, stop]);

  React.useEffect(() => stop, [stop]);

  // Controlled progress: position and fade follow the value directly.
  const p = progress === undefined ? null : Math.min(1, Math.max(0, progress));
  const controlledStyle: React.CSSProperties | undefined =
    p === null ? undefined : { transform: `translateX(${p * TRAVEL_PCT}%)`, opacity: Math.max(0, Math.sin(Math.PI * p)) ** 0.5 };

  const replay = () => {
    if (progress === undefined && trigger === "hover" && !runs.current.some((r) => r.playState === "running")) {
      sweep(false);
    }
  };

  return (
    <Tag
      ref={setRefs}
      data-slot="prism-headline"
      className={cn(
        "relative w-fit max-w-full font-display text-4xl leading-[1.05] tracking-tight text-balance text-foreground sm:text-6xl",
        className,
      )}
      onPointerEnter={(e: React.PointerEvent<HTMLHeadingElement>) => {
        onPointerEnter?.(e);
        if (e.pointerType !== "touch") replay();
      }}
      onFocus={(e: React.FocusEvent<HTMLHeadingElement>) => {
        onFocus?.(e);
        replay();
      }}
      {...props}
    >
      {children}
      <GlassSurface
        asChild
        glass={mergeGlass(BAR_OPTICS, glass)}
      >
        <span
          ref={barRef}
          aria-hidden
          data-slot="prism-headline-bar"
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full opacity-0 will-change-transform motion-reduce:hidden"
          style={{ width: `${BAR_PCT}%`, ...controlledStyle }}
        />
      </GlassSurface>
    </Tag>
  );
}

export { PrismHeadline };
