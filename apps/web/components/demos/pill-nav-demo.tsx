"use client";

import * as React from "react";

import { PillNav } from "@/registry/pro/ui/pill-nav";

const ITEMS = [
  { label: "Overview", href: "#overview" },
  { label: "Analytics", href: "#analytics" },
  { label: "Customers", href: "#customers" },
  { label: "Billing", href: "#billing" },
];

export function PillNavDemo() {
  const [value, setValue] = React.useState("#overview");
  return (
    <div data-demo="pill-nav" className="flex max-w-full flex-col items-center gap-4">
      <PillNav aria-label="Dashboard sections" items={ITEMS} value={value} onValueChange={setValue} />
      <p aria-live="polite" className="text-sm text-muted-foreground">
        Viewing {ITEMS.find((item) => item.href === value)?.label.toLowerCase()}
      </p>
    </div>
  );
}
