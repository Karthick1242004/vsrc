"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const BOX_OPTICS: LiquidGlassOptions = {
  scale: -28,
  chroma: 2,
  border: 0.24,
  mapBlur: 4,
  blur: 0.5,
  saturate: 1.3,
  fallbackBlur: 1,
};

function Checkbox({
  className,
  glass,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & { glass?: LiquidGlassOptions | GlassPreset | false }) {
  return (
    <GlassSurface asChild glass={mergeGlass(BOX_OPTICS, glass)}>
      <CheckboxPrimitive.Root
        data-slot="checkbox"
        className={cn(
          "relative inline-flex size-5 shrink-0 items-center justify-center rounded-md",
          "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:border-primary/60 data-[state=checked]:bg-primary/80",
          "data-[state=indeterminate]:border-primary/60 data-[state=indeterminate]:bg-primary/80",
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="grid place-items-center text-primary-foreground data-[state=checked]:animate-[checkbox-pop_0.22s_ease-out] motion-reduce:animate-none"
        >
          {props.checked === "indeterminate" ? (
            <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
              <path d="M3.5 8h9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
              <path
                d="M3.5 8.5l3 3 6-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    </GlassSurface>
  );
}

export { Checkbox };
