import { CopyButton } from "@/components/site/copy-button";

export function CodeBlock({ kicker, code, copy }: { kicker: string; code: string; copy?: boolean }) {
  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-card">
      <figcaption className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {`// ${kicker}`}
        </span>
        {copy ? <CopyButton text={code} /> : null}
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-card-foreground">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
