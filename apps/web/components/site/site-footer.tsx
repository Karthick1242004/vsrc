import Link from "next/link";

import { Wordmark } from "@/components/site/wordmark";

const linkClass = "transition-colors hover:text-foreground";

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl border-t border-border px-6 pt-16 pb-28">
      <p
        aria-hidden
        className="text-center font-display text-[clamp(5rem,18vw,16rem)] leading-none text-foreground"
      >
        <Wordmark />
      </p>
      <nav
        aria-label="Footer"
        className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground"
      >
        <Link href="/components" className={linkClass}>
          Components
        </Link>
        <Link href="/about" className={linkClass}>
          About &amp; beta
        </Link>
        <a
          href="https://github.com/Karthick1242004/vsrc"
          rel="noreferrer"
          target="_blank"
          className={linkClass}
        >
          GitHub
        </a>
        <a href="mailto:karthick1242004@gmail.com" className={linkClass}>
          Contact
        </a>
      </nav>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
        {/* Copyright stays plain: signal red never sits behind small text. The
            slash still pulls toward the dash so the mark reads attached. */}
        <span>Built by Karthickrajan Somasundaram · v0.1.0 beta · MIT</span>
        <span>
          © 2026 V-<span className="-ml-[0.08em]">/</span>Src
        </span>
      </div>
    </footer>
  );
}
