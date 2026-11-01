import fs from "node:fs/promises";
import path from "node:path";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DEMOS } from "@/components/demos";
import { CodeBlock } from "@/components/site/code-block";
import { CodePanel } from "@/components/site/code-panel";
import { DemoTile } from "@/components/site/demo-tile";
import { Reveal } from "@/components/site/reveal";
import { ProNotice, TierBadge } from "@/components/site/tier-badge";
import { COMPONENT_DOCS, DOC_BY_SLUG } from "@/lib/component-docs";
import { highlight } from "@/lib/highlight";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPONENT_DOCS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = DOC_BY_SLUG.get(slug);
  if (!doc) return {};
  return {
    title: `${doc.title} — vsrc`,
    description: doc.blurb,
  };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = DOC_BY_SLUG.get(slug);
  if (!doc) notFound();

  // The code tab renders the exact file consumers install — read from the
  // registry source at build time so it can never drift from what ships. Pro
  // source is not published yet, so those pages never read it.
  const isPro = doc.tier === "pro";
  const source = isPro
    ? ""
    : await fs.readFile(path.join(process.cwd(), "registry", "vsrc", "ui", `${slug}.tsx`), "utf8");
  const html = isPro ? "" : await highlight(source);
  const Demo = DEMOS[slug];

  const index = COMPONENT_DOCS.findIndex((d) => d.slug === slug);
  const prev = COMPONENT_DOCS[index - 1];
  const next = COMPONENT_DOCS[index + 1];

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24">
      <Reveal>
        <nav aria-label="Breadcrumb" className="mt-6 font-mono text-xs text-muted-foreground">
          <Link href="/components" className="transition-colors hover:text-foreground">
            components
          </Link>
          <span aria-hidden> / </span>
          <span className="text-foreground">{doc.slug}</span>
        </nav>

        <p className="mt-8 font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
          {`// ${doc.slug}`}
        </p>
        <h1 className="display-stroke mt-2 flex flex-wrap items-center gap-4 font-display text-5xl sm:text-6xl">
          {doc.title}
          <TierBadge tier={doc.tier} className="text-xs" />
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{doc.blurb}</p>

        <div className="mt-8 grid gap-4" data-demo={doc.slug}>
          {Demo ? (
            <DemoTile word={doc.word}>
              <Demo />
            </DemoTile>
          ) : null}
          {isPro ? <ProNotice /> : <CodeBlock kicker="install" code={`npx shadcn add @vsrc/${doc.slug}`} copy />}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <section className="mt-14">
          <h2 className="display-stroke-sm font-display text-3xl">Props</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Only the vsrc surface is documented here.
            {doc.extendsRadix ? (
              <>
                {" "}
                Everything else passes through to{" "}
                <a
                  href={doc.extendsRadix.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground underline decoration-signal/60 underline-offset-4 transition-colors hover:decoration-signal"
                >
                  {doc.extendsRadix.label}
                </a>
                .
              </>
            ) : (
              " Everything else passes through to the underlying element."
            )}
          </p>
          <div className="mt-6 grid gap-8">
            {doc.props.map((group) => (
              <div key={group.component}>
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {`// ${group.component}`}
                </p>
                <div className="mt-3 overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border font-mono text-xs text-muted-foreground">
                        <th className="px-4 py-2 font-normal">prop</th>
                        <th className="px-4 py-2 font-normal">type</th>
                        <th className="px-4 py-2 font-normal">default</th>
                        <th className="px-4 py-2 font-normal">notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.rows.map((row) => (
                        <tr key={row.name} className="border-b border-border last:border-0 align-top">
                          <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-foreground">
                            {row.name}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                            {row.type}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-muted-foreground">
                            {row.default ?? "—"}
                          </td>
                          <td className="px-4 py-3 leading-relaxed text-muted-foreground">
                            {row.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.12}>
        <section className="mt-14">
          <h2 className="display-stroke-sm font-display text-3xl">Optics</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{doc.optics}</p>
        </section>
      </Reveal>

      <Reveal delay={0.14}>
        <section className="mt-14">
          <h2 className="display-stroke-sm font-display text-3xl">Accessibility</h2>
          <ul className="mt-3 grid max-w-2xl gap-2 text-muted-foreground">
            {doc.a11y.map((note) => (
              <li key={note} className="flex gap-3 leading-relaxed">
                <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-signal" />
                {note}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {isPro ? null : (
        <Reveal delay={0.16}>
          <section className="mt-14">
            <h2 className="display-stroke-sm font-display text-3xl">Source</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The exact file the CLI copies into your project — you own it after install.
            </p>
            <div className="mt-4">
              <CodePanel kicker={`registry/vsrc/ui/${doc.slug}.tsx`} html={html} raw={source} />
            </div>
          </section>
        </Reveal>
      )}

      <nav aria-label="Component pagination" className="mt-16 flex justify-between font-mono text-sm">
        {prev ? (
          <Link
            href={`/components/${prev.slug}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            ← {prev.slug}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/components/${next.slug}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {next.slug} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
