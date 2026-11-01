"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const BAND_OPTICS: LiquidGlassOptions = {
  scale: -104,
  chroma: 6,
  border: 0.24,
  mapBlur: 14,
  magnify: 1.2,
  blur: 0,
  saturate: 1.2,
  fallbackBlur: 1,
};

export interface RefractionMarqueeProps extends Omit<React.ComponentProps<"div">, "children"> {
  items: string[];
  /** Scroll speed in px per second. */
  speed?: number;
  direction?: "left" | "right";
  /** Width of the stationary glass band in px. */
  bandWidth?: number;
  /** Accessible name of the region. */
  label?: string;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function Star() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="mx-[0.35em] size-[0.28em] shrink-0 text-primary" fill="currentColor">
      <path d="M10 0c.6 5.6 3.8 9.4 10 10-6.2.6-9.4 4.4-10 10-.6-5.6-3.8-9.4-10-10C6.2 9.4 9.4 5.6 10 0Z" />
    </svg>
  );
}

function RefractionMarquee({
  items,
  speed = 90,
  direction = "left",
  bandWidth = 200,
  label = "Highlights",
  glass,
  className,
  ref,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: RefractionMarqueeProps) {
  const reduced = useReducedMotion();
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const firstRef = React.useRef<HTMLUListElement | null>(null);
  const animation = React.useRef<Animation | null>(null);
  const rate = React.useRef(1);
  const [reps, setReps] = React.useState(1);
  const [shift, setShift] = React.useState(0);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const paused = hovered || focused;

  // One "rep" is the item list once. Repeat it until a copy covers the viewport,
  // then render two copies; sliding by one copy's width loops seamlessly.
  React.useEffect(() => {
    const viewport = viewportRef.current;
    const first = firstRef.current;
    if (reduced || !viewport || !first) return;
    const measure = () => {
      const repWidth = first.offsetWidth / reps;
      if (repWidth <= 0) return;
      const need = Math.max(1, Math.ceil(viewport.clientWidth / repWidth));
      setReps(need);
      setShift(repWidth * need);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(first);
    return () => ro.disconnect();
  }, [items, reps, reduced]);

  React.useEffect(() => {
    const track = trackRef.current;
    if (reduced || !track || shift <= 0) return;
    const [from, to] = direction === "left" ? [0, -shift] : [-shift, 0];
    const run = track.animate(
      [{ transform: `translate3d(${from}px,0,0)` }, { transform: `translate3d(${to}px,0,0)` }],
      { duration: (shift / Math.max(1, speed)) * 1000, iterations: Infinity, easing: "linear" },
    );
    run.playbackRate = rate.current;
    animation.current = run;
    return () => {
      run.cancel();
      animation.current = null;
    };
  }, [shift, speed, direction, reduced]);

  // Ease to a stop and back instead of freezing mid-word.
  React.useEffect(() => {
    const goal = paused ? 0 : 1;
    let raf = 0;
    const step = () => {
      rate.current += (goal - rate.current) * 0.14;
      if (Math.abs(goal - rate.current) < 0.01) rate.current = goal;
      animation.current?.updatePlaybackRate(rate.current);
      if (rate.current !== goal) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, shift, speed, direction, reduced]);

  if (items.length === 0) return null;

  const group = (index: number) => (
    <ul
      key={index}
      ref={index === 0 ? firstRef : undefined}
      aria-hidden={index === 0 ? undefined : true}
      className={cn("flex shrink-0 items-center", reduced && "flex-wrap justify-center")}
    >
      {Array.from({ length: reduced ? 1 : reps }, (_, rep) =>
        items.map((item, i) => (
          <li
            key={`${rep}-${i}`}
            aria-hidden={index === 0 && rep === 0 ? undefined : true}
            className="flex shrink-0 items-center whitespace-nowrap font-display text-7xl leading-[1.15] text-foreground sm:text-9xl"
          >
            {item}
            <Star />
          </li>
        )),
      )}
    </ul>
  );

  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      tabIndex={0}
      data-slot="refraction-marquee"
      data-paused={paused ? "" : undefined}
      className={cn(
        "relative outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        className,
      )}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        if (e.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        setHovered(false);
      }}
      onFocus={(e) => {
        onFocus?.(e);
        setFocused(true);
      }}
      onBlur={(e) => {
        onBlur?.(e);
        setFocused(false);
      }}
      {...props}
    >
      <div ref={viewportRef} className="relative overflow-hidden">
        {reduced ? (
          group(0)
        ) : (
          <div ref={trackRef} className="flex w-max will-change-transform">
            {Array.from({ length: 2 }, (_, copy) => (
              <React.Fragment key={copy}>{group(copy)}</React.Fragment>
            ))}
          </div>
        )}
        {reduced ? null : (
          <GlassSurface
            aria-hidden
            data-slot="refraction-marquee-band"
            glass={mergeGlass(BAND_OPTICS, glass)}
            className="pointer-events-none absolute inset-y-3 left-1/2 max-w-[80%] -translate-x-1/2 rounded-[2.5rem]"
            style={{ width: bandWidth }}
          />
        )}
      </div>
    </div>
  );
}

export { RefractionMarquee };
