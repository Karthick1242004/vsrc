"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const TRIGGER_OPTICS: LiquidGlassOptions = {
  scale: -40,
  chroma: 3,
  border: 0.18,
  mapBlur: 6,
  blur: 2,
  saturate: 1.3,
  fallbackBlur: 2,
};

const PANEL_OPTICS: LiquidGlassOptions = {
  scale: -80,
  chroma: 3,
  border: 0.08,
  mapBlur: 12,
  blur: 3,
  saturate: 1.3,
  fallbackBlur: 6,
};

export interface DateRange {
  from?: Date;
  to?: Date;
}

interface DatePickerBase {
  min?: Date;
  max?: Date;
  /** Return true for days that cannot be chosen. */
  disabled?: (date: Date) => boolean;
  placeholder?: string;
  locale?: string;
  /** 0 = Sunday, 1 = Monday. */
  weekStartsOn?: 0 | 1;
  className?: string;
  glass?: LiquidGlassOptions | GlassPreset | false;
  "aria-label"?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

export type DatePickerProps = DatePickerBase &
  (
    | { mode?: "single"; value?: Date; defaultValue?: Date; onValueChange?: (value: Date | undefined) => void }
    | { mode: "range"; value?: DateRange; defaultValue?: DateRange; onValueChange?: (value: DateRange | undefined) => void }
  );

type Picked = Date | DateRange | undefined;

const day0 = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const t = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last));
};
const same = (a?: Date, b?: Date) => !!a && !!b && a.getTime() === b.getTime();
const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const isRange = (v: Picked): v is DateRange => !!v && !(v instanceof Date);

const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background";

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-4">
      <path d={d} />
    </svg>
  );
}

function DatePicker(props: DatePickerProps) {
  const { mode = "single", min, max, disabled, placeholder = "Pick a date", locale = "en-US", weekStartsOn = 0, className, glass, ref } = props;
  const [inner, setInner] = React.useState<Picked>(props.defaultValue);
  const picked: Picked = "value" in props ? props.value : inner;
  const [open, setOpen] = React.useState(false);
  const [today, setToday] = React.useState<Date | null>(null);

  // "Today" differs between server and client, so it only exists after mount.
  React.useEffect(() => setToday(day0(new Date())), []);

  const commit = (next: Picked) => {
    if (!("value" in props)) setInner(next);
    (props.onValueChange as ((v: Picked) => void) | undefined)?.(next);
  };

  const fmt = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" });
  let label: string | null = null;
  if (picked instanceof Date) label = fmt.format(picked);
  else if (isRange(picked) && picked.from) label = picked.to ? `${fmt.format(picked.from)} – ${fmt.format(picked.to)}` : `${fmt.format(picked.from)} – …`;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <GlassSurface asChild glass={mergeGlass(TRIGGER_OPTICS, glass)}>
        <PopoverPrimitive.Trigger
          ref={ref}
          data-slot="date-picker"
          aria-label={props["aria-label"]}
          className={cn(
            "relative inline-flex h-10 min-w-56 items-center gap-2.5 rounded-full px-4 text-sm",
            "transition-transform duration-150 active:scale-[0.98] disabled:opacity-50 motion-reduce:transition-none",
            FOCUS,
            className,
          )}
        >
          <Icon d="M3 5.5A1.5 1.5 0 0 1 4.5 4h7A1.5 1.5 0 0 1 13 5.5v6a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5v-6ZM3 7h10M5.5 2.5V5M10.5 2.5V5" />
          <span className={cn("flex-1 text-left", label ? "text-foreground" : "text-muted-foreground")}>{label ?? placeholder}</span>
        </PopoverPrimitive.Trigger>
      </GlassSurface>
      <PopoverPrimitive.Portal>
        <GlassSurface asChild glass={mergeGlass(PANEL_OPTICS, glass)}>
          <PopoverPrimitive.Content
            data-slot="date-picker-content"
            aria-label="Choose date"
            align="start"
            sideOffset={8}
            collisionPadding={12}
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              (e.currentTarget as HTMLElement).querySelector<HTMLElement>('[role="gridcell"] [tabindex="0"]')?.focus();
            }}
            className="animate-glass-in relative z-50 w-[19rem] max-w-[calc(100vw-1.5rem)] rounded-[28px] p-4 text-foreground outline-none"
          >
            <Calendar
              mode={mode}
              picked={picked}
              today={today}
              min={min}
              max={max}
              disabled={disabled}
              locale={locale}
              weekStartsOn={weekStartsOn}
              onPick={(next, done) => {
                commit(next);
                if (done) setOpen(false);
              }}
            />
          </PopoverPrimitive.Content>
        </GlassSurface>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

