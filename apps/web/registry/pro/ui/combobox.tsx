"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const FIELD_OPTICS: LiquidGlassOptions = {
  scale: -40,
  chroma: 3,
  border: 0.18,
  mapBlur: 6,
  blur: 2,
  saturate: 1.3,
  fallbackBlur: 2,
};

const PANEL_OPTICS: LiquidGlassOptions = {
  scale: -72,
  chroma: 3,
  border: 0.08,
  mapBlur: 12,
  blur: 3,
  saturate: 1.3,
  fallbackBlur: 6,
};

export interface ComboboxOption {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
}

interface ComboboxBase {
  options: ComboboxOption[];
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  glass?: LiquidGlassOptions | GlassPreset | false;
  "aria-label"?: string;
}

export type ComboboxProps = ComboboxBase &
  (
    | { multiple?: false; value?: string; defaultValue?: string; onValueChange?: (value: string | undefined) => void }
    | { multiple: true; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void }
  );

const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background";

const Check = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-4 shrink-0">
    <path d="m3.5 8.5 3 3 6-7" />
  </svg>
);

function Combobox(props: ComboboxProps) {
  const { options, placeholder = "Select…", emptyText = "No results found.", searchPlaceholder = "Search…", disabled, className, glass, multiple } = props;
  const [inner, setInner] = React.useState<string | string[] | undefined>(props.defaultValue);
  const raw = "value" in props ? props.value : inner;
  const selected = React.useMemo(() => (Array.isArray(raw) ? raw : raw !== undefined ? [raw] : []), [raw]);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const commit = (next: string[]) => {
    const out = multiple ? next : next[0];
    if (!("value" in props)) setInner(out);
    (props.onValueChange as ((v: string | string[] | undefined) => void) | undefined)?.(out);
  };

  const byValue = React.useMemo(() => new Map(options.map((o) => [o.value, o])), [options]);
  const chips = selected.map((v) => byValue.get(v)).filter((o): o is ComboboxOption => !!o);

  const toggle = (v: string) => {
    if (multiple) commit(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]);
    else {
      commit([v]);
      setOpen(false);
    }
  };
  const removeLast = () => selected.length > 0 && commit(selected.slice(0, -1));

  const groups = React.useMemo(() => {
    const map = new Map<string, ComboboxOption[]>();
    for (const o of options) map.set(o.group ?? "", [...(map.get(o.group ?? "") ?? []), o]);
    return [...map.entries()];
  }, [options]);

  const single = !multiple ? chips[0] : undefined;

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearch("");
      }}
    >
      <GlassSurface asChild glass={mergeGlass(FIELD_OPTICS, glass)}>
        <PopoverPrimitive.Anchor
          data-slot="combobox"
          aria-disabled={disabled || undefined}
          className={cn(
            "relative flex min-h-10 w-64 max-w-full flex-wrap items-center gap-1.5 rounded-[20px] py-1 pr-2 pl-2",
            "has-[[role=combobox]:focus-visible]:ring-2 has-[[role=combobox]:focus-visible]:ring-ring ring-offset-background",
            disabled && "opacity-50",
            className,
          )}
        >
          {multiple &&
            chips.map((o) => (
              <span
                key={o.value}
                data-slot="combobox-chip"
                className="animate-glass-in inline-flex items-center gap-1 rounded-full bg-foreground/15 py-0.5 pr-1 pl-2.5 text-xs font-medium"
              >
                {o.label}
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={`Remove ${o.label}`}
                  onClick={() => {
                    commit(selected.filter((s) => s !== o.value));
                    triggerRef.current?.focus();
                  }}
                  className={cn("flex size-4 items-center justify-center rounded-full transition-colors hover:bg-foreground/20", FOCUS)}
                >
                  <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden className="size-2.5">
                    <path d="m2 2 6 6M8 2 2 8" />
                  </svg>
                </button>
              </span>
            ))}
          <PopoverPrimitive.Trigger
            ref={triggerRef}
            type="button"
            role="combobox"
            data-slot="combobox-trigger"
            aria-label={props["aria-label"]}
            aria-haspopup="listbox"
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && multiple) removeLast();
            }}
            className="flex h-8 min-w-24 flex-1 items-center justify-between gap-2 rounded-full px-2 text-left text-sm outline-none"
          >
            <span className={cn("truncate", chips.length === 0 && "text-muted-foreground")}>{multiple ? (chips.length ? "" : placeholder) : (single?.label ?? placeholder)}</span>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className={cn("ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")}
            >
              <path d="m4 6 4 4 4-4" />
            </svg>
          </PopoverPrimitive.Trigger>
        </PopoverPrimitive.Anchor>
      </GlassSurface>

      <PopoverPrimitive.Portal>
        <GlassSurface asChild glass={mergeGlass(PANEL_OPTICS, glass)}>
          <PopoverPrimitive.Content
            data-slot="combobox-content"
            align="start"
            sideOffset={8}
            collisionPadding={12}
            className="animate-glass-in relative z-50 w-(--radix-popover-trigger-width) min-w-56 rounded-[24px] p-1.5 text-foreground outline-none"
          >
            <CommandPrimitive
              data-slot="combobox-command"
              onKeyDown={(e) => {
                if (e.key === "Backspace" && multiple && search === "") removeLast();
              }}
            >
              <div className="flex items-center gap-2 border-b border-foreground/10 px-3">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden className="size-4 shrink-0 text-muted-foreground">
                  <circle cx="7" cy="7" r="4.5" />
                  <path d="m11 11 3 3" />
                </svg>
                <CommandPrimitive.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder={searchPlaceholder}
                  aria-label={props["aria-label"] ? `Search ${props["aria-label"]}` : "Search options"}
                  className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <CommandPrimitive.List aria-multiselectable={multiple || undefined} className="max-h-60 overflow-x-hidden overflow-y-auto p-1 pt-1.5">
                <CommandPrimitive.Empty className="py-6 text-center text-sm text-muted-foreground">{emptyText}</CommandPrimitive.Empty>
                {groups.map(([group, items]) => (
                  <CommandPrimitive.Group
                    key={group}
                    heading={group || undefined}
                    className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase"
                  >
                    {items.map((o) => {
                      const on = selected.includes(o.value);
                      return (
                        <CommandPrimitive.Item
                          key={o.value}
                          value={o.value}
                          keywords={[o.label, o.group ?? ""]}
                          disabled={o.disabled}
                          onSelect={() => toggle(o.value)}
                          data-checked={on || undefined}
                          className={cn(
                            "flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm select-none",
                            "data-[selected=true]:bg-foreground/15 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
                          )}
                        >
                          <span className="flex-1 truncate">{o.label}</span>
                          <span className={cn("transition-opacity duration-150", on ? "opacity-100" : "opacity-0")}>
                            <Check />
                          </span>
                        </CommandPrimitive.Item>
                      );
                    })}
                  </CommandPrimitive.Group>
                ))}
              </CommandPrimitive.List>
            </CommandPrimitive>
          </PopoverPrimitive.Content>
        </GlassSurface>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export { Combobox };
