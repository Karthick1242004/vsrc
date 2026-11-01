"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

// Large panel: gentle bend, soft wide edge. The sheet is one fixed-size glass
// element (height = the tallest snap) that only ever translates, so its
// displacement map is built once and never regenerates while dragging.
const SHEET_OPTICS: LiquidGlassOptions = {
  scale: -96,
  chroma: 3,
  border: 0.07,
  mapBlur: 14,
  blur: 8,
  saturate: 1.2,
  fallbackBlur: 14,
};

// Enter/exit are CSS animations (not transitions) so Radix Presence waits for
// them before unmounting. `--ty` is where the sheet rests or was released.
const CSS = `
@keyframes vsrc-drawer-in { from { transform: translateY(100%); } }
@keyframes vsrc-drawer-out { to { transform: translateY(100%); } }
@keyframes vsrc-drawer-fade-in { from { opacity: 0; } }
@keyframes vsrc-drawer-fade-out { from { opacity: var(--drawer-o, 1); } to { opacity: 0; } }
[data-slot="drawer-content"] { transform: translateY(var(--ty)); transition: transform 380ms cubic-bezier(0.32, 0.72, 0, 1); }
[data-slot="drawer-content"][data-dragging] { transition: none; }
[data-slot="drawer-content"][data-state="open"] { animation: vsrc-drawer-in 420ms cubic-bezier(0.32, 0.72, 0, 1); }
[data-slot="drawer-content"][data-state="closed"] { animation: vsrc-drawer-out var(--drawer-dur, 280ms) cubic-bezier(0.32, 0.72, 0, 1) forwards; }
[data-slot="drawer-overlay"] { opacity: var(--drawer-o, 1); transition: opacity 300ms ease; }
[data-slot="drawer-overlay"][data-dragging] { transition: none; }
[data-slot="drawer-overlay"][data-state="open"] { animation: vsrc-drawer-fade-in 300ms ease; }
[data-slot="drawer-overlay"][data-state="closed"] { animation: vsrc-drawer-fade-out var(--drawer-dur, 280ms) ease forwards; }
@media (prefers-reduced-motion: reduce) {
  [data-slot="drawer-content"], [data-slot="drawer-overlay"] { transition: none !important; animation: none !important; }
}
`;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const DrawerContext = React.createContext<{ setOpen: (open: boolean) => void } | null>(null);

type DrawerProps = React.ComponentProps<typeof DialogPrimitive.Root>;

function Drawer({ open: openProp, defaultOpen = false, onOpenChange, ...props }: DrawerProps) {
  const [inner, setInner] = React.useState(defaultOpen);
  const open = openProp ?? inner;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInner(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );
  const ctx = React.useMemo(() => ({ setOpen }), [setOpen]);
  return (
    <DrawerContext.Provider value={ctx}>
      <DialogPrimitive.Root open={open} onOpenChange={setOpen} {...props} />
    </DrawerContext.Provider>
  );
}

const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;

