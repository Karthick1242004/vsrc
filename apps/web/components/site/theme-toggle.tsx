"use client";

import * as React from "react";

import { Button } from "@/registry/vsrc/ui/button";

/**
 * Dark (warm black) is the default; `.light` on <html> opts into cream paper.
 * A head script in layout.tsx applies the stored choice before first paint.
 */

/** Flip the theme, persist it, and announce it so any listener (the header
 *  button, the command palette) can stay in sync. Returns the new light state. */
export function toggleTheme(): boolean {
  const light = !document.documentElement.classList.contains("light");
  document.documentElement.classList.toggle("light", light);
  localStorage.setItem("vsrc-theme", light ? "light" : "dark");
  window.dispatchEvent(new CustomEvent("vsrc:themechange", { detail: { light } }));
  return light;
}

export function ThemeToggle() {
  const [light, setLight] = React.useState(false);

  React.useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
    const sync = (e: Event) => setLight((e as CustomEvent<{ light: boolean }>).detail.light);
    window.addEventListener("vsrc:themechange", sync);
    return () => window.removeEventListener("vsrc:themechange", sync);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8"
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      onClick={() => toggleTheme()}
    >
      {light ? (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15.5 12.5A6.5 6.5 0 0 1 7.5 4.5a6.5 6.5 0 1 0 8 8Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="10" cy="10" r="3.5" />
          <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4" />
        </svg>
      )}
    </Button>
  );
}
