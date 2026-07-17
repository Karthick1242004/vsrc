# HANDOFF — vsrc (V-/Src) Liquid Glass Component Library

> Last updated: 2026-07-17, after the feature-batch session (fresh-consumer proof,
> 6 new surfaces → 19 total, optics presets, node-driven glass hook, slider,
> command palette + site-wide ⌘K, pointer-tracked specular, demo-tile word drift).
> **Committed locally on `main` but NOT yet pushed** — run `! ALLOW_PUSH=1 git push`
> yourself (pre-push guard blocks agents). The prior pushed commit is `7b9b207`.
> Read `PLAN.md` (owner-approved plan) and `THINKING.md` (binding discipline) first.
> Component-authoring recipe: `apps/web/registry/README.md`; `button` is the reference
> for simple surfaces, `dialog`/`switch`/`select` for the `<GlassSurface asChild>` pattern.

## Goal

Build **vsrc**: an open-source, shadcn-registry-compatible React component library whose
differentiator is **real refraction** (displacement-map `backdrop-filter`, not blur-only
glassmorphism). Hybrid distribution: npm package `vsrc` = optics engine; **19 components**
delivered via shadcn registry namespace `@vsrc` hosted on the docs site (`vsrc.vercel.app`
until a real domain; actual deploy observed at `vsrc-weld.vercel.app`). Full decision log +
architecture + verification bar: **`PLAN.md`**.

Brand: **V-/Src** — canonical source is `vsrc-brand-board (1).html` in repo root
(warm black #181616 / cream #fffddb, two reds #e02723 fill vs #ff3831 display-only,
Instrument Serif + Geist + Geist Mono). The `griflan-*` files are the raw extraction;
the board wins on conflict. Owner chose **"bend the brand to glass"**: the docs site is
built FROM the glass components. Mark hygiene stays absolute (mark/wordmark never placed
behind glass — glass distorts). Wordmark `-/` is signal red (owner override, prior session).

## This session (feature batch — all verified in Chromium via Playwright)

Root `pnpm build` (turbo: engine + site) green; `pnpm --filter web lint` (tsc) clean;
**17/17 vitest** (was 11 — +6 for presets). `pnpm registry:build` → **22** `public/r/*.json`
(theme + utils + registry.json + 19 ui). Every proof below was a Playwright run against the
local dev server asserting `data-vsrc-glass="refract"` (see What Worked).

1. **Fresh-consumer proof — DONE** (PLAN §Verification 1, the long-standing biggest gap).
   Scratch Next app OUTSIDE the repo (in the session scratchpad, never the repo):
   `pnpm pack` the local engine → `vsrc-0.1.0.tgz`, pin it via a pnpm **override** in the
   scratch `pnpm-workspace.yaml` (package.json `pnpm.overrides` is IGNORED by pnpm 11 —
   the direct `file:` dep + workspace override are what actually pin it), serve the registry
   from `localhost:3000`, `npx shadcn add @vsrc/dialog` → pulled dialog + glass-surface +
   utils + theme tokens + npm deps, `next build` green, Playwright `1 passed` (surface +
   dialog both refract). See What Didn't Work for the two gotchas (base-nova style; offline
   colors).
2. **6 new surfaces (13 → 19).** `select`, `alert-dialog`, `context-menu`, `hover-card`
   (clone the existing panel/modal patterns), `slider` (glass **lens thumb** over a plain
   gradient track — the switch inverted), `command` (cmdk inside a glass Dialog). Each: a
   `registry/vsrc/ui/<name>.tsx`, a `registry.json` item, a docs section + demo, an entry in
   `components/site/component-index.ts`. `COMPONENT_INDEX.length` now drives every on-page
   count (no more literal "Thirteen").
3. **Optics presets.** `GLASS_PRESETS` (`subtle`/`regular`/`heavy`) + `mergeGlass(base, glass)`
   live in `packages/vsrc/src/engine.ts` (re-exported from `vsrc` and `vsrc/react`). Every
   component's `glass` prop widened to `LiquidGlassOptions | GlassPreset | false`; merging
   components now call `mergeGlass(<NAME>_OPTICS, glass)` — **never spread `glass` directly**,
   a preset string would scatter into indexed chars. `liquidGlass(el, "heavy")` and
   `useLiquidGlass(node, "subtle")` both accept the string. Dogfooded: the hover-card demo
   uses `glass="subtle"`.
