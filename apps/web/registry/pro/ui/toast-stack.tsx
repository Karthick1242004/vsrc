"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

// Each toast is its own small glass pane — siblings in the stack, never nested.
const TOAST_OPTICS: LiquidGlassOptions = {
  scale: -56,
  chroma: 3,
  border: 0.14,
  mapBlur: 8,
  blur: 4,
  saturate: 1.3,
  fallbackBlur: 8,
};

const PEEK = 9; // px of each older toast showing behind the front one
const GAP = 10; // px between toasts when the stack is expanded
const EXIT_MS = 320;

export interface ToastInput {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  /** Milliseconds before auto-dismiss. `Infinity` keeps it until dismissed. Default 5000. */
  duration?: number;
}

interface ToastItem extends ToastInput {
  id: string;
  /** Set while the exit animation runs; the toast no longer counts toward layout. */
  leaving?: "up" | "left" | "right";
}

interface StackApi {
  push: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ApiContext = React.createContext<StackApi | null>(null);
const ItemsContext = React.createContext<{
  items: ToastItem[];
  dismiss: (id: string, direction?: "left" | "right") => void;
} | null>(null);

function ToastStackProvider({ children, limit = 4 }: { children: React.ReactNode; limit?: number }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const counter = React.useRef(0);
  const timers = React.useRef(new Set<ReturnType<typeof setTimeout>>());

  React.useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const remove = React.useCallback((id: string) => {
    setItems((all) => all.filter((t) => t.id !== id));
  }, []);

  const dismiss = React.useCallback(
    (id: string, direction: "left" | "right" | "up" = "up") => {
      setItems((all) => all.map((t) => (t.id === id && !t.leaving ? { ...t, leaving: direction } : t)));
      const timer = setTimeout(() => {
        timers.current.delete(timer);
        remove(id);
      }, EXIT_MS);
      timers.current.add(timer);
    },
    [remove],
  );

  const push = React.useCallback(
    (toast: ToastInput) => {
      const id = `toast-${++counter.current}`;
      // Newest first; the oldest live toast makes room when over the limit.
      setItems((all) => [{ ...toast, id }, ...all].slice(0, limit + all.filter((t) => t.leaving).length));
      return id;
    },
    [limit],
  );

  const dismissAll = React.useCallback(() => {
    setItems((all) => all.map((t) => (t.leaving ? t : { ...t, leaving: "up" as const })));
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setItems((all) => all.filter((t) => !t.leaving));
    }, EXIT_MS);
    timers.current.add(timer);
  }, []);

  const api = React.useMemo<StackApi>(() => ({ push, dismiss: (id) => dismiss(id), dismissAll }), [push, dismiss, dismissAll]);
  const list = React.useMemo(() => ({ items, dismiss }), [items, dismiss]);

  return (
    <ApiContext.Provider value={api}>
      <ItemsContext.Provider value={list}>{children}</ItemsContext.Provider>
    </ApiContext.Provider>
  );
}

function useToastStack(): StackApi {
  const api = React.useContext(ApiContext);
  if (!api) throw new Error("useToastStack must be used inside <ToastStackProvider>");
  return api;
}

/* --------------------------------- viewport --------------------------------- */

export interface ToastStackViewportProps {
  /** Position absolutely inside the nearest `relative` ancestor instead of fixed to the viewport. */
  contained?: boolean;
  placement?: "top" | "bottom";
  glass?: LiquidGlassOptions | GlassPreset | false;
  className?: string;
}

