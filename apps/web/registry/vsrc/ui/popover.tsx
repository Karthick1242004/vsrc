"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import type { LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

function PopoverContent({
  className,
  align = "center",
  sideOffset = 8,
  glass,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & { glass?: LiquidGlassOptions | false }) {
  return (
    <PopoverPrimitive.Portal>
      <GlassSurface asChild glass={glass}>
        <PopoverPrimitive.Content
          data-slot="popover-content"
          align={align}
          sideOffset={sideOffset}
          className={cn("animate-glass-in relative z-50 w-72 p-4 text-foreground outline-none", className)}
          {...props}
        />
      </GlassSurface>
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
