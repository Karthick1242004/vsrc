/**
 * The busy backdrop the demo glass floats over: drifting warm-color blobs and
 * two marquee rows of giant serif type for the rim to bend. Deliberately NOT
 * the wordmark — mark hygiene forbids distorting it, and glass distorts.
 */
const WORDS = ["refraction", "dispersion", "specular", "caustics", "chroma", "rim-light"];

function MarqueeRow({ className }: { className?: string }) {
  const run = WORDS.map((w) => `${w} · `).join("");
  return (
    <div className={`flex w-max animate-marquee whitespace-nowrap ${className ?? ""}`}>
      {[0, 1].map((i) => (
        <span
          key={i}
          className="pr-4 font-display text-[7rem] leading-none italic sm:text-[9rem]"
        >
          {run}
        </span>
      ))}
    </div>
  );
}

export function RefractionField({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-border bg-background">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -top-1/4 -left-1/6 size-[34rem] animate-blob-a rounded-full bg-signal/45 blur-3xl" />
        <div className="absolute -right-1/6 -bottom-1/4 size-[30rem] animate-blob-b rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 size-[24rem] animate-blob-a rounded-full bg-foreground/15 blur-3xl [animation-delay:-12s]" />
        {/* Rows span the full band so every glass element — buttons included —
            has type behind it to bend, not just the centered panel. */}
        <div className="absolute inset-0 flex flex-col justify-evenly opacity-90">
          <MarqueeRow className="text-foreground" />
          <MarqueeRow className="text-signal [animation-direction:reverse]" />
          <MarqueeRow className="text-foreground [animation-delay:-18s]" />
        </div>
      </div>
      <div className="relative flex min-h-[28rem] items-center justify-center p-8 sm:p-14">
        {children}
      </div>
    </div>
  );
}
