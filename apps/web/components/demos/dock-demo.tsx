"use client";

import { Monogram } from "@/components/site/monogram";
import { Dock, DockItem, DockSeparator } from "@/registry/vsrc/ui/dock";

export function DockDemo() {
  return (
    <Dock glass={{ scale: -48 }} className="static! bottom-auto left-auto z-0 translate-x-0">
      <DockItem>
        <a href="#dock" aria-label="Home" className="bg-primary text-primary-foreground">
          <Monogram />
        </a>
      </DockItem>
      <DockItem>
        <a href="#dock" aria-label="Search">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="9" r="5.5" />
            <path d="m13.5 13.5 3.5 3.5" />
          </svg>
        </a>
      </DockItem>
      <DockSeparator />
      <DockItem>
        <a href="#dock" aria-label="Settings">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="10" cy="10" r="2.5" />
            <path d="M10 3v2.2M10 14.8V17M3 10h2.2M14.8 10H17M5 5l1.6 1.6M13.4 13.4 15 15M15 5l-1.6 1.6M6.6 13.4 5 15" />
          </svg>
        </a>
      </DockItem>
    </Dock>
  );
}
