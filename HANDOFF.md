# HANDOFF — vsrc (V-/Src) Liquid Glass Component Library

> Last updated: 2026-07-16, after the first component (button) shipped end-to-end.
> Read `PLAN.md` (the owner-approved plan) and `THINKING.md` (binding discipline) first.
> **The component-authoring recipe for all remaining components is
> `apps/web/registry/README.md` — follow it exactly, `button` is the reference.**

## Goal

Build **vsrc**: an open-source, shadcn-registry-compatible React component library whose
differentiator is **real refraction** (displacement-map `backdrop-filter`, not blur-only
glassmorphism). Hybrid distribution: npm package `vsrc` = optics engine; 12 components
delivered via shadcn registry namespace `@vsrc` hosted on the docs site (`vsrc.vercel.app`
until a real domain). Full decision log + architecture + verification bar: **`PLAN.md`**.

Brand: **V-/Src** — canonical source is `vsrc-brand-board (1).html` in repo root
(warm black #181616 / cream #fffddb, two reds #e02723 fill vs #ff3831 display-only,
Instrument Serif + Geist + Geist Mono). The `griflan-*` files are the raw extraction;
the board wins on conflict. Owner chose **"bend the brand to glass"**: the docs site is
built FROM the glass components. Mark/wordmark hygiene stays absolute (wordmark is never
placed behind glass — glass distorts).

## Current Progress (phase status)

**Phase 1 — Scaffold: DONE, verified.** Root `pnpm build` (turbo) green 2026-07-16.

**Phase 2 — Engine: DONE, verified.** 11/11 vitest green (SSR 3/3 + DOM 8/8).
Playwright e2e proof green in both browsers (`packages/vsrc/e2e/`,
`cd packages/vsrc && npx playwright test`): Chromium → `data-vsrc-glass="refract"` +
`backdrop-filter: url("#vsrc-lg-N")` with the SVG filter in the DOM; WebKit →
`"frosted"` blur fallback. Screenshots in `packages/vsrc/e2e/screenshots/` (gitignored).

