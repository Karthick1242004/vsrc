"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const WINDOW_OPTICS: LiquidGlassOptions = {
  scale: -72,
  chroma: 3,
  border: 0.08,
  mapBlur: 12,
  blur: 1,
  saturate: 1.25,
  fallbackBlur: 4,
};

const TITLE_H = 40;

interface Point {
  x: number;
  y: number;
}

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

const DesktopContext = React.createContext<{ raise: (id: string) => void; zOf: (id: string) => number } | null>(null);

/** The frame windows live in and are clamped to. Tracks which window is on top. */
function WindowDesktop({ className, children, ...props }: React.ComponentProps<"div">) {
  const [stack, setStack] = React.useState<string[]>([]);
  const raise = React.useCallback(
    (id: string) => setStack((s) => (s[s.length - 1] === id ? s : [...s.filter((x) => x !== id), id])),
    [],
  );
  const ctx = React.useMemo(() => ({ raise, zOf: (id: string) => stack.indexOf(id) + 2 || 1 }), [raise, stack]);
  return (
    <DesktopContext.Provider value={ctx}>
      <div data-slot="window-desktop" className={cn("relative overflow-hidden", className)} {...props}>
        {children}
      </div>
    </DesktopContext.Provider>
  );
}

// Traffic-light hues are the one deliberate use of raw palette colours: they
// are an OS convention, not theme decoration.
function Light({ label, tone, d, onClick }: { label: string; tone: string; d: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "relative grid size-3 place-items-center rounded-full outline-none after:absolute after:-inset-1.5",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-transparent",
        tone,
      )}
    >
      <svg viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden
        className="size-2 text-black/60 opacity-0 group-hover/lights:opacity-100 group-focus-within/lights:opacity-100">
        <path d={d} />
      </svg>
    </button>
  );
}

