import { COMPONENT_DOCS } from "@/lib/component-docs";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** llms.txt — a machine-readable map of the library for AI coding agents.
 *  Generated from the same doc registry that renders the human pages. */
export function GET() {
  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "Components are distributed shadcn-registry style — source is copied into the",
    "consumer's project. Register the namespace once in components.json (use a",
    'Radix-based style such as "new-york"; the Base UI "base-nova" style breaks',
    "asChild composition), then add components by name:",
    "",
    "```json",
    `{ "registries": { "@vsrc": "${SITE_URL}/r/{name}.json" } }`,
    "```",
    "",
    "```bash",
    "npx shadcn add @vsrc/<component>",
    "```",
    "",
    "Every component exposes a `glass` prop:",
    '`"subtle" | "regular" | "heavy" | LiquidGlassOptions | false` — a preset name',
    "replaces the tuned optics, an object merges over them, `false` disables",
    "refraction. The optics engine is the `vsrc` npm package.",
    "",
    "## Components",
    "",
  ];
  for (const doc of COMPONENT_DOCS) {
    lines.push(`- [${doc.title}](${SITE_URL}/components/${doc.slug}): ${doc.blurb}`);
  }
  lines.push(
    "",
    "## Registry",
    "",
    `- [Registry index](${SITE_URL}/r/registry.json): all installable items as JSON`,
    `- [Install guide](${SITE_URL}/components#installation): one-time namespace setup`,
    "",
  );
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
