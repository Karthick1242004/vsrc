"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

// A small, strong lens: the switch inverted. The track carries the colour and
// the thumb is the glass, so blur is 0 — the lens must bend the track crisply,
// not fog it. Dragging only moves the thumb's position (Radix sets `left` on a
// wrapper), never its box, so the engine's ResizeObserver never regenerates the
// displacement map mid-drag — the same reason the site's lens cursor is cheap.
const THUMB_OPTICS: LiquidGlassOptions = {
  scale: -72,
  chroma: 5,
  border: 0.18,
  mapBlur: 5,
  blur: 0,
  saturate: 1.5,
  fallbackBlur: 1,
};

function Slider({
  className,
  glass,
  defaultValue,
  value,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  glass?: LiquidGlassOptions | GlassPreset | false;
}) {
  const thumbCount = React.useMemo(() => {
    if (Array.isArray(value)) return value.length;
    if (Array.isArray(defaultValue)) return defaultValue.length;
    return 1;
  }, [value, defaultValue]);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      {/* A coloured, ticked track so the lens has something to bend — signal red
          is decoration here (no text sits on it). */}
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-2 w-full grow overflow-hidden rounded-full"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in oklab, var(--primary) 70%, transparent), color-mix(in oklab, var(--signal) 55%, transparent) 55%, color-mix(in oklab, var(--foreground) 28%, transparent)), repeating-linear-gradient(90deg, transparent 0 13px, color-mix(in oklab, var(--foreground) 30%, transparent) 13px 14px)",
        }}
      >
        <SliderPrimitive.Range data-slot="slider-range" className="absolute h-full bg-foreground/15" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }, (_, i) => (
        <GlassSurface asChild glass={mergeGlass(THUMB_OPTICS, glass)} key={i}>
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            className={cn(
              "relative block size-7 rounded-full outline-none",
              "transition-[border-color] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
              "disabled:pointer-events-none",
            )}
          />
        </GlassSurface>
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
