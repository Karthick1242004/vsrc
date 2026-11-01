"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const CARD_OPTICS: LiquidGlassOptions = {
  scale: -64,
  chroma: 3,
  border: 0.1,
  mapBlur: 10,
  blur: 2,
  saturate: 1.25,
  fallbackBlur: 3,
};

/** Horizontal distance between neighbouring cards, in px (cards are w-56 = 224px). */
const STEP = 132;
const DEPTH = 110;
const ANGLE = 38;

export interface DepthCarouselItem {
  id: string;
  title: string;
  caption?: string;
  art: React.ReactNode;
}

export interface DepthCarouselProps extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  items: DepthCarouselItem[];
  value?: number;
  defaultValue?: number;
  onValueChange?: (index: number) => void;
  /** Accessible name of the carousel region. */
  label?: string;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function Chevron({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const navButton = cn(
  "grid size-10 place-items-center rounded-full border border-border bg-card/60 text-foreground outline-none transition-[opacity,transform] active:scale-90",
  "hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:opacity-35 motion-reduce:transition-none",
);

function DepthCarousel({
  items,
  value,
  defaultValue = 0,
  onValueChange,
  label = "Gallery",
  glass,
  className,
  onKeyDown,
  ...props
}: DepthCarouselProps) {
  const n = items.length;
  const [inner, setInner] = React.useState(defaultValue);
  const index = clamp(value ?? inner, 0, Math.max(0, n - 1));
  const go = (next: number) => {
    const t = clamp(next, 0, n - 1);
    if (!n || t === index) return;
    if (value === undefined) setInner(t);
    onValueChange?.(t);
  };

  const [drag, setDrag] = React.useState<number | null>(null);
  const gesture = React.useRef<{ x0: number; last: number; t: number; v: number; moved: boolean } | null>(null);
  // Rubber-band past the first and last card.
  const pos = clamp(index - (drag ?? 0) / STEP, -0.35, n - 1 + 0.35);
  const optics = mergeGlass(CARD_OPTICS, glass);

  const finish = () => {
    const g = gesture.current;
    gesture.current = null;
    if (!g) return;
    const dx = (drag ?? 0);
    let target = Math.round(clamp(pos + (g.v * 200) / STEP, 0, n - 1));
    if (target === index && Math.abs(dx) > 24) target = clamp(index + (dx < 0 ? 1 : -1), 0, n - 1);
    setDrag(null);
    go(target);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      data-slot="depth-carousel"
      className={cn(
        "flex w-full flex-col items-center gap-3 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 ring-offset-background",
        className,
      )}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
        e.preventDefault();
        go(index + (e.key === "ArrowRight" ? 1 : -1));
      }}
      {...props}
    >
      <div
        data-slot="depth-carousel-stage"
        aria-live="polite"
        className={cn("relative h-80 w-full touch-pan-y overflow-hidden select-none [perspective:1000px]", drag !== null ? "cursor-grabbing" : "cursor-grab")}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          gesture.current = { x0: e.clientX, last: e.clientX, t: e.timeStamp, v: 0, moved: false };
        }}
        onPointerMove={(e) => {
          const g = gesture.current;
          if (!g) return;
          const dx = e.clientX - g.x0;
          // Capture only once it is a drag, so plain clicks still reach the card.
          if (!g.moved && Math.abs(dx) > 5) {
            g.moved = true;
            e.currentTarget.setPointerCapture(e.pointerId);
          }
          const dt = Math.max(1, e.timeStamp - g.t);
          g.v = g.v * 0.6 + (((e.clientX - g.last) / dt) * -1) * 0.4;
          g.last = e.clientX;
          g.t = e.timeStamp;
          if (g.moved) setDrag(dx);
        }}
        onPointerUp={finish}
        onPointerCancel={finish}
      >
        {items.map((item, i) => {
          const o = i - pos;
          const a = Math.abs(o);
          if (a > 2.7) return null;
          const s = Math.min(a, 2);
          const active = i === index;
          return (
            <GlassSurface
              key={item.id}
              data-slot="depth-carousel-card"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              aria-hidden={!active}
              glass={optics}
              onClick={() => go(i)}
              className={cn(
                "absolute top-2 left-1/2 flex h-[19rem] w-56 flex-col gap-2 rounded-3xl p-2.5 will-change-transform",
                drag === null && "transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,0.9,0.3,1)] motion-reduce:transition-none",
                !active && "cursor-pointer",
              )}
              style={{
                transform: `translate3d(calc(-50% + ${o * STEP}px), 0, ${-s * DEPTH}px) rotateY(${-clamp(o, -1, 1) * ANGLE}deg) scale(${1 - s * 0.06})`,
                opacity: Math.max(0, 1 - a * 0.38),
                zIndex: 50 - Math.round(a * 10),
              }}
            >
              <div className="min-h-0 flex-1 overflow-hidden rounded-2xl">{item.art}</div>
              <div className="px-1.5 pb-1">
                <p className="truncate font-display text-lg leading-tight">{item.title}</p>
                {item.caption && <p className="truncate text-xs text-muted-foreground">{item.caption}</p>}
              </div>
            </GlassSurface>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button type="button" aria-label="Previous slide" className={navButton} disabled={index === 0} onClick={() => go(index - 1)}>
          <Chevron d="M10 3L5 8l5 5" />
        </button>
        <div className="flex items-center">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i)}
              className="group grid h-6 w-5 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={cn(
                  "h-1.5 rounded-full bg-foreground transition-[width,opacity] duration-300 motion-reduce:transition-none",
                  i === index ? "w-5 opacity-90" : "w-1.5 opacity-30 group-hover:opacity-60",
                )}
              />
            </button>
          ))}
        </div>
        <button type="button" aria-label="Next slide" className={navButton} disabled={index === n - 1} onClick={() => go(index + 1)}>
          <Chevron d="M6 3l5 5-5 5" />
        </button>
      </div>
    </div>
  );
}

export { DepthCarousel };
