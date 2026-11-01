"use client";

import * as React from "react";
import { mergeGlass, type GlassPreset, type LiquidGlassOptions } from "vsrc/react";

import { Button } from "@/registry/vsrc/ui/button";
import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";
import { cn } from "@/lib/utils";

const LENS_OPTICS: LiquidGlassOptions = {
  scale: -104,
  chroma: 5,
  border: 0.07,
  mapBlur: 14,
  blur: 0.5,
  saturate: 1.35,
  fallbackBlur: 3,
};

// Motion lives in a scoped stylesheet so the block copies into a project with no
// globals.css edits. Everything animated sits inside the no-preference query:
// under reduced motion the content simply renders, still.
const HERO_CSS = `
@keyframes vsrc-hero-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes vsrc-hero-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes vsrc-hero-drift{from{transform:translateX(-3%)}to{transform:translateX(3%)}}
@media (prefers-reduced-motion:no-preference){
[data-slot="hero-section"] .vsrc-rise{animation:vsrc-hero-rise .9s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--rise,0ms)}
[data-slot="hero-section"] .vsrc-marquee{animation:vsrc-hero-marquee 70s linear infinite}
[data-slot="hero-section"] .vsrc-drift{animation:vsrc-hero-drift 11s ease-in-out infinite alternate}
}`;

export interface HeroSectionProps extends Omit<React.ComponentProps<"section">, "title"> {
  /** Display headline; keep it to two lines. */
  headline?: React.ReactNode;
  description?: React.ReactNode;
  /** Pass `null` to hide a call to action. */
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  /** Huge words that scroll behind the lens pane. */
  backdropWords?: string[];
  headingAs?: "h1" | "h2";
  glass?: LiquidGlassOptions | GlassPreset | false;
}

function HeroSection({
  headline = "Light, bent on purpose.",
  description = "Panels that really refract what sits behind them, in code you own. Drop a block in, keep the motion, ship the page.",
  primaryAction = <Button variant="primary" size="lg">Start building</Button>,
  secondaryAction = <Button size="lg">Browse components</Button>,
  backdropWords = ["Refract", "Reflect", "Bend"],
  headingAs: Heading = "h2",
  glass,
  className,
  ref,
  ...props
}: HeroSectionProps) {
  const words = backdropWords.length ? backdropWords : [""];
  return (
    <section
      ref={ref}
      data-slot="hero-section"
      className={cn(
        "relative isolate flex min-h-[26rem] w-full flex-col gap-8 overflow-hidden rounded-[2rem] border border-border bg-card/40 px-6 pt-8 sm:px-10 sm:pt-12",
        className,
      )}
      {...props}
    >
      <style>{HERO_CSS}</style>
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-16 -z-10 size-72 rounded-full bg-signal/25 blur-3xl" />

      <div data-slot="hero-copy" className="relative z-10 flex max-w-xl flex-col items-start gap-4">
        <Heading
          data-slot="hero-headline"
          className="vsrc-rise font-display text-[2.75rem] leading-[0.98] tracking-tight text-balance text-foreground sm:text-6xl"
        >
          {headline}
        </Heading>
        {description ? (
          <p data-slot="hero-description" className="vsrc-rise max-w-md text-sm text-pretty text-muted-foreground sm:text-base" style={{ "--rise": "90ms" } as React.CSSProperties}>
            {description}
          </p>
        ) : null}
        {primaryAction || secondaryAction ? (
          <div data-slot="hero-actions" className="vsrc-rise mt-1 flex flex-wrap items-center gap-3" style={{ "--rise": "180ms" } as React.CSSProperties}>
            {primaryAction}
            {secondaryAction}
          </div>
        ) : null}
      </div>

      <div
        data-slot="hero-stage"
        className="vsrc-rise relative z-10 -mx-6 mt-auto flex h-44 items-center sm:-mx-10 sm:h-60"
        style={{ "--rise": "280ms" } as React.CSSProperties}
      >
        <div data-slot="hero-backdrop" aria-hidden="true" className="absolute inset-0 flex items-center overflow-hidden select-none">
          <div className="vsrc-marquee flex w-max shrink-0 items-center will-change-transform">
            {[0, 1].map((copy) =>
              words.map((word, i) => (
                <span
                  key={`${copy}-${i}`}
                  className="pr-10 font-display text-[8.5rem] leading-none whitespace-nowrap text-foreground/25 sm:pr-16 sm:text-[13rem]"
                >
                  {word}
                </span>
              )),
            )}
          </div>
        </div>
        <div className="vsrc-drift mx-6 w-full sm:mx-10">
          <GlassSurface
            aria-hidden="true"
            data-slot="hero-section-lens"
            glass={mergeGlass(LENS_OPTICS, glass)}
            specular="pointer"
            className="h-28 w-full rounded-[2rem] sm:h-40"
          />
        </div>
      </div>
    </section>
  );
}

export { HeroSection };
