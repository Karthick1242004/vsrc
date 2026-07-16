import { CodeBlock } from "@/components/site/code-block";
import { LensDemo } from "@/components/site/lens-demo";
import { RefractionField } from "@/components/site/refraction-field";
import { Button } from "@/registry/vsrc/ui/button";
import { GlassSurface } from "@/registry/vsrc/ui/glass-surface";

const REGISTRY_SNIPPET = `{
  "registries": {
    "@vsrc": "https://vsrc.vercel.app/r/{name}.json"
  }
}`;

const USAGE_SNIPPET = `import { Button } from "@/components/ui/button"

<Button variant="primary">Ship it</Button>
<Button>Clear glass</Button>
<Button variant="ghost">Quiet</Button>`;

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <header className="flex items-center justify-between py-6">
        <p className="font-display text-2xl text-foreground">
          V-/Src
          <span className="ml-3 align-middle font-mono text-xs text-muted-foreground">v0.1.0</span>
        </p>
        <Button variant="ghost" size="sm" asChild>
          <a href="https://github.com/Karthick1242004" rel="noreferrer" target="_blank">
            GitHub
          </a>
        </Button>
      </header>

      <section className="py-20 sm:py-28">
        <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
          {"// real refraction, not blur"}
        </p>
        <h1 className="display-stroke mt-6 max-w-4xl font-display text-[clamp(3rem,8.5vw,7rem)] leading-[0.95] text-balance">
          Glass that <em className="mr-[0.14em] text-signal">bends</em> what&apos;s behind it.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          vsrc is a shadcn-compatible React library built on a displacement-map optics engine.
          Chromium refracts with a faint prism fringe at the rim. Safari and Firefox fall back to
          frosted glass. Reduced-transparency users get solid panels. Same components everywhere.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button variant="primary" size="lg" asChild>
            <a href="#install">Install the button</a>
          </Button>
          <code className="font-mono text-sm text-muted-foreground">
            npx shadcn add @vsrc/button
          </code>
        </div>
      </section>

      <section aria-label="Live refraction demo">
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
        <LensDemo />
      </section>

      <section id="install" className="py-24 sm:py-32">
        <h2 className="display-stroke-sm font-display text-4xl sm:text-5xl">
          Three steps, no dependency on us.
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          Components are copied into your project through the shadcn CLI. The only npm package is{" "}
          <code className="font-mono text-sm text-foreground">vsrc</code> — the optics engine.
        </p>
        <div className="mt-10 grid max-w-3xl gap-6">
          <CodeBlock kicker="1 · components.json" code={REGISTRY_SNIPPET} />
          <CodeBlock kicker="2 · add the component" code={"npx shadcn add @vsrc/button"} />
          <CodeBlock kicker="3 · use it" code={USAGE_SNIPPET} />
        </div>
      </section>

      <footer className="border-t border-border pt-16 pb-10">
        <p aria-hidden className="text-center font-display text-[clamp(5rem,18vw,16rem)] leading-none text-foreground">
          V-/Src
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
          <span>MIT — engine and registry</span>
          <span>© 2026 V-/Src</span>
        </div>
      </footer>
    </div>
  );
}
