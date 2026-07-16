# Adding a vsrc registry component — the pattern

`button` is the reference implementation. Copy its shape exactly; do not invent new
patterns. Read `ui/glass-surface.tsx` and `ui/button.tsx` before writing anything.

## Files per component (exactly two edits + one demo)

1. `registry/vsrc/ui/<name>.tsx` — the component.
2. An entry in `registry.json` (see the `button` item; keep the same field order).
3. A usage example added to the docs site so it renders live.

## Component conventions (all mandatory)

- `"use client"` at top. Imports: Radix package for behavior, `useLiquidGlass` +
  `type LiquidGlassOptions` from `vsrc/react`, `glassMaterial` from
  `@/registry/vsrc/ui/glass-surface`, `cn` from `@/lib/utils`.
- The glass element is the component's own surface (panel, content, trigger — whatever
  the "pane" is). **Never nest glass inside glass**; interior elements are plain.
- Define a `const <NAME>_OPTICS: LiquidGlassOptions` preset sized to the surface:
  small controls (buttons, switches) ≈ `{ scale: -56, chroma: 4, border: 0.16,
  mapBlur: 8, blur: 2, saturate: 1.4 }`; large panels (dialog, sheet, card) can take
  stronger scale (−80…−112) and default border/mapBlur. Big surfaces: keep maps cheap —
  no refraction on elements that animate position (see PLAN.md perf guardrails).
- Public prop `glass?: LiquidGlassOptions | false` merged as
  `{ ...PRESET, ...glass }`; `false` (and non-glass variants) must pass `false` to the
  hook so no filter is built.
- Ref pattern: local ref + composed callback ref, exactly as in `button.tsx`
  (React 19 style — `ref` comes through props, no `forwardRef`).
- Styling: cva variants where variants exist; tokens only (`--glass-*`, theme colors);
  `data-slot="<name>"`; visible `focus-visible` ring; `rounded-(--glass-radius)` for
  panels, `rounded-full` for pills.
- Radix behavior must survive intact: keyboard nav, focus trap, escape, aria. Do not
  re-implement behavior Radix provides.

## registry.json entry

`dependencies`: `vsrc` + the Radix package(s) + `class-variance-authority` if used.
`registryDependencies`: `["@vsrc/glass-surface"]` (glass-surface itself depends on
`@vsrc/theme` + `@vsrc/utils`). Then run `pnpm registry:build` in `apps/web`.

## Brand rules that bind components

- `--signal` (#ff3831) is display/decoration only — never behind or as small text.
- One `primary` (red) action per view; everything else clear glass or ghost.
- The V-/Src wordmark/monogram is never placed behind glass (glass distorts; mark
  hygiene forbids distortion).

## Verification bar per component (do all, paste output)

1. `pnpm build` at root (turbo: engine + site) green.
2. `pnpm registry:build` in `apps/web` green; item present in `public/r/<name>.json`.
3. Component rendered on the docs site: in Chromium every glass element carries
   `data-vsrc-glass="refract"`; in WebKit `"frosted"`; non-glass variants carry none.
4. Keyboard-only operation (tab, arrows, escape where applicable).
5. Known tooling limit: Playwright's WebKit computes but does not PAINT
   backdrop-filter — frosted visuals are confirmed in real Safari by the owner, not
   by screenshot. Do not burn time re-debugging this.
