"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

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
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { glass?: LiquidGlassOptions | GlassPreset | false }) {
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = React.useState<{ left: number; width: number } | null>(null);

  // The active pill is one element that glides between triggers instead of a
  // per-trigger background snapping on. Radix flips data-state on the triggers;
  // we watch that and measure the active one.
  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const place = () => {
      const active = list.querySelector<HTMLElement>('[data-slot="tabs-trigger"][data-state="active"]');
      if (active) setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
    };
    place();
    const states = new MutationObserver(place);
    states.observe(list, { attributes: true, attributeFilter: ["data-state"], subtree: true });
    const sizes = new ResizeObserver(place);
    sizes.observe(list);
    return () => {
      states.disconnect();
      sizes.disconnect();
    };
  }, []);

  return (
    <GlassSurface asChild glass={mergeGlass(LIST_OPTICS, glass)}>
      <TabsPrimitive.List
        ref={listRef}
        data-slot="tabs-list"
        className={cn("relative inline-flex w-fit items-center gap-1 rounded-full p-1", className)}
        {...props}
      >
        {indicator && (
          <span
            aria-hidden
            style={{ left: indicator.left, width: indicator.width }}
            className={cn(
              "absolute inset-y-1 rounded-full bg-foreground/15",
              "transition-[left,width] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              "motion-reduce:transition-none",
            )}
          />
        )}
        {children}
      </TabsPrimitive.List>
    </GlassSurface>
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-8 items-center justify-center rounded-full px-4 text-sm font-medium whitespace-nowrap",
        "text-muted-foreground transition-[color,transform,scale] duration-300 outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        "hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
        // Label pops slightly after the pill lands under it; no delay on the way out.
        "data-[state=active]:scale-[1.04] data-[state=active]:text-foreground data-[state=active]:delay-100",
        "motion-reduce:transition-none motion-reduce:data-[state=active]:scale-100",
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
