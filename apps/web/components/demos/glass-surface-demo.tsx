"use client";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";

export function GlassSurfaceDemo() {
  return (
    <GlassSurface specular="pointer" className="w-[24rem] max-w-full p-8">
      <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
        {"// glass-surface"}
      </p>
      <p className="mt-3 font-display text-2xl leading-snug">Everything bends at the rim.</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Content stays legible in the middle; the edge does the optics.
      </p>
    </GlassSurface>
  );
}
