"use client";

import * as React from "react";
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

const THUMB = 32; // px; track is inset by half so the thumb never overhangs the control
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
  glass?: LiquidGlassOptions | GlassPreset | false;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

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
  glass,
  className,
  ref,
}: ElasticSliderProps) {
  const [inner, setInner] = React.useState(defaultValue ?? min);
  const controlled = valueProp !== undefined;
  const value = clamp(controlled ? valueProp : inner, min, max);

  const id = React.useId();
  const trackRef = React.useRef<HTMLDivElement>(null);
  const trackBodyRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const stretch = React.useRef({ x: 0, v: 0, raf: 0 });
  const reduced = React.useRef(false);
  const dragging = React.useRef(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => (reduced.current = mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  React.useEffect(() => () => cancelAnimationFrame(stretch.current.raf), []);

  const decimals = (String(step).split(".")[1] ?? "").length;
  const snap = (raw: number) =>
    clamp(Number((Math.round((raw - min) / step) * step + min).toFixed(decimals)), min, max);
  const set = (next: number) => {
    if (next === value) return;
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };

  // Signed overshoot in px: + past the max end, − past the min end. Pure
  // transforms, written straight to the DOM so a drag never re-renders.
  const paint = (x: number) => {
    const track = trackBodyRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;
    const width = track.offsetWidth || 1;
    const pull = Math.abs(x);
    track.style.transformOrigin = x > 0 ? "0% 50%" : "100% 50%";
    track.style.transform = `scale(${1 + pull / width}, ${1 - (0.45 * pull) / (pull + 90)})`;
    thumb.style.translate = `${x}px 0`;
  };

  const release = () => {
    const s = stretch.current;
    cancelAnimationFrame(s.raf);
    if (reduced.current) {
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

  const fromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const raw = (e.clientX - rect.left) / rect.width;
    set(snap(min + clamp(raw, 0, 1) * (max - min)));
    const over = raw < 0 ? e.clientX - rect.left : raw > 1 ? e.clientX - rect.right : 0;
    const s = stretch.current;
    s.x = reduced.current ? 0 : Math.sign(over) * rubber(Math.abs(over), 64);
    s.v = 0;
    paint(s.x);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const big = Math.max(step, Math.round((max - min) / 10 / step) * step);
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = value + step;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = value - step;
    else if (e.key === "PageUp") next = value + big;
    else if (e.key === "PageDown") next = value - big;
    else if (e.key === "Home") next = min;
    else if (e.key === "End") next = max;
    if (next === null) return;
    e.preventDefault();
    const clamped = snap(next);
    // Pushing against an end gives the band a small nudge instead of nothing.
    if (clamped === value && !reduced.current && Math.abs(next - clamped) > 0 && e.key.startsWith("Arrow")) {
      stretch.current.x = next > value ? 7 : -7;
      stretch.current.v = 0;
      paint(stretch.current.x);
      release();
    } else set(clamped);
  };

  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
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
        <output
          htmlFor={`${id}-thumb`}
          data-slot="elastic-slider-value"
          className="font-display text-3xl leading-none tabular-nums"
        >
          {text}
        </output>
      </div>

      <div
        data-slot="elastic-slider-control"
        className={cn("relative h-12 touch-none select-none", disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing")}
        style={{ paddingInline: THUMB / 2 }}
        onPointerDown={(e) => {
          if (disabled || e.button !== 0) return;
          cancelAnimationFrame(stretch.current.raf);
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          thumbRef.current?.focus();
          fromPointer(e);
        }}
        onPointerMove={(e) => dragging.current && fromPointer(e)}
        onPointerUp={(e) => {
          if (!dragging.current) return;
          dragging.current = false;
          if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
          release();
        }}
        onPointerCancel={() => {
          dragging.current = false;
          release();
        }}
      >
        <div ref={trackRef} className="relative h-full w-full">
          <div
            ref={trackBodyRef}
            data-slot="elastic-slider-track"
            className="absolute top-1/2 h-2.5 w-full -translate-y-1/2 overflow-hidden rounded-full will-change-transform"
            style={{
              background:
                "repeating-linear-gradient(90deg, transparent 0 13px, color-mix(in oklab, var(--foreground) 24%, transparent) 13px 14px), color-mix(in oklab, var(--foreground) 14%, transparent)",
            }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background:
                  "linear-gradient(90deg, color-mix(in oklab, var(--primary) 75%, transparent), color-mix(in oklab, var(--signal) 70%, transparent))",
              }}
            />
          </div>
          <div className="absolute top-1/2 left-0" style={{ left: `${pct}%` }}>
            <GlassSurface asChild glass={mergeGlass(THUMB_OPTICS, glass)}>
              <div
                ref={thumbRef}
                id={`${id}-thumb`}
                role="slider"
                tabIndex={disabled ? -1 : 0}
                aria-labelledby={`${id}-label`}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                aria-valuetext={text}
                aria-disabled={disabled || undefined}
                aria-orientation="horizontal"
                data-slot="elastic-slider-thumb"
                className={cn(
                  "-mt-4 -ml-4 rounded-full outline-none transition-[scale,border-color] duration-200 ease-out",
                  "hover:scale-105 [[data-slot=elastic-slider-control]:active_&]:scale-110",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                  "motion-reduce:transition-none",
                )}
                style={{ width: THUMB, height: THUMB }}
                onKeyDown={onKeyDown}
              />
            </GlassSurface>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ElasticSlider };