**Phase 3 — Tokens + first components: IN PROGRESS, first component shipped.**
Done and verified live: registry items `theme` (brand + glass cssVars, dark default +
light), `utils` (cn), `glass-surface` (styled primitive, exports shared `glassMaterial`),
`button` (variants default/primary/ghost, sizes sm/default/lg/icon, asChild, per-size
optics preset, `glass: false` opt-out). `pnpm registry:build` in `apps/web` green →
`public/r/{theme,utils,glass-surface,button}.json`. Docs site (`apps/web`, Next 16.2.10 +
Tailwind v4) scaffolded with brand landing page; `next build` green (SSR-safety proven by
prerender); live check: 7 glass elements `refract` in Chromium / `frosted` in WebKit,
ghost button carries no glass attribute. Frosted material is CLEAR glass benchmarked
against glasscn (whose Safari path is also just blur — verified by reading their
registry source; they don't refract there either): engine `fallbackBlur` 16→6,
near-transparent `--glass-tint-frosted`, single top specular, and a 1px directional
hairline rim (`[data-vsrc-glass=frosted]::after`, light streak top/bottom + dark
streak sides, corner fades) in globals + the theme item's `css` field. Primary stays
red in frosted via an explicit re-override. Frosted also carries an EDGE LENS:
`[data-vsrc-glass=frosted]::before` masked band (`--glass-lens`, 12px panels / 5px
buttons) with heavier backdrop blur+saturate+brightness than the clear interior, plus
a bottom fish-eye inset glow in `--glass-specular-frosted` — both after glasscn's
`liquid` variant recipe (their Safari path is pure CSS too). Frosted VISUALS are verified by
screenshotting Chromium with a Safari user agent (engine sniffs UA → frosted, and
Chromium paints backdrop-filter where Playwright WebKit can't). Non-refracting
browsers also get a press-to-open **WebGL refraction demo** (`components/site/lens-demo.tsx`,
gated on `!canRefract()`, `?lens=demo` forces it for testing) — verified painting in
Playwright WebKit + Chromium.
**Remaining in Phase 3:** the fresh-consumer proof (scratch Next app outside the repo,
`npx shadcn add @vsrc/button` against the locally-served registry) — not yet run.

**Phase 4 — remaining components (#5–#12): NOT started.** card · input · switch · tabs ·
tooltip · popover · dropdown-menu · dialog · sheet · toast (sonner) · dock. Follow
`apps/web/registry/README.md` per component; owner intends to run these on a cheaper
model — the pattern doc + button are the template.

**Phases 5–6 — full docs site, E2E verification: not started** (landing exists; per-component
doc pages don't).

## Files written (everything still uncommitted; branch `main` has zero commits)

- Root: `package.json`, `pnpm-workspace.yaml` (allowBuilds: esbuild + sharp — required),
  `turbo.json`, `tsconfig.base.json`, `.gitignore`, `PLAN.md`, this file.
- `packages/vsrc/` — engine (`src/engine.ts`), react layer (`src/react.tsx`:
  `useLiquidGlass(ref, options | false)` — `false` disables, added for ghost variants),
  `src/index.ts`, tests (`test/`), e2e proof (`e2e/` + `playwright.config.ts`,
  `@playwright/test` devDep), tsup/vitest configs, MIT LICENSE w/ upstream attribution.
- `apps/web/` — Next 16 docs site + registry host: `app/{layout,page}.tsx`,
  `app/globals.css` (tokens dark-default + `.light`, film grain, marquee/blob keyframes,
  display-stroke utilities), `components/site/{refraction-field,code-block}.tsx`,
  `registry/vsrc/{lib/utils.ts,ui/glass-surface.tsx,ui/button.tsx}`, `registry.json`,
  `registry/README.md` (the pattern doc), `public/r/*.json` (built).
- fable5 governance stack (THINKING/AGENTS/CLAUDE.md, `.claude/hooks/*`, git guards).

## Key decisions already made (don't re-litigate)

All PLAN.md §"Decisions locked" plus, from this session:
- Brand tokens written as **hex** (not oklch) — board values are hex; no hand-conversion.
- Glass tokens shipped: `--glass-tint/-border/-specular/-shadow/-radius`. PLAN's
  `--glass-tint-opacity/-blur/-saturate` NOT created — the engine sets blur/saturate
  inline; dead tokens omitted deliberately.
- Registry ui imports use `@/registry/vsrc/...` form (shadcn CLI rewrites on add);
  app tsconfig maps `@/lib/utils` → `registry/vsrc/lib/utils`.
- Button optics preset for small controls: scale −56, chroma 4, border 0.16, mapBlur 8.
- Dark is the default theme (`:root`); `.light` class opts into cream paper.
- Install-steps blocks stacked vertically (3-col clipped code at rest).

## What Worked

- Engine + workspace builds, registry build (`shadcn build` v4.13.0), Next 16 prerender.
- e2e fixture (static HTML importing `dist/index.js` over `python3 -m http.server`).
- Live-site verification script pattern (Playwright from `packages/vsrc` deps against
  localhost:3000, asserting `data-vsrc-glass` values per browser).

## What Didn't Work (do not repeat / re-debug)

- **Playwright's WebKit computes but does NOT PAINT backdrop-filter** (verified: inline +
  computed styles correct, `CSS.supports` true, zero visual blur even headed, in a
  minimal page). Frosted VISUALS must be eyeballed in real Safari; assert the attribute
  and style in tests, never the pixels, in WebKit.
- **WebKit misplaces `feImage` x/y inside SVG filters** (probed: full-region map at 0,0
  still renders shifted) — SVG-filter displacement is unreliable on WebKit. That's why
  the sandbox demo (`apps/web/components/site/lens-demo.tsx`) is WebGL, which paints
  identically in all engines (verified by screenshot). Note: reading WebGL canvas pixels
  via drawImage returns blank without `preserveDrawingBuffer` — screenshot instead.
- Chromium CSSOM serializes `url(#id)` as `url("#id")` — match `/url\("?#vsrc-lg-/`.
- pnpm 11 blocks postinstall scripts (`esbuild`, then `sharp`) → `allowBuilds` in
  `pnpm-workspace.yaml`; on a blocked install pnpm APPENDS a placeholder line
  (`sharp: set this to true or false`) into the yaml — remove/replace it, don't just add.
- jsdom quirks (no `CSS` global; `style.backdropFilter` reads back undefined;
  border-radius shorthand not expanded) — engine guard + test conventions handle these.
- The user's HOME is itself a git repo — always operate with cwd inside the project.

## Next Steps (in order)

1. **Owner checks the running site** (dev server: `pnpm --filter web dev`,
   localhost:3000) — including the frosted look in real Safari.
2. Commit proposal at this phase boundary (owner approves; hooks enforce).
3. Fresh-consumer proof: scratch Next app outside the repo, registry served locally,
   `npx shadcn add @vsrc/button`, `next build`, button refracts (PLAN.md §Verification 1).
4. Components #5–#12 per `apps/web/registry/README.md` (owner plans a cheaper model).
5. Per-component docs pages; then Phases 5–6 per PLAN.md.

## Open questions for the owner (none blocking)

- npm name claiming (`vsrc`) timing — first publish does it.
- Real domain purchase timing (registry URL swaps via `NEXT_PUBLIC_SITE_URL`).
- GitHub repo URL for the header link (currently points at the owner's profile).