4. **Node-driven `useLiquidGlass` (bug fix).** The hook now takes the **element** (held in
   `useState`), not a ref object, and keys its effect on the node. Fixes a real bug: Radix
   **Select** mounts its content a commit AFTER the wrapping `GlassSurface`, so the old
   ref-read-once effect never applied refraction (select-content came back with no
   `data-vsrc-glass`). Swept `button`/`input`/`glass-surface` + the package primitive.
5. **Command palette + site-wide ⌘K.** `components/site/command-menu.tsx` is mounted once in
   `layout.tsx`; ⌘K/Ctrl+K opens the registry `command` surface listing all 19 components +
   site links + a theme toggle. `DialogContent` gained a backward-compatible
   `showCloseButton?: boolean` (default true) so the palette drops the corner ✕.
   `theme-toggle.tsx` now exports a shared `toggleTheme()` (dispatches a `vsrc:themechange`
   event so the header icon and palette stay in sync).
6. **Pointer-tracked specular.** Opt-in `<GlassSurface specular="pointer">` (material layer,
   NOT the engine): an rAF-throttled pointermove writes `--spec-x/-y/-o`, read by a
   `[data-vsrc-specular]::before` cream glare. Fine pointers only, inert under reduced motion,
   OFF by default (only the glass-surface hero demo enables it). CSS lives in BOTH
   `globals.css` AND the `theme` registry item's `css` (kept in lockstep).
7. **Demo-tile word drift.** The giant word behind each demo tile now animates
   (`word-drift`, **8s** ease-in-out alternate, reduced-motion off) so the refraction reads
   on a static tile. `DemoTile` is the one shared component (word-as-prop); not forked.

**Still NOT built:** per-component doc pages (props/a11y tables) — the remaining Phase 5 gap.
README/CONTRIBUTING + `npm publish --dry-run` unwritten (Phase 6). Axe smoke + 60fps perf
sanity not run.

## Repo state (committed locally on `main`, NOT pushed)

Owner runs every push via `! ALLOW_PUSH=1 git push` (pre-push guard blocks agents; never
bypass, never set ALLOW_PUSH yourself). Deploys are owner-run on Vercel. `griflan-*`,
`.claude/`, `.agents/` are gitignored. **`apps/web/next-env.d.ts` gets rewritten by
`pnpm dev`** — never stage it (it stayed clean this session).

New this session:
- Files: `registry/vsrc/ui/{select,alert-dialog,context-menu,hover-card,slider,command}.tsx`,
  `components/site/command-menu.tsx`.
- Deps (`apps/web`): `@radix-ui/react-{select,alert-dialog,context-menu,hover-card,slider}`,
  `cmdk`.
- Engine (`packages/vsrc`): `GLASS_PRESETS`, `mergeGlass`, `GlassPreset` added; hook + primitive
  made node-driven; +6 vitest cases.

Layout: `packages/vsrc/` = engine (`src/{engine,react,index}.ts`, tests, MIT LICENSE).
`apps/web/` = Next 16 docs site + registry host: `app/{layout,page}.tsx`,
`app/components/page.tsx`, `app/globals.css`; `components/site/*`; `registry/vsrc/lib/utils.ts`
+ `registry/vsrc/ui/*` (19); `registry.json`; `registry/README.md`; `public/r/*.json`.

## Key decisions already made (don't re-litigate)

Prior sessions: hex tokens; glass tokens `--glass-*`; button optics scale −56/chroma 4/
border 0.16/mapBlur 8; dark default; toasts CSS-only; frost tuned (fallbackBlur 3 / buttons 2,
tint cream 4%, sheen ≤8%, owner blur-sensitive — change only on ask; edge-band frost REJECTED
twice); wordmark `-/` signal red; hero = two CTAs; installation on /components; Lenis wheel-only.
This session:
- **Preset values** (`subtle`/`regular`/`heavy`) tuned from existing per-component optics;
  `regular` = engine DEFAULTS. A **string preset REPLACES** a component's optics; an **object
  merges over** them; `false` disables.
- **Specular is a registry material-layer feature** (`specular="pointer"`), NOT an engine API —
  the engine owns optics only. Default OFF everywhere (adds a pointermove listener).
