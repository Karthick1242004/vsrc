"use client";

import * as React from "react";

import { ColorPicker } from "@/registry/pro/ui/color-picker";

/** Black or white, whichever reads better on the swatch (WCAG relative luminance). */
function readableOn(hex: string): string {
  const n = (i: number) => parseInt(hex.slice(i, i + 2), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const lum = 0.2126 * lin(n(1)) + 0.7152 * lin(n(3)) + 0.0722 * lin(n(5));
  return lum > 0.36 ? "#1b1a18" : "#ffffff";
}

export function ColorPickerDemo() {
  const [color, setColor] = React.useState("#e02723");
  const solid = color.slice(0, 7);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 sm:flex-row sm:justify-between">
      <div className="flex flex-col gap-1.5 text-center sm:text-left">
        <p className="text-sm font-medium">Brand accent</p>
        <p className="text-xs text-muted-foreground">Used for buttons, links and focus rings.</p>
        <div
          className="mt-2 inline-flex h-10 items-center justify-center self-center rounded-full px-5 text-sm font-medium sm:self-start"
          style={{ background: color, color: readableOn(solid) }}
        >
          Start free trial
        </div>
      </div>
      <ColorPicker alpha value={color} onValueChange={setColor} label="Brand accent colour" />
    </div>
  );
}
