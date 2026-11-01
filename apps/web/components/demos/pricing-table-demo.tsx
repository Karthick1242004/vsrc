"use client";

import * as React from "react";

import { PricingTable, type BillingInterval } from "@/registry/pro/ui/pricing-table";

export function PricingTableDemo() {
  const [picked, setPicked] = React.useState<string | null>(null);
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-4">
      <PricingTable
        onSelect={(planId: string, interval: BillingInterval) =>
          setPicked(`${planId[0]?.toUpperCase()}${planId.slice(1)}, billed ${interval === "year" ? "yearly" : "monthly"}`)
        }
      />
      <p role="status" className="min-h-5 text-xs text-muted-foreground">
        {picked ? `Selected: ${picked}` : "Pick a plan to see onSelect fire."}
      </p>
    </div>
  );
}
