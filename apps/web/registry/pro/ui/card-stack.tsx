"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const PLATE_OPTICS: LiquidGlassOptions = {
  scale: -56,
  chroma: 3,
  border: 0.12,
  mapBlur: 8,
  blur: 0.5,
  saturate: 1.3,
  fallbackBlur: 3,
};

const THRESHOLD = 110;
const FLY_MS = 300;

export type SwipeDirection = "left" | "right";

export interface CardStackItem {
  id: string;
  title: string;
  subtitle?: string;
  /** Full-bleed picture behind the caption plate. */
  art: React.ReactNode;
}

export interface CardStackProps extends Omit<React.ComponentProps<"div">, "children"> {
  items: CardStackItem[];
  /** Left means skip, right means keep. Fires after the card has left the stack. */
  onSwipe?: (item: CardStackItem, direction: SwipeDirection) => void;
  onUndo?: (item: CardStackItem) => void;
  onReset?: () => void;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const pill = cn(
  "inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium outline-none transition-[transform,opacity,background-color]",
  "active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none",
);

function CardStack({ items, onSwipe, onUndo, onReset, glass, className, onKeyDown, ...props }: CardStackProps) {
  const descId = React.useId();
  const [decisions, setDecisions] = React.useState<SwipeDirection[]>([]);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const [leaving, setLeaving] = React.useState<SwipeDirection | null>(null);
  const grab = React.useRef<{ x0: number; y0: number; t: number; v: number; lastX: number } | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const undone = React.useRef<SwipeDirection | null>(null);
  const topEl = React.useRef<HTMLDivElement | null>(null);
  const plate = mergeGlass(PLATE_OPTICS, glass);

  const index = Math.min(decisions.length, items.length);
  const top = items[index];
  const left = items.length - index;
  const progress = leaving ? 1 : clamp(Math.abs(offset.x) / THRESHOLD, 0, 1);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  React.useEffect(() => {
    const dir = undone.current;
    undone.current = null;
    if (!dir || prefersReducedMotion()) return;
    const from = dir === "right" ? 420 : -420;
    topEl.current?.animate(
      [{ transform: `translate3d(${from}px,0,0) rotate(${from / 16}deg)`, opacity: 0 }, { transform: "none", opacity: 1 }],
      { duration: 360, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
    );
  }, [index]);

  const fling = (dir: SwipeDirection) => {
    if (leaving || !top) return;
    setLeaving(dir);
    const finish = () => {
      setDecisions((d) => [...d, dir]);
      setOffset({ x: 0, y: 0 });
      setLeaving(null);
      onSwipe?.(top, dir);
    };
    if (prefersReducedMotion()) finish();
    else timer.current = setTimeout(finish, FLY_MS);
  };

  const undo = () => {
    const last = decisions[decisions.length - 1];
    const item = items[index - 1];
    if (!last || !item || leaving) return;
    undone.current = last;
    setDecisions((d) => d.slice(0, -1));
    onUndo?.(item);
  };

  const lastItem = items[index - 1];
  const lastDecision = decisions[index - 1];
  const status = lastItem && lastDecision ? `${lastDecision === "right" ? "Kept" : "Skipped"} ${lastItem.title}. ${left} remaining.` : "";

  return (
    <div
      role="group"
      aria-label="Card stack"
      aria-describedby={descId}
      tabIndex={0}
      data-slot="card-stack"
      className={cn(
        "flex w-full max-w-64 flex-col items-center gap-4 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 ring-offset-background",
        className,
      )}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === "ArrowLeft") fling("left");
        else if (e.key === "ArrowRight") fling("right");
        else return;
        e.preventDefault();
      }}
      {...props}
    >
      <p id={descId} className="sr-only">Use the left arrow key to skip a card and the right arrow key to keep it.</p>
      <p aria-live="polite" className="sr-only">{status}</p>

