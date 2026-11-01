"use client";

import { RadioGroup, RadioGroupItem } from "@/registry/vsrc/ui/radio-group";

const OPTIONS = [
  { value: "subtle", label: "Subtle" },
  { value: "regular", label: "Regular" },
  { value: "heavy", label: "Heavy" },
];

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="regular" aria-label="Glass preset" className="text-sm text-foreground">
      {OPTIONS.map((o) => (
        <label key={o.value} className="flex items-center gap-3">
          <RadioGroupItem value={o.value} />
          {o.label}
        </label>
      ))}
    </RadioGroup>
  );
}
