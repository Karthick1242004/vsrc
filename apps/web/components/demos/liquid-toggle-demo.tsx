"use client";

import * as React from "react";

import { LiquidToggle } from "@/registry/pro/ui/liquid-toggle";

export function LiquidToggleDemo() {
  const [focus, setFocus] = React.useState(true);

  return (
    <div className="flex w-full max-w-xs flex-col gap-4 text-sm text-foreground">
      <label className="flex items-center justify-between gap-6">
        <span>
          Wi-Fi
          <span className="block text-xs text-muted-foreground">Connected to Atelier-5G</span>
        </span>
        <LiquidToggle defaultChecked />
      </label>
      <label className="flex items-center justify-between gap-6">
        <span>
          Focus mode
          <span className="block text-xs text-muted-foreground">{focus ? "Notifications paused" : "Notifications on"}</span>
        </span>
        <LiquidToggle checked={focus} onCheckedChange={setFocus} />
      </label>
      <label className="flex items-center justify-between gap-6 text-muted-foreground">
        <span>
          Low power mode
          <span className="block text-xs">Managed by your administrator</span>
        </span>
        <LiquidToggle disabled />
      </label>
    </div>
  );
}
