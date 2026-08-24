import { CopyButton } from "@/components/site/copy-button";

/** Highlighted source view — same figure chrome as CodeBlock, but the body is
 *  shiki-rendered HTML and the header carries a copy affordance. */
export function CodePanel({ kicker, html, raw }: { kicker: string; html: string; raw: string }) {
  return (
    <figure className="code-panel overflow-hidden rounded-lg border border-border bg-card">
      <figcaption className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {`// ${kicker}`}
        </span>
        <CopyButton text={raw} />
      </figcaption>
      {/* shiki output, generated at build time from our own registry source. */}
      <div
        className="max-h-[32rem] overflow-auto font-mono text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
