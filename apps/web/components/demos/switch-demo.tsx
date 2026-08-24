"use client";

import { Switch } from "@/registry/vsrc/ui/switch";

export function SwitchDemo() {
  return (
    <div className="flex items-center gap-3">
      <Switch defaultChecked aria-label="Demo switch" />
    </div>
  );
}
