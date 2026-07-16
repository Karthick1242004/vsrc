# V-/Src — Liquid Glass Component Library (MVP)

## Context

Karthick is building **vsrc** (brand: **V-/Src**): an open-source, shadcn-compatible React component library whose differentiator is **real refraction** — the bundled `liquid-glass.js` engine (MIT, ~230 lines) generates a canvas displacement map and applies it via SVG filter + `backdrop-filter`, so content behind a panel visibly bends at the rim with a prism fringe. Competitors (glasscn, shadcn-glass-ui, glass-ui, Ein UI) are blur-and-gradient glassmorphism; none do true refraction. Positioning is "best-crafted, not first."

Target: production-grade MVP a stranger can install into a Next.js/React app today.

## Decisions locked with the owner (grilling session)

1. **Distribution — hybrid:** the optics engine ships as an npm package; the 12 components ship via a shadcn-compatible registry (`npx shadcn add @vsrc/dialog`), source copied into the consumer's project.
2. **React Native:** cut from MVP; keep tokens/API portable so an RN package can slot in later.
3. **Zero backend:** registry = static JSON, docs = static Next.js. No DB, no API server.
4. **Scope:** ~12 surface components, craft-first (not shadcn parity).
5. **Styling:** Tailwind v4 + CSS custom-property tokens (shadcn theming convention).
6. **Full docs site in MVP** — it also hosts the registry.
7. **Name:** `vsrc` (free on npm, verified). Wordmark `V-/Src`, exact capitalization, never bent.
8. **Brand: "bend the brand to glass"** — the docs site itself is built FROM the glass components (full dogfooding). Brand board palette/type stay canonical; its "flat/no-shadow" laws are reinterpreted as the glass material. Mark hygiene still absolute: monogram/wordmark undistorted, single-color, level, 16px floor.
9. **Domain:** `vsrc.vercel.app` for now; real domain later via one env var (`NEXT_PUBLIC_SITE_URL`).

## Decisions made on the owner's behalf (stated, reversible)

