import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/site/reveal";
import { Button } from "@/registry/vsrc/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/vsrc/ui/card";

export const metadata: Metadata = {
  title: "About & beta — vsrc",
  description:
    "vsrc is in public beta: what works, which browsers refract, how your data is handled, and how to reach the developer.",
};

/* Support is engine-accurate: canRefract() in packages/vsrc/src/engine.ts gates
   Chromium in, Safari and Firefox out (frosted), reduced-transparency to solid. */
const BROWSERS: { name: string; mode: string; note: string }[] = [
  {
    name: "Chrome · Edge · Chromium",
    mode: "refract",
    note: "Real displacement-map refraction with a faint prism fringe at the rim — the effect at full strength.",
  },
  {
    name: "Safari — macOS & iOS",
    mode: "frosted",
    note: "WebKit computes but never paints SVG-filtered backdrops, so panels frost instead of bend. Every iOS browser runs on WebKit, so iPhone and iPad always frost — even Chrome for iOS.",
  },
  {
    name: "Firefox",
    mode: "frosted",
    note: "The same frosted-glass fallback as Safari — blur and saturation, no rim bending.",
  },
  {
    name: "Android Chrome",
    mode: "refract / frosted",
    note: "Refracts on devices whose browser supports backdrop-filter: url(); older or lower-power devices fall back to frost. Test on your target hardware.",
  },
  {
    name: "Reduced transparency",
    mode: "reduced",
    note: "With the OS setting on, panels go solid with no backdrop effect. Reduced-motion also turns the background drift animations off.",
  },
];

function Kicker({ children }: { children: string }) {
  return (
    <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">{children}</p>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24">
      <section className="py-14 sm:py-20">
        <Reveal>
          <Kicker>{"// public beta"}</Kicker>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="display-stroke mt-6 font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.95]">
            vsrc is in <em className="text-signal">beta</em>.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            The optics engine and all 19 components work today, but this is v0.1.0: the component
            APIs may still change before 1.0, and rough edges remain. We&apos;re actively improving
            it — if something breaks or feels off, an issue on GitHub is the fastest way to get it
            fixed.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Before you ship it to production</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              Real refraction is a Chromium feature. On every other browser the same components stay
              fully usable and legible — they just frost instead of bend. Treat the frosted look as
              your baseline and refraction as progressive enhancement, and check the browsers your
              users actually run before you rely on the effect.
            </CardContent>
          </Card>
        </Reveal>
      </section>

      <section className="scroll-mt-24 border-t border-border pt-14">
        <Reveal>
          <Kicker>{"// browser support"}</Kicker>
          <h2 className="display-stroke-sm mt-2 font-display text-3xl sm:text-4xl">
            Where it refracts
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Every panel exposes its active mode as{" "}
            <code className="font-mono text-sm text-foreground">data-vsrc-glass</code> — inspect any
            surface to see exactly what it did.
          </p>
          <dl className="mt-8 grid gap-px overflow-hidden rounded-[24px] border border-border bg-border">
            {BROWSERS.map((b) => (
              <div
                key={b.name}
                className="grid gap-2 bg-background p-5 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6"
              >
                <div>
                  <dt className="font-display text-xl">{b.name}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.note}</dd>
                </div>
                <span className="justify-self-start rounded-full border border-border px-2.5 py-1 font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase sm:justify-self-end">
                  {b.mode}
                </span>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="mt-14 scroll-mt-24 border-t border-border pt-14">
        <Reveal>
          <Kicker>{"// privacy"}</Kicker>
          <h2 className="display-stroke-sm mt-2 font-display text-3xl sm:text-4xl">
            What we collect
          </h2>
          <div className="mt-4 grid gap-4 leading-relaxed text-muted-foreground">
            <p>
              Nothing, essentially. This is a static site with no backend, no database, and no
              account system. There are no analytics, advertising, or tracking cookies — we add
              none. The only thing stored is your light/dark theme choice, kept in your browser&apos;s
              localStorage, which never leaves your device.
            </p>
            <p>
              Fonts are self-hosted at build time, so the page makes no third-party font requests
              while you browse. The site is hosted on Vercel, whose platform may keep standard server
              logs (such as IP address and request time) for delivery and security; that is outside
              our control and covered by Vercel&apos;s own policy.
            </p>
            <p>
              The components you install run entirely inside your own project. The optics engine
              makes no network calls — it only reads the DOM and draws to a canvas.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mt-14 scroll-mt-24 border-t border-border pt-14">
        <Reveal>
          <Kicker>{"// about & contact"}</Kicker>
          <h2 className="display-stroke-sm mt-2 font-display text-3xl sm:text-4xl">
            Who builds this
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            vsrc is designed and built by{" "}
            <span className="text-foreground">Karthickrajan Somasundaram</span>. It&apos;s open source
            under the MIT license — both the engine and the registry. Contributions, bug reports, and
            feedback are all welcome while it&apos;s in beta.
          </p>
          <dl className="mt-8 grid gap-4 font-mono text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{"// email"}</dt>
              <dd className="mt-1">
                <a
                  href="mailto:karthick1242004@gmail.com"
                  className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-signal"
                >
                  karthick1242004@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                {"// github"}
              </dt>
              <dd className="mt-1">
                <a
                  href="https://github.com/Karthick1242004"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-signal"
                >
                  Karthick1242004
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                {"// source"}
              </dt>
              <dd className="mt-1">
                <a
                  href="https://github.com/Karthick1242004/vsrc"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-signal"
                >
                  vsrc repo
                </a>
              </dd>
            </div>
          </dl>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button variant="primary" asChild>
              <a href="https://github.com/Karthick1242004/vsrc" target="_blank" rel="noreferrer">
                Star on GitHub
              </a>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/components">Browse components</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
