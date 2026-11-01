"use client";

import * as React from "react";
import { useLiquidGlass, mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { glassMaterial } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const TEXTAREA_OPTICS: LiquidGlassOptions = {
  scale: -40,
  chroma: 3,
  border: 0.14,
  mapBlur: 6,
  blur: 2,
  saturate: 1.3,
  fallbackBlur: 2,
};

function Textarea({
  className,
  glass,
  ref,
  ...props
}: React.ComponentProps<"textarea"> & { glass?: LiquidGlassOptions | GlassPreset | false }) {
  const [node, setNode] = React.useState<HTMLTextAreaElement | null>(null);
  useLiquidGlass(node, mergeGlass(TEXTAREA_OPTICS, glass));
  const composedRef = React.useCallback(
    (element: HTMLTextAreaElement | null) => {
      setNode(element);
      if (typeof ref === "function") ref(element);
      else if (ref) ref.current = element;
    },
    [ref],
  );
  return (
    <textarea
      ref={composedRef}
      data-slot="textarea"
      className={cn(
        glassMaterial,
        "min-h-24 w-full min-w-0 resize-y rounded-2xl px-4 py-3 text-sm leading-relaxed text-foreground",
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "transition-[border-color] outline-none focus-visible:border-foreground/50",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
