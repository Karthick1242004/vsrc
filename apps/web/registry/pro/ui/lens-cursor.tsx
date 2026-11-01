"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const LENS_OPTICS: LiquidGlassOptions = {
  scale: -90,
  chroma: 4,
  border: 0.2,
  mapBlur: 8,
  magnify: 1.35,
  blur: 0,
  saturate: 1.2,
  fallbackBlur: 1,
};

// Exponential smoothing rates (per second): position trails, size reacts faster.
const FOLLOW_RATE = 16;
const SIZE_RATE = 14;
const PRESS_SCALE = 0.88;

export interface LensCursorProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Resting diameter in px. */
  size?: number;
  /** Diameter over elements marked data-lens="grow". */
  grownSize?: number;
  /** Element to track. Defaults to the parent, which must be positioned. */
  container?: React.RefObject<HTMLElement | null>;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function LensCursor({
  size = 40,
  grownSize = 88,
  container,
  glass,
  className,
  ref,
  style,
  ...props
}: LensCursorProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  React.useEffect(() => {
    const el = rootRef.current;
    const host = container?.current ?? el?.parentElement;
    if (!el || !host) return;

    // The lens is laid out at grownSize; the resting size is a transform scale,
    // so the displacement map is built once and never regenerated mid-hover.
    const restScale = size / grownSize;
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)");
    const calmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const target = { x: 0, y: 0, scale: restScale, opacity: 0 };
    const cur = { x: 0, y: 0, scale: restScale, opacity: 0 };
    let placed = false;
    let pressed = false;
    let raf = 0;
    let last = 0;

    const paint = () => {
      const half = grownSize / 2;
      el.style.transform = `translate3d(${cur.x - half}px, ${cur.y - half}px, 0) scale(${cur.scale})`;
      el.style.opacity = String(cur.opacity);
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const calm = calmQuery.matches;
      const kPos = calm ? 1 : 1 - Math.exp(-FOLLOW_RATE * dt);
      const kSize = calm ? 1 : 1 - Math.exp(-SIZE_RATE * dt);
      cur.x += (target.x - cur.x) * kPos;
      cur.y += (target.y - cur.y) * kPos;
      cur.scale += (target.scale - cur.scale) * kSize;
      cur.opacity += (target.opacity - cur.opacity) * kSize;
      paint();
      const settled =
        Math.abs(target.x - cur.x) < 0.05 &&
        Math.abs(target.y - cur.y) < 0.05 &&
        Math.abs(target.scale - cur.scale) < 0.002 &&
        Math.abs(target.opacity - cur.opacity) < 0.01;
      if (settled) {
        Object.assign(cur, target);
        paint();
        raf = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const setScale = (grown: boolean) => {
      target.scale = (grown ? 1 : restScale) * (pressed ? PRESS_SCALE : 1);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || coarse.matches) return;
      const rect = host.getBoundingClientRect();
      target.x = e.clientX - rect.left - host.clientLeft;
      target.y = e.clientY - rect.top - host.clientTop;
      target.opacity = 1;
      if (!placed) {
        cur.x = target.x;
        cur.y = target.y;
        placed = true;
      }
      const hit = e.target instanceof Element ? e.target.closest('[data-lens="grow"]') : null;
      setScale(!!hit && host.contains(hit));
      wake();
    };
    const onLeave = () => {
      target.opacity = 0;
      placed = false;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pressed = true;
      target.scale *= PRESS_SCALE;
      wake();
    };
    const onUp = () => {
      if (!pressed) return;
      pressed = false;
      target.scale /= PRESS_SCALE;
      wake();
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    paint();
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [container, size, grownSize]);

  return (
    <GlassSurface
      ref={setRefs}
      aria-hidden
      data-slot="lens-cursor"
      glass={mergeGlass(LENS_OPTICS, glass)}
      className={cn(
        // Stays at opacity 0 on touch and hover-less devices: the pointer handlers ignore them.
        "pointer-events-none absolute top-0 left-0 z-20 rounded-full opacity-0 will-change-transform",
        className,
      )}
      style={{ width: grownSize, height: grownSize, ...style }}
      {...props}
    />
  );
}

export interface LensCursorAreaProps extends React.ComponentProps<"div"> {
  size?: number;
  grownSize?: number;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

/** Wrapper form: a relative, clipped region with a lens that follows the pointer inside it. */
function LensCursorArea({ size, grownSize, glass, className, children, ...props }: LensCursorAreaProps) {
  return (
    <div data-slot="lens-cursor-area" className={cn("relative overflow-hidden", className)} {...props}>
      {children}
      <LensCursor size={size} grownSize={grownSize} glass={glass} />
    </div>
  );
}

export { LensCursor, LensCursorArea };
