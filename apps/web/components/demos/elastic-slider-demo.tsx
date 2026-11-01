"use client";

import * as React from "react";

import { ElasticSlider } from "@/registry/pro/ui/elastic-slider";

export function ElasticSliderDemo() {
  const [volume, setVolume] = React.useState(64);
  const [exposure, setExposure] = React.useState(0.3);

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <ElasticSlider label="Volume" value={volume} onValueChange={setVolume} format={(v) => `${v}%`} />
      <ElasticSlider
        label="Exposure"
        min={-2}
        max={2}
        step={0.1}
        value={exposure}
        onValueChange={setExposure}
        format={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)} EV`}
      />
      <p className="text-center text-xs text-muted-foreground">Drag past either end, then let go.</p>
    </div>
  );
}