interface CalendarProps {
  mode: "single" | "range";
  picked: Picked;
  today: Date | null;
  min?: Date;
  max?: Date;
  disabled?: (date: Date) => boolean;
  locale: string;
  weekStartsOn: 0 | 1;
  onPick: (next: Picked, done: boolean) => void;
}

function Calendar({ mode, picked, today, min, max, disabled, locale, weekStartsOn, onPick }: CalendarProps) {
  // Mounts only while the popover is open (client only), so reading the clock here is hydration-safe.
  const [focused, setFocused] = React.useState(() => {
    const anchor = picked instanceof Date ? picked : isRange(picked) ? (picked.from ?? picked.to) : undefined;
    return day0(anchor ?? today ?? new Date());
  });
  const gridRef = React.useRef<HTMLDivElement>(null);
  const shouldFocus = React.useRef(false);
  const dir = React.useRef(0);
  const headingId = React.useId();

  const month = focused.getMonth();
  const monthFmt = React.useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }), [locale]);
  const dayFmt = React.useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" }), [locale]);
  const weekdays = React.useMemo(() => {
    const short = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const long = new Intl.DateTimeFormat(locale, { weekday: "long" });
    // 7 Jan 2024 is a Sunday.
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2024, 0, 7 + ((i + weekStartsOn) % 7));
      return { short: short.format(d), long: long.format(d) };
    });
  }, [locale, weekStartsOn]);

  const cells = React.useMemo(() => {
    const first = new Date(focused.getFullYear(), month, 1);
    const start = addDays(first, -((first.getDay() - weekStartsOn + 7) % 7));
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [focused, month, weekStartsOn]);

  const off = (d: Date) => (min && d < day0(min)) || (max && d > day0(max)) || !!disabled?.(d);
  const from = isRange(picked) ? picked.from : picked;
  const to = isRange(picked) ? picked.to : undefined;

  const go = (next: Date, moveFocus: boolean) => {
    dir.current = next.getTime() === focused.getTime() ? 0 : next > focused ? 1 : -1;
    shouldFocus.current = moveFocus;
    setFocused(next);
  };

  React.useEffect(() => {
    if (shouldFocus.current) {
      shouldFocus.current = false;
      gridRef.current?.querySelector<HTMLElement>(`[data-day="${key(focused)}"]`)?.focus();
    }
  }, [focused]);

  // Month change: the grid slides in from the direction of travel.
  React.useEffect(() => {
    const el = gridRef.current;
    if (!el || dir.current === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dx = dir.current * 14;
    dir.current = 0;
    el.animate([{ opacity: 0.2, transform: `translateX(${dx}px)` }, { opacity: 1, transform: "none" }], { duration: 240, easing: "cubic-bezier(0.22,1,0.36,1)" });
  }, [month]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step: Record<string, Date> = {
      ArrowLeft: addDays(focused, -1),
      ArrowRight: addDays(focused, 1),
      ArrowUp: addDays(focused, -7),
      ArrowDown: addDays(focused, 7),
      Home: addDays(focused, -((focused.getDay() - weekStartsOn + 7) % 7)),
      End: addDays(focused, 6 - ((focused.getDay() - weekStartsOn + 7) % 7)),
      PageUp: addMonths(focused, e.shiftKey ? -12 : -1),
      PageDown: addMonths(focused, e.shiftKey ? 12 : 1),
    };
    const next = step[e.key];
    if (!next) return;
    e.preventDefault();
    go(next, true);
  };

  const select = (d: Date) => {
    if (off(d)) return;
    if (mode === "single") return onPick(d, true);
    if (!from || to || d < from) onPick({ from: d }, false);
    else onPick({ from, to: d }, true);
  };

  const nav = (label: string, d: string, delta: number) => (
    <button
      type="button"
      aria-label={label}
      onClick={() => go(addMonths(focused, delta), false)}
      className={cn("flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground", FOCUS)}
    >
      <Icon d={d} />
    </button>
  );

  const todayOff = !today || off(today);

  return (
    <div data-slot="date-picker-calendar">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex">
          {nav("Previous year", "M9 4 5 8l4 4M13 4 9 8l4 4", -12)}
          {nav("Previous month", "M10 4 6 8l4 4", -1)}
        </div>
        <h2 id={headingId} aria-live="polite" className="text-sm font-semibold">
          {monthFmt.format(focused)}
        </h2>
        <div className="flex">
          {nav("Next month", "m6 4 4 4-4 4", 1)}
          {nav("Next year", "m3 4 4 4-4 4M7 4l4 4-4 4", 12)}
        </div>
      </div>
      <div role="grid" aria-labelledby={headingId} onKeyDown={onKeyDown}>
        <div role="row" className="grid grid-cols-7">
          {weekdays.map((w) => (
            <div key={w.long} role="columnheader" aria-label={w.long} className="py-1 text-center text-xs font-medium text-muted-foreground">
              {w.short.slice(0, 2)}
            </div>
          ))}
        </div>
        <div ref={gridRef} role="presentation">
          {Array.from({ length: 6 }, (_, r) => (
            <div key={r} role="row" className="grid grid-cols-7">
              {cells.slice(r * 7, r * 7 + 7).map((d) => {
                const isFrom = same(d, from);
                const isTo = same(d, to);
                const selected = isFrom || isTo;
                const between = !!from && !!to && d > from && d < to;
                const outside = d.getMonth() !== month;
                const isOff = !!off(d);
                const isToday = same(d, today ?? undefined);
                return (
                  <div
                    key={key(d)}
                    role="gridcell"
                    aria-selected={selected || between}
                    className={cn("flex justify-center py-0.5", between && "bg-foreground/10", isFrom && to && "rounded-l-full bg-foreground/10", isTo && from && "rounded-r-full bg-foreground/10")}
                  >
                    <button
                      type="button"
                      data-day={key(d)}
                      tabIndex={same(d, focused) ? 0 : -1}
                      aria-label={dayFmt.format(d)}
                      aria-disabled={isOff || undefined}
                      aria-current={isToday ? "date" : undefined}
                      onFocus={() => !same(d, focused) && setFocused(d)}
                      onClick={() => select(d)}
                      className={cn(
                        "size-9 rounded-full text-sm tabular-nums transition-[background-color,color,transform] duration-150 active:scale-90 motion-reduce:transition-none",
                        FOCUS,
                        outside ? "text-muted-foreground" : "text-foreground",
                        !selected && !isOff && "hover:bg-foreground/15",
                        isToday && !selected && "ring-1 ring-foreground/40",
                        selected && "bg-primary font-semibold text-primary-foreground",
                        isOff && "cursor-not-allowed opacity-35 line-through",
                      )}
                    >
                      {d.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-foreground/10 pt-3">
        <button
          type="button"
          disabled={todayOff}
          onClick={() => {
            if (!today) return;
            if (mode === "single") onPick(today, true);
            else go(today, true);
          }}
          className={cn("rounded-full px-3 py-1 text-sm font-medium transition-colors hover:bg-foreground/10 disabled:pointer-events-none disabled:opacity-40", FOCUS)}
        >
          Today
        </button>
        <button
          type="button"
          disabled={!from}
          onClick={() => onPick(undefined, false)}
          className={cn("rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-40", FOCUS)}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export { DatePicker };
