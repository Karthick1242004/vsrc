import { codeToHtml } from "shiki";

/**
 * Server-side syntax highlighting. `codeToHtml` reuses shiki's internal
 * singleton, so per-page calls at build time share one highlighter.
 * Dual theme: dark is the site default; `.light .shiki span` swaps to the
 * light vars (see globals.css).
 */
export function highlight(code: string, lang = "tsx"): Promise<string> {
  return codeToHtml(code, {
    lang,
    themes: { dark: "vesper", light: "github-light" },
    defaultColor: "dark",
  });
}