export interface DrawerContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  /** Visible heights as fractions of the viewport (or `container`), ascending. */
  snapPoints?: number[];
  /** Which snap point to open at (a value from `snapPoints`). Defaults to the smallest. */
  defaultSnap?: number;
  /** Portal into this element and position absolutely instead of fixed to the viewport. */
  container?: HTMLElement | null;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function DrawerContent({
  snapPoints = [0.4, 0.9],
  defaultSnap,
  container,
  glass,
  className,
  children,
  style,
  ...props
}: DrawerContentProps) {
  const ctx = React.useContext(DrawerContext);
  const snaps = React.useMemo(() => {
    const cleaned = [...new Set(snapPoints.map((s) => clamp(s, 0.1, 1)))].sort((a, b) => a - b);
    return cleaned.length ? cleaned : [0.9];
  }, [snapPoints]);
  const top = snaps[snaps.length - 1] ?? 0.9;
  const [snapIndex, setSnapIndex] = React.useState(() => {
    const i = defaultSnap === undefined ? 0 : snaps.findIndex((s) => Math.abs(s - defaultSnap) < 0.001);
    return Math.max(i, 0);
  });
  const index = Math.min(snapIndex, snaps.length - 1);
  const snap = snaps[index] ?? top;

  const sheetRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef({ active: false, moved: false, startY: 0, y0: 0, h: 0, y: 0, v: 0, lastY: 0, lastT: 0 });

  // Resting offset as a percentage of the sheet's own height: no measuring needed.
  const restTy = (s: number) => `${((top - s) / top) * 100}%`;
  const rest = restTy(snap);

  const settle = (s: number) => {
    sheetRef.current?.style.setProperty("--ty", restTy(s));
    overlayRef.current?.style.setProperty("--drawer-o", "1");
  };

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    const sheet = sheetRef.current;
    if (!sheet || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const h = sheet.offsetHeight;
    const d = drag.current;
    Object.assign(d, { active: true, moved: false, startY: e.clientY, h, y0: ((top - snap) / top) * h, y: ((top - snap) / top) * h, v: 0, lastY: e.clientY, lastT: e.timeStamp });
    sheet.setAttribute("data-dragging", "");
    overlayRef.current?.setAttribute("data-dragging", "");
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dy = e.clientY - d.startY;
    if (Math.abs(dy) > 4) d.moved = true;
    let y = d.y0 + dy;
    if (y < 0) y *= 0.25; // resistance above the tallest snap
    d.y = y;
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = 0.7 * d.v + 0.3 * ((e.clientY - d.lastY) / dt);
    d.lastY = e.clientY;
    d.lastT = e.timeStamp;
    sheetRef.current?.style.setProperty("--ty", `${y}px`);
    const lowTy = ((top - (snaps[0] ?? top)) / top) * d.h;
    overlayRef.current?.style.setProperty("--drawer-o", String(clamp((d.h - y) / Math.max(d.h - lowTy, 1), 0, 1)));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    sheetRef.current?.removeAttribute("data-dragging");
    overlayRef.current?.removeAttribute("data-dragging");
    if (!d.moved) return settle(snap);

    // Project where a flick would land, then take the nearest resting place
    // (every snap, or fully closed).
    const projected = d.y + d.v * 180;
    const targets = [...snaps.map((s) => ((top - s) / top) * d.h), d.h];
    let best = 0;
    targets.forEach((t, i) => {
      if (Math.abs(t - projected) < Math.abs((targets[best] ?? 0) - projected)) best = i;
    });
    if (best === snaps.length) {
      const remaining = d.h - d.y;
      const ms = clamp(remaining / Math.max(Math.abs(d.v), 0.6), 140, 320);
      sheetRef.current?.style.setProperty("--drawer-dur", `${Math.round(ms)}ms`);
      overlayRef.current?.style.setProperty("--drawer-dur", `${Math.round(ms)}ms`);
      ctx?.setOpen(false);
    } else {
      setSnapIndex(best);
      settle(snaps[best] ?? snap);
    }
  };

  // Keyboard and click alternative for the drag handle: step through snaps.
  const stepSnap = (dir: 1 | -1) => {
    const next = clamp(index + dir, 0, snaps.length - 1);
    setSnapIndex(next);
    settle(snaps[next] ?? snap);
  };
  const onHandleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") stepSnap(1);
    else if (e.key === "ArrowDown") stepSnap(-1);
    else return;
    e.preventDefault();
  };
  const onHandleClick = () => {
    if (drag.current.moved) {
      drag.current.moved = false; // the click that follows a drag is not a tap
      return;
    }
    stepSnap(index === snaps.length - 1 ? -1 : 1);
  };

  const pos = container ? "absolute" : "fixed";
  return (
    <DialogPrimitive.Portal container={container}>
      <style>{CSS}</style>
      <DialogPrimitive.Overlay
        ref={overlayRef}
        data-slot="drawer-overlay"
        className={cn(pos, "inset-0 z-50 bg-background/60")}
      />
      <GlassSurface asChild glass={mergeGlass(SHEET_OPTICS, glass)}>
        <DialogPrimitive.Content
          ref={sheetRef}
          data-slot="drawer-content"
          data-snap={snap}
          className={cn(
            pos,
            "inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-lg flex-col rounded-b-none rounded-t-[28px] border-b-0 text-foreground outline-none",
            className,
          )}
          style={{ height: `${top * 100}%`, "--ty": rest, ...style } as React.CSSProperties}
          // Land focus on the sheet itself, not the resize handle.
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            sheetRef.current?.focus();
          }}
          {...props}
        >
          <button
            type="button"
            aria-label="Resize sheet"
            data-slot="drawer-handle"
            className="group flex h-9 w-full shrink-0 cursor-grab touch-none items-center justify-center outline-none active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onHandleKey}
            onClick={onHandleClick}
          >
            <span className="h-1.5 w-10 rounded-full bg-foreground/30 transition-colors group-hover:bg-foreground/50 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 ring-offset-background" />
          </button>
          {/* Height tracks the visible snap, so the end of the content is never below the fold. */}
          <div
            data-slot="drawer-body"
            className="flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-contain px-6 pb-8 transition-[height] duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
            style={{ height: `calc(${(snap / top) * 100}% - 2.25rem)` }}
          >
            {children}
          </div>
        </DialogPrimitive.Content>
      </GlassSurface>
    </DialogPrimitive.Portal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-header" className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="drawer-title"
      className={cn("font-display text-2xl leading-tight", className)}
      {...props}
    />
  );
}

function DrawerDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-footer" className={cn("mt-auto flex flex-col gap-2 pt-2", className)} {...props} />;
}

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
};
