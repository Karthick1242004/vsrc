"use client";

import * as React from "react";

import Link from "next/link";

import { DEMOS } from "@/components/demos";
import { CatalogFilters, type GroupFilter, type TierFilter } from "@/components/site/catalog-filters";
import { CodeBlock } from "@/components/site/code-block";
import { COMPONENT_INDEX } from "@/components/site/component-index";
import { DemoTile } from "@/components/site/demo-tile";
import { LazyMount } from "@/components/site/lazy-mount";
import { RefractionField } from "@/components/site/refraction-field";
import { Reveal } from "@/components/site/reveal";
import { ProNotice, TierBadge } from "@/components/site/tier-badge";
import { GROUP_ORDER } from "@/lib/component-catalog";
import { COMPONENT_DOCS, type ComponentDoc } from "@/lib/component-docs";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const REGISTRY_SNIPPET = `{
  "registries": {
    "@vsrc": "${SITE_URL}/r/{name}.json"
  }
}`;

const USAGE_SNIPPET = `import { Button } from "@/components/ui/button"

<Button variant="primary">Ship it</Button>
<Button>Clear glass</Button>
<Button variant="ghost">Quiet</Button>`;

/* The landing page's drifting-marquee backdrop, with any component dropped in —
   the fastest way to see how a surface treats a moving background. */
function Playground({ docs }: { docs: ComponentDoc[] }) {
  const [chosen, setPick] = React.useState("glass-surface");
  // The chosen surface can fall out of the active filter; fall back to the first visible one.
  const pick = docs.some((d) => d.slug === chosen) ? chosen : (docs[0]?.slug ?? "glass-surface");
  const Demo = DEMOS[pick];
  return (
    <section id="playground" className="mt-12 scroll-mt-24">
      <Reveal delay={0.18}>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">{"// playground"}</p>
        <h2 className="display-stroke-sm mt-2 font-display text-3xl sm:text-4xl">Playground</h2>
        <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
          Pick a surface and drop it over moving type. The middle stays still; the rim bends
          whatever drifts past.
        </p>
        <div className="mt-6 flex flex-wrap gap-1.5" role="group" aria-label="Choose a component">
          {docs.map(({ slug: name }) => (
            <button
              key={name}
              type="button"
              onClick={() => setPick(name)}
              aria-pressed={pick === name}
              className={cn(
                "rounded-full px-3 py-1.5 font-mono text-xs transition-colors outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring",
                pick === name
                  ? "bg-foreground/15 text-foreground"
                  : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
              )}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <RefractionField key={pick}>{Demo ? <Demo /> : null}</RefractionField>
        </div>
      </Reveal>
    </section>
  );
}

/* Setup, first thing on the page: register the @vsrc namespace, add a
   component, use it. Per-component install commands live on each detail page;
   this is the one-time registry wiring every consumer does once. */
function Installation() {
  return (
    <section id="installation" className="mt-14 scroll-mt-24">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
          {"// installation"}
        </p>
        <h2 className="display-stroke-sm mt-2 font-display text-3xl sm:text-4xl">Installation</h2>
        <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
          Components are copied into your project through the shadcn CLI. The only npm package is{" "}
          <code className="font-mono text-sm text-foreground">vsrc</code> — the optics engine.
        </p>
        <div className="mt-6 grid max-w-3xl gap-6">
          <CodeBlock kicker="1 · components.json" code={REGISTRY_SNIPPET} copy />
          <CodeBlock kicker="2 · add a component" code={"npx shadcn add @vsrc/button"} copy />
          <CodeBlock kicker="3 · use it" code={USAGE_SNIPPET} />
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Your <code className="font-mono text-foreground">components.json</code> must use a
          Radix-based style such as{" "}
          <code className="font-mono text-foreground">new-york</code>. The Base UI{" "}
          <code className="font-mono text-foreground">base-nova</code> style rewrites{" "}
          <code className="font-mono text-foreground">asChild</code> composition during install
          and breaks these components.
        </p>
      </Reveal>
    </section>
  );
}

export default function ComponentsPage() {
  const [tier, setTier] = React.useState<TierFilter>("all");
  const [group, setGroup] = React.useState<GroupFilter>("all");

  const counts = React.useMemo(() => {
    const t: Record<TierFilter, number> = { all: COMPONENT_DOCS.length, free: 0, pro: 0 };
    const g = { all: COMPONENT_DOCS.length } as Record<GroupFilter, number>;
    for (const name of GROUP_ORDER) g[name] = 0;
    for (const d of COMPONENT_DOCS) {
      t[d.tier] += 1;
      g[d.group] += 1;
    }
    return { tier: t, group: g };
  }, []);

  const visible = COMPONENT_DOCS.filter(
    (d) => (tier === "all" || d.tier === tier) && (group === "all" || d.group === group),
  );

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">
      <Reveal>
        <h1 className="display-stroke mt-6 font-display text-5xl sm:text-6xl">Components</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          {`${COMPONENT_INDEX.length} surfaces, one optic. ${counts.tier.free} are free and open source; ${counts.tier.pro} are Pro.`}{" "}
          Each refracts for real in Chromium; Safari and Firefox get clear frost. Every tile links to full docs:
          props, optics, accessibility, and for the free ones, the source you&apos;ll own.
        </p>
      </Reveal>

      <Installation />

      <Playground docs={visible} />

      <CatalogFilters tier={tier} group={group} onTier={setTier} onGroup={setGroup} counts={counts} />

      <div className="mt-10 flex gap-12">
        <nav aria-label="Component index" className="sticky top-8 hidden h-fit max-h-[calc(100vh-4rem)] w-48 shrink-0 overflow-y-auto lg:block">
          {GROUP_ORDER.map((name) => {
            const docs = visible.filter((d) => d.group === name);
            if (docs.length === 0) return null;
            return (
              <div key={name} className="mb-4">
                <p className="px-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{name}</p>
                <ul className="mt-1 grid gap-0.5 font-mono text-xs">
                  {docs.map(({ slug, tier: t }) => (
                    <li key={slug}>
                      <a
                        href={`#${slug}`}
                        className="flex items-center justify-between rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                      >
                        {slug}
                        {t === "pro" ? <span aria-label="Pro" className="size-1.5 rounded-full bg-primary" /> : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="grid min-w-0 flex-1 gap-16">
          {visible.length === 0 ? (
            <p className="text-muted-foreground">Nothing in this group on this plan.</p>
          ) : null}
          {visible.map(({ slug, title, word, blurb, tier: t }) => {
            const Demo = DEMOS[slug];
            return (
              <section key={slug} id={slug} className="scroll-mt-24">
                <Reveal>
                  <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">{`// ${slug}`}</p>
                  <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="display-stroke-sm flex items-center gap-3 font-display text-3xl sm:text-4xl">
                      {title}
                      <TierBadge tier={t} />
                    </h2>
                    <Link
                      href={`/components/${slug}`}
                      className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      docs →
                    </Link>
                  </div>
                  <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{blurb}</p>
                  <div className="mt-6 grid gap-4">
                    {/* min-h matches DemoTile so lazy mounting never shifts layout. */}
                    <LazyMount className="min-h-56">
                      <DemoTile word={word}>{Demo ? <Demo /> : null}</DemoTile>
                    </LazyMount>
                    {t === "pro" ? (
                      <ProNotice compact />
                    ) : (
                      <CodeBlock kicker="install" code={`npx shadcn add @vsrc/${slug}`} copy />
                    )}
                  </div>
                </Reveal>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
