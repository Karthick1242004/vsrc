# Optics notes

How the engine's optics are shaped, and what was learned from other glass work.
Updated 2026-10-29.

## Where glass refracts

| Engine | Mode | Why |
|---|---|---|
| Chromium (Chrome, Edge, Arc, Brave) | `refract` | Paints SVG filters through `backdrop-filter: url()`. |
| WebKit (Safari, every iOS browser) | `frosted` | Doesn't paint `backdrop-filter: url()` (WebKit bug 245510). |
| Gecko (Firefox) | `frosted` | Same gap (Gecko bug 1961378). |

Tried and dropped (October 2026): **clone-glass**, which refracts a hidden live copy
of the page with a plain CSS `filter: url()`. Safari 27 does paint that, but it runs
SVG filters in software, so a two-pane test page ran at 8 fps. The code is archived,
commented out and uncompiled, in `apps/web/lab-archive/`.

WebGL glass, such as the home page lens demo, works in every engine, but it only
bends a picture it drew itself. Browsers have no way to turn live DOM into a
texture, so WebGL can't refract real components.

## What the map does

`fillDisplacementMap` writes one pixel per CSS pixel:

- **Rim.** Each pixel is displaced along the edge normal by `(1 − t)^2.4` of the
  peak (`scale / 2`), where `t` runs from 0 at the edge to 1 at the inner edge of
  the band. The band is `border × short side + 2 × mapBlur`, capped at half the
  short side. With the shipped negative scales, the rim reads **outward**: it
  shows what lies just past the edge, gathered in. That is what makes text curve
  at the edge of real glass.
- **Corners.** The distance comes from the true rounded rectangle, so the bend
  follows the corner exactly. Normals come from the same box with its radius
  raised to the band width, which stops a mitre seam forming along each corner
  diagonal.
- **Interior.** A uniform magnification (`magnify`, 1.05 by default) reads
  slightly toward the centre.
- **Fringe.** Unchanged: three displacement passes at `scale`, `scale + chroma`
  and `scale + 2 × chroma`. Because the fringe scales with the offset, it is
  widest at the rim.

The material CSS adds a 1.5px lit rim in `refract` mode: bright where the edge
faces the top-left light, with a faint catch on the opposite edge.

## Ideas taken from the Bencho glass bubble

The bencho.dev "Glass bubble" block is a WebGL shader over a photograph. None of its
code is in this repo. These ideas were reimplemented here:

1. **One edge drives everything.** A signed distance field sets the bend, the
   fringe and the light, so all three follow the same edge. Before this, our map
   was a blurred inset rectangle over two linear ramps. Its bend didn't follow
   rounded corners, and the fringe smeared widely at the top edge.
2. **A hard rim falloff.** `(1 − t)^2.4` instead of a Gaussian blur edge.
3. **The rim reads outward.** It gathers what is just outside the glass instead
   of stretching the interior toward the edge.
4. **A magnified middle.**
5. **Directional rim light.** A bright edge facing the light and a weaker catch
   opposite, instead of a uniform hairline.

Not taken, and why:

- **Spring follow and stretch on drag.** The engine doesn't move panes. Draggable
  demos, such as the lens demo and the cursor, could adopt it later.
- **A drop shadow drawn by the shader.** The material already has
  `--glass-shadow`.
- **Rendering over a picture.** See "Where glass refracts" above.

## Cost

The map is filled pixel by pixel in JavaScript on mount and on resize. Resizes
are debounced by 120 ms. A 1200 × 800 pane is about 1M pixels. Sheet and dialog
are the largest maps in the registry.
