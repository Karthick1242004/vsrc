"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const TRACK_OPTICS: LiquidGlassOptions = {
  scale: -32,
  chroma: 2,
  border: 0.22,
  mapBlur: 5,
  blur: 2,
  saturate: 1.3,
  fallbackBlur: 2,
};

function Switch({
  className,
  glass,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & { glass?: LiquidGlassOptions | GlassPreset | false }) {
  return (
    <GlassSurface asChild glass={mergeGlass(TRACK_OPTICS, glass)}>
      <SwitchPrimitive.Root
        data-slot="switch"
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full",
          "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:border-primary/60 data-[state=checked]:bg-primary/80",
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            "block size-5 rounded-full bg-foreground shadow-[0_1px_4px_rgb(0_0_0/0.4)]",
            "transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0.5",
          )}
        />
      </SwitchPrimitive.Root>
    </GlassSurface>
  );
}

export { Switch };
