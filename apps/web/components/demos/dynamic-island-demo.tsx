"use client";

import * as React from "react";

import { DynamicIsland, DYNAMIC_ISLAND_STATES, type DynamicIslandState } from "@/registry/pro/ui/dynamic-island";
import { cn } from "@/lib/utils";

const LABELS: Record<DynamicIslandState, string> = {
  idle: "Idle",
  call: "Incoming call",
  timer: "Timer",
  playing: "Now playing",
};

export function DynamicIslandDemo() {
  const [state, setState] = React.useState<DynamicIslandState>("call");

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative h-[190px] w-full max-w-[320px] overflow-hidden rounded-[2.5rem] border border-border bg-card">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_90%,oklch(0.78_0.16_55/0.7),transparent),radial-gradient(60%_60%_at_90%_30%,oklch(0.68_0.16_265/0.6),transparent),radial-gradient(40%_40%_at_50%_60%,oklch(0.8_0.12_150/0.45),transparent)]"
        />
        <div className="relative flex justify-center pt-3">
          <DynamicIsland state={state} onStateChange={setState} />
        </div>
        <p aria-hidden className="absolute inset-x-0 bottom-5 text-center font-display text-5xl text-foreground/80">
          9:41
        </p>
      </div>
      <div role="group" aria-label="Island state" className="flex flex-wrap justify-center gap-1.5">
        {DYNAMIC_ISLAND_STATES.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={state === s}
            onClick={() => setState(s)}
            className={cn(
              "rounded-full border border-border px-3 py-1.5 text-xs font-medium outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
              state === s ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted",
            )}
          >
            {LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
