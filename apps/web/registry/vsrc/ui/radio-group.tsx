"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const RADIO_OPTICS: LiquidGlassOptions = {
  scale: -28,
  chroma: 2,
  border: 0.3,
  mapBlur: 4,
  blur: 1,
  saturate: 1.3,
  fallbackBlur: 1,
};

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />;
}

function RadioGroupItem({
  className,
  glass,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & { glass?: LiquidGlassOptions | GlassPreset | false }) {
  return (
    <GlassSurface asChild glass={mergeGlass(RADIO_OPTICS, glass)}>
      <RadioGroupPrimitive.Item
        data-slot="radio-group-item"
        className={cn(
          "relative inline-flex size-5 shrink-0 items-center justify-center rounded-full",
          "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:border-primary/60",
          className,
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator
          data-slot="radio-group-indicator"
          className="block size-2.5 rounded-full bg-primary data-[state=checked]:animate-[checkbox-pop_0.22s_ease-out] motion-reduce:animate-none"
        />
      </RadioGroupPrimitive.Item>
    </GlassSurface>
  );
}

export { RadioGroup, RadioGroupItem };
