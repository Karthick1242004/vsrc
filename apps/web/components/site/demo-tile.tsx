import type * as React from "react";

import { DemoBackdrop } from "@/components/site/demo-backdrop";

/* Every demo floats over a moving, pointer-reactive scene so the glass has
   something to bend — same reason the landing demo band exists. */
export function DemoTile({ word, children }: { word: string; children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-[32px] border border-border p-4 sm:p-10">
      <DemoBackdrop word={word} />
      {/* Full width so demos can size with w-full / max-w-*; flex keeps narrower ones centred. */}
      <div className="relative flex w-full items-center justify-center">{children}</div>
    </div>
  );
}
