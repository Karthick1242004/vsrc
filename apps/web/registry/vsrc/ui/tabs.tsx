"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const LIST_OPTICS: LiquidGlassOptions = {
  scale: -40,
  chroma: 3,
  border: 0.18,
  mapBlur: 6,
  blur: 2,
  saturate: 1.3,
  fallbackBlur: 2,
};

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-4", className)} {...props} />;
}

function TabsList({
  className,
  glass,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { glass?: LiquidGlassOptions | false }) {
  return (
    <GlassSurface asChild glass={glass === false ? false : { ...LIST_OPTICS, ...glass }}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn("relative inline-flex w-fit items-center gap-1 rounded-full p-1", className)}
        {...props}
      />
    </GlassSurface>
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-full px-4 text-sm font-medium whitespace-nowrap",
        "text-muted-foreground transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        "hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-foreground/15 data-[state=active]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("outline-none", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
