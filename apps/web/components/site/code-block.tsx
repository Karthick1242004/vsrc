export function CodeBlock({ kicker, code }: { kicker: string; code: string }) {
  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-card">
      <figcaption className="border-b border-border px-4 py-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        {`// ${kicker}`}
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-card-foreground">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
