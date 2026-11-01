"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { Switch } from "@/registry/vsrc/ui/switch";
import { cn } from "@/lib/utils";

const PLAN_OPTICS: LiquidGlassOptions = {
  scale: -80,
  chroma: 3,
  border: 0.07,
  mapBlur: 12,
  blur: 2,
  saturate: 1.3,
  fallbackBlur: 2,
};

// The recommended card bends harder and carries a brighter rim so it reads as raised.
const FEATURED_OPTICS: LiquidGlassOptions = {
  scale: -112,
  chroma: 4,
  border: 0.14,
  mapBlur: 14,
  blur: 2,
  saturate: 1.4,
  fallbackBlur: 3,
};

export type BillingInterval = "month" | "year";

export interface Plan {
  id: string;
  name: string;
  description: string;
  /** Price per month when billed monthly. */
  monthly: number;
  /** Total price per year when billed yearly. */
  yearly: number;
  features: string[];
  cta?: string;
  recommended?: boolean;
}

export const DEFAULT_PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For a side project or a first launch.",
    monthly: 12,
    yearly: 120,
    features: ["5 projects", "Core glass components", "Community support", "1 seat"],
    cta: "Start with Starter",
  },
  {
    id: "studio",
    name: "Studio",
    description: "For freelancers and small product teams.",
    monthly: 29,
    yearly: 276,
    features: ["Unlimited projects", "Every Pro block", "Priority email support", "3 seats", "Early access to new blocks"],
    cta: "Choose Studio",
    recommended: true,
  },
  {
    id: "team",
    name: "Team",
    description: "For agencies shipping many sites.",
    monthly: 79,
    yearly: 756,
    features: ["Everything in Studio", "15 seats", "Shared design tokens", "Onboarding call"],
    cta: "Talk to us",
  },
];

const STYLE = `
@keyframes vsrc-price-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:no-preference){[data-slot="pricing-table"] .vsrc-price{animation:vsrc-price-in .32s cubic-bezier(.2,.7,.2,1) both}}`;

function Check() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-foreground">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

export interface PricingTableProps extends Omit<React.ComponentProps<"div">, "onSelect"> {
  plans?: Plan[];
  interval?: BillingInterval;
  defaultInterval?: BillingInterval;
  onIntervalChange?: (interval: BillingInterval) => void;
  onSelect?: (planId: string, interval: BillingInterval) => void;
  currency?: string;
  locale?: string;
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function PricingTable({
  plans = DEFAULT_PLANS,
  interval: intervalProp,
  defaultInterval = "month",
  onIntervalChange,
  onSelect,
  currency = "USD",
  locale = "en-US",
  glass,
  className,
  ...props
}: PricingTableProps) {
  const [inner, setInner] = React.useState<BillingInterval>(defaultInterval);
  const interval = intervalProp ?? inner;
  const setInterval_ = (next: BillingInterval) => {
    if (intervalProp === undefined) setInner(next);
    onIntervalChange?.(next);
  };
  const labelId = React.useId();
  const yearly = interval === "year";

  const money = (value: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: Number.isInteger(value) ? 0 : 2 }).format(value);
  const savingPct = Math.max(0, ...plans.map((p) => Math.round((1 - p.yearly / (p.monthly * 12)) * 100)));

  return (
    <div data-slot="pricing-table" className={cn("@container flex w-full flex-col items-center gap-8", className)} {...props}>
      <style>{STYLE}</style>
      <div data-slot="pricing-toggle" className="flex flex-wrap items-center justify-center gap-3 text-sm">
        <span id={`${labelId}-m`} className={cn("transition-colors", yearly ? "text-muted-foreground" : "font-medium text-foreground")}>
          Monthly
        </span>
        <Switch
          aria-label="Bill yearly"
          aria-describedby={`${labelId}-m ${labelId}-y`}
          checked={yearly}
          onCheckedChange={(on) => setInterval_(on ? "year" : "month")}
          glass={glass}
        />
        <span id={`${labelId}-y`} className={cn("transition-colors", yearly ? "font-medium text-foreground" : "text-muted-foreground")}>
          Yearly
        </span>
        {savingPct > 0 ? (
          <span className="rounded-full border border-foreground/20 bg-foreground/10 px-2 py-0.5 text-xs font-medium text-foreground">Save up to {savingPct}%</span>
        ) : null}
      </div>
      <p className="sr-only" aria-live="polite">
        {yearly ? "Showing yearly prices" : "Showing monthly prices"}
      </p>

      <ul role="list" className="grid w-full items-stretch gap-4 @2xl:grid-cols-3 @2xl:items-center">
        {plans.map((plan) => {
          const featured = !!plan.recommended;
          const perMonth = yearly ? plan.yearly / 12 : plan.monthly;
          const saving = plan.monthly * 12 - plan.yearly;
          return (
            <GlassSurface key={plan.id} asChild glass={mergeGlass(featured ? FEATURED_OPTICS : PLAN_OPTICS, glass)}>
              <li
                data-slot={featured ? "pricing-plan-featured" : "pricing-plan"}
                data-plan={plan.id}
                className={cn(
                  "relative flex list-none flex-col gap-5 p-6 transition-transform duration-300 motion-reduce:transition-none",
                  featured && "border-foreground/40 @2xl:-translate-y-2 @2xl:py-8",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-medium text-foreground">{plan.name}</h3>
                  {featured ? (
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">Most popular</span>
                  ) : null}
                </div>
                <p className="-mt-3 text-sm text-muted-foreground">{plan.description}</p>

                <div>
                  <p className="flex items-baseline gap-1">
                    <span key={interval} className="vsrc-price font-display text-5xl leading-none text-foreground tabular-nums">
                      {money(perMonth)}
                    </span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </p>
                  <p className="mt-2 min-h-5 text-xs text-muted-foreground">
                    {yearly ? (
                      <>
                        {money(plan.yearly)} billed yearly
                        {saving > 0 ? <span className="font-medium text-foreground"> · save {money(saving)}</span> : null}
                      </>
                    ) : (
                      "Billed monthly"
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelect?.(plan.id, interval)}
                  className={cn(
                    "h-10 rounded-full px-5 text-sm font-medium transition-[background-color,transform] duration-200 outline-none active:scale-[0.98]",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                    featured
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-foreground/25 bg-foreground/10 text-foreground hover:bg-foreground/20",
                  )}
                >
                  {plan.cta ?? `Choose ${plan.name}`}
                  <span className="sr-only">
                    , {yearly ? "billed yearly" : "billed monthly"}
                  </span>
                </button>

                <ul role="list" className="flex flex-col gap-2.5 text-sm text-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5">
                      <Check />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </li>
            </GlassSurface>
          );
        })}
      </ul>
    </div>
  );
}

export { PricingTable };
