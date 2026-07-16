export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl border-t border-border px-6 pt-16 pb-28">
      <p
        aria-hidden
        className="text-center font-display text-[clamp(5rem,18vw,16rem)] leading-none text-foreground"
      >
        V-/Src
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
        <span>MIT — engine and registry</span>
        <span>© 2026 V-/Src</span>
      </div>
    </footer>
  );
}
