"use client";

import * as React from "react";
import { Drawer as VaulDrawer } from "vaul";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

// Large panel: gentle bend, soft wide edge. The sheet keeps one fixed height and
// vaul only translates it, so the displacement map is built once, never per drag frame.
const SHEET_OPTICS: LiquidGlassOptions = {
  scale: -96,
  chroma: 3,
  border: 0.07,
  mapBlur: 14,
  blur: 4,
  saturate: 1.2,
  fallbackBlur: 14,
};

/**
 * vaul (the library behind shadcn's Drawer) owns drag, flick velocity, snap
 * points, focus trap and Escape; this file adds the glass sheet. Pass
 * `snapPoints` (fractions of the viewport, e.g. [0.5, 0.92]) on the root.
 */
function Drawer({ shouldScaleBackground = false, ...props }: React.ComponentProps<typeof VaulDrawer.Root>) {
  return <VaulDrawer.Root shouldScaleBackground={shouldScaleBackground} {...props} />;
}

const DrawerTrigger = VaulDrawer.Trigger;
const DrawerClose = VaulDrawer.Close;

export interface DrawerContentProps extends React.ComponentProps<typeof VaulDrawer.Content> {
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function DrawerContent({ glass, className, children, ...props }: DrawerContentProps) {
  return (
    <VaulDrawer.Portal>
      <VaulDrawer.Overlay data-slot="drawer-overlay" className="fixed inset-0 z-50 bg-background/60" />
      <GlassSurface asChild glass={mergeGlass(SHEET_OPTICS, glass)}>
        <VaulDrawer.Content
          data-slot="drawer-content"
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[92dvh] w-full max-w-lg flex-col rounded-t-[28px] rounded-b-none border-b-0 text-foreground outline-none",
            className,
          )}
          {...props}
        >
          <VaulDrawer.Handle data-slot="drawer-handle" className="mx-auto mt-3 mb-3 !h-1.5 !w-10 shrink-0 !rounded-full !bg-foreground/30 !opacity-100" />
          <div data-slot="drawer-body" className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-6 pb-8">
            {children}
          </div>
        </VaulDrawer.Content>
      </GlassSurface>
    </VaulDrawer.Portal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-header" className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof VaulDrawer.Title>) {
  return <VaulDrawer.Title data-slot="drawer-title" className={cn("font-display text-2xl leading-tight", className)} {...props} />;
}

function DrawerDescription({ className, ...props }: React.ComponentProps<typeof VaulDrawer.Description>) {
  return (
    <VaulDrawer.Description
      data-slot="drawer-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-footer" className={cn("mt-auto flex flex-col gap-2 pt-2", className)} {...props} />;
}

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
};
