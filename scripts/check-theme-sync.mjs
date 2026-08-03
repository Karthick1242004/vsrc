#!/usr/bin/env node
/**
 * Guards the hand-maintained lockstep between the registry `theme` item
 * (apps/web/registry.json — what consumers install) and the site's own
 * apps/web/app/globals.css. The two carry the same tokens and material CSS by
 * convention only; this script fails when they drift.
 *
 * Checks:
 *  1. Every cssVars.dark entry exists identically in globals `:root`,
 *     every cssVars.light entry in `.light`.
 *  2. Every `--glass-*` custom property in globals `:root`/`.light` is tracked
 *     in the registry cssVars (catches additions that skip the registry).
 *  3. Every selector in the theme item's `css` block exists in globals with an
 *     identical declaration set (both directions), including inside at-rules.
 *
 * No dependencies; run with `node scripts/check-theme-sync.mjs`.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(readFileSync(resolve(root, "apps/web/registry.json"), "utf8"));
const globals = readFileSync(resolve(root, "apps/web/app/globals.css"), "utf8");

const theme = registry.items.find((i) => i.name === "theme");
if (!theme) {
  console.error("check-theme-sync: no `theme` item in registry.json");
  process.exit(1);
}

/* ---------- tiny CSS parser (rules tree; ignores comments/strings safely) -- */

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/** Parse css text into [{selector, body, children}] where body is the raw
 *  declaration text of the block and children are nested rules. */
function parseRules(css) {
  const rules = [];
  let i = 0;
  const n = css.length;
  while (i < n) {
    const brace = css.indexOf("{", i);
    if (brace === -1) break;
    const semi = css.indexOf(";", i);
    // At-statement (`@import …;`) before the next block — skip it.
    if (semi !== -1 && semi < brace && css.slice(i, semi).trimStart().startsWith("@")) {
      i = semi + 1;
      continue;
    }
    const selector = css.slice(i, brace).trim();
    // Find the matching close brace, honoring nesting and quoted strings.
    let depth = 1;
    let j = brace + 1;
    let quote = null;
    while (j < n && depth > 0) {
      const ch = css[j];
      if (quote) {
        if (ch === quote && css[j - 1] !== "\\") quote = null;
      } else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === "{") depth++;
      else if (ch === "}") depth--;
      j++;
    }
    const inner = css.slice(brace + 1, j - 1);
    const children = inner.includes("{") ? parseRules(inner) : [];
    // Body = inner text minus child blocks (declarations only).
    let body = inner;
    for (const c of children) body = body.replace(c.raw, "");
    rules.push({ selector: normSel(selector), body, children, raw: css.slice(i, j) });
    i = j;
  }
  return rules;
}

const normSel = (s) => s.replace(/\s+/g, " ").trim();
// Collapse whitespace, including the `( ` / ` )` padding that multi-line
// formatting introduces — formatting differences are not drift.
const normVal = (s) =>
  s.replace(/\s+/g, " ").replace(/\(\s+/g, "(").replace(/\s+\)/g, ")").trim();

/** Declaration text → Map(prop → value). */
function parseDecls(body) {
  const map = new Map();
  // Split on `;` outside quotes/parens.
  let cur = "";
  let quote = null;
  let paren = 0;
  const parts = [];
  for (const ch of body) {
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(") paren++;
    else if (ch === ")") paren--;
    else if (ch === ";" && paren === 0) {
      parts.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  parts.push(cur);
  for (const part of parts) {
    const idx = part.indexOf(":");
    if (idx === -1) continue;
    const prop = part.slice(0, idx).trim();
    const value = normVal(part.slice(idx + 1));
    if (prop) map.set(prop, value);
  }
  return map;
}

const tree = parseRules(stripComments(globals));

/** A selector can appear in several top-level blocks (globals splits its
 *  reduced-motion rules across five @media blocks). Merge them: declarations
 *  cascade (later wins) and children concatenate. */
function findTop(sel) {
  const matches = tree.filter((r) => r.selector === normSel(sel));
  if (matches.length === 0) return undefined;
  return {
    selector: normSel(sel),
    body: matches.map((m) => m.body).join(";"),
    children: matches.flatMap((m) => m.children),
  };
}

const errors = [];

/* ---------- 1. cssVars → globals ----------------------------------------- */

for (const [mode, selector] of [["dark", ":root"], ["light", ".light"]]) {
  const rule = findTop(selector);
  if (!rule) {
    errors.push(`globals.css: missing top-level \`${selector}\` block`);
    continue;
  }
  const decls = parseDecls(rule.body);
  // `.light` may omit a var and inherit it from `:root` — that is lockstep as
  // long as the inherited value matches what the registry ships for light.
  const rootDecls = selector === ".light" ? parseDecls(findTop(":root")?.body ?? "") : null;
  for (const [key, value] of Object.entries(theme.cssVars?.[mode] ?? {})) {
    const got = decls.get(`--${key}`) ?? rootDecls?.get(`--${key}`);
    if (got === undefined) {
      errors.push(`\`${selector}\` lacks --${key} (registry cssVars.${mode})`);
    } else if (got !== normVal(value)) {
      errors.push(`--${key} drift in \`${selector}\`: globals \`${got}\` vs registry \`${normVal(value)}\``);
    }
  }
  /* ---------- 2. globals --glass-* → cssVars ------------------------------ */
  for (const prop of decls.keys()) {
    if (prop.startsWith("--glass-") && !(prop.slice(2) in (theme.cssVars?.[mode] ?? {}))) {
      errors.push(`globals \`${selector}\` declares ${prop} but registry cssVars.${mode} does not track it`);
    }
  }
}

/* ---------- 3. css block selectors: declaration-set equality -------------- */

function compareRule(context, sel, expected, actualRule) {
  if (!actualRule) {
    errors.push(`globals.css: missing \`${sel}\`${context ? ` inside \`${context}\`` : ""} (present in registry theme css)`);
    return;
  }
  const values = Object.values(expected);
  const nested = values.length > 0 && values.every((v) => typeof v === "object");
  if (nested) {
    for (const [innerSel, innerDecls] of Object.entries(expected)) {
      // Same merge rule as findTop: a child selector may recur across the
      // merged parent blocks.
      const matches = actualRule.children.filter((c) => c.selector === normSel(innerSel));
      const child =
        matches.length === 0
          ? undefined
          : {
              selector: normSel(innerSel),
              body: matches.map((m) => m.body).join(";"),
              children: matches.flatMap((m) => m.children),
            };
      compareRule(sel, innerSel, innerDecls, child);
    }
    return;
  }
  const actual = parseDecls(actualRule.body);
  for (const [prop, value] of Object.entries(expected)) {
    const got = actual.get(prop);
    if (got === undefined) {
      errors.push(`\`${sel}\` in globals lacks \`${prop}\` (registry has it)`);
    } else if (got !== normVal(String(value))) {
      errors.push(`\`${sel}\` { ${prop} } drift: globals \`${got}\` vs registry \`${normVal(String(value))}\``);
    }
  }
  for (const prop of actual.keys()) {
    if (!(prop in expected)) {
      errors.push(`\`${sel}\` in globals declares \`${prop}\` but the registry theme css does not`);
    }
  }
}

for (const [sel, decls] of Object.entries(theme.css ?? {})) {
  compareRule(null, sel, decls, findTop(sel));
}

/* ---------- report -------------------------------------------------------- */

if (errors.length) {
  console.error(`check-theme-sync: ${errors.length} drift issue(s) between registry theme and globals.css:\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log("check-theme-sync: registry theme and globals.css are in lockstep ✓");
