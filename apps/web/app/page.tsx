import { LensDemo } from "@/components/site/lens-demo";
import { RefractionField } from "@/components/site/refraction-field";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/registry/vsrc/ui/button";
import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">
      <section className="py-16 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
            {"// real refraction, not blur"}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="display-stroke mt-6 max-w-4xl font-display text-[clamp(3rem,8.5vw,7rem)] leading-[0.95] text-balance">
            Glass that <em className="mr-[0.14em] text-signal">bends</em> what&apos;s behind it.
          </h1>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            vsrc is a shadcn-compatible React library built on a displacement-map optics engine.
            Chromium refracts with a faint prism fringe at the rim. Safari and Firefox fall back to
            frosted glass. Reduced-transparency users get solid panels. Same components everywhere.
          </p>
        </Reveal>
        <Reveal delay={0.28}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button variant="primary" size="lg" asChild>
              <a href="/components">Get started</a>
            </Button>
            <LensDemo size="lg" />
          </div>
        </Reveal>
      </section>

      <section aria-label="Live refraction demo">
        <Reveal delay={0.38}>
          <RefractionField>
            <div className="flex flex-col items-center gap-5">
              <GlassSurface className="max-w-sm p-8">
                <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
                  {"// glass-surface"}
                </p>
                <p className="mt-3 font-display text-3xl leading-tight">
                  The rim bends the type drifting behind this panel.
                </p>
                <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
                  chromium → refract
                  <br />
                  safari / firefox → frosted
                  <br />
                  reduced transparency → solid
                </p>
              </GlassSurface>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg">Large</Button>
                <Button>Default</Button>
                <Button variant="primary">Primary</Button>
                <Button size="sm">Small</Button>
                <Button size="icon" aria-label="Add">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                </Button>
              </div>
            </div>
          </RefractionField>
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            {"// live — every element above carries data-vsrc-glass with its active mode"}
          </p>
        </Reveal>
      </section>
    </div>
  );
}
