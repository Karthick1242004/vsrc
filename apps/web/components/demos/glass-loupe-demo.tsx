"use client";

import { GlassLoupe } from "@/registry/pro/ui/glass-loupe";

export function GlassLoupeDemo() {
  return (
    <div
      className="relative h-[340px] w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-card"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_70%_at_15%_20%,oklch(0.8_0.16_55/0.55),transparent),radial-gradient(55%_60%_at_90%_80%,oklch(0.7_0.15_250/0.45),transparent)]"
      />
      <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
        <p className="font-display text-[5.5rem] leading-[0.85] tracking-tight text-foreground sm:text-[9rem]">
          Lumen<span className="text-primary">.</span>
        </p>
        <div className="grid gap-3 text-[11px] leading-snug text-muted-foreground sm:grid-cols-3">
          <p>
            Lumen is a field guide to how light behaves when it meets a curved edge. Every plate in this issue was
            photographed through hand-ground borosilicate, edge-lit, on a single morning in March.
          </p>
          <p>
            The distortion you see at a lens rim is not a flaw. It is refraction doing exactly what Snell&apos;s law
            says it must, and it is the reason a drop of water can turn a printed page into a landscape.
          </p>
          <p className="hidden sm:block">
            Plate 14, Caustics on slate, 1/250s at f/8. Printed on 170gsm uncoated stock with a matte aqueous
            varnish. Edition of 400, numbered and signed on the colophon page.
          </p>
        </div>
      </div>
      <GlassLoupe size={150} defaultPosition={{ x: 150, y: 215 }} label="Magnifier">
        Drag me
      </GlassLoupe>
    </div>
  );
}
