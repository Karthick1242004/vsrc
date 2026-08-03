# V-/Src — liquid glass components for React

**Glass that bends what's behind it.** Open-source, shadcn-compatible React components with real refraction: a displacement-map optics engine bends the backdrop at every pane's rim — with a faint prism fringe — instead of just blurring it.

**Docs & live demos:** https://vsrc-weld.vercel.app · **Status:** beta

## Why this exists

Every glassmorphism library ships `backdrop-filter: blur()`. vsrc ships physics: an SVG displacement map built per-surface drives a `backdrop-filter` that visibly refracts the content behind the glass at its edge band, staggered across color channels for chromatic dispersion. Blur is the fallback, not the effect.

## Install components

Components are distributed shadcn-registry style — source lands in your project, you own the code.

```jsonc
// components.json — add the registry (use a Radix-based style, e.g. "new-york";
// the Base UI "base-nova" style is incompatible with vsrc's asChild composition)
{
  "registries": {
    "@vsrc": "https://vsrc-weld.vercel.app/r/{name}.json"
  }
}
```

```bash
npx shadcn add @vsrc/button
```

Each component pulls its tree automatically: `glass-surface` (the refraction primitive), `theme` (tokens + material CSS), and `utils`.

## The engine

The optics live in [`packages/vsrc`](./packages/vsrc) — a framework-agnostic core with a React hook and primitive at `vsrc/react`, published to npm as [`vsrc`](https://www.npmjs.com/package/vsrc). Components depend on it; you can also use it raw on any element.

## Browser support

| Mode | Where | What you get |
|---|---|---|
| `refract` | Chromium | Real displacement-map refraction + chromatic fringe |
| `frosted` | Safari, Firefox | Barely-there blur + CSS sheen (they parse but never paint SVG backdrop filters) |
| `reduced` | `prefers-reduced-transparency` | No transparency; opaque surfaces |
| `none` | SSR | Inert; safe everywhere |

The mode is exposed as `data-vsrc-glass` on every surface, so you can style each tier deliberately.

## Repo layout

```
packages/vsrc   # the optics engine (npm package)
apps/web        # docs site + component registry (source of the installable components)
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) — the component pattern is strict on purpose; start with the authoring recipe it references before writing any code.

## License

[MIT](./LICENSE). The engine is a TypeScript port of [liquid-glass.js](https://github.com/deepika-builds/liquid-glass) (MIT).
