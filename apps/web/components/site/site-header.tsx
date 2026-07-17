import Link from "next/link";

import { MobileNav } from "@/components/site/mobile-nav";
import { MonogramTile } from "@/components/site/monogram";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Wordmark } from "@/components/site/wordmark";
import { Button } from "@/registry/vsrc/ui/button";

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="flex items-center gap-3">
        <MonogramTile />
        <p className="font-display text-2xl text-foreground">
          <Wordmark />
          <span className="ml-3 align-middle font-mono text-xs text-muted-foreground">v0.1.0</span>
        </p>
      </Link>
      <nav className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
          <Link href="/components">Components</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
          <a href="https://github.com/Karthick1242004/vsrc" rel="noreferrer" target="_blank">
            GitHub
          </a>
        </Button>
        <ThemeToggle />
        <MobileNav />
      </nav>
    </header>
  );
}
