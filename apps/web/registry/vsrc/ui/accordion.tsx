"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const ACCORDION_OPTICS: LiquidGlassOptions = {
  scale: -56,
  chroma: 4,
  border: 0.08,
  mapBlur: 10,
  blur: 0.5,
  saturate: 1.4,
  fallbackBlur: 3,
};

/** One glass panel holds every item — a stack of separate glass rows would nest
 *  filters for no gain. Items are separated by a hairline, not by their own pane. */
function Accordion({
  className,
  glass,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & { glass?: LiquidGlassOptions | GlassPreset | false }) {
  return (
    <GlassSurface asChild glass={mergeGlass(ACCORDION_OPTICS, glass)}>
      <AccordionPrimitive.Root data-slot="accordion" className={cn("w-full rounded-3xl", className)} {...props} />
    </GlassSurface>
  );
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-border/60 last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground",
          "transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <svg
          viewBox="0 0 16 16"
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
        >
          <path d="M3.5 6l4.5 4.5L12.5 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm text-muted-foreground data-[state=closed]:animate-[accordion-up_0.22s_ease-out] data-[state=open]:animate-[accordion-down_0.26s_ease-out] motion-reduce:animate-none"
      {...props}
    >
      <div className={cn("px-5 pb-4 leading-relaxed", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
