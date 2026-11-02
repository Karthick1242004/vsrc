"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const VOCAB = ["refract", "bend", "light", "glass"];

/* Straight thin lines are the clearest proof of refraction: the rim visibly kinks them. */
const LINES =
  "repeating-linear-gradient(115deg, color-mix(in oklab, var(--foreground) 7%, transparent) 0 1px, transparent 1px 26px)";

function Row({ words, className }: { words: string[]; className: string }) {
  // Two identical halves so the -50% marquee loops without a seam.
  const half = words.join("  ·  ");
  return (
    <div className={`flex w-max whitespace-nowrap will-change-transform ${className}`}>
      <span className="pr-[0.6em]">{half}  ·  </span>
      <span className="pr-[0.6em]">{half}  ·  </span>
    </div>
  );
}

/**
 * The moving scene behind every demo: light pools, two counter-sliding rows of
 * display type and a field of fine lines, all leaning toward the pointer.
 * Pointer motion is eased in rAF and written as CSS variables, never React
 * state. Paused off screen; still under reduced motion.
 */
/** `compact` is for small tiles (the home bento): quieter type and smaller light pools. */
export function DemoBackdrop({ word, compact = false }: { word: string; compact?: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    const tile = el?.parentElement;
    if (!el || !tile) return;
    const io = new IntersectionObserver(([entry]) => el.toggleAttribute("data-paused", !entry?.isIntersecting));
    io.observe(el);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => io.disconnect();

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    const step = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--mx", x.toFixed(3));
      el.style.setProperty("--my", y.toFixed(3));
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.002 ? requestAnimationFrame(step) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    const move = (e: PointerEvent) => {
      const r = tile.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      kick();
    };
    const leave = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    tile.addEventListener("pointermove", move);
    tile.addEventListener("pointerleave", leave);
    return () => {
      io.disconnect();
      tile.removeEventListener("pointermove", move);
      tile.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const words = [word, ...VOCAB];
  const shift = (px: number, py: number) => ({
    transform: `translate3d(calc(var(--mx, 0) * ${px}px), calc(var(--my, 0) * ${py}px), 0)`,
  });

  return (
    <div ref={ref} aria-hidden data-demo-backdrop className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={shift(56, 40)}>
        <div className={cn("absolute -top-1/3 -left-1/4 rounded-full blur-3xl", compact ? "size-64 bg-signal/30" : "size-96 bg-signal/45")} />
        <div className={cn("absolute -right-1/4 -bottom-1/3 rounded-full blur-3xl", compact ? "size-56 bg-primary/25" : "size-80 bg-primary/40")} />
      </div>
      <div className="absolute -inset-10" style={{ backgroundImage: LINES, ...shift(-18, -12) }} />
      <div
        className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col gap-1 leading-[0.95]"
        style={shift(-28, -16)}
      >
        <Row
          words={words}
          className={cn(
            "animate-marquee font-display italic [animation-duration:38s]",
            compact ? "text-[3.5rem] text-foreground/25" : "text-[5.5rem] text-foreground/40",
          )}
        />
        <Row
          words={[...words].reverse()}
          className={cn(
            "animate-marquee font-display [animation-direction:reverse] [animation-duration:52s]",
            compact ? "text-[2.5rem] text-signal/30" : "text-[4rem] text-signal/45",
          )}
        />
      </div>
    </div>
  );
}