- **License MIT** (upstream engine is MIT — attribution kept in LICENSE).
- **Monorepo:** pnpm workspaces + Turborepo. **TypeScript strict** everywhere.
- **Engine npm package named `vsrc`** (claim the bare name; `@vsrc/*` org optional later). Registry namespace `@vsrc` is a components.json alias — no npm org required.
- **Toast via `sonner`** (shadcn's current convention), glass-styled.
- **Dark theme default**, light ("cream paper") supported — per brand board.

## Brand system (canonical source: `vsrc-brand-board (1).html`)

- Colors (oklch, dark default): `--background` #181616 warm near-black · `--foreground` #fffddb cream · `--card` #221f1f · `--muted-fg` #a89e8a · `--border` #35302f · `--primary` #e02723 (AA-safe fills, cream label 4.5:1) · `--signal` #ff3831 (display/decoration only — never behind small text). Light theme: cream paper #fbf7e4 + warm ink. No cool greys, no second accent.
- Type: **Instrument Serif 400** display (faux-bold = 0.85px text-stroke at hero, 0.4px at headings, never small), **Geist** 400/500 body/UI, **Geist Mono** code/prices/`// kickers`. All on Google Fonts via `next/font`.
- Motifs: film grain overlay (~5% opacity, feTurbulence), `//` mono kickers, giant footer wordmark, monogram C (`-/` sharing a terminal), app-icon tile radius 22%.
- The `griflan-*` files in repo root are the raw extraction that informed the board; the board wins on conflict.

## Architecture

```
liquidglasscomponents/
├── packages/vsrc/                  # npm package "vsrc" — the optics engine
│   ├── src/engine.ts               # port of liquid-glass.js: TS, ESM, SSR-safe
│   ├── src/use-liquid-glass.ts     # React hook (ref + options, destroy on unmount)
│   ├── src/glass-surface.tsx       # <GlassSurface> primitive (polymorphic, asChild)
│   ├── src/index.ts
│   ├── LICENSE                     # MIT + upstream attribution
│   ├── tsup.config.ts              # ESM + d.ts
│   └── package.json                # react as peerDependency
├── apps/web/                       # docs site + registry host (Next.js 15, Tailwind v4)
│   ├── app/                        # / landing · /docs · /docs/[slug] · layout
│   ├── registry/vsrc/              # THE LIBRARY SOURCE (what consumers receive)
│   │   ├── theme.css-vars          # registry:style item — brand + glass tokens
│   │   ├── lib/utils.ts            # cn() (registry:lib)
│   │   └── ui/*.tsx                # 12 components (registry:ui)
│   ├── registry.json               # shadcn registry manifest
│   ├── public/r/*.json             # `shadcn build` output (committed)
│   └── components/                 # docs-only chrome (built FROM registry components)
├── pnpm-workspace.yaml · turbo.json · README.md · LICENSE
```

### Engine port (`packages/vsrc`) — from `~/.claude/skills/liquid-glass/resources/liquid-glass.js`
Keep the technique byte-for-byte (displacement map gradient-difference method, 3-pass chromatic filter, sRGB interpolation, ResizeObserver debounce, UA-based Safari/Firefox frosted fallback). Changes:
- ESM + types; **no `window`/`navigator` access at module scope** — lazy feature-detect on first call (SSR safety; current IIFE would crash `next build`).
- `useLiquidGlass(ref, options)` effect hook; `<GlassSurface>` renders div (or `asChild` via `@radix-ui/react-slot`) + hook + material CSS classes.
- Honor `prefers-reduced-transparency` (opaque-ish fallback) and expose `data-vsrc-glass="refract|frosted"` for styling hooks.

### Design tokens (in the `@vsrc/theme` registry:style item, cssVars)
Brand layer (above) + glass material layer: `--glass-tint`, `--glass-tint-opacity`, `--glass-blur`, `--glass-saturate`, `--glass-specular`, `--glass-shadow`, `--glass-radius` (glass panels use 20–28px radius — deliberate departure from the board's flat radii, per "bend the brand"). Both themes.

### Components (registry:ui, Radix behavior, shadcn-mirroring APIs)
`glass-surface` (primitive) · `button` (Slot) · `card` · `input` · `switch` · `tabs` · `tooltip` · `popover` · `dropdown-menu` · `dialog` · `sheet` · `toast` (sonner) · `dock` (glass navbar — the signature piece, mirrors the board's docked nav).
Each item's `dependencies`: `vsrc` + its Radix package; `registryDependencies`: `@vsrc/glass-surface`, utils, theme.
Performance guardrails baked in: refraction on the panel surface only (never nested glass-in-glass), sheets/dialogs cap map size, position animations never regenerate maps.

### Registry mechanics (verified against shadcn docs)
- `registry.json` → `npx shadcn build` → `public/r/{name}.json`.
- Consumer setup documented as: `components.json` → `"registries": { "@vsrc": "https://vsrc.vercel.app/r/{name}.json" }` → `npx shadcn add @vsrc/dock`.

### Docs site (apps/web)
Fully glass (owner's call): glass dock nav, glass cards, glass dialogs — components ARE the docs UI, over a warm-black canvas with rich background media + film grain so refraction is visible. Landing hero (Instrument Serif, giant wordmark, live refraction demo), per-component pages: live preview / install command / props table / a11y notes. Signal red only for primary CTAs.

## Build phases (each ends with observable proof, not "code written")

1. **Scaffold** — pnpm + turbo + TS; `pnpm build` green on empty packages.
2. **Engine** — port + vitest unit tests (option merge, radius resolution, SSR no-crash, fallback path). Proof: tests pass + standalone fixture page shows refraction in Chromium and frosted fallback in WebKit via Playwright screenshots.
3. **Tokens + first components** — theme, glass-surface, button, card; registry.json; `shadcn build`. Proof: `npx shadcn add @vsrc/button` from locally-served registry into a scratch Next.js app renders a refracting button.
4. **Remaining 9 components** — same bar per component (Radix a11y intact: keyboard nav, focus trap, escape).
5. **Docs site** — landing + 13 doc pages, both themes, film grain, registry served.
6. **End-to-end verification** (below) + README, LICENSE, CONTRIBUTING.

Commits proposed at each phase boundary — owner approves each (hooks enforce this anyway). npm publish + Vercel deploy are owner actions at the end (I prepare `npm publish --dry-run` output and vercel config).

## Verification (definition of done)

1. **Fresh-consumer test (the real entry point):** scratch Next.js 15 app outside the repo → configure `@vsrc` namespace against locally-served `public/r/` → `npx shadcn add` all 13 items → `next build` green → page composing dialog+dock+card renders refraction in Chromium.
2. **Cross-browser:** Playwright — Chromium shows `data-vsrc-glass="refract"`, WebKit shows `frosted` fallback; screenshots attached.
3. **Failure paths:** SSR render (no window) doesn't crash; reduced-transparency media query honored; keyboard-only dialog/dropdown operation; axe smoke on docs pages (no critical violations).
4. **Perf sanity:** docs landing with ~6 live glass elements holds 60fps scroll on M-series (Playwright trace / manual check).
5. Engine unit tests + `pnpm build` green across workspace.

## Post-MVP (recorded, not built)

Real domain swap (one env var) · npm org `@vsrc` · React Native package (iOS 26 native glass / expo-blur) · more components · Pro tier/blocks (would introduce first backend) · `/playbook` run after code lands.
