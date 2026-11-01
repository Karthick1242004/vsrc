"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

/**
 * `src` is any ReactNode, so real photos are just `<img className="size-full object-cover" />`.
 * The node is rendered in the stage and again in the thumbnail strip, so it
 * must fill its box (size-full) rather than carry its own dimensions.
 */
export interface LightboxItem {
  id: string;
  src?: React.ReactNode;
  title: string;
  caption?: string;
}

const CONTROL_OPTICS: LiquidGlassOptions = {
  scale: -44,
  chroma: 3,
  border: 0.2,
  mapBlur: 6,
  blur: 0.5,
  saturate: 1.3,
  fallbackBlur: 2,
};

const BAR_OPTICS: LiquidGlassOptions = {
  scale: -72,
  chroma: 3,
  border: 0.09,
  mapBlur: 12,
  blur: 0.5,
  saturate: 1.25,
  fallbackBlur: 3,
};

const ZOOM = 2.2;
const SWIPE_PX = 48;

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (next: T) => void) {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [controlled ? value : inner, set] as const;
}

const wrap = (i: number, n: number) => (n ? ((i % n) + n) % n : 0);
const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Radix Dialog remembers only the last-mounted Trigger, so focus return is tracked here.
const LightboxContext = React.createContext<{
  select: (index: number) => void;
  lastTrigger: React.RefObject<HTMLElement | null>;
} | null>(null);

function Glyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const controlClass = cn(
  "grid size-11 place-items-center rounded-full text-foreground outline-none transition-transform active:scale-95",
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background motion-reduce:transition-none",
);

