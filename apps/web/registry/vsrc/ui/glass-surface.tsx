"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useLiquidGlass, type LiquidGlassOptions } from "vsrc/react";

import { cn } from "@/lib/utils";

/**
 * The V-/Src glass material. Refraction itself (the backdrop-filter) comes
 * from the vsrc engine; these classes are only the dressing — tint, border,
 * speculars, shadow — plus the opaque fallback the engine signals with
 * data-vsrc-glass="reduced" when the user prefers reduced transparency.
 *
 * Never nest one glass surface inside another: refraction is a per-panel
 * effect and stacked filters multiply cost without adding depth.
 */
export const glassMaterial = cn(
  "relative isolate overflow-hidden",
  "border border-(--glass-border) bg-(--glass-tint)",
  "shadow-[var(--glass-shadow),var(--glass-specular)]",
  // Frosted (WebKit / all iOS) can't refract — a stronger lens rim fakes it.
  "data-[vsrc-glass=frosted]:shadow-[var(--glass-shadow),var(--glass-specular-frosted)]",
  "data-[vsrc-glass=reduced]:bg-card",
);

export interface GlassSurfaceProps extends React.ComponentProps<"div"> {
  asChild?: boolean;
  /** Engine optics overrides; `false` renders the material without refraction. */
  glass?: LiquidGlassOptions | false;
}

function GlassSurface({ asChild, glass, className, ref, ...props }: GlassSurfaceProps) {
  const localRef = React.useRef<HTMLDivElement | null>(null);
  useLiquidGlass(localRef, glass);
  const composedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={composedRef}
      data-slot="glass-surface"
      className={cn(glassMaterial, "rounded-(--glass-radius)", className)}
      {...props}
    />
  );
}

export { GlassSurface };
