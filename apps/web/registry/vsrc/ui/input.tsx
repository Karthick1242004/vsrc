"use client";

import * as React from "react";
import { useLiquidGlass, mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { glassMaterial } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const INPUT_OPTICS: LiquidGlassOptions = {
  scale: -40,
  chroma: 3,
  border: 0.18,
  mapBlur: 6,
  blur: 2,
  saturate: 1.3,
  fallbackBlur: 2,
};

function Input({
  className,
  glass,
  ref,
  ...props
}: React.ComponentProps<"input"> & { glass?: LiquidGlassOptions | GlassPreset | false }) {
  const [node, setNode] = React.useState<HTMLInputElement | null>(null);
  useLiquidGlass(node, mergeGlass(INPUT_OPTICS, glass));
  const composedRef = React.useCallback(
    (element: HTMLInputElement | null) => {
      setNode(element);
      if (typeof ref === "function") ref(element);
      else if (ref) ref.current = element;
    },
    [ref],
  );
  return (
    <input
      ref={composedRef}
      data-slot="input"
      className={cn(
        glassMaterial,
        "h-10 w-full min-w-0 rounded-full px-4 text-sm text-foreground",
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "transition-[border-color] outline-none focus-visible:border-foreground/50",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
