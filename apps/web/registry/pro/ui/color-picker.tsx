"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { Button } from "@/registry/vsrc/ui/button";
import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

// A large, calm panel: shallow bend and a wide soft edge so the saturation
// square (the busiest thing on it) never fights the lens.
const PANEL_OPTICS: LiquidGlassOptions = {
  scale: -88,
  chroma: 3,
  border: 0.07,
  mapBlur: 14,
  blur: 6,
  saturate: 1.2,
  fallbackBlur: 10,
};

export const DEFAULT_SWATCHES = [
  "#e02723",
  "#f08a24",
  "#f4c542",
  "#3fa66b",
  "#2f8fd8",
  "#6b5bd6",
  "#d6549b",
  "#1b1a18",
];

/* ------------------------------ colour math ------------------------------ */

interface HSVA {
  h: number; // 0-360
  s: number; // 0-1
  v: number; // 0-1
  a: number; // 0-1
}

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const d = max - Math.min(rn, gn, bn);
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

function toHex({ h, s, v, a }: HSVA, withAlpha: boolean): string {
  const part = (n: number) => n.toString(16).padStart(2, "0");
  const [r, g, b] = hsvToRgb(h, s, v);
  const base = `#${part(r)}${part(g)}${part(b)}`;
  return withAlpha && a < 1 ? base + part(Math.round(a * 255)) : base;
}

/** Accepts #rgb, #rgba, #rrggbb, #rrggbbaa (the # is optional). */
function parseHex(input: string): HSVA | null {
  let t = input.trim().replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(t)) return null;
  if (t.length === 3 || t.length === 4) t = [...t].map((c) => c + c).join("");
  if (t.length !== 6 && t.length !== 8) return null;
  const n = (i: number) => parseInt(t.slice(i, i + 2), 16);
  return { ...rgbToHsv(n(0), n(2), n(4)), a: t.length === 8 ? n(6) / 255 : 1 };
}

/* ------------------------------ drag + keys ------------------------------ */

/** Pointer-captured dragging that reports a 0–1 position inside the element. */
function useDrag(onDrag: (x: number, y: number) => void) {
  const active = React.useRef(false);
  const read = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onDrag(clamp((e.clientX - r.left) / r.width), clamp((e.clientY - r.top) / r.height));
  };
  const end = (e: React.PointerEvent<HTMLElement>) => {
    active.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };
  return {
    onPointerDown(e: React.PointerEvent<HTMLElement>) {
      if (e.button !== 0) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      active.current = true;
      e.currentTarget.focus();
      read(e);
    },
    onPointerMove(e: React.PointerEvent<HTMLElement>) {
      if (active.current) read(e);
    },
    onPointerUp: end,
    onPointerCancel: end,
  };
}

const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, 1],
  ArrowDown: [0, -1],
};

const thumbClass =
  "pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.35),0_2px_6px_rgb(0_0_0/0.3)] transition-transform group-active:scale-125 motion-reduce:transition-none";

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

const CHECKER =
  "conic-gradient(color-mix(in oklab, var(--foreground) 18%, transparent) 25%, transparent 0 50%, color-mix(in oklab, var(--foreground) 18%, transparent) 0 75%, transparent 0) 0 0 / 8px 8px";

/** A hue or alpha track: one-axis slider with role=slider on the track. */
function ChannelSlider({
  label,
  max,
  value,
  unit,
  background,
  onChange,
  step = 1,
  bigStep = 10,
}: {
  label: string;
  max: number;
  value: number;
  unit: string;
  background: string;
  onChange: (v: number) => void;
  step?: number;
  bigStep?: number;
}) {
  const drag = useDrag((x) => onChange(x * max));
  const onKeyDown = (e: React.KeyboardEvent) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
    let next: number | null = null;
    if (dir) next = value + dir * (e.shiftKey ? bigStep : step);
    else if (e.key === "PageUp") next = value + bigStep;
    else if (e.key === "PageDown") next = value - bigStep;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = max;
    if (next === null) return;
    e.preventDefault();
    onChange(clamp(next, 0, max));
  };
  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      aria-valuetext={`${Math.round(value)}${unit}`}
      data-slot="color-picker-channel"
      className={cn("group relative h-3.5 touch-none cursor-pointer rounded-full", focusRing)}
      style={{ background }}
      onKeyDown={onKeyDown}
      {...drag}
    >
      <span
        className={cn(thumbClass, "top-1/2")}
        style={{ left: `${(value / max) * 100}%`, background: "transparent" }}
      />
    </div>
  );
}

/* -------------------------------- component -------------------------------- */

export interface ColorPickerProps {
  /** Controlled colour as a hex string (#rrggbb, or #rrggbbaa when `alpha`). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (hex: string) => void;
  /** Quick-pick colours shown under the hex field. */
  swatches?: string[];
  /** Adds an opacity slider; emitted hex gains two digits when opacity < 100%. */
  alpha?: boolean;
  /** Accessible name for the trigger. */
  label?: string;
  /** Optics override for the popover panel. */
  glass?: LiquidGlassOptions | GlassPreset | false;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

function ColorPicker({
  value,
  defaultValue = "#e02723",
  onValueChange,
  swatches = DEFAULT_SWATCHES,
  alpha = false,
  label = "Choose colour",
  glass,
  className,
  ref,
}: ColorPickerProps) {
  const [hsva, setHsva] = React.useState<HSVA>(
    () => parseHex(value ?? defaultValue) ?? { h: 0, s: 1, v: 1, a: 1 },
  );
  // Hue and saturation are kept in HSV so dragging through black/white doesn't
  // lose them; an outside `value` only replaces them when it is a different colour.
  const [prevValue, setPrevValue] = React.useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    const parsed = value === undefined ? null : parseHex(value);
    if (parsed && toHex(parsed, true) !== toHex(hsva, true)) setHsva(parsed);
  }

