"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const RADIAL_OPTICS: LiquidGlassOptions = {
  scale: -48,
  chroma: 4,
  border: 0.18,
  mapBlur: 6,
  blur: 2,
  saturate: 1.4,
  fallbackBlur: 2,
};

export interface RadialMenuItem {
  id: string;
  /** Accessible name; also shown as a caption while the item is hovered or focused. */
  label: string;
  /** Icon-only inline SVG. */
  icon: React.ReactNode;
  onSelect?: () => void;
}

export interface RadialMenuProps extends Omit<React.ComponentProps<"div">, "children" | "onSelect"> {
  /** 3 to 8 items; extras are ignored. */
  items: RadialMenuItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Distance in px from the trigger centre to each item centre. */
  radius?: number;
  /** Degrees, 0 = right, positive = clockwise (so -90 is straight up). */
  startAngle?: number;
  endAngle?: number;
  /** Accessible name of the trigger and of the item group. */
  label?: string;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

const ITEM = 44;
const TRIGGER = 56;
const button = cn(
  "absolute flex items-center justify-center rounded-full text-foreground outline-none",
  "ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:size-5",
);

function RadialMenu({
  items,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  radius = 92,
  startAngle = -160,
  endAngle = -20,
  label = "Actions",
  glass,
  className,
  ref,
  ...props
}: RadialMenuProps) {
  const [inner, setInner] = React.useState(defaultOpen);
  const open = openProp ?? inner;
  const [caption, setCaption] = React.useState<string | null>(null);
  const [active, setActive] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const groupId = React.useId();
  const list = items.slice(0, 8);
  const optics = mergeGlass(RADIAL_OPTICS, glass);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInner(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const close = (restoreFocus: boolean) => {
    setOpen(false);
    setCaption(null);
    if (restoreFocus) triggerRef.current?.focus();
  };

  // Move focus into the fan when the trigger opens it (not when the parent
  // drives `open`); the closed fan is
  // inert, so focus can only land here after the open state is committed.
  const focusOnOpen = React.useRef(false);
  React.useEffect(() => {
    if (open && focusOnOpen.current) {
      setActive(0);
      itemRefs.current[0]?.focus();
    }
    focusOnOpen.current = false;
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) close(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, setOpen]);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const move = (index: number) => {
    const next = (index + list.length) % list.length;
    setActive(next);
    itemRefs.current[next]?.focus();
  };

  const onGroupKeyDown = (event: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    const step = keys[event.key];
    if (step !== undefined) {
      event.preventDefault();
      move(active + step);
    } else if (event.key === "Home") {
      event.preventDefault();
      move(0);
    } else if (event.key === "End") {
      event.preventDefault();
      move(list.length - 1);
    }
  };

  const span = list.length > 1 ? (endAngle - startAngle) / (list.length - 1) : 0;

  return (
    <div
      ref={setRefs}
      data-slot="radial-menu"
      data-state={open ? "open" : "closed"}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          close(true);
        }
      }}
      onBlur={(event) => {
        // A null relatedTarget is a click on non-focusable space (Safari never focuses
        // buttons on click); the outside-pointerdown listener covers that case.
        if (open && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) close(false);
      }}
      className={cn("relative shrink-0", className)}
      style={{ width: TRIGGER, height: TRIGGER }}
      {...props}
    >
      <div
        id={groupId}
        role="toolbar"
        aria-label={label}
        inert={!open}
        onKeyDown={onGroupKeyDown}
        className="absolute inset-0"
      >
        {list.map((item, index) => {
          const angle = ((startAngle + span * index) * Math.PI) / 180;
          const x = Math.round(Math.cos(angle) * radius * 100) / 100;
          const y = Math.round(Math.sin(angle) * radius * 100) / 100;
          return (
            <GlassSurface asChild key={item.id} glass={optics}>
              <button
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                type="button"
                data-slot="radial-menu-item"
                aria-label={item.label}
                tabIndex={index === active ? 0 : -1}
                onFocus={() => {
                  setActive(index);
                  setCaption(item.label);
                }}
                onPointerEnter={() => setCaption(item.label)}
                onPointerLeave={() => setCaption(null)}
                onClick={() => {
                  item.onSelect?.();
                  close(true);
                }}
                style={
                  {
                    "--tx": `${x}px`,
                    "--ty": `${y}px`,
                    width: ITEM,
                    height: ITEM,
                    left: (TRIGGER - ITEM) / 2,
                    top: (TRIGGER - ITEM) / 2,
                    transitionDelay: open ? `${index * 35}ms` : `${(list.length - 1 - index) * 20}ms`,
                  } as React.CSSProperties
                }
                className={cn(
                  button,
                  "transition-[translate,scale,opacity,background-color] duration-[420ms] ease-[cubic-bezier(0.34,1.45,0.64,1)]",
                  "hover:bg-foreground/10",
                  open
                    ? "translate-x-(--tx) translate-y-(--ty) scale-100 opacity-100"
                    : "pointer-events-none scale-50 opacity-0 motion-reduce:translate-x-(--tx) motion-reduce:translate-y-(--ty) motion-reduce:scale-100",
                  "motion-reduce:duration-150",
                )}
              >
                {item.icon}
              </button>
            </GlassSurface>
          );
        })}
      </div>
      <GlassSurface asChild glass={optics}>
        <button
          ref={triggerRef}
          type="button"
          data-slot="radial-menu-trigger"
          aria-label={label}
          aria-expanded={open}
          aria-controls={groupId}
          onClick={() => {
            focusOnOpen.current = !open;
            setOpen(!open);
          }}
          className={cn(
            button,
            "inset-0 size-14 transition-transform duration-300 active:scale-95 hover:border-foreground/40",
            "[&_svg]:transition-transform [&_svg]:duration-300 motion-reduce:[&_svg]:transition-none",
            open && "[&_svg]:rotate-45",
          )}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="M10 4v12M4 10h12" />
          </svg>
        </button>
      </GlassSurface>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-full left-1/2 mt-3 -translate-x-1/2 text-xs font-medium whitespace-nowrap text-foreground",
          "transition-opacity duration-200",
          open && caption ? "opacity-100" : "opacity-0",
        )}
      >
        {caption}
      </span>
    </div>
  );
}

export { RadialMenu };
