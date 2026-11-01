"use client";

import { GROUP_ORDER } from "@/lib/component-catalog";
import type { Group, Tier } from "@/lib/docs/types";
import { cn } from "@/lib/utils";

export type TierFilter = "all" | Tier;
export type GroupFilter = "all" | Group;

const TIERS: { id: TierFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "free", label: "Free" },
  { id: "pro", label: "Pro" },
];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3 py-1.5 font-mono text-xs transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-foreground/15 text-foreground"
          : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/** Tier and group filters for the component gallery. Counts are for the whole
 *  catalog, so a chip never reads "0" because another filter is active. */
export function CatalogFilters({
  tier,
  group,
  onTier,
  onGroup,
  counts,
}: {
  tier: TierFilter;
  group: GroupFilter;
  onTier: (t: TierFilter) => void;
  onGroup: (g: GroupFilter) => void;
  counts: { tier: Record<TierFilter, number>; group: Record<GroupFilter, number> };
}) {
  return (
    <div className="mt-8 grid gap-3">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by plan">
        {TIERS.map((t) => (
          <Chip key={t.id} active={tier === t.id} onClick={() => onTier(t.id)}>
            {`${t.label} ${counts.tier[t.id]}`}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by group">
        <Chip active={group === "all"} onClick={() => onGroup("all")}>
          {`All groups`}
        </Chip>
        {GROUP_ORDER.map((g) => (
          <Chip key={g} active={group === g} onClick={() => onGroup(g)}>
            {`${g} ${counts.group[g]}`}
          </Chip>
        ))}
      </div>
    </div>
  );
}
