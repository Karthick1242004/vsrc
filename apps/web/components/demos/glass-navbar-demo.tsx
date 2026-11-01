"use client";

import * as React from "react";

import { Monogram } from "@/components/site/monogram";
import { GlassNavbar } from "@/registry/pro/ui/glass-navbar";

const LINKS = [
  { label: "Product", href: "#glass-navbar", current: true },
  { label: "Changelog", href: "#glass-navbar" },
  { label: "Pricing", href: "#glass-navbar" },
  { label: "Docs", href: "#glass-navbar" },
];

const POSTS = [
  ["Shipping the fastest search we have built", "Query latency is down 41% at p95 across every region."],
  ["Workspaces now sync offline", "Edit on a plane; changes merge cleanly when you land."],
  ["A calmer inbox for support teams", "Threads group by customer, not by whoever replied last."],
  ["Granular roles arrive for Teams", "Give contractors access to one project, nothing else."],
];

export function GlassNavbarDemo() {
  const scroller = React.useRef<HTMLDivElement | null>(null);
  return (
    <div
      data-demo="glass-navbar"
      className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-background/40"
    >
      <div ref={scroller} className="h-[360px] overflow-y-auto overscroll-contain">
        <GlassNavbar
          scrollContainer={scroller}
          className="-mb-[4.5rem]"
          navLabel="Product site"
          logo={
            <>
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Monogram />
              </span>
              <span className="text-sm font-semibold tracking-tight">Lumen</span>
            </>
          }
          links={LINKS}
          cta={
            <a
              href="#glass-navbar"
              className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background"
            >
              Start free
            </a>
          }
        />
        <div className="px-6 pt-24 pb-10">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">What is new</p>
          <h3 className="font-display mt-2 text-4xl leading-none sm:text-5xl">Scroll to shrink the bar.</h3>
          <ul className="mt-8 flex flex-col gap-3">
            {POSTS.map(([title, body]) => (
              <li key={title} className="rounded-2xl border border-border bg-card/70 p-4">
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </li>
            ))}
          </ul>
          <div aria-hidden className="mt-3 h-24 rounded-2xl bg-[radial-gradient(circle_at_30%_30%,var(--color-primary),transparent_60%)] opacity-40" />
        </div>
      </div>
    </div>
  );
}
