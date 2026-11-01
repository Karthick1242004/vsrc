"use client";

import { RefractionMarquee } from "@/registry/pro/ui/refraction-marquee";

const WORDS = ["Refract", "Bend", "Gather", "Prism", "Clarity", "Depth"];

export function RefractionMarqueeDemo() {
  return (
    <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-card py-4">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(45%_90%_at_20%_50%,oklch(0.8_0.15_60/0.35),transparent),radial-gradient(45%_90%_at_85%_50%,oklch(0.7_0.14_260/0.3),transparent)]"
      />
      <RefractionMarquee items={WORDS} label="Optical vocabulary" speed={80} bandWidth={220} className="relative" />
    </div>
  );
}
