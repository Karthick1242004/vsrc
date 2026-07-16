// Runs in node (no DOM): the engine must be importable and inert during SSR.
import { describe, expect, it } from "vitest";
import { canRefract, liquidGlass, prefersReducedTransparency } from "../src/engine";

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