  const [draft, setDraft] = React.useState<string | null>(null);
  const hex = toHex(hsva, alpha);

  const commit = (next: HSVA) => {
    setHsva(next);
    onValueChange?.(toHex(next, alpha));
  };

  const area = useDrag((x, y) => commit({ ...hsva, s: x, v: 1 - y }));
  const onAreaKey = (e: React.KeyboardEvent) => {
    const arrow = ARROWS[e.key];
    if (!arrow) return;
    e.preventDefault();
    const d = e.shiftKey ? 0.1 : 0.01;
    commit({ ...hsva, s: clamp(hsva.s + arrow[0] * d), v: clamp(hsva.v + arrow[1] * d) });
  };

  const [r, g, b] = hsvToRgb(hsva.h, hsva.s, hsva.v);
  const solid = `rgb(${r} ${g} ${b})`;
  const draftInvalid = draft !== null && parseHex(draft) === null;

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <Button ref={ref} aria-label={`${label}, current ${hex}`} className={cn("gap-2.5 pr-5 pl-2.5", className)}>
          <span
            aria-hidden
            data-slot="color-picker-chip"
            className="relative size-6 shrink-0 overflow-hidden rounded-full border border-foreground/25"
            style={{ background: CHECKER }}
          >
            <span className="absolute inset-0" style={{ background: `rgb(${r} ${g} ${b} / ${hsva.a})` }} />
          </span>
          <span className="font-mono text-xs tracking-normal uppercase">{hex}</span>
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <GlassSurface asChild glass={mergeGlass(PANEL_OPTICS, glass)}>
          <PopoverPrimitive.Content
            data-slot="color-picker-panel"
            aria-label="Colour picker"
            sideOffset={10}
            collisionPadding={12}
            className="animate-glass-in relative z-50 flex w-64 max-w-[calc(100vw-1.5rem)] flex-col gap-3 p-3 text-foreground outline-none"
          >
            <div
              role="slider"
              tabIndex={0}
              aria-label="Saturation and brightness"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(hsva.s * 100)}
              aria-valuetext={`Saturation ${Math.round(hsva.s * 100)}%, brightness ${Math.round(hsva.v * 100)}%`}
              data-slot="color-picker-area"
              className={cn("group relative h-36 touch-none cursor-crosshair rounded-xl", focusRing)}
              style={{
                background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hsva.h} 100% 50%)`,
              }}
              onKeyDown={onAreaKey}
              {...area}
            >
              <span
                className={thumbClass}
                style={{ left: `${hsva.s * 100}%`, top: `${(1 - hsva.v) * 100}%`, background: solid }}
              />
            </div>

            <ChannelSlider
              label="Hue"
              max={360}
              value={hsva.h}
              unit="°"
              background="linear-gradient(to right, hsl(0 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%), hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%))"
              onChange={(h) => commit({ ...hsva, h })}
            />
            {alpha && (
              <ChannelSlider
                label="Opacity"
                max={1}
                value={hsva.a}
                unit="%"
                step={0.01}
                bigStep={0.1}
                background={`linear-gradient(to right, rgb(${r} ${g} ${b} / 0), ${solid}), ${CHECKER}`}
                onChange={(a) => commit({ ...hsva, a })}
              />
            )}

            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-8 shrink-0">Hex</span>
              <input
                value={draft ?? hex.slice(1)}
                maxLength={9}
                spellCheck={false}
                autoComplete="off"
                aria-invalid={draftInvalid || undefined}
                data-slot="color-picker-input"
                onFocus={(e) => e.currentTarget.select()}
                onChange={(e) => {
                  const text = e.target.value;
                  setDraft(text);
                  const parsed = parseHex(text);
                  if (parsed) commit(alpha ? parsed : { ...parsed, a: 1 });
                }}
                onBlur={() => setDraft(null)}
                onKeyDown={(e) => e.key === "Enter" && setDraft(null)}
                className={cn(
                  "h-9 min-w-0 flex-1 rounded-lg border bg-foreground/5 px-2.5 font-mono text-sm text-foreground uppercase outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                  draftInvalid ? "border-primary" : "border-border",
                )}
              />
            </label>
            {draftInvalid && (
              <p role="alert" className="-mt-1.5 text-xs text-primary">
                Use 3, 6 or 8 hex digits.
              </p>
            )}

            {swatches.length > 0 && (
              <div role="group" aria-label="Swatches" className="flex flex-wrap gap-1.5">
                {swatches.map((swatch) => {
                  const parsed = parseHex(swatch);
                  if (!parsed) return null;
                  const selected = toHex(parsed, true) === toHex(hsva, true);
                  return (
                    <button
                      key={swatch}
                      type="button"
                      aria-label={swatch}
                      aria-pressed={selected}
                      data-slot="color-picker-swatch"
                      onClick={() => commit(alpha ? parsed : { ...parsed, a: 1 })}
                      className={cn(
                        "size-6 rounded-full border border-foreground/25 transition-transform hover:scale-110 active:scale-95",
                        "motion-reduce:transition-none",
                        focusRing,
                        selected && "ring-2 ring-foreground ring-offset-2",
                      )}
                      style={{ background: swatch }}
                    />
                  );
                })}
              </div>
            )}
          </PopoverPrimitive.Content>
        </GlassSurface>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export { ColorPicker };
