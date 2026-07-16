"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const TIP_OPTICS: LiquidGlassOptions = {
  scale: -32,
  chroma: 2,
  border: 0.2,
  mapBlur: 5,
  blur: 2,
  saturate: 1.3,
  fallbackBlur: 2,
};

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

function TooltipContent({
  className,
  sideOffset = 6,
  glass,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & { glass?: LiquidGlassOptions | false }) {
  return (
    <TooltipPrimitive.Portal>
      <GlassSurface asChild glass={glass === false ? false : { ...TIP_OPTICS, ...glass }}>
        <TooltipPrimitive.Content
          data-slot="tooltip-content"
          sideOffset={sideOffset}
          className={cn(
            "animate-glass-in relative z-50 rounded-full px-3 py-1.5 text-xs text-foreground",
            className,
          )}
          {...props}
        />
      </GlassSurface>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
