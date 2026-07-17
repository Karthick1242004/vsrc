// @vitest-environment jsdom
// jsdom cannot do SVG-filtered backdrops (and its canvas readback throws),
// which makes it a faithful stand-in for the unsupported-browser path.
import { afterEach, describe, expect, it, vi } from "vitest";
import { DATA_ATTR, GLASS_PRESETS, canRefract, liquidGlass, resolveRadius } from "../src/engine";

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

describe("capability detection", () => {
  it("reports no refraction support in jsdom", () => {
    expect(canRefract()).toBe(false);
  });
});

describe("frosted fallback path", () => {
  it("applies the fallback and marks the element", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const glass = liquidGlass(el);
    expect(glass.mode).toBe("frosted");
    expect(glass.supported).toBe(false);
    expect(el.getAttribute(DATA_ATTR)).toBe("frosted");
    expect(el.classList.contains("lg-fallback")).toBe(true);
  });

  it("destroy() removes everything it added", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const glass = liquidGlass(el);
    glass.destroy();
    expect(el.getAttribute(DATA_ATTR)).toBeNull();
    expect(el.classList.contains("lg-fallback")).toBe(false);
    expect(el.style.backdropFilter).toBeFalsy();
  });

  it("applies a named preset's fallback blur/saturate", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    liquidGlass(el, "heavy");
    const { fallbackBlur, saturate } = GLASS_PRESETS.heavy;
    expect(el.style.backdropFilter).toBe(`blur(${fallbackBlur}px) saturate(${saturate})`);

    const el2 = document.createElement("div");
    document.body.appendChild(el2);
    liquidGlass(el2, "subtle");
    const subtle = GLASS_PRESETS.subtle;
    expect(el2.style.backdropFilter).toBe(`blur(${subtle.fallbackBlur}px) saturate(${subtle.saturate})`);
  });
});

describe("reduced-transparency path", () => {
  it("applies no backdrop effect when the user prefers reduced transparency", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("prefers-reduced-transparency"),
        media: query,
      })),
    );
    const el = document.createElement("div");
    document.body.appendChild(el);
    const glass = liquidGlass(el);
    expect(glass.mode).toBe("reduced");
    expect(el.getAttribute(DATA_ATTR)).toBe("reduced");
    // jsdom returns undefined for properties it doesn't know; falsy = not set
    expect(el.style.backdropFilter).toBeFalsy();
    expect(el.classList.contains("lg-fallback")).toBe(false);
    glass.destroy();
    expect(el.getAttribute(DATA_ATTR)).toBeNull();
  });
});

describe("resolveRadius", () => {
  it("uses the override when provided", () => {
    const el = document.createElement("div");
    expect(resolveRadius(el, 100, 100, 42)).toBe(42);
  });

  it("reads px border-radius from computed style", () => {
    const el = document.createElement("div");
    // jsdom doesn't expand the border-radius shorthand; set the longhand
    el.style.borderTopLeftRadius = "28px";
    document.body.appendChild(el);
    expect(resolveRadius(el, 100, 100, null)).toBe(28);
  });

  it("resolves percentage radii against the smaller side", () => {
    const el = document.createElement("div");
    el.style.borderTopLeftRadius = "50%";
    document.body.appendChild(el);
    expect(resolveRadius(el, 100, 200, null)).toBe(50);
  });

  it("falls back to 0 with no radius set", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    expect(resolveRadius(el, 100, 100, null)).toBe(0);
  });
});
