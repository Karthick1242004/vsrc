"use client";

import * as React from "react";
import Link from "next/link";
import { canRefract } from "vsrc";

const STORE = "vsrc-status-banner-v1";

/**
 * What is still being built, said once at the top of every page. A visitor on
 * Safari or Firefox is told they are looking at the frosted fallback, so the
 * difference from a Chromium screenshot is never a surprise.
 */
export function StatusBanner() {
  const [shown, setShown] = React.useState(false);
  const [frosted, setFrosted] = React.useState(false);

  React.useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(STORE) === "1";
    } catch {}
    setFrosted(!canRefract());
    setShown(!dismissed);
  }, []);

  if (!shown) return null;

  const dismiss = () => {
    setShown(false);
    try {
      localStorage.setItem(STORE, "1");
    } catch {}
  };

  return (
    <aside
      aria-label="Work in progress"
      data-slot="status-banner"
      className="relative overflow-hidden border-b border-border/60 bg-card/70 text-sm text-foreground"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-x-6 gap-y-1 px-6 py-2.5 max-sm:flex-col max-sm:items-start max-sm:pr-12">
        <p className="flex items-center gap-2.5">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-signal/70 motion-reduce:animate-none" />
            <span className="relative size-2 rounded-full bg-signal" />
          </span>
          {frosted
            ? "You're on Safari or Firefox, so you see frosted glass. Live refraction for WebKit is in development."
            : "Refraction for Safari and iOS is in development. Chromium bends light today."}
        </p>
        <p className="flex items-center gap-2.5 text-muted-foreground">
          <span aria-hidden className="size-2 rounded-full bg-foreground/40" />
          The vsrc npm package is a work in progress; install through the shadcn registry today.
        </p>
        <Link
          href="/about"
          className="shrink-0 text-foreground underline decoration-signal/60 underline-offset-4 transition-colors hover:decoration-signal sm:ml-auto"
        >
          Browser support
        </Link>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss this notice"
        className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring max-sm:top-3 max-sm:translate-y-0"
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-3.5" aria-hidden>
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
      {/* Indeterminate progress: a short signal-red segment travelling the bottom edge. */}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px overflow-hidden">
        <span className="animate-progress-run block h-full w-1/4 bg-signal motion-reduce:hidden" />
      </span>
    </aside>
  );
}
