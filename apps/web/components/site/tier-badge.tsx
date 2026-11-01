import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Tier } from "@/lib/docs/types";

/** Free / Pro marker. Pro carries the primary hue on its outline only: the red
 *  brand colour never sits behind small text. */
export function TierBadge({ tier, className }: { tier: Tier; className?: string }) {
  return (
    <span
      data-tier={tier}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.2em] uppercase",
        tier === "pro" ? "border-primary/70 text-foreground" : "border-border text-muted-foreground",
        className,
      )}
    >
      {tier === "pro" ? "Pro" : "Free"}
    </span>
  );
}

/** The call to buy on Pro components. The live demo above it is the real component. */
export function ProNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div
      data-slot="pro-notice"
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-primary/50 bg-card/60 px-5 py-4"
    >
      <div>
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">{"// pro"}</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground">
          {compact
            ? "Included with Pro: $49 a year or $99 once."
            : "Included with Pro: $49 a year or $99 once. Buy, create your install key, and the command above works in your project."}
        </p>
      </div>
      <Link
        href="/pro"
        className="rounded-full border border-primary/70 px-4 py-1.5 font-mono text-xs tracking-[0.15em] text-foreground uppercase transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        Get Pro
      </Link>
    </div>
  );
}
