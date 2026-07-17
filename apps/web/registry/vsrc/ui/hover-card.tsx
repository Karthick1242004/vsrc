"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import type { GlassPreset, LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 8,
  glass,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content> & { glass?: LiquidGlassOptions | GlassPreset | false }) {
  return (
    <HoverCardPrimitive.Portal>
      <GlassSurface asChild glass={glass}>
        <HoverCardPrimitive.Content
          data-slot="hover-card-content"
          align={align}
          sideOffset={sideOffset}
          className={cn("animate-glass-in relative z-50 w-72 p-4 text-foreground outline-none", className)}
          {...props}
        />
      </GlassSurface>
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
