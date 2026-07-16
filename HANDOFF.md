# HANDOFF — vsrc (V-/Src) Liquid Glass Component Library

> Last updated: 2026-07-16 (evening), after ALL 13 components + docs skeleton + glass
> cursor shipped and pushed (`main` @ fd49b81, github.com/Karthick1242004/vsrc).
> Read `PLAN.md` (the owner-approved plan) and `THINKING.md` (binding discipline) first.
> Component-authoring recipe: `apps/web/registry/README.md`; `button` is the reference
> for simple surfaces, `dialog`/`switch` for the `<GlassSurface asChild>` Radix pattern.

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
red in frosted via an explicit re-override. Frosted is a UNIFORM frost — an
edge-band experiment read as a thick border and was removed (owner rejected it twice;
don't reintroduce). Recipe (after glasscn, MIT — their demo cards' Safari path is just
blur(4)+hairline): `fallbackBlur` 5 (buttons 4), tint cream 4%, FAINT drifting radial
sheens (`glass-drift` 18s, reduced-motion honored; peaks ≤8% — stacked cream reads as
milk, owner rejected), subtle fish-eye + side rails in `--glass-specular-frosted`,
1px directional hairline rim. All frosted dressing lives in globals + the theme item's
`css` field. Frosted VISUALS are verified by
screenshotting Chromium with a Safari user agent (engine sniffs UA → frosted, and
Chromium paints backdrop-filter where Playwright WebKit can't). Non-refracting
browsers also get a press-to-open **WebGL refraction demo** (`components/site/lens-demo.tsx`,
gated on `!canRefract()`, `?lens=demo` forces it for testing) — verified painting in
Playwright WebKit + Chromium.
**Remaining in Phase 3:** the fresh-consumer proof (scratch Next app outside the repo,
`npx shadcn add @vsrc/button` against the locally-served registry) — not yet run.

**Phase 4 — remaining components: DONE, verified.** All 13 shipped: card, input, switch,
tabs, tooltip, popover, dropdown-menu, dialog, sheet, toast (sonner, CSS-material only —
toasts animate position), dock. Pattern: portaled/asChild surfaces compose
`<GlassSurface asChild>` around the Radix primitive. **Positioning gotcha (cost a debug
round): `glassMaterial` deliberately has NO position class — Slot concatenation made
`relative` beat `fixed` in the cascade and dialogs rendered in flow. asChild consumers
must position themselves (`relative` for popover/tooltip/menu content, `fixed` dialogs/
sheets/dock); overriding the dock's `fixed` needs `static!`.** Verified in both engines:
19 glass elements on /components all refract (Chromium) / frost (WebKit), dialog opens
via keyboard + Escape closes + focus trapped, tooltip on hover, toast fires.

**Phase 5 — docs site: PARTIAL.** Library skeleton done: shared header (monogram tile +
wordmark), giant-wordmark footer, floating glass Dock as site nav (dogfooding dock/
tooltip/switch), `/components` page (sticky index + 13 demo sections + install commands),
smooth scroll (reduced-motion aware), site-wide custom cursor (`components/site/cursor.tsx`,
fine pointers only): default = tilting -/ monogram mark, dock LENS switch toggles a
64px glass-orb cursor running the real engine (localStorage-persisted). Monogram = brand
board markC in `components/site/monogram.tsx`. Not built: per-component doc pages
(props/a11y tables), light-theme toggle.

**Phase 6 — E2E verification suite: not started** (ad-hoc Playwright scripts cover the
above; the fresh-consumer proof from Phase 3 is still the next verification task).

## Repo state (all committed AND pushed — github.com/Karthick1242004/vsrc)

`main` @ `fd49b81`; tree clean. Owner runs every push themselves via
`ALLOW_PUSH=1 git push` (pre-push guard blocks agents; never bypass). The site is
deployed on Vercel (URL seen: `vsrc-weld.vercel.app`) — deploys are owner-run.
The `griflan-*` files, `.claude/`, `.agents/` are deliberately gitignored.

- Root: `package.json`, `pnpm-workspace.yaml` (allowBuilds: esbuild + sharp — required),
  `turbo.json`, `tsconfig.base.json`, `.gitignore`, `PLAN.md`, this file.
- `packages/vsrc/` — engine (`src/engine.ts`), react layer (`src/react.tsx`:
  `useLiquidGlass(ref, options | false)` — `false` disables, added for ghost variants),
  `src/index.ts`, tests (`test/`), e2e proof (`e2e/` + `playwright.config.ts`,
  `@playwright/test` devDep), tsup/vitest configs, MIT LICENSE w/ upstream attribution.
- `apps/web/` — Next 16 docs site + registry host:
  - `app/{layout,page.tsx}`, `app/components/page.tsx` (library page: sticky index,
    13 demo sections, install commands), `app/globals.css` (tokens dark-default +
    `.light`, film grain, marquee/blob/drift/glass-in keyframes, smooth scroll,
    cursor:none rule, frosted dressing).
  - `components/site/`: `refraction-field`, `code-block`, `lens-demo` (WebGL),
    `monogram` (brand markC + red tile), `cursor` (provider + monogram/lens follower +
    toggle), `site-header`, `site-footer`, `site-dock` (Dock as site nav).
  - `registry/vsrc/lib/utils.ts` + `registry/vsrc/ui/` — all 13 components;
    `registry.json`; `registry/README.md` (pattern doc); `public/r/*.json` (15 items,
    committed per PLAN).
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
- Frost tuned across four owner rounds — final: `fallbackBlur` 3 (buttons 2), tint
  cream 4%, sheen peaks ≤8%, hairline rim. Owner is blur-sensitive; change only on ask.
- Custom cursor: default = tilting monogram, LENS toggle (dock) = glass orb; the lens
  over the footer wordmark technically distorts the mark — accepted as user-driven,
  not layout (flagged, owner hasn't objected).
- Toasts skip the displacement engine (they animate position); CSS material only.

## What Worked

- Engine + workspace builds, registry build (`shadcn build` v4.13.0), Next 16 prerender.
- e2e fixture (static HTML importing `dist/index.js` over `python3 -m http.server`).
- Live-site verification script pattern (Playwright from `packages/vsrc` deps against
  localhost:3000, asserting `data-vsrc-glass` values per browser); the full interactive
  sweep lives at the session scratchpad as `full-check.mjs` — recreate from HANDOFF
  description if gone (landing modes, tooltip hover, cursor toggle, /components count,
  dialog keyboard open/Escape, toast fire, per engine).
- **Frosted visuals previewed via Chromium + Safari UA** (engine UA-sniffs → frosted;
  Chromium paints backdrop-filter where Playwright WebKit can't).
- `<GlassSurface asChild>` around Radix primitives — one hook path for all 13 components.
- Reading a competitor's shadcn registry JSON (`/r/*.json`) for ground-truth analysis.

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

1. **Fresh-consumer proof** (PLAN.md §Verification 1, the biggest remaining gap):
   scratch Next app OUTSIDE the repo, `components.json` registries →
   `http://localhost:3000/r/{name}.json`, `npx shadcn add @vsrc/dialog` (pulls the
   dependency chain), `next build` green, page refracts in Chromium. Note: registry
   items reference npm package `vsrc` which is NOT published yet — the scratch app
   needs a pnpm/file override to the local `packages/vsrc`, or publish first.
2. Per-component docs pages (props tables, a11y notes) — PLAN Phase 5 completion.
3. Light-theme toggle (`.light` class exists, tokens ready, no UI switch yet).
4. Axe smoke + 60fps scroll sanity (PLAN §Verification 3–4).
5. `npm publish --dry-run` for the engine package + README/CONTRIBUTING (Phase 6).
6. Owner reminder: run `/playbook` (real code has landed; PLAYBOOK.md still absent).

## Open questions for the owner (none blocking)

- npm name claiming (`vsrc`) timing — first publish does it (blocks consumer-proof
  without a local override, see Next Step 1).
- Real domain purchase timing (registry URL swaps via `NEXT_PUBLIC_SITE_URL`; the
  registry snippet on the landing page still says `vsrc.vercel.app` — actual deploy
  observed at `vsrc-weld.vercel.app`).
