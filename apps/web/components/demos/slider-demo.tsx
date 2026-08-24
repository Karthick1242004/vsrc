"use client";

import { Slider } from "@/registry/vsrc/ui/slider";

export function SliderDemo() {
  return <Slider defaultValue={[40]} className="w-72" aria-label="Demo slider" />;
}
