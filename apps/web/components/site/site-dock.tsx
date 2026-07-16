"use client";

import Link from "next/link";

import { CursorToggle } from "@/components/site/cursor";
import { Monogram } from "@/components/site/monogram";
import { Dock, DockItem, DockSeparator } from "@/registry/vsrc/ui/dock";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/vsrc/ui/tooltip";

export function SiteDock() {
  return (
    <Dock aria-label="Site navigation">
      <DockItem>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/" aria-label="Home" className="bg-primary text-primary-foreground hover:bg-primary">
              <Monogram />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Home</TooltipContent>
        </Tooltip>
      </DockItem>
      <DockItem>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/components" aria-label="Components">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="6" height="6" rx="2" />
                <rect x="11" y="3" width="6" height="6" rx="2" />
                <rect x="3" y="11" width="6" height="6" rx="2" />
                <rect x="11" y="11" width="6" height="6" rx="2" />
              </svg>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Components</TooltipContent>
        </Tooltip>
      </DockItem>
      <DockItem>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://github.com/Karthick1242004/vsrc"
              rel="noreferrer"
              target="_blank"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 1.6a8.4 8.4 0 0 0-2.66 16.38c.42.08.58-.18.58-.4v-1.4c-2.34.5-2.84-1.13-2.84-1.13-.38-.97-.93-1.23-.93-1.23-.77-.52.06-.51.06-.51.84.06 1.29.87 1.29.87.75 1.28 1.97.91 2.45.7.08-.55.3-.91.53-1.12-1.87-.21-3.83-.94-3.83-4.15 0-.92.33-1.67.86-2.26-.08-.21-.37-1.07.09-2.22 0 0 .7-.23 2.31.86a8 8 0 0 1 4.2 0c1.6-1.09 2.3-.86 2.3-.86.47 1.15.18 2.01.09 2.22.54.59.86 1.34.86 2.26 0 3.22-1.96 3.93-3.84 4.14.3.26.57.78.57 1.57v2.33c0 .22.15.49.58.4A8.4 8.4 0 0 0 10 1.6Z" />
              </svg>
            </a>
          </TooltipTrigger>
          <TooltipContent>GitHub</TooltipContent>
        </Tooltip>
      </DockItem>
      <DockSeparator />
      <CursorToggle />
    </Dock>
  );
}
