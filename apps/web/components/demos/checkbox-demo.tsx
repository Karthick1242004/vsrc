"use client";

import * as React from "react";

import { Checkbox } from "@/registry/vsrc/ui/checkbox";

export function CheckboxDemo() {
  const [all, setAll] = React.useState<boolean | "indeterminate">("indeterminate");
  const [items, setItems] = React.useState({ engine: true, material: false });
  const sync = (next: typeof items) => {
    setItems(next);
    const n = Object.values(next).filter(Boolean).length;
    setAll(n === 0 ? false : n === 2 ? true : "indeterminate");
  };
  return (
    <div className="grid gap-3 text-sm text-foreground">
      <label className="flex items-center gap-3">
        <Checkbox
          checked={all}
          onCheckedChange={(v) => sync({ engine: v === true, material: v === true })}
          aria-label="Select all"
        />
        Everything
      </label>
      <label className="flex items-center gap-3 pl-8">
        <Checkbox checked={items.engine} onCheckedChange={(v) => sync({ ...items, engine: v === true })} />
        Optics engine
      </label>
      <label className="flex items-center gap-3 pl-8">
        <Checkbox checked={items.material} onCheckedChange={(v) => sync({ ...items, material: v === true })} />
        Material layer
      </label>
    </div>
  );
}
