"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { DayPicker, type Matcher } from "react-day-picker";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const TRIGGER_OPTICS: LiquidGlassOptions = {
  scale: -40,
  chroma: 3,
  border: 0.18,
  mapBlur: 6,
  blur: 0.5,
  saturate: 1.3,
  fallbackBlur: 2,
};

const PANEL_OPTICS: LiquidGlassOptions = {
  scale: -80,
  chroma: 3,
  border: 0.08,
  mapBlur: 12,
  blur: 1,
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
          // The label alone would hide the chosen date from screen readers.
          aria-label={props["aria-label"] && label ? `${props["aria-label"]}, ${label}` : props["aria-label"]}
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

const DAY_CLASSES = {
  root: "relative",
  months: "flex flex-col",
  month: "flex flex-col gap-3",
  month_caption: "flex h-9 items-center justify-center font-display text-lg",
  nav: "absolute inset-x-0 top-0 z-10 flex h-9 items-center justify-between",
  button_previous: cn("grid size-9 place-items-center rounded-full transition-colors hover:bg-foreground/10 disabled:opacity-30", FOCUS),
  button_next: cn("grid size-9 place-items-center rounded-full transition-colors hover:bg-foreground/10 disabled:opacity-30", FOCUS),
  chevron: "size-4 fill-foreground",
  month_grid: "w-full border-collapse",
  weekdays: "flex",
  weekday: "flex-1 py-1 text-center text-xs font-medium text-muted-foreground",
  week: "flex w-full",
  day: "flex-1 py-0.5 text-center text-foreground",
  day_button: cn(
    "mx-auto grid size-9 place-items-center rounded-full text-sm tabular-nums transition-[background-color,transform] duration-150 hover:bg-foreground/15 active:scale-90 motion-reduce:transition-none",
    FOCUS,
  ),
  today: "[&>button]:ring-1 [&>button]:ring-foreground/40",
  outside: "text-muted-foreground",
  disabled: "opacity-35 [&>button]:cursor-not-allowed [&>button]:line-through [&>button]:hover:bg-transparent",
  selected: "[&>button]:bg-primary [&>button]:font-semibold [&>button]:text-primary-foreground [&>button]:ring-0",
  range_start: "rounded-l-full bg-foreground/10",
  range_end: "rounded-r-full bg-foreground/10",
  range_middle: "bg-foreground/10 [&>button]:bg-transparent [&>button]:font-normal [&>button]:text-foreground",
  hidden: "invisible",
};

/** react-day-picker (the calendar behind shadcn's Calendar) with V-/Src classes; Intl supplies the caption and weekday text. */
function Calendar({ mode, picked, today, min, max, disabled, locale, weekStartsOn, onPick }: CalendarProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const from = isRange(picked) ? picked.from : picked;
  const caption = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  const matchers: Matcher[] = [];
  if (min) matchers.push({ before: day0(min) });
  if (max) matchers.push({ after: day0(max) });
  if (disabled) matchers.push(disabled);
  const common = {
    showOutsideDays: true,
    weekStartsOn,
    disabled: matchers,
    today: today ?? undefined,
    defaultMonth: from ?? today ?? undefined,
    formatters: { formatCaption: (m: Date) => caption.format(m), formatWeekdayName: (d: Date) => weekday.format(d) },
    classNames: DAY_CLASSES,
  };

  return (
    <div ref={rootRef}>
      {mode === "range" ? (
        <DayPicker
          {...common}
          mode="range"
          selected={isRange(picked) && picked.from ? { from: picked.from, to: picked.to } : undefined}
          onSelect={(r) => onPick(r?.from ? { from: r.from, to: r.to } : undefined, !!r?.from && !!r.to && r.from.getTime() !== r.to.getTime())}
        />
      ) : (
        <DayPicker {...common} mode="single" selected={picked instanceof Date ? picked : undefined} onSelect={(d) => onPick(d, !!d)} />
      )}
      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
        <button
          type="button"
          disabled={!today || (!!today && matchers.length > 0 && !!disabled?.(today))}
          onClick={() => today && onPick(mode === "single" ? today : { from: today }, mode === "single")}
          className={cn("rounded-full px-3 py-1 text-sm font-medium transition-colors hover:bg-foreground/10 disabled:pointer-events-none disabled:opacity-40", FOCUS)}
        >
          Today
        </button>
        <button
          type="button"
          disabled={!from}
          onClick={() => {
            onPick(undefined, false);
            // This button disables itself; keep keyboard focus inside the calendar.
            rootRef.current?.querySelector<HTMLElement>("button[tabindex='0']")?.focus();
          }}
          className={cn("rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-40", FOCUS)}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export { DatePicker };
