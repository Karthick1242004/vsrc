// Runs in node (no DOM): the engine must be importable and inert during SSR.
import { describe, expect, it } from "vitest";
import {
  GLASS_PRESETS,
  canRefract,
  liquidGlass,
  mergeGlass,
  prefersReducedTransparency,
} from "../src/engine";

describe("SSR safety (no window/document)", () => {
  it("imports without touching the DOM and reports no support", () => {
    expect(canRefract()).toBe(false);
    expect(prefersReducedTransparency()).toBe(false);
  });

  it("returns an inert instance for a null element", () => {
    const glass = liquidGlass(null);
    expect(glass.mode).toBe("none");
    expect(glass.supported).toBe(false);
    expect(() => {
      glass.refresh();
      glass.destroy();
    }).not.toThrow();
  });

  it("returns an inert instance when window is undefined even with an element-like value", () => {
    const fake = {} as HTMLElement;
    const glass = liquidGlass(fake);
    expect(glass.mode).toBe("none");
    expect(() => glass.destroy()).not.toThrow();
  });
});

describe("mergeGlass", () => {
  const base = GLASS_PRESETS.regular;

  it("returns the base untouched when no override is given", () => {
    expect(mergeGlass(base)).toEqual(base);
  });

  it("returns false to disable refraction", () => {
    expect(mergeGlass(base, false)).toBe(false);
  });

  it("lets a string preset replace the base wholesale", () => {
    expect(mergeGlass(base, "subtle")).toEqual({ ...base, ...GLASS_PRESETS.subtle });
    // A defining key of the preset must win over the base.
    expect((mergeGlass(base, "subtle") as { scale: number }).scale).toBe(GLASS_PRESETS.subtle.scale);
  });

  it("merges an options object over the base", () => {
    const merged = mergeGlass(base, { scale: -10 });
    expect(merged).toEqual({ ...base, scale: -10 });
  });

  it("does NOT spread a preset string into indexed characters", () => {
    const merged = mergeGlass(base, "heavy") as Record<string, unknown>;
    expect(merged["0"]).toBeUndefined();
  });
});
