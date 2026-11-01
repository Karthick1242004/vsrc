"use client";

import { PrismHeadline } from "@/registry/pro/ui/prism-headline";

export function PrismHeadlineDemo() {
  return (
    <div className="flex w-full max-w-3xl flex-col items-start gap-8">
      <PrismHeadline as="h3" className="text-5xl sm:text-7xl">
        Light bends where it meets glass.
      </PrismHeadline>
      <div className="flex flex-col gap-1">
        <PrismHeadline as="h3" trigger="hover" className="text-3xl sm:text-4xl">
          Hover to bend this line
        </PrismHeadline>
        <p className="text-xs text-muted-foreground">Sweeps once on hover or focus.</p>
      </div>
    </div>
  );
}