export interface LightboxProps {
  items: LightboxItem[];
  /** Trigger(s): render one `LightboxTrigger` per thumbnail. */
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function Lightbox({ items, children, open, defaultOpen = false, onOpenChange, index, defaultIndex = 0, onIndexChange, glass }: LightboxProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [rawIndex, setIndex] = useControllable(index, defaultIndex, onIndexChange);
  const n = items.length;
  const current = wrap(rawIndex, n);
  const item = items[current];
  const [zoom, setZoom] = React.useState<{ id: string; x: number; y: number } | null>(null);
  const zoomed = !!item && zoom?.id === item.id;
  const dir = React.useRef(0);
  const swipeStart = React.useRef<number | null>(null);
  const suppressClick = React.useRef(false);
  const stage = React.useRef<HTMLDivElement>(null);
  const strip = React.useRef<HTMLDivElement>(null);
  const zoomLayer = React.useRef<HTMLDivElement>(null);
  const lastTrigger = React.useRef<HTMLElement | null>(null);
  const control = mergeGlass(CONTROL_OPTICS, glass);
  const bar = mergeGlass(BAR_OPTICS, glass);

  const show = (target: number, direction: number) => {
    dir.current = direction;
    setIndex(wrap(target, n));
  };
  const select = React.useCallback(
    (i: number) => {
      dir.current = 0;
      setIndex(wrap(i, n));
    },
    [n, setIndex],
  );
  const ctx = React.useMemo(() => ({ select, lastTrigger }), [select]);

  React.useEffect(() => {
    if (!dir.current || prefersReducedMotion()) return;
    stage.current?.animate(
      [{ opacity: 0, transform: `translateX(${dir.current * 36}px)` }, { opacity: 1, transform: "none" }],
      { duration: 280, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
    );
  }, [current]);

  React.useEffect(() => {
    if (!isOpen) return;
    strip.current
      ?.querySelector('[aria-current="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [current, isOpen]);

  const pointOf = (e: React.PointerEvent | React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
  };

  return (
    <LightboxContext.Provider value={ctx}>
      <DialogPrimitive.Root open={isOpen} onOpenChange={setOpen}>
        {children}
        {item && (
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay data-slot="lightbox-overlay" className="animate-glass-in fixed inset-0 z-50 bg-background/85" />
            <DialogPrimitive.Content
              data-slot="lightbox-content"
              {...(item.caption ? {} : { "aria-describedby": undefined })}
              className="animate-glass-in fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-4 outline-none"
              onClick={(e) => e.target === e.currentTarget && setOpen(false)}
              onCloseAutoFocus={(e) => {
                if (!lastTrigger.current) return;
                e.preventDefault();
                lastTrigger.current.focus();
              }}
              onKeyDown={(e) => {
                if (n < 2 || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
                e.preventDefault();
                const d = e.key === "ArrowRight" ? 1 : -1;
                show(current + d, d);
              }}
            >
              <div className="relative aspect-[3/2] w-[min(92vw,calc(58dvh*1.5),56rem)] overflow-hidden rounded-3xl border border-border bg-card">
                <div
                  ref={stage}
                  data-slot="lightbox-stage"
                  className={cn("absolute inset-0 select-none", zoomed ? "cursor-zoom-out touch-none" : "cursor-zoom-in touch-pan-y")}
                  onPointerDown={(e) => {
                    swipeStart.current = e.clientX;
                    // A touch swipe fires no click, so a flag left from the last swipe would eat the next tap.
                    suppressClick.current = false;
                  }}
                  onPointerMove={(e) => {
                    // Pan writes the style directly: a state update per move re-renders every glass control.
                    if (!zoomed || !(e.pointerType === "mouse" || e.buttons) || !zoomLayer.current) return;
                    const { x, y } = pointOf(e);
                    zoomLayer.current.style.transformOrigin = `${x}% ${y}%`;
                  }}
                  onPointerUp={(e) => {
                    const start = swipeStart.current;
                    swipeStart.current = null;
                    if (start === null || zoomed || n < 2) return;
                    const dx = e.clientX - start;
                    if (Math.abs(dx) < SWIPE_PX) return;
                    suppressClick.current = true;
                    show(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
                  }}
                  onPointerCancel={() => (swipeStart.current = null)}
                  onClick={(e) => {
                    if (suppressClick.current) {
                      suppressClick.current = false;
                      return;
                    }
                    setZoom(zoomed ? null : { id: item.id, ...pointOf(e) });
                  }}
                >
                  <div
                    ref={zoomLayer}
                    className="size-full transition-transform duration-300 ease-out motion-reduce:transition-none"
                    style={{
                      transform: zoomed ? `scale(${ZOOM})` : undefined,
                      transformOrigin: zoom && zoomed ? `${zoom.x}% ${zoom.y}%` : "50% 50%",
                    }}
                  >
                    {item.src ?? <div className="grid size-full place-items-center bg-muted font-display text-3xl">{item.title}</div>}
                  </div>
                </div>

                <div className="absolute top-3 right-3 flex gap-2">
                  <GlassSurface asChild glass={control}>
                    <button
                      type="button"
                      data-slot="lightbox-control"
                      aria-label="Zoom"
                      aria-pressed={zoomed}
                      className={controlClass}
                      onClick={() => setZoom(zoomed ? null : { id: item.id, x: 50, y: 50 })}
                    >
                      <Glyph d={zoomed ? "M3 8h10" : "M3 8h10M8 3v10"} />
                    </button>
                  </GlassSurface>
                  <GlassSurface asChild glass={control}>
                    <DialogPrimitive.Close data-slot="lightbox-control" aria-label="Close" className={controlClass}>
                      <Glyph d="M4 4l8 8M12 4l-8 8" />
                    </DialogPrimitive.Close>
                  </GlassSurface>
                </div>

                {n > 1 &&
                  ([-1, 1] as const).map((d) => (
                    <GlassSurface key={d} asChild glass={control}>
                      <button
                        type="button"
                        data-slot="lightbox-control"
                        aria-label={d < 0 ? "Previous image" : "Next image"}
                        className={cn(controlClass, "absolute top-1/2 -translate-y-1/2", d < 0 ? "left-3" : "right-3")}
                        onClick={() => show(current + d, d)}
                      >
                        <Glyph d={d < 0 ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"} />
                      </button>
                    </GlassSurface>
                  ))}

                <GlassSurface data-slot="lightbox-caption" glass={bar} className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-4 rounded-2xl px-4 py-3">
                  <div className="min-w-0">
                    <DialogPrimitive.Title className="font-display text-xl leading-tight">{item.title}</DialogPrimitive.Title>
                    {item.caption && (
                      <DialogPrimitive.Description className="mt-0.5 text-sm text-muted-foreground">{item.caption}</DialogPrimitive.Description>
                    )}
                  </div>
                  <p aria-live="polite" className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {current + 1} / {n}
                  </p>
                </GlassSurface>
              </div>

              {n > 1 && (
                <div ref={strip} role="group" aria-label="Thumbnails" className="flex max-w-full gap-2 overflow-x-auto p-1">
                  {items.map((it, i) => (
                    <button
                      key={it.id}
                      type="button"
                      data-slot="lightbox-thumb"
                      aria-label={it.title}
                      aria-current={i === current}
                      onClick={() => show(i, i > current ? 1 : -1)}
                      className={cn(
                        "h-14 w-20 shrink-0 overflow-hidden rounded-lg outline-none transition-[opacity,box-shadow] motion-reduce:transition-none",
                        "focus-visible:ring-2 focus-visible:ring-ring ring-offset-background",
                        i === current ? "opacity-100 ring-2 ring-foreground" : "opacity-60 hover:opacity-100",
                      )}
                    >
                      {it.src}
                    </button>
                  ))}
                </div>
              )}
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </DialogPrimitive.Root>
    </LightboxContext.Provider>
  );
}

/** Opens the lightbox at `index`. Render the thumbnail as its child. */
function LightboxTrigger({
  index = 0,
  onClick,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger> & { index?: number }) {
  const ctx = React.useContext(LightboxContext);
  return (
    <DialogPrimitive.Trigger
      data-slot="lightbox-trigger"
      onClick={(e) => {
        onClick?.(e);
        if (ctx) ctx.lastTrigger.current = e.currentTarget;
        ctx?.select(index);
      }}
      {...props}
    />
  );
}

export { Lightbox, LightboxTrigger };
