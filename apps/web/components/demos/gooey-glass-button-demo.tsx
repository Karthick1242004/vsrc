"use client";

import * as React from "react";

import { GooeyGlassButton } from "@/registry/pro/ui/gooey-glass-button";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function GooeyGlassButtonDemo() {
  const [saved, setSaved] = React.useState(0);
  return (
    <div className="flex flex-col items-center gap-6" data-demo="gooey-glass-button">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <GooeyGlassButton variant="primary" size="lg" onClick={() => setSaved((n) => n + 1)}>
          Start free trial
          <ArrowIcon />
        </GooeyGlassButton>
        <GooeyGlassButton>Book a demo</GooeyGlassButton>
        <GooeyGlassButton size="sm" disabled>
          Sold out
        </GooeyGlassButton>
      </div>
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {saved === 0 ? "Hover or press a button." : `Trial started ${saved} time${saved === 1 ? "" : "s"}.`}
      </p>
    </div>
  );
}
