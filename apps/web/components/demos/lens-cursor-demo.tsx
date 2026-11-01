"use client";

import { LensCursorArea } from "@/registry/pro/ui/lens-cursor";

const LINKS = [
  { title: "Field notes", body: "Short essays on optics, one every Thursday.", meta: "42 issues" },
  { title: "The lens library", body: "Forty hand-ground lenses, measured and catalogued.", meta: "Updated Oct 28" },
  { title: "Workshop dates", body: "Small-group sessions in Lisbon and Kyoto.", meta: "6 seats left" },
];

export function LensCursorDemo() {
  return (
    <LensCursorArea className="w-full max-w-3xl rounded-3xl border border-border bg-card p-5 sm:p-6">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(50%_60%_at_85%_10%,oklch(0.78_0.16_60/0.4),transparent),radial-gradient(50%_60%_at_5%_95%,oklch(0.7_0.14_250/0.35),transparent)]"
      />
      <p className="relative font-display text-3xl text-foreground sm:text-4xl">The Optics Review</p>
      <p className="relative mt-1 text-sm text-muted-foreground">
        Move your pointer over the cards. On touch screens the lens is hidden.
      </p>
      <ul className="relative mt-5 grid gap-3 sm:grid-cols-3">
        {LINKS.map((item) => (
          <li key={item.title}>
            <a
              href="#lens-cursor"
              data-lens="grow"
              className="block h-full rounded-2xl border border-border bg-background/60 p-4 outline-none transition-colors hover:bg-background/80 focus-visible:ring-2 focus-visible:ring-ring ring-offset-background"
            >
              <span className="block text-sm font-medium text-foreground">{item.title}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{item.body}</span>
              <span className="mt-3 block text-[11px] text-muted-foreground">{item.meta}</span>
            </a>
          </li>
        ))}
      </ul>
    </LensCursorArea>
  );
}
