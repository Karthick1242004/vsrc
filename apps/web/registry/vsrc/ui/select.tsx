"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

// Input-tuned optics: the trigger is a small pill, same footprint as Input.
const TRIGGER_OPTICS: LiquidGlassOptions = {
  scale: -40,
  chroma: 3,
  border: 0.18,
  mapBlur: 6,
  blur: 2,
  saturate: 1.3,
  fallbackBlur: 2,
};

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

function SelectTrigger({
  className,
  children,
  glass,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & { glass?: LiquidGlassOptions | GlassPreset | false }) {
  return (
    <GlassSurface asChild glass={mergeGlass(TRIGGER_OPTICS, glass)}>
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        className={cn(
          "relative flex h-10 w-fit items-center justify-between gap-2 rounded-full px-4 text-sm text-foreground",
          "outline-none focus-visible:border-foreground/50 data-[placeholder]:text-muted-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
          "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          className,
        )}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    </GlassSurface>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  glass,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & { glass?: LiquidGlassOptions | GlassPreset | false }) {
  return (
    <SelectPrimitive.Portal>
      <GlassSurface asChild glass={glass}>
        <SelectPrimitive.Content
          data-slot="select-content"
          position={position}
          sideOffset={8}
          className={cn(
            "animate-glass-in relative z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width)",
            "overflow-hidden p-1.5 text-foreground outline-none",
            className,
          )}
          {...props}
        >
          <SelectPrimitive.Viewport className="max-h-72 overflow-y-auto">
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </GlassSurface>
    </SelectPrimitive.Portal>
  );
}

// Radix Select highlights the active option with data-highlighted (it drives
// selection off a roving highlight, not DOM focus like DropdownMenu).
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-[calc(var(--glass-radius)-8px)] py-2 pr-8 pl-3 text-sm",
        "outline-none select-none data-[highlighted]:bg-foreground/15",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-3 flex items-center">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
          <path d="M3.5 8.5l3 3 6-7" />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-3 py-1.5 font-mono text-xs tracking-widest text-muted-foreground uppercase", className)}
      {...props}
    />
  );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("mx-2 my-1 h-px bg-foreground/15", className)}
      {...props}
    />
  );
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
};
