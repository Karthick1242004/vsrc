"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { COMPONENT_INDEX } from "@/components/site/component-index";
import { Wordmark } from "@/components/site/wordmark";
import { Button } from "@/registry/vsrc/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/vsrc/ui/sheet";

const linkClass =
  "block rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground";

/** Small-screen nav: the registry Sheet as a left side panel (dogfooding). */
export function MobileNav() {
  // On /components itself, pure-hash anchors let Lenis smooth the jump;
  // Next Link hash navigation scrolls instantly and bypasses it.
  const onComponents = usePathname() === "/components";
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 lg:hidden" aria-label="Open navigation">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 5.5h14M3 10h14M3 14.5h14" />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <Wordmark />
          </SheetTitle>
          <SheetDescription>Thirteen surfaces, one optic.</SheetDescription>
        </SheetHeader>
        <nav aria-label="Site" className="grid gap-1 text-sm">
          <SheetClose asChild>
            <Link href="/" className={linkClass}>
              Home
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/components" className={linkClass}>
              Components
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <a
              href="https://github.com/Karthick1242004/vsrc"
              rel="noreferrer"
              target="_blank"
              className={linkClass}
            >
              GitHub
            </a>
          </SheetClose>
        </nav>
        <p className="mt-2 font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
          {"// components"}
        </p>
        <nav aria-label="Component index" className="grid gap-1 font-mono text-xs">
          {COMPONENT_INDEX.map((name) => (
            <SheetClose asChild key={name}>
              {onComponents ? (
                <a href={`#${name}`} className={linkClass}>
                  {name}
                </a>
              ) : (
                <Link href={`/components#${name}`} className={linkClass}>
                  {name}
                </Link>
              )}
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
