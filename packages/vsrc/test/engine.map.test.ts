import { describe, expect, it } from "vitest";
import { fillDisplacementMap } from "../src/engine";

// Map channels: R = X offset, B = Y offset, 128 = neutral. With a negative
// scale (every shipped preset) a value below 128 on the right-hand rim reads
// outward, past the edge.
function map(w: number, h: number, { radius = 24, border = 0.07, mapBlur = 12, magnify = 1, scale = -112 } = {}) {
  const data = new Uint8ClampedArray(w * h * 4);
  fillDisplacementMap(data, w, h, radius, border, mapBlur, magnify, scale);
  return (x: number, y: number) => {
    const i = (y * w + x) * 4;
    return { r: data[i]!, b: data[i + 2]!, a: data[i + 3]! };
  };
}

describe("fillDisplacementMap", () => {
  it("is neutral past the rim band when magnify is 1", () => {
    const px = map(400, 240);
    expect(px(200, 120)).toEqual({ r: 128, b: 128, a: 255 });
    expect(px(120, 120)).toEqual({ r: 128, b: 128, a: 255 });
  });

  it("peaks at the edge and points along the outward normal", () => {
    const px = map(400, 240);
    expect(px(399, 120).r).toBeLessThan(10); // right rim, X only
    expect(px(399, 120).b).toBe(128);
    expect(px(0, 120).r).toBeGreaterThan(245); // left rim mirrors it
    expect(px(200, 0).b).toBeGreaterThan(245); // top rim, Y only
    expect(px(200, 0).r).toBe(128);
  });

  it("falls off hard: a third of the way into the band is under half the peak", () => {
    const px = map(400, 240, { border: 0, mapBlur: 15 }); // 30px band
    const atEdge = 128 - px(399, 120).r;
    const inside = 128 - px(389, 120).r;
    expect(inside).toBeGreaterThan(0);
    expect(inside / atEdge).toBeLessThan(0.5);
  });

  it("turns the normal smoothly round a corner, with no mitre seam", () => {
    const px = map(400, 240, { radius: 8, border: 0, mapBlur: 20 }); // band 40 > radius
    // Either side of the corner diagonal, X and Y offsets must stay close.
    const a = px(385, 224);
    const b = px(384, 225);
    expect(Math.abs(a.r - b.r)).toBeLessThan(6);
    expect(Math.abs(a.b - b.b)).toBeLessThan(6);
    // And on the diagonal both axes are displaced, not just one.
    const diag = px(384, 224);
    expect(128 - diag.r).toBeGreaterThan(5);
    expect(128 - diag.b).toBeGreaterThan(5);
  });

  it("magnifies the interior toward the centre, by the magnify factor", () => {
    const scale = -112;
    const px = map(400, 240, { magnify: 1.05, scale });
    // 100px right of centre: offset = −100 × (1 − 1/1.05) ≈ −4.76px, i.e. read
    // nearer the centre. R = 0.5 + offset / scale.
    const r = px(299, 120).r;
    const offset = scale * (r / 255 - 0.5);
    expect(offset).toBeCloseTo(-4.76, 0);
    expect(px(100, 120).r).toBeLessThan(128); // mirrored on the left
  });

  it("stays in range on tiny panes and with a zero scale", () => {
    const px = map(44, 24, { radius: 12, border: 0.22, mapBlur: 5, magnify: 1.05, scale: 0 });
    for (let y = 0; y < 24; y++) for (let x = 0; x < 44; x++) expect(px(x, y).a).toBe(255);
    // Row 12 is half a pixel off a 24px pane's centre line: within one level.
    expect(Math.abs(px(22, 12).r - 128)).toBeLessThanOrEqual(1);
    expect(Math.abs(px(22, 12).b - 128)).toBeLessThanOrEqual(1);
  });
});
