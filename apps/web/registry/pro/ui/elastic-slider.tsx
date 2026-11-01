"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

// The thumb is the lens and the track carries the colour, so blur is 0: the
// lens must bend the stretching track crisply, not fog it. It moves by
// transform only, so its displacement map is generated once.
const THUMB_OPTICS: LiquidGlassOptions = {
  scale: -72,
  chroma: 5,
  border: 0.18,
  mapBlur: 5,
  blur: 0,
  saturate: 1.5,
  fallbackBlur: 1,
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** iOS-style resistance: grows with the pull but saturates at `limit`. */
const rubber = (over: number, limit: number) => (limit * over) / (over + limit * 1.6);

export interface ElasticSliderProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Visible label above the track; also names the slider. */
  label: string;
  /** Formats the readout and aria-valuetext. */
  format?: (value: number) => string;
  disabled?: boolean;
  /** Submits the value with a form. */
  name?: string;
  glass?: LiquidGlassOptions | GlassPreset | false;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Radix Slider (shadcn's Slider base) owns dragging, keys, value and ARIA; this
 * adds the glass lens thumb and the rubber band: pulling past an end stretches
 * the track, and releasing springs it back.
 */
function ElasticSlider({
  value: valueProp,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  format,
  disabled,
  name,
  glass,
  className,
  ref,
}: ElasticSliderProps) {
  const [inner, setInner] = React.useState(defaultValue ?? min);
  const controlled = valueProp !== undefined;
  const value = clamp(controlled ? valueProp : inner, min, max);
  const id = React.useId();
  const trackRef = React.useRef<HTMLSpanElement>(null);
  const thumbRef = React.useRef<HTMLSpanElement>(null);
  const stretch = React.useRef({ x: 0, v: 0, raf: 0 });
  const dragging = React.useRef(false);

  React.useEffect(() => () => cancelAnimationFrame(stretch.current.raf), []);

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const set = (next: number) => {
    if (next === value) return;
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };

  // Signed overshoot in px: + past the max end, − past the min end. Pure
  // transforms, written straight to the DOM so a drag never re-renders.
  const paint = (x: number) => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;
    const width = track.offsetWidth || 1;
    const pull = Math.abs(x);
    track.style.transformOrigin = x > 0 ? "0% 50%" : "100% 50%";
    track.style.transform = `translateY(-50%) scale(${1 + pull / width}, ${1 - (0.45 * pull) / (pull + 90)})`;
    thumb.style.translate = `${x}px 0`;
  };

  const release = () => {
    const s = stretch.current;
    cancelAnimationFrame(s.raf);
    if (reduced()) {
      s.x = 0;
      paint(0);
      return;
    }
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      // Under-damped spring: one small overshoot, like a released band.
      s.v += (-260 * s.x - 15 * s.v) * dt;
      s.x += s.v * dt;
      if (Math.abs(s.x) < 0.15 && Math.abs(s.v) < 0.5) {
        s.x = 0;
        s.v = 0;
        paint(0);
        return;
      }
      paint(s.x);
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
  };

  const pull = (e: React.PointerEvent) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || reduced()) return;
    const over = e.clientX < rect.left ? e.clientX - rect.left : e.clientX > rect.right ? e.clientX - rect.right : 0;
    const s = stretch.current;
    s.x = Math.sign(over) * rubber(Math.abs(over), 64);
    s.v = 0;
    paint(s.x);
  };

  // Pushing against an end with the keys gives the band a small nudge instead of nothing.
  const nudge = (e: React.KeyboardEvent) => {
    if (disabled || reduced()) return;
    const up = e.key === "ArrowRight" || e.key === "ArrowUp";
    const down = e.key === "ArrowLeft" || e.key === "ArrowDown";
    if (!((up && value >= max) || (down && value <= min))) return;
    stretch.current.x = up ? 7 : -7;
    stretch.current.v = 0;
    paint(stretch.current.x);
    release();
  };

  const text = format ? format(value) : String(value);

  return (
    <div
      ref={ref}
      data-slot="elastic-slider"
      data-disabled={disabled ? "" : undefined}
      className={cn("flex w-full flex-col gap-3 data-[disabled]:opacity-50", className)}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span id={`${id}-label`} className="text-sm font-medium">
          {label}
        </span>
        <output htmlFor={`${id}-thumb`} data-slot="elastic-slider-value" className="font-display text-3xl leading-none tabular-nums">
          {text}
        </output>
      </div>
      <SliderPrimitive.Root
        data-slot="elastic-slider-control"
        value={[value]}
        onValueChange={([v]) => v !== undefined && set(v)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        name={name}
        className={cn(
          "relative flex h-12 w-full touch-none items-center select-none",
          disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing",
        )}
        onPointerDown={() => {
          cancelAnimationFrame(stretch.current.raf);
          dragging.current = true;
        }}
        onPointerMove={(e) => dragging.current && e.buttons & 1 && pull(e)}
        onPointerUp={() => {
          if (!dragging.current) return;
          dragging.current = false;
          release();
        }}
        onPointerCancel={() => {
          dragging.current = false;
          release();
        }}
      >
        <SliderPrimitive.Track
          ref={trackRef}
          data-slot="elastic-slider-track"
          className="absolute top-1/2 h-2.5 w-full -translate-y-1/2 overflow-hidden rounded-full will-change-transform"
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent 0 13px, color-mix(in oklab, var(--foreground) 24%, transparent) 13px 14px), color-mix(in oklab, var(--foreground) 14%, transparent)",
          }}
        >
          <SliderPrimitive.Range
            className="absolute h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, color-mix(in oklab, var(--primary) 75%, transparent), color-mix(in oklab, var(--signal) 70%, transparent))",
            }}
          />
        </SliderPrimitive.Track>
        <GlassSurface asChild glass={mergeGlass(THUMB_OPTICS, glass)}>
          <SliderPrimitive.Thumb
            ref={thumbRef}
            id={`${id}-thumb`}
            aria-labelledby={`${id}-label`}
            aria-valuetext={text}
            data-slot="elastic-slider-thumb"
            onKeyDown={nudge}
            className={cn(
              "block size-8 rounded-full outline-none transition-[scale,border-color] duration-200 ease-out",
              "hover:scale-105 [[data-slot=elastic-slider-control]:active_&]:scale-110",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
              "motion-reduce:transition-none",
            )}
          />
        </GlassSurface>
      </SliderPrimitive.Root>
    </div>
  );
}

export { ElasticSlider };
