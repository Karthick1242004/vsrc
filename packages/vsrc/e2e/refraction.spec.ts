import { test, expect } from "@playwright/test";

// Phase-2 proof (PLAN.md): the built engine, loaded by a plain static page,
// must pick real refraction in Chromium and the frosted fallback in WebKit.
test("applies the browser-appropriate glass mode", async ({ page, browserName }) => {
  await page.goto("/e2e/fixture.html");
  const panel = page.locator("#panel");

  if (browserName === "webkit") {
    await expect(panel).toHaveAttribute("data-vsrc-glass", "frosted");
    const backdrop = await panel.evaluate(
      (el) =>
        el.style.backdropFilter ||
        (el.style as CSSStyleDeclaration & { webkitBackdropFilter?: string }).webkitBackdropFilter ||
        "",
    );
    expect(backdrop).toContain("blur(");
    expect(backdrop).not.toContain("#vsrc-lg-");
  } else {
    await expect(panel).toHaveAttribute("data-vsrc-glass", "refract");
    const backdrop = await panel.evaluate((el) => el.style.backdropFilter);
    // Chromium's CSSOM serializes url(#id) as url("#id") — match the fragment.
    expect(backdrop).toMatch(/url\("?#vsrc-lg-/);
    // The filter must actually exist in the DOM, not just be referenced.
    await expect(page.locator("svg filter[id^='vsrc-lg-']")).toHaveCount(1);
  }

  await page.screenshot({ path: `e2e/screenshots/${browserName}.png` });
});