- **Slider** v1 maps N thumbs (multi-value ready); `blur:0` lens (bend, don't fog).
- **`DialogContent` gained `showCloseButton`** (upstream-shadcn pattern) for the palette.
- On-page component counts render from `COMPONENT_INDEX.length`, not literals.
- Demo-tile word drift is 8s (owner asked to speed it up from the initial 12s).

## What Worked

- **Live-site verification via Playwright** run from the scratch consumer app's deps
  (`@playwright/test`) against `localhost:3000`. Assert `data-vsrc-glass` per surface. For
  portaled Radix content, open it (click/hover/right-click) then read the attribute on
  `[data-slot="<name>-content"]`. For pointer effects use `locator.hover()` (its actionable
  pointer path) — raw `page.mouse.move` to computed coords sometimes misses under Lenis.
- Detached dev server via Bash `run_in_background: true`; poll `curl` in an until-loop.
- `<GlassSurface asChild>` around a Radix pane — one path for all portaled surfaces.
- The lens-cursor pattern proves moving glass is cheap: Radix moves a thumb via a wrapper's
  `left`, the thumb's box never changes, so the engine's ResizeObserver never regenerates the
  displacement map mid-drag (verified: slider map href unchanged across a position change).

## What Didn't Work (do not repeat / re-debug)

- **shadcn's default `base-nova` (Base UI) style BREAKS the install.** Its `asChild`→`render`
  codemod rewrites `<GlassSurface>` callers but leaves `GlassSurface` implementing Radix
  `asChild` → `next build` type-fails on a `render` prop. Install with a **Radix style
  (`new-york`)** — that's what the fresh-consumer proof used. Fix later: a compat note or a
  `render`-accepting shim.
- **This machine can't reach `ui.shadcn.com`** (npm registry is allowlisted, ui.shadcn.com is
  not; `curl` → 000). `shadcn add`/`init` fetch `.../colors/neutral.json` for base colors and
  hang. Workaround: serve a minimal synthetic `neutral.json`
  (`{inlineColors:{light:{},dark:{}}, cssVars:{...}, cssVarsV4:{...}, inlineColorsTemplate:"",
  cssVarsTemplate:""}`) on a local port and set `REGISTRY_URL=http://localhost:PORT/r`
  (`@vsrc` still resolves via components.json). A real online user never hits this.
- **pnpm 11 ignores `pnpm.overrides` in package.json** — the new home is `pnpm-workspace.yaml`
  `overrides:`. Also blocks postinstall scripts (`sharp` in a fresh Next app) — set
  `allowBuilds: { sharp: true }` in the scratch `pnpm-workspace.yaml`; pnpm APPENDS a
  placeholder line on a blocked install, replace it.
- **Radix Select mounts content a commit after the wrapping surface** → a ref-read-once glass
  hook misses it. This is why `useLiquidGlass` is now node-driven (element in state). Any
  future deferred-mount surface is covered by this.
- **Turbopack dev cache serves STALE CSS** after editing `globals.css` — `rm -rf apps/web/.next`
  and restart dev to pick up new rules.
- **Playwright's WebKit computes but does NOT PAINT backdrop-filter** — assert the attribute /
  computed style, never pixels. Chromium CSSOM serializes `url(#id)` as `url("#id")`; computed
  colors come back `oklab(...)`.
- The user's HOME is itself a git repo — always operate with cwd inside the project.

## Next Steps (in order)

1. **Push** this session's local commit: `! ALLOW_PUSH=1 git push`.
2. **Per-component docs pages** (props tables, a11y notes) — the remaining Phase 5 gap.
3. **Axe smoke + 60fps perf sanity** (PLAN §Verification 3–4) — now with loader, Lenis,
   reveals, drift, and the ⌘K listener all live.
4. **Publish prep** (Phase 6): `npm publish --dry-run` for the engine + README/CONTRIBUTING.
   Publishing claims the `vsrc` npm name and unblocks a consumer proof without the local
   tarball override. NOTE: the Phase-0 tarball predates the preset/node-hook changes — re-pack
   before a fresh proof.
5. Optional: re-prove a NEW surface (e.g. `select`) in a consumer to exercise the deferred-mount
   fix end-to-end through `shadcn add`.
6. Run `/playbook` (PLAYBOOK.md still absent).

## Open questions for the owner (none blocking)

- **base-nova compatibility**: document "use a Radix style", or ship a `render`-accepting shim?
- Hero CTA copy still shipped as **"Get started"** (vs literal "Getting Started").
- npm name claiming (`vsrc`) timing; real domain timing (`NEXT_PUBLIC_SITE_URL`; snippet still
  says `vsrc.vercel.app`, deploy at `vsrc-weld.vercel.app`).