      <div className="relative aspect-[4/5] w-full">
        {!top && (
          <div data-slot="card-stack-empty" className="absolute inset-0 grid place-items-center rounded-3xl border border-dashed border-border p-6 text-center">
            <div>
              <p className="font-display text-2xl">All caught up</p>
              <p className="mt-1 text-sm text-muted-foreground">You have been through all {items.length} cards.</p>
              <button
                type="button"
                className={cn(pill, "mt-4 bg-card hover:bg-foreground/10")}
                onClick={() => {
                  setDecisions([]);
                  onReset?.();
                }}
              >
                Start over
              </button>
            </div>
          </div>
        )}
        {items
          .slice(index, index + 3)
          .map((item, slot) => {
            const isTop = slot === 0;
            const rest = slot - (isTop ? 0 : progress);
            const x = isTop ? (leaving ? (leaving === "right" ? 1 : -1) * 520 : offset.x) : 0;
            const y = isTop ? offset.y : rest * 14;
            const rot = isTop ? (leaving ? (leaving === "right" ? 22 : -22) : offset.x / 18) : 0;
            const scale = isTop ? 1 : 1 - rest * 0.05;
            return (
              <div
                key={item.id}
                ref={isTop ? topEl : undefined}
                data-slot="card-stack-card"
                aria-hidden={!isTop}
                className={cn(
                  "absolute inset-0 overflow-hidden rounded-3xl border border-border bg-card shadow-xl select-none will-change-transform",
                  isTop ? "touch-pan-y cursor-grab" : "pointer-events-none",
                  isTop && dragging && "cursor-grabbing",
                  !dragging && "transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none",
                  leaving && isTop && "duration-300 ease-in",
                )}
                style={{
                  transform: `translate3d(${x}px,${y}px,0) rotate(${rot}deg) scale(${scale})`,
                  opacity: leaving && isTop ? 0 : 1,
                  zIndex: 3 - slot,
                }}
                onPointerDown={
                  isTop
                    ? (e) => {
                        if (e.button !== 0 || leaving) return;
                        e.currentTarget.setPointerCapture(e.pointerId);
                        grab.current = { x0: e.clientX, y0: e.clientY, t: e.timeStamp, v: 0, lastX: e.clientX };
                        setDragging(true);
                      }
                    : undefined
                }
                onPointerMove={
                  isTop
                    ? (e) => {
                        const g = grab.current;
                        if (!g) return;
                        const dt = Math.max(1, e.timeStamp - g.t);
                        g.v = g.v * 0.6 + ((e.clientX - g.lastX) / dt) * 0.4;
                        g.lastX = e.clientX;
                        g.t = e.timeStamp;
                        setOffset({ x: e.clientX - g.x0, y: (e.clientY - g.y0) * 0.35 });
                      }
                    : undefined
                }
                onPointerUp={
                  isTop
                    ? () => {
                        const g = grab.current;
                        grab.current = null;
                        setDragging(false);
                        if (!g) return;
                        const flick = Math.abs(g.v) > 0.5 && Math.abs(offset.x) > 40;
                        if (Math.abs(offset.x) > THRESHOLD || flick) fling(offset.x < 0 ? "left" : "right");
                        else setOffset({ x: 0, y: 0 });
                      }
                    : undefined
                }
                onPointerCancel={
                  isTop
                    ? () => {
                        grab.current = null;
                        setDragging(false);
                        setOffset({ x: 0, y: 0 });
                      }
                    : undefined
                }
              >
                <div className="absolute inset-0">{item.art}</div>
                {isTop && (
                  <>
                    <span aria-hidden className="absolute top-5 left-5 -rotate-12 rounded-lg border-2 border-foreground bg-card/80 px-2.5 py-1 text-sm font-semibold tracking-widest text-foreground uppercase" style={{ opacity: clamp(offset.x / THRESHOLD, 0, 1) }}>
                      Keep
                    </span>
                    <span aria-hidden className="absolute top-5 right-5 rotate-12 rounded-lg border-2 border-foreground bg-card/80 px-2.5 py-1 text-sm font-semibold tracking-widest text-foreground uppercase" style={{ opacity: clamp(-offset.x / THRESHOLD, 0, 1) }}>
                      Skip
                    </span>
                  </>
                )}
                <GlassSurface data-slot="card-stack-plate" glass={plate} className="absolute inset-x-3 bottom-3 rounded-2xl px-4 py-3">
                  <p className="truncate font-display text-xl leading-tight">{item.title}</p>
                  {item.subtitle && <p className="truncate text-sm text-muted-foreground">{item.subtitle}</p>}
                </GlassSurface>
              </div>
            );
          })
          .reverse()}
      </div>

      <div className="flex items-center gap-2">
        <button type="button" className={cn(pill, "bg-card hover:bg-foreground/10")} disabled={!top} onClick={() => fling("left")}>
          <Icon d="M10 3L5 8l5 5" />
          Skip
        </button>
        <button type="button" aria-label="Undo last swipe" className={cn(pill, "w-11 justify-center px-0 hover:bg-foreground/10")} disabled={index === 0} onClick={undo}>
          <Icon d="M3 8h7a3 3 0 010 6H7M3 8l3-3M3 8l3 3" />
        </button>
        <button type="button" className={cn(pill, "border-transparent bg-primary text-primary-foreground")} disabled={!top} onClick={() => fling("right")}>
          Keep
          <Icon d="M6 3l5 5-5 5" />
        </button>
      </div>
    </div>
  );
}

export { CardStack };
