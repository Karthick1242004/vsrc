"use client";

import { GlassOrbLoader } from "@/registry/pro/ui/glass-orb-loader";

export function GlassOrbLoaderDemo() {
  return (
    <div data-demo="glass-orb-loader" className="flex flex-wrap items-end justify-center gap-10">
      <GlassOrbLoader size="sm" label="Saving" />
      <GlassOrbLoader size="lg" label="Syncing library" showLabel />
      <GlassOrbLoader size="md" label="Rendering" />
    </div>
  );
}