export interface GlassWindowProps extends Omit<React.ComponentProps<"div">, "title"> {
  title: string;
  position?: Point;
  defaultPosition?: Point;
  /** Fires when a drag ends (and when the window is pushed back inside a shrinking frame). */
  onPositionChange?: (position: Point) => void;
  size?: { width: number; height: number };
  /** Called by the red button. The window does not remove itself: unmount it from the parent. */
  onClose?: () => void;
  /** Collapses the window to its title bar. */
  minimized?: boolean;
  defaultMinimized?: boolean;
  onMinimizedChange?: (minimized: boolean) => void;
  /** Fills the desktop frame. */
  maximized?: boolean;
  defaultMaximized?: boolean;
  onMaximizedChange?: (maximized: boolean) => void;
  /** Overrides the stacking order when not inside a `WindowDesktop`. */
  zIndex?: number;
  /** Fired when the window is pressed or focused and raised to the front. */
  onActivate?: () => void;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function GlassWindow({
  title,
  position,
  defaultPosition = { x: 24, y: 24 },
  onPositionChange,
  size = { width: 320, height: 220 },
  onClose,
  minimized: minimizedProp,
  defaultMinimized = false,
  onMinimizedChange,
  maximized: maximizedProp,
  defaultMaximized = false,
  onMaximizedChange,
  zIndex,
  onActivate,
  glass,
  className,
  style,
  children,
  ref,
  ...props
}: GlassWindowProps) {
  const id = React.useId();
  const desktop = React.useContext(DesktopContext);
  const [pos, setPos] = useControllable(position, defaultPosition, onPositionChange);
  const [minimized, setMinimized] = useControllable(minimizedProp, defaultMinimized, onMinimizedChange);
  const [maximized, setMaximized] = useControllable(maximizedProp, defaultMaximized, onMaximizedChange);
  const [dragging, setDragging] = React.useState(false);
  const node = React.useRef<HTMLDivElement | null>(null);
  const grab = React.useRef<Point | null>(null);
  const posRef = React.useRef(pos);
  posRef.current = pos;

  const clamp = React.useCallback((p: Point): Point => {
    const el = node.current;
    const frame = el?.parentElement;
    if (!el || !frame) return p;
    return {
      x: Math.min(Math.max(0, frame.clientWidth - el.offsetWidth), Math.max(0, p.x)),
      y: Math.min(Math.max(0, frame.clientHeight - el.offsetHeight), Math.max(0, p.y)),
    };
  }, []);

  // Keep the window inside its frame when the frame shrinks (phone widths, resizes)
  // and when a minimized window grows back. Skipped while maximized, which would
  // otherwise pin the restore position to the corner.
  React.useEffect(() => {
    const frame = node.current?.parentElement;
    if (!frame || maximized) return;
    const fit = () => {
      const next = clamp(posRef.current);
      if (next.x !== posRef.current.x || next.y !== posRef.current.y) setPos(next);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(frame);
    return () => ro.disconnect();
  }, [clamp, setPos, minimized, maximized]);

  const activate = () => {
    desktop?.raise(id);
    onActivate?.();
  };

  const z = zIndex ?? desktop?.zOf(id) ?? 1;
  const toggleMax = () => setMaximized(!maximized);
  const setNode = React.useCallback(
    (el: HTMLDivElement | null) => {
      node.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );
  const endDrag = () => {
    if (!grab.current) return;
    grab.current = null;
    setDragging(false);
    setPos(posRef.current);
  };

  return (
    <GlassSurface
      ref={setNode}
      data-slot="glass-window"
      role="group"
      aria-labelledby={`${id}-title`}
      glass={mergeGlass(WINDOW_OPTICS, glass)}
      onPointerDownCapture={activate}
      onFocusCapture={activate}
      className={cn(
        "absolute top-0 left-0 flex flex-col rounded-2xl text-foreground",
        // Size snaps: animating width/height would stretch the displacement map every frame.
        "transition-[transform] duration-300 ease-out motion-reduce:transition-none",
        dragging && "transition-none",
        className,
      )}
      style={{
        ...style,
        width: maximized ? "100%" : size.width,
        height: maximized ? "100%" : minimized ? TITLE_H : size.height,
        maxWidth: "100%",
        maxHeight: "100%",
        transform: maximized ? "translate3d(0,0,0)" : `translate3d(${pos.x}px,${pos.y}px,0)`,
        zIndex: z,
      }}
      {...props}
    >
      <div
        data-slot="glass-window-titlebar"
        className={cn(
          "flex shrink-0 touch-none items-center gap-3 border-b border-border/50 px-3.5 select-none",
          maximized ? "cursor-default" : dragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{ height: TITLE_H }}
        onDoubleClick={(e) => !(e.target as HTMLElement).closest("button") && toggleMax()}
        onPointerDown={(e) => {
          if (e.button !== 0 || maximized || (e.target as HTMLElement).closest("button")) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          grab.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
          setDragging(true);
        }}
        onPointerMove={(e) => {
          const g = grab.current;
          if (!g || !node.current) return;
          // Written straight to the element; state is committed once, on release.
          const p = clamp({ x: e.clientX - g.x, y: e.clientY - g.y });
          posRef.current = p;
          node.current.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="group/lights flex items-center gap-2">
          <Light label="Close window" tone="bg-red-500" d="M2 2l4 4M6 2L2 6" onClick={() => onClose?.()} />
          <Light label={minimized ? "Restore window" : "Minimize window"} tone="bg-amber-400" d="M1.8 4h4.4" onClick={() => setMinimized(!minimized)} />
          <Light label={maximized ? "Exit zoom" : "Zoom window"} tone="bg-green-500" d={maximized ? "M2.5 5.5l3-3M2.5 2.5v3h3" : "M2 6l4-4M2 2h4v4"} onClick={toggleMax} />
        </div>
        <div id={`${id}-title`} className="min-w-0 flex-1 truncate text-center text-xs font-medium">
          {title}
        </div>
        <span aria-hidden className="w-[52px] shrink-0" />
      </div>
      <div
        data-slot="glass-window-body"
        inert={minimized}
        className={cn(
          "min-h-0 flex-1 overflow-auto p-4 text-sm transition-opacity duration-200 motion-reduce:transition-none",
          minimized && "opacity-0",
        )}
      >
        {children}
      </div>
    </GlassSurface>
  );
}

export { GlassWindow, WindowDesktop };
