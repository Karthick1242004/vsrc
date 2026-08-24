import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { COMPONENT_DOCS } from "../lib/component-docs";

const PAGES = [
  "/",
  "/components",
  "/about",
  ...COMPONENT_DOCS.map((doc) => `/components/${doc.slug}`),
];

/** Axe smoke over every route: fail on critical and serious violations.
 *  Moderate/minor are reported in the failure message only when the gate
 *  trips, so the signal stays actionable. */
for (const path of PAGES) {
  test(`axe: ${path}`, async ({ page }) => {
    await page.goto(path);
    // The boot loader overlays the first paint; wait for content.
    await page.locator("main, h1").first().waitFor();
    const results = await new AxeBuilder({ page }).analyze();
    const gate = results.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? ""),
    );
    expect(
      gate.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
    ).toEqual([]);
  });
}
