# vsrc

Liquid glass optics engine — **real refraction for the web**, not blur.

`vsrc` builds an SVG displacement-map `backdrop-filter` that visibly bends what's behind an element at its rim, with a faint chromatic fringe. Framework-agnostic core, optional React hook and primitive at `vsrc/react`. Powers the [vsrc component registry](https://vsrc-weld.vercel.app) — shadcn-compatible glass components you install with `npx shadcn add @vsrc/button`.

## Install

```bash
npm install vsrc
```

React is an optional peer dependency — the core engine runs without it.

## Vanilla

```ts
import { liquidGlass } from "vsrc";

const glass = liquidGlass(document.querySelector(".panel"), {
  scale: -112,   // displacement strength; negative = magnifying bulge
  chroma: 6,     // per-channel scale stagger → prism fringe at the rim
  blur: 3,       // backdrop blur inside the pane
  saturate: 1.5,
});

glass.mode;      // "refract" | "frosted" | "reduced" | "none"
glass.destroy(); // removes filter, observers, and attributes
```

## React

```tsx
import { useLiquidGlass, GlassSurface, GLASS_PRESETS } from "vsrc/react";

// Hook — node-driven (element in state, not a ref) so the effect re-applies
// the moment a portaled node attaches
function Panel() {
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);
  const mode = useLiquidGlass(node, "regular");
  return <div ref={setNode} className="rounded-3xl p-6" data-mode={mode} />;
}

// Primitive — a styled div that carries the effect
<GlassSurface glass="subtle">Content</GlassSurface>
<GlassSurface glass={{ scale: -120, blur: 1 }}>Tuned</GlassSurface>
<GlassSurface glass={false}>Effect disabled</GlassSurface>
```

Presets: `subtle`, `regular`, `heavy` (`GLASS_PRESETS`). `mergeGlass(base, glass)` resolves a preset name (replaces), an options object (merges), or `false` (disables).

## Fallback ladder

The engine degrades honestly — every mode is surfaced as `data-vsrc-glass` for styling:

| Mode | When | What renders |
|---|---|---|
| `refract` | Chromium | Displacement-map backdrop filter with chromatic fringe |
| `frosted` | Safari, Firefox (they parse but never paint SVG backdrop filters) | `blur() saturate()` + CSS sheen |
| `reduced` | `prefers-reduced-transparency: reduce` | No backdrop effect; style opaque via the attribute |
| `none` | SSR / no element | Inert instance, safe to call anywhere |

`canRefract()` and `prefersReducedTransparency()` are exported for your own branching.

## Options

| Option | Default | What it does |
|---|---|---|
| `scale` | `-112` | Displacement strength; negative = magnifying bulge |
| `chroma` | `6` | Channel stagger for the prism fringe; `0` disables |
| `border` | `0.07` | Edge-band width as a fraction of the short side |
| `mapBlur` | `12` | Curvature of the bulge: small = hard rim, large = dome |
| `blur` | `3` | Backdrop blur inside the pane |
| `saturate` | `1.5` | Backdrop saturation boost |
| `radius` | `null` | Corner radius override (auto-read from computed style) |
| `fallbackBlur` | `3` | Blur used in `frosted` mode — kept barely-there so the backdrop stays vivid |

## License

MIT — the engine is a TypeScript port of [liquid-glass.js](https://github.com/deepika-builds/liquid-glass) (MIT). See [LICENSE](./LICENSE).
