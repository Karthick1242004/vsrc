"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const CARD_OPTICS: LiquidGlassOptions = {
  scale: -64,
  chroma: 3,
  border: 0.1,
  mapBlur: 10,
  blur: 0.5,
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
  const optics = mergeGlass(CARD_OPTICS, glass);
  // embla (the engine behind shadcn's Carousel) owns drag, flick, snapping and
  // looping-free bounds; this file adds the coverflow depth on top of its scroll.
  // Options must stay stable: a changed startIndex makes embla re-initialise and
  // jump straight to it, cutting off its own scroll animation on every switch.
  const [startIndex] = React.useState(index);
  const [viewportRef, api] = useEmblaCarousel({ align: "center", startIndex, containScroll: false, duration: 32 });
  const slides = React.useRef<Array<HTMLDivElement | null>>([]);
  const cards = React.useRef<Array<HTMLDivElement | null>>([]);
  const onChange = React.useRef(onValueChange);
  onChange.current = onValueChange;
  const controlled = value !== undefined;

  // Depth, tilt and fade follow each card's live distance from centre, written
  // straight to the DOM on every scroll frame: no React state while dragging.
  React.useEffect(() => {
    if (!api) return;
    const tween = () => {
      const snaps = api.scrollSnapList();
      const span = (snaps[snaps.length - 1] ?? 0) - (snaps[0] ?? 0) || 1;
      const progress = api.scrollProgress();
      snaps.forEach((snap, i) => {
        const o = ((snap - progress) / span) * (n - 1);
        const a = Math.abs(o);
        const s = Math.min(a, 2);
        const card = cards.current[i];
        const slide = slides.current[i];
        if (!card || !slide) return;
        card.style.transform = `translateZ(${-s * DEPTH}px) rotateY(${-clamp(o, -1, 1) * ANGLE}deg) scale(${1 - s * 0.06})`;
        card.style.opacity = String(Math.max(0, 1 - a * 0.38));
        slide.style.zIndex = String(50 - Math.round(a * 10));
      });
    };
    const select = () => {
      const i = api.selectedScrollSnap();
      if (!controlled) setInner(i);
      onChange.current?.(i);
    };
    tween();
    api.on("scroll", tween).on("reInit", tween).on("select", select);
    return () => {
      api.off("scroll", tween).off("reInit", tween).off("select", select);
    };
  }, [api, n, controlled]);

  React.useEffect(() => {
    if (api && api.selectedScrollSnap() !== index) api.scrollTo(index);
  }, [api, index]);

  const go = (i: number) => api?.scrollTo(clamp(i, 0, n - 1));

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
        ref={viewportRef}
        data-slot="depth-carousel-stage"
        aria-live="polite"
        className="relative h-80 w-full cursor-grab touch-pan-y overflow-hidden select-none [perspective:1000px] active:cursor-grabbing"
      >
        <div className="flex h-full [transform-style:preserve-3d]">
          {items.map((item, i) => {
            const active = i === index;
            return (
              // Slides are one STEP wide so neighbours overlap; the card inside is wider.
              <div
                key={item.id}
                ref={(el) => {
                  slides.current[i] = el;
                }}
                className="relative flex h-full shrink-0 justify-center"
                style={{ flexBasis: STEP }}
              >
                <GlassSurface
                  ref={(el: HTMLDivElement | null) => {
                    cards.current[i] = el;
                  }}
                  data-slot="depth-carousel-card"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${n}`}
                  aria-hidden={!active}
                  glass={optics}
                  onClick={() => go(i)}
                  className={cn(
                    "absolute top-2 flex h-[19rem] w-56 flex-col gap-2 rounded-3xl p-2.5 will-change-transform",
                    !active && "cursor-pointer",
                  )}
                >
                  <div className="min-h-0 flex-1 overflow-hidden rounded-2xl">{item.art}</div>
                  <div className="px-1.5 pb-1">
                    <p className="truncate font-display text-lg leading-tight">{item.title}</p>
                    {item.caption && <p className="truncate text-xs text-muted-foreground">{item.caption}</p>}
                  </div>
                </GlassSurface>
              </div>
            );
          })}
        </div>
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
