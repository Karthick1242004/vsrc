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

/** Stands in for the install command and the source on Pro components, whose
 *  source is not published yet. The live demo above it is the real component. */
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
            ? "Included with Pro. Licensing opens soon."
            : "Included with Pro. The source and the install command unlock when licensing opens — until then, this page shows the live component."}
        </p>
      </div>
      <TierBadge tier="pro" />
    </div>
  );
}
