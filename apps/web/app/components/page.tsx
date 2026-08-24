"use client";

import * as React from "react";

import Link from "next/link";

import { DEMOS } from "@/components/demos";
import { CodeBlock } from "@/components/site/code-block";
import { COMPONENT_INDEX } from "@/components/site/component-index";
import { DemoTile } from "@/components/site/demo-tile";
import { LazyMount } from "@/components/site/lazy-mount";
import { RefractionField } from "@/components/site/refraction-field";
import { Reveal } from "@/components/site/reveal";
import { COMPONENT_DOCS } from "@/lib/component-docs";
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
function Playground() {
  const [pick, setPick] = React.useState("glass-surface");
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
          {COMPONENT_INDEX.map((name) => (
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
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">
      <Reveal>
        <h1 className="display-stroke mt-6 font-display text-5xl sm:text-6xl">Components</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          {`${COMPONENT_INDEX.length} surfaces, one optic.`} Install the registry once, then add any
          surface with the shadcn CLI — each refracts for real in Chromium; Safari and Firefox get
          clear frost. Every tile links to full docs: props, optics, accessibility, and the source
          you&apos;ll own.
        </p>
      </Reveal>

      <Installation />

      <Playground />

      <div className="mt-16 flex gap-12">
        <nav aria-label="Component index" className="sticky top-8 hidden h-fit w-44 shrink-0 lg:block">
          <ul className="grid gap-1 font-mono text-xs">
            {COMPONENT_INDEX.map((name) => (
              <li key={name}>
                <a
                  href={`#${name}`}
                  className="block rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid min-w-0 flex-1 gap-16">
          {COMPONENT_DOCS.map(({ slug, title, word, blurb }) => {
            const Demo = DEMOS[slug];
            return (
              <section key={slug} id={slug} className="scroll-mt-24">
                <Reveal>
                  <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">{`// ${slug}`}</p>
                  <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="display-stroke-sm font-display text-3xl sm:text-4xl">{title}</h2>
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
                    <CodeBlock kicker="install" code={`npx shadcn add @vsrc/${slug}`} copy />
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
