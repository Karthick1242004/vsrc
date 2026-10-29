# lab-archive

Retired test benches, kept as fully commented-out source. Nothing here is compiled:
the folder sits outside `app/` (no routes), `tsconfig.json` excludes it, and
`app/globals.css` keeps Tailwind from scanning it.

| File | What it was |
|---|---|
| `lib/clone-glass.ts` | Cross-engine refraction: an SVG filter on a live DOM copy of the scene, instead of `backdrop-filter: url()`. |
| `components/site/clone-glass-lab.tsx`, `app/lab/clone-glass/page.tsx` | `/lab/clone-glass` manual test bench (drag, mutation, scroll, resize). |
| `components/site/svg-filter-diag.tsx`, `app/lab/svg-diag/page.tsx` | `/lab/svg-diag` WebKit diagnostic tiles (feImage units, compositing triggers). |

Why it was retired (2026-10-29): clone-glass did refract in Safari 27, but Safari
paints SVG filters in software, so the bench ran at 8 fps. Shipping policy stays:
Chromium refracts, Safari and Firefox get the frosted material.

To restore a file: move it back to the path named in its first line, delete that
line, and strip the leading `// ` from every other line:

```sh
tail -n +2 lab-archive/lib/clone-glass.ts | sed 's#^// \{0,1\}##' > lib/clone-glass.ts
```
