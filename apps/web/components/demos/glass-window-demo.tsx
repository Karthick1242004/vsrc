"use client";

import { useState } from "react";

import { GlassWindow, WindowDesktop } from "@/registry/pro/ui/glass-window";

/** Wallpaper art for the demo desktop: layered gradients only, no images. */
export const ARTWORKS = {
  wallpaper:
    "radial-gradient(60% 70% at 15% 20%, #ff9a6b 0%, transparent 60%), radial-gradient(55% 65% at 85% 15%, #7a5cff 0%, transparent 62%), radial-gradient(70% 70% at 70% 100%, #1fb6c9 0%, transparent 60%), linear-gradient(160deg, #2a1b4d, #0f3b57)",
};

const NOTES = [
  { done: true, text: "Send Q4 invoices to Halden & Co." },
  { done: true, text: "Review Mara's pricing page copy" },
  { done: false, text: "Book flights for the Lisbon offsite" },
  { done: false, text: "Renew the studio lease by 15 Dec" },
];

const LOG = [
  ["14:02:11", "build", "compiled 41 modules in 1.8s"],
  ["14:02:12", "test", "212 passed, 0 failed"],
  ["14:02:13", "deploy", "edge-eu-west ready"],
  ["14:02:14", "deploy", "edge-us-east ready"],
  ["14:02:15", "cdn", "purged 3 paths"],
];

export function GlassWindowDemo() {
  const [open, setOpen] = useState({ notes: true, term: true });

  return (
    <WindowDesktop className="h-[22rem] w-[min(calc(100vw-6rem),40rem)] rounded-2xl border border-border">
      <div aria-hidden className="absolute inset-0" style={{ background: ARTWORKS.wallpaper }} />
      <div aria-hidden className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: "repeating-linear-gradient(115deg, transparent 0 14px, rgb(255 255 255 / 0.5) 14px 15px)" }} />

      {open.notes && (
        <GlassWindow title="Notes: Thursday" defaultPosition={{ x: 20, y: 22 }} size={{ width: 270, height: 210 }} onClose={() => setOpen((o) => ({ ...o, notes: false }))}>
          <ul className="space-y-2.5">
            {NOTES.map((n) => (
              <li key={n.text} className="flex items-start gap-2.5">
                <span aria-hidden className={`mt-1 size-3 shrink-0 rounded-full border ${n.done ? "border-transparent bg-primary" : "border-foreground/50"}`} />
                <span className={n.done ? "text-muted-foreground line-through" : ""}>{n.text}</span>
              </li>
            ))}
          </ul>
        </GlassWindow>
      )}

      {open.term && (
        <GlassWindow title="deploy: production" defaultPosition={{ x: 150, y: 128 }} size={{ width: 330, height: 190 }} onClose={() => setOpen((o) => ({ ...o, term: false }))}>
          <div role="log" aria-label="Deploy output" className="space-y-1 font-mono text-[11px] leading-relaxed">
            {LOG.map(([t, k, m]) => (
              <p key={t} className="whitespace-nowrap">
                <span className="text-muted-foreground">{t}</span> <span className="font-semibold">{k}</span> {m}
              </p>
            ))}
            <p aria-hidden className="flex items-center gap-1">
              <span>$</span>
              <span className="h-3 w-1.5 animate-pulse bg-foreground motion-reduce:animate-none" />
            </p>
          </div>
        </GlassWindow>
      )}

      {!open.notes && !open.term && (
        <button
          type="button"
          onClick={() => setOpen({ notes: true, term: true })}
          className="absolute top-1/2 left-1/2 -translate-1/2 rounded-full bg-card px-4 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Reopen windows
        </button>
      )}
    </WindowDesktop>
  );
}
