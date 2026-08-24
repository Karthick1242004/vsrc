import type * as React from "react";

/* Every demo floats over type and warm color so the glass has something to
   bend — same reason the landing demo band exists. */
export function DemoTile({ word, children }: { word: string; children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-[32px] border border-border p-10">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -top-1/3 -left-1/4 size-80 rounded-full bg-signal/40 blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/3 size-72 rounded-full bg-primary/35 blur-3xl" />
        <p className="animate-word-drift absolute top-1/2 left-1/2 -translate-1/2 font-display text-[6rem] leading-none whitespace-nowrap text-foreground/80 italic">
          {word}
        </p>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
