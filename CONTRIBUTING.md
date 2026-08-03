# Contributing to vsrc

The component pattern here is strict on purpose — every surface follows one shape, and the docs site dogfoods every component it documents.

## Before writing any code

Read, in order:

1. [`apps/web/registry/README.md`](./apps/web/registry/README.md) — **the authoring recipe.** File-per-component pattern, optics conventions, registry entry shape, and the per-component verification bar. `button` is the reference implementation; copy its shape exactly.
2. `apps/web/registry/vsrc/ui/glass-surface.tsx` and `ui/button.tsx` — the primitive and the reference.
3. `THINKING.md` — how work is verified and communicated in this repo.

## Binding design constraints

These are owner decisions, not defaults to re-litigate:

- **Optics values derive from `GLASS_PRESETS` only** (`packages/vsrc/src/engine.ts`). Do not invent new frost/blur numbers — the owner is blur-sensitive and frost values change only on explicit request.
- **Glass is for panes.** Surfaces that continuously animate position or size (toasts, accordion content, chart tooltips) get CSS material only — no displacement map. Small repeated controls (checkboxes, radios, badges) stay flat; a sub-20px surface can't show an edge band, and N live filters per form is a real cost.
- **Never nest glass inside glass.** Interiors are plain.
- **One red `primary` action per view.** Everything else is clear glass or ghost.
- **Mark hygiene:** the V-/Src wordmark/monogram is never placed behind glass.
- **Hex tokens are locked** (no oklch migration).

## Verification bar

Per component (from the authoring recipe — do all, paste output):

1. Root `pnpm build` green (turbo: engine + site).
2. `pnpm registry:build` in `apps/web` green; item present in `public/r/<name>.json`; **commit the rebuilt output** — CI fails on drift between `registry.json` and `public/r`.
3. Rendered on the docs site: Chromium surfaces carry `data-vsrc-glass="refract"`, WebKit `"frosted"`, non-glass variants none.
4. Keyboard-only operation (tab, arrows, escape where applicable).
5. Known tooling limit: Playwright's WebKit computes but does not *paint* backdrop-filter — assert attributes, never pixels; frosted visuals are confirmed in real Safari by the owner.

## Consumer compatibility

- Consumers must use a **Radix-based shadcn style** (e.g. `new-york`). The Base UI `base-nova` style rewrites `asChild` composition (`render` props) and breaks every vsrc component. Say so in any install docs you touch.

## Releases (engine: `packages/vsrc`)

1. Add a changeset with your PR (`npx changeset`) — patch/minor per semver; `apps/web` is private and never versioned.
2. Version + publish are owner-run: `npx changeset version`, review CHANGELOG, `npm publish` from `packages/vsrc` (`prepublishOnly` rebuilds `dist`).
3. Release checklist (owner, requires network access to ui.shadcn.com): fresh scratch Next app **outside** the repo, add the `@vsrc` registry to `components.json`, `npx shadcn add @vsrc/dialog` with **no local overrides**, `next build` green, refraction asserted in Chromium.

## Git etiquette

- Never `git add -A`; stage explicit paths.
- Commits and pushes are owner-approved only (a pre-push guard enforces this).
- Scratch/temp files never land in the repo.
