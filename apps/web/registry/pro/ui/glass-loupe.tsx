"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

// Magnification is the point: the centre is enlarged 1.6x and the rim bends hard.
const LOUPE_OPTICS: LiquidGlassOptions = {
  scale: -128,
  chroma: 5,
  border: 0.14,
  mapBlur: 10,
  magnify: 1.6,
  blur: 0,
  saturate: 1.25,
  fallbackBlur: 1,
};

const STEP = 16;
const STEP_LARGE = 64;

export interface GlassLoupeProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Diameter (or side) in px. */
  size?: number;
  shape?: "circle" | "rounded";
  /** Element the loupe is confined to. Defaults to the parent, which must be positioned. */
  container?: React.RefObject<HTMLElement | null>;
  /** Initial centre, in px from the container's top-left. Defaults to the middle. */
  defaultPosition?: { x: number; y: number };
  /** Accessible name. */
  label?: string;
  glass?: LiquidGlassOptions | GlassPreset | false;
  /** Optional caption drawn inside the lens, under its centre. */
  children?: React.ReactNode;
}

function GlassLoupe({
  size = 168,
  shape = "circle",
  container,
  defaultPosition,
  label = "Magnifier",
  glass,
  className,
  children,
  ref,
  style,
  onKeyDown,
  onPointerDown,
  onPointerMove,
  ...props
}: GlassLoupeProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const pos = React.useRef<{ x: number; y: number } | null>(null);
  const grab = React.useRef<{ x: number; y: number } | null>(null);
  const initial = React.useRef(defaultPosition);
  const [ready, setReady] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const hintId = React.useId();

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const getHost = React.useCallback(
    () => container?.current ?? rootRef.current?.parentElement ?? null,
    [container],
  );

  const place = React.useCallback(
    (next: { x: number; y: number }, animate: boolean) => {
      const el = rootRef.current;
      const host = getHost();
      if (!el || !host) return;
      const half = size / 2;
      const p = {
        x: Math.min(Math.max(next.x, half), Math.max(half, host.clientWidth - half)),
        y: Math.min(Math.max(next.y, half), Math.max(half, host.clientHeight - half)),
      };
      pos.current = p;
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Inline transition overrides the class, so the opacity fade-in has to be listed here too.
      el.style.transition = calm
        ? "none"
        : animate
          ? "transform 150ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 300ms"
          : "opacity 300ms";
      el.style.transform = `translate3d(${p.x - half}px, ${p.y - half}px, 0)`;
    },
    [getHost, size],
  );

  // Initial placement, then stay inside the container as either side resizes.
  React.useEffect(() => {
    const host = getHost();
    if (!host) return;
    place(pos.current ?? initial.current ?? { x: host.clientWidth / 2, y: host.clientHeight / 2 }, false);
    setReady(true);
    const ro = new ResizeObserver(() => {
      if (pos.current) place(pos.current, false);
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, [getHost, place]);

  const toHost = (e: React.PointerEvent) => {
    const host = getHost();
    if (!host) return null;
    const rect = host.getBoundingClientRect();
    return { x: e.clientX - rect.left - host.clientLeft, y: e.clientY - rect.top - host.clientTop };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(e);
    if (e.defaultPrevented || e.button !== 0 || !pos.current) return;
    const p = toHost(e);
    if (!p) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    grab.current = { x: p.x - pos.current.x, y: p.y - pos.current.y };
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    const g = grab.current;
    const p = toHost(e);
    if (g && p) place({ x: p.x - g.x, y: p.y - g.y }, false);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!grab.current) return;
    grab.current = null;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || !pos.current) return;
    const step = e.shiftKey ? STEP_LARGE : STEP;
    const deltas: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const d = deltas[e.key];
    if (!d) return;
    e.preventDefault();
    place({ x: pos.current.x + d[0], y: pos.current.y + d[1] }, true);
  };

  const radius = shape === "circle" ? "rounded-full" : "rounded-[28%]";

  return (
    <div
      ref={setRefs}
      role="group"
      tabIndex={0}
      aria-label={label}
      aria-describedby={hintId}
      aria-roledescription="movable magnifier"
      data-slot="glass-loupe"
      data-dragging={dragging ? "" : undefined}
      className={cn(
        "absolute top-0 left-0 z-10 touch-none select-none will-change-transform",
        "cursor-grab data-[dragging]:cursor-grabbing transition-opacity duration-300",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        radius,
        !ready && "opacity-0",
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={handleKeyDown}
    >
      <span id={hintId} className="sr-only">
        Drag, or use the arrow keys to move. Hold Shift for larger steps.
      </span>
      <GlassSurface
        data-slot="glass-loupe-lens"
        glass={mergeGlass(LOUPE_OPTICS, glass)}
        className={cn(
          "size-full transition-transform duration-200 ease-out motion-reduce:transition-none",
          dragging && "scale-[1.04]",
          radius,
        )}
      >
        {children ? (
          <span className="absolute inset-x-0 bottom-[16%] mx-auto w-fit rounded-full bg-background/70 px-2 py-0.5 text-[11px] font-medium text-foreground">
            {children}
          </span>
        ) : null}
      </GlassSurface>
    </div>
  );
}

export { GlassLoupe };