function ToastStackViewport({ contained = false, placement = "top", glass, className }: ToastStackViewportProps) {
  const store = React.useContext(ItemsContext);
  if (!store) throw new Error("<ToastStackViewport> must be used inside <ToastStackProvider>");
  const { items, dismiss } = store;

  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const [heights, setHeights] = React.useState<Record<string, number>>({});
  const onHeight = React.useCallback((id: string, h: number) => {
    setHeights((prev) => (prev[id] === h ? prev : { ...prev, [id]: h }));
  }, []);

  const wrapRef = React.useRef<HTMLDivElement>(null);
  // A focused toast that unmounts fires no blur; re-read focus whenever the list changes.
  React.useEffect(() => {
    setFocus(!!wrapRef.current?.contains(document.activeElement));
    if (items.length === 0) setHover(false);
  }, [items]);

  const live = items.filter((t) => !t.leaving);
  const expanded = hover || focus;
  const paused = expanded || pressed;
  const dir = placement === "top" ? 1 : -1;
  const h = (id: string) => heights[id] ?? 72;
  const front = live[0];
  const frontH = front ? h(front.id) : 0;

  // Layout for each live toast, newest = index 0.
  let offset = 0;
  const layout = new Map<string, { y: number; scale: number; fade: number; clip: number }>();
  live.forEach((t, i) => {
    if (expanded) {
      layout.set(t.id, { y: offset, scale: 1, fade: 1, clip: 0 });
      offset += h(t.id) + GAP;
    } else {
      const scale = 1 - 0.05 * i;
      layout.set(t.id, {
        y: PEEK * Math.min(i, 3),
        scale,
        fade: i > 2 ? 0 : 1,
        // Older toasts are clipped to the front toast's height so a tall one never pokes out below.
        clip: i === 0 ? 0 : Math.max(0, h(t.id) - frontH / scale),
      });
    }
  });
  const stackHeight = expanded ? Math.max(offset - GAP, 0) : frontH + PEEK * Math.min(Math.max(live.length - 1, 0), 2);

  return (
    <div
      data-slot="toast-stack-viewport"
      role="status"
      aria-live="polite"
      aria-relevant="additions"
      aria-label="Notifications"
      className={cn(
        "pointer-events-none z-[100] flex justify-center px-3",
        contained ? "absolute inset-x-0" : "fixed inset-x-0",
        placement === "top" ? "top-0 pt-3" : "bottom-0 pb-3",
        className,
      )}
      onKeyDown={(e) => {
        if (e.key === "Escape" && front) dismiss(front.id);
      }}
    >
      <div
        ref={wrapRef}
        className={cn("relative w-full max-w-[22rem]", items.length > 0 && "pointer-events-auto")}
        style={{ height: stackHeight, transition: "height 420ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        onPointerEnter={(e) => e.pointerType !== "touch" && setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setFocus(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false);
        }}
      >
        {items.map((t) => {
          const l = layout.get(t.id);
          const index = live.findIndex((x) => x.id === t.id);
          return (
            <ToastCard
              key={t.id}
              toast={t}
              placement={placement}
              y={(l?.y ?? 0) * dir}
              scale={l?.scale ?? 1}
              fade={l?.fade ?? 1}
              clip={l?.clip ?? 0}
              z={items.length - items.indexOf(t)}
              inert={!expanded && index > 0}
              paused={paused}
              glass={glass}
              onHeight={onHeight}
              onPressed={setPressed}
              onDismiss={dismiss}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------- card ----------------------------------- */

interface ToastCardProps {
  toast: ToastItem;
  placement: "top" | "bottom";
  y: number;
  scale: number;
  fade: number;
  clip: number;
  z: number;
  inert: boolean;
  paused: boolean;
  glass?: LiquidGlassOptions | GlassPreset | false;
  onHeight: (id: string, height: number) => void;
  onPressed: (pressed: boolean) => void;
  onDismiss: (id: string, direction?: "left" | "right") => void;
}

function ToastCard({ toast, placement, y, scale, fade, clip, z, inert, paused, glass, onHeight, onPressed, onDismiss }: ToastCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [entered, setEntered] = React.useState(false);
  const drag = React.useRef({ active: false, x0: 0, dx: 0, v: 0, lastX: 0, lastT: 0 });
  const remaining = React.useRef(toast.duration ?? 5000);
  const { id, leaving } = toast;
  // A leaving toast is dropped from the layout; it keeps its last place and just exits from there.
  const resting = React.useRef({ y, scale, clip });
  if (!leaving) resting.current = { y, scale, clip };
  const pose = resting.current;

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    onHeight(id, el.offsetHeight);
    const ro = new ResizeObserver(() => onHeight(id, el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [id, onHeight]);

  // Auto-dismiss: the clock only runs while nothing is hovering, focused or pressing the stack.
  React.useEffect(() => {
    if (paused || leaving || !Number.isFinite(remaining.current)) return;
    const started = performance.now();
    const timer = setTimeout(() => onDismiss(id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [paused, leaving, id, onDismiss]);

  const down = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    Object.assign(drag.current, { active: true, x0: e.clientX, dx: 0, v: 0, lastX: e.clientX, lastT: e.timeStamp });
    e.currentTarget.style.transition = "none";
    onPressed(true);
  };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    d.dx = e.clientX - d.x0;
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = 0.7 * d.v + 0.3 * ((e.clientX - d.lastX) / dt);
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    e.currentTarget.style.translate = `${d.dx}px 0`;
    e.currentTarget.style.setProperty("--swipe-o", String(Math.max(0.2, 1 - Math.abs(d.dx) / 260)));
  };
  const up = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    onPressed(false);
    const el = e.currentTarget;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    el.style.transition = "";
    if (Math.abs(d.dx) > 90 || Math.abs(d.v) > 0.6) {
      onDismiss(id, d.dx + d.v * 80 < 0 ? "left" : "right");
    } else {
      el.style.translate = "";
      el.style.removeProperty("--swipe-o");
    }
  };

  const exit = leaving === "left" ? "-120% 0" : leaving === "right" ? "120% 0" : undefined;
  const dir = placement === "top" ? 1 : -1;
  const base = !entered ? 0 : leaving ? 0 : fade;

  return (
    <GlassSurface asChild glass={mergeGlass(TOAST_OPTICS, glass)}>
      <div
        ref={ref}
        role="group"
        aria-label={toast.title}
        inert={inert}
        data-slot="toast-stack-item"
        data-state={leaving ? "closed" : "open"}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        className={cn(
          "absolute inset-x-0 flex touch-pan-y items-start gap-3 rounded-[22px] p-3.5 pl-4 text-foreground select-none",
          placement === "top" ? "top-0 origin-top" : "bottom-0 origin-bottom",
          "transition-[transform,opacity,clip-path,translate] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "motion-reduce:transition-none",
        )}
        style={{
          zIndex: z,
          transform: entered
            ? `translateY(${pose.y - (leaving === "up" ? dir * 14 : 0)}px) scale(${pose.scale})`
            : `translateY(${dir * -28}px) scale(0.94)`,
          opacity: `calc(var(--swipe-o, 1) * ${base})`,
          clipPath: `inset(0 0 ${pose.clip}px 0 round 22px)`,
          translate: exit,
          pointerEvents: leaving ? "none" : undefined,
        }}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate text-sm font-medium">{toast.title}</p>
          {toast.description && <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{toast.description}</p>}
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action?.onClick();
                onDismiss(id);
              }}
              className="mt-2 self-start rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium outline-none transition-colors hover:bg-foreground/15 focus-visible:ring-2 focus-visible:ring-ring"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          type="button"
          aria-label={`Dismiss ${toast.title}`}
          onClick={() => onDismiss(id)}
          className="-m-1 shrink-0 rounded-full p-1.5 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-3.5" aria-hidden>
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>
    </GlassSurface>
  );
}

export { ToastStackProvider, ToastStackViewport, useToastStack };
