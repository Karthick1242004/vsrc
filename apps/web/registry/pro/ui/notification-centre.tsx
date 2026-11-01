"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { Button } from "@/registry/vsrc/ui/button";
import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

// Large panel, so a shallow bend and a soft wide edge; the rows inside are plain.
const PANEL_OPTICS: LiquidGlassOptions = {
  scale: -88,
  chroma: 3,
  border: 0.07,
  mapBlur: 14,
  blur: 6,
  saturate: 1.2,
  fallbackBlur: 10,
};

export interface NotificationItem {
  id: string;
  /** Who it is from; the avatar shows their initials. */
  name: string;
  text: string;
  /** Pre-formatted relative time, e.g. "12 min ago". */
  time: string;
  group: "today" | "earlier";
  read: boolean;
}

export interface NotificationCentreProps {
  notifications: NotificationItem[];
  /** Called with the ids to mark read: one for a row, every unread id for "Mark all read". */
  onRead?: (ids: string[]) => void;
  onClear?: () => void;
  /** Optics override for the popover panel. */
  glass?: LiquidGlassOptions | GlassPreset | false;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

const GROUPS = [
  { key: "today", label: "Today" },
  { key: "earlier", label: "Earlier" },
] as const;

const TINTS = ["bg-primary/15", "bg-foreground/10", "bg-foreground/15"];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

const tint = (name: string) => TINTS[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % TINTS.length];

const textButton =
  "rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

function NotificationCentre({ notifications, onRead, onClear, glass, className, ref }: NotificationCentreProps) {
  const unread = notifications.filter((n) => !n.read);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState<string | null>(null);
  const uid = React.useId();
  const label = unread.length ? `Notifications, ${unread.length} unread` : "Notifications";

  const rows = () => Array.from(listRef.current?.querySelectorAll<HTMLElement>('[data-slot="notification-row"]') ?? []);
  const onRowKey = (e: React.KeyboardEvent<HTMLElement>, item: NotificationItem) => {
    if (e.target !== e.currentTarget) return;
    const all = rows();
    const at = all.indexOf(e.currentTarget);
    let to: HTMLElement | undefined;
    if (e.key === "ArrowDown") to = all[Math.min(at + 1, all.length - 1)];
    else if (e.key === "ArrowUp") to = all[Math.max(at - 1, 0)];
    else if (e.key === "Home") to = all[0];
    else if (e.key === "End") to = all[all.length - 1];
    else if ((e.key === "Enter" || e.key === " ") && !item.read) {
      e.preventDefault();
      onRead?.([item.id]);
      return;
    } else return;
    e.preventDefault();
    to?.focus();
  };

  // One row is the tab stop; arrows move between rows from there.
  const ordered = GROUPS.flatMap((g) => notifications.filter((n) => n.group === g.key));
  const stop = ordered.some((n) => n.id === active) ? active : ordered[0]?.id;

  return (
    <PopoverPrimitive.Root>
      <span className="relative inline-flex">
        <PopoverPrimitive.Trigger asChild>
          <Button ref={ref} size="icon" aria-label={label} className={cn("[&_svg]:size-5", className)}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 8a5 5 0 0 1 10 0c0 4 1.5 5.5 1.5 5.5h-13S5 12 5 8Z" />
              <path d="M8.5 16.5a1.6 1.6 0 0 0 3 0" />
            </svg>
          </Button>
        </PopoverPrimitive.Trigger>
        {/* A sibling of the button: the glass button clips its own overflow. */}
        {unread.length > 0 && (
          <span
            aria-hidden
            data-slot="notification-centre-badge"
            className="pointer-events-none absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground tabular-nums"
          >
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </span>

      <PopoverPrimitive.Portal>
        <GlassSurface asChild glass={mergeGlass(PANEL_OPTICS, glass)}>
          <PopoverPrimitive.Content
            data-slot="notification-centre-panel"
            aria-label="Notifications"
            align="end"
            sideOffset={10}
            collisionPadding={12}
            className="animate-glass-in relative z-50 flex max-h-[min(30rem,var(--radix-popover-content-available-height))] w-[22rem] max-w-[calc(100vw-1.5rem)] flex-col text-foreground outline-none"
          >
            <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-2">
              <h2 className="font-display text-xl leading-none">Notifications</h2>
              <div className="flex items-center">
                <button type="button" className={textButton} disabled={unread.length === 0} onClick={() => onRead?.(unread.map((n) => n.id))}>
                  Mark all read
                </button>
                <button type="button" className={textButton} disabled={notifications.length === 0} onClick={() => onClear?.()}>
                  Clear
                </button>
              </div>
            </div>

            {notifications.length === 0 ? (
              <div data-slot="notification-centre-empty" className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-10 text-muted-foreground" aria-hidden>
                  <path d="M13 21a11 11 0 0 1 22 0c0 9 3.5 12 3.5 12h-29S13 30 13 21Z" />
                  <path d="M20 39a4 4 0 0 0 8 0" />
                  <path d="M19 22l3.5 3.5L30 18" />
                </svg>
                <p className="text-sm font-medium">You are all caught up</p>
                <p className="text-xs text-muted-foreground">New activity will show up here.</p>
              </div>
            ) : (
              <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-3">
                {GROUPS.map(({ key, label: groupLabel }) => {
                  const items = notifications.filter((n) => n.group === key);
                  if (items.length === 0) return null;
                  return (
                    <section key={key} aria-labelledby={`${uid}-${key}`} className="mt-1">
                      <h3 id={`${uid}-${key}`} className="px-3 pt-2 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                        {groupLabel}
                      </h3>
                      <ul className="flex flex-col">
                        {items.map((item) => (
                          <li
                            key={item.id}
                            data-slot="notification-row"
                            data-read={item.read ? "" : undefined}
                            tabIndex={item.id === stop ? 0 : -1}
                            onFocus={(e) => e.target === e.currentTarget && setActive(item.id)}
                            onKeyDown={(e) => onRowKey(e, item)}
                            className="group flex items-start gap-3 rounded-2xl px-3 py-2.5 outline-none transition-colors hover:bg-foreground/5 focus-visible:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <span aria-hidden className={cn("flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium", tint(item.name))}>
                              {initials(item.name)}
                            </span>
                            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                              <p className={cn("text-sm leading-snug", item.read ? "text-muted-foreground" : "text-foreground")}>
                                <span className="font-medium">{item.name}</span> {item.text}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.time}
                                {!item.read && <span className="sr-only">, unread</span>}
                              </p>
                            </div>
                            <div className="flex h-9 w-6 shrink-0 items-center justify-center">
                              {item.read ? null : (
                                <button
                                  type="button"
                                  tabIndex={-1}
                                  aria-label={`Mark "${item.text}" from ${item.name} as read`}
                                  onClick={() => onRead?.([item.id])}
                                  className="group/dot flex size-6 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                  <span className="size-2.5 rounded-full bg-primary transition-transform group-hover/dot:scale-125 motion-reduce:transition-none" />
                                </button>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            )}
          </PopoverPrimitive.Content>
        </GlassSurface>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export { NotificationCentre };
