import type { Metadata } from "next";

import { CodeBlock } from "@/components/site/code-block";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/registry/vsrc/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/vsrc/ui/card";
import { CATALOG } from "@/lib/component-catalog";
import { PRO_PLANS, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pro",
  description:
    "vsrc Pro: 35 more liquid glass components, installed with the shadcn CLI and a personal key. $49 a year or $99 once.",
  alternates: { canonical: "/pro" },
};

const PRO_COUNT = CATALOG.filter((entry) => entry.tier === "pro").length;

const REGISTRIES_SNIPPET = `{
  "registries": {
    "@vsrc": "${SITE_URL}/r/{name}.json",
    "@vsrc-pro": {
      "url": "${SITE_URL}/r/pro/{name}.json",
      "headers": { "Authorization": "Bearer \${VSRC_PRO_KEY}" }
    }
  }
}`;

const LICENCE: string[] = [
  "Use Pro components in as many of your own and client projects as you like, commercial or not.",
  "Do not share, publish, or resell the components themselves, on their own or bundled as a UI kit, template, or component library.",
  "Your install key is personal. Do not share it or commit it to a repository.",
  "Yearly plan: everything you installed while your plan was active stays licensed to you after it ends. New downloads and updates stop.",
  "Lifetime plan: downloads and updates never stop.",
  "A refund ends the licence and switches the key off. Breaking these terms on purpose ends it too.",
];

function Kicker({ children }: { children: string }) {
  return (
    <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">{children}</p>
  );
}

export default function ProPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24">
      <section className="py-14 sm:py-20">
        <Reveal>
          <Kicker>{"// pro"}</Kicker>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="display-stroke mt-6 font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.95]">
            {PRO_COUNT} more surfaces, <em className="text-signal">one key</em>.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Pro adds the optics showpieces, navigation, forms, media and page blocks you can try on
            every component page. You install them with the same shadcn command as the free ones,
            plus a personal key. The source lands in your project and is yours to edit.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {PRO_PLANS.map((plan) => (
              <Card key={plan.name}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <p>
                    <span className="font-display text-5xl">{plan.price}</span>{" "}
                    <span className="font-mono text-xs text-muted-foreground">{plan.cadence}</span>
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{plan.note}</p>
                  <Button asChild variant={plan.name === "Lifetime" ? "primary" : "default"}>
                    <a href={plan.href}>Get {plan.name.toLowerCase()}</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Checkout runs on vsrc.co.in, the V-/Src store. Sign in with GitHub, pay, and your key is
            waiting in your library.
          </p>
        </Reveal>
      </section>

      <section id="setup" className="scroll-mt-24 border-t border-border pt-14">
        <Reveal>
          <Kicker>{"// setup"}</Kicker>
          <h2 className="display-stroke-sm mt-2 font-display text-3xl sm:text-4xl">Install with your key</h2>
          <ol className="mt-6 grid list-decimal gap-6 pl-5 leading-relaxed text-muted-foreground [&>li]:min-w-0">
            <li>
              In your library on vsrc.co.in, choose <span className="text-foreground">Create install key</span> and
              copy it. It is shown once; you can always replace it.
            </li>
            <li>
              Add both registries to <code className="font-mono text-sm text-foreground">components.json</code>:
              <div className="mt-3">
                <CodeBlock kicker="components.json" code={REGISTRIES_SNIPPET} copy />
              </div>
            </li>
            <li>
              Put the key in <code className="font-mono text-sm text-foreground">.env.local</code>, which
              stays out of git:
              <div className="mt-3">
                <CodeBlock kicker=".env.local" code="VSRC_PRO_KEY=vsrc_pro_your_key_here" copy />
              </div>
            </li>
            <li>
              Install any Pro component:
              <div className="mt-3">
                <CodeBlock kicker="install" code="npx shadcn add @vsrc-pro/glass-loupe" copy />
              </div>
            </li>
          </ol>
        </Reveal>
      </section>

      <section id="licence" className="mt-14 scroll-mt-24 border-t border-border pt-14">
        <Reveal>
          <Kicker>{"// licence"}</Kicker>
          <h2 className="display-stroke-sm mt-2 font-display text-3xl sm:text-4xl">The Pro licence</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The free components and the optics engine stay MIT. Pro components are licensed per
            buyer, in plain words:
          </p>
          <ul className="mt-6 grid gap-2 text-muted-foreground">
            {LICENCE.map((term) => (
              <li key={term} className="flex gap-3 leading-relaxed">
                <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-signal" />
                {term}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Every Pro file arrives with a comment naming who it is licensed to. Downloads are logged
            with the key&apos;s owner and the requesting IP address so shared keys can be found and
            switched off.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
