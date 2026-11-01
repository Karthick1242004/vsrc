"use client";

import * as React from "react";

import { RadialMenu, type RadialMenuItem } from "@/registry/pro/ui/radial-menu";

const svg = (d: string) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export function RadialMenuDemo() {
  const [picked, setPicked] = React.useState<string | null>(null);
  const items: RadialMenuItem[] = [
    { id: "reply", label: "Reply", icon: svg("M8 5 3 9.5 8 14M3 9.5h8a5 5 0 0 1 5 5"), onSelect: () => setPicked("Reply") },
    { id: "share", label: "Share", icon: svg("M10 13V3M6 6l4-3.5L14 6M4 10v6h12v-6"), onSelect: () => setPicked("Share") },
    { id: "star", label: "Star", icon: svg("m10 3 2.1 4.3 4.7.7-3.4 3.3.8 4.7L10 13.8 5.8 16l.8-4.7L3.2 8l4.7-.7z"), onSelect: () => setPicked("Star") },
    { id: "pin", label: "Pin to top", icon: svg("M7 3h6l-1 5 3 3H5l3-3zM10 11v6"), onSelect: () => setPicked("Pin to top") },
    { id: "archive", label: "Archive", icon: svg("M3 5h14v3H3zM4.5 8v8h11V8M8 11.5h4"), onSelect: () => setPicked("Archive") },
  ];
  return (
    <div data-demo="radial-menu" className="flex flex-col items-center gap-14 pt-24">
      <RadialMenu items={items} label="Message actions" />
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {picked ? `${picked} selected.` : "Open the menu, then use the arrow keys."}
      </p>
    </div>
  );
}
