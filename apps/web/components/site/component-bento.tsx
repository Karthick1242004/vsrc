import Link from "next/link";

import { DEMOS } from "@/components/demos";
import { DemoBackdrop } from "@/components/site/demo-backdrop";
import { LazyMount } from "@/components/site/lazy-mount";
import { TierBadge } from "@/components/site/tier-badge";
import { COMPONENT_DOCS, DOC_BY_SLUG } from "@/lib/component-docs";
import { cn } from "@/lib/utils";

/*
 * Twelve columns, dense flow. Rows read: loupe 7x2 | island 5, pill 5;
 * carousel 7x2 | otp 5, slider 5; then tabs, toggle, gooey at 4 each; then the full-width index.
 * At md (2 columns) the wide tiles span both, leaving six singles: no holes.
 */
const TILES: { slug: string; span: string }[] = [
  { slug: "glass-loupe", span: "md:col-span-2 lg:col-span-7 lg:row-span-2" },
  { slug: "dynamic-island", span: "lg:col-span-5" },
  { slug: "pill-nav", span: "lg:col-span-5" },
  { slug: "depth-carousel", span: "md:col-span-2 lg:col-span-7 lg:row-span-2" },
  { slug: "otp-input", span: "lg:col-span-5" },
  { slug: "elastic-slider", span: "lg:col-span-5" },
  { slug: "tabs", span: "lg:col-span-4" },
  { slug: "liquid-toggle", span: "lg:col-span-4" },
  { slug: "gooey-glass-button", span: "md:col-span-2 lg:col-span-4" },
];

function Tile({ slug, span }: { slug: string; span: string }) {
  const doc = DOC_BY_SLUG.get(slug);
  const Demo = DEMOS[slug];
  if (!doc || !Demo) return null;
  return (
    <article
      data-bento-tile={slug}
      className={cn(
        "group relative flex min-h-64 flex-col overflow-hidden rounded-[28px] border border-border transition-colors duration-300 hover:border-foreground/25",
        span,
      )}
    >
      <DemoBackdrop word={doc.word} compact />
      {/* The demo is the real, interactive component, mounted only near the viewport. */}
      <LazyMount className="relative flex min-h-0 flex-1 items-center justify-center p-5 sm:p-8">
        <div className="flex w-full items-center justify-center">
          <Demo />
        </div>
      </LazyMount>
      <div className="relative flex items-center justify-between gap-3 px-5 pb-4">
        <h3 className="flex items-center gap-2.5 font-display text-xl leading-none">
          {doc.title}
          <TierBadge tier={doc.tier} />
        </h3>
        <Link
          href={`/components/${slug}`}
          aria-label={`${doc.title} docs`}
          className="rounded-full px-2 py-1 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          Docs{" "}
          <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

function NameRow({ slugs, reverse, hidden }: { slugs: string[]; reverse?: boolean; hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={cn(
        "flex shrink-0 items-center gap-8 pr-8 font-display text-4xl whitespace-nowrap sm:text-5xl",
        reverse ? "text-signal/80" : "text-foreground/85",
      )}
    >
      {slugs.map((slug) => (
        <li key={slug}>
          <Link
            href={`/components/${slug}`}
            tabIndex={hidden ? -1 : undefined}
            className="rounded-md outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            {DOC_BY_SLUG.get(slug)?.title ?? slug}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** The full catalogue as two counter-sliding rows; hovering stops them so a name can be picked. */
function IndexTile() {
  const slugs = COMPONENT_DOCS.map((d) => d.slug);
  const half = Math.ceil(slugs.length / 2);
  const rows = [slugs.slice(0, half), slugs.slice(half)];
  return (
    <article className="group/index relative overflow-hidden rounded-[28px] border border-border bg-card/60 md:col-span-2 lg:col-span-12">
      <div className="flex flex-col gap-3 py-8 [&:hover_.animate-marquee]:[animation-play-state:paused] [&:focus-within_.animate-marquee]:[animation-play-state:paused]">
        {rows.map((row, i) => (
          <div key={i} className={cn("flex w-max animate-marquee", i === 1 && "[animation-direction:reverse]")} style={{ animationDuration: "70s" }}>
            <NameRow slugs={row} reverse={i === 1} />
            <NameRow slugs={row} reverse={i === 1} hidden />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 px-6 py-4">
        <p className="text-sm text-muted-foreground">
          {COMPONENT_DOCS.length} components: {COMPONENT_DOCS.filter((d) => d.tier === "free").length} free, the rest in Pro.
        </p>
        <Link
          href="/components"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        >
          Browse all {COMPONENT_DOCS.length}
        </Link>
      </div>
    </article>
  );
}

export function ComponentBento() {
  return (
    <div className="grid grid-flow-dense auto-rows-[minmax(16rem,auto)] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
      {TILES.map((t) => (
        <Tile key={t.slug} {...t} />
      ))}
      <IndexTile />
    </div>
  );
}
