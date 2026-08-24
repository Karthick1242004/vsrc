import { expect, test } from "@playwright/test";

import { COMPONENT_DOCS } from "../lib/component-docs";

/**
 * Data-driven refraction proof: every component's docs page must show its
 * glass surface carrying data-vsrc-glass="refract" in Chromium. The doc
 * registry supplies the selector and, for portaled panes, the interaction
 * that reveals them — adding a component to the registry adds its test.
 *
 * Direct surfaces are scoped inside the demo tile ([data-demo=slug]) so site
 * chrome (the layout dock, header buttons) can't satisfy the assertion.
 * Portaled panes mount at body level and are asserted page-globally.
 */
for (const doc of COMPONENT_DOCS) {
  const { surface, open, none } = doc.e2e;

  test(`${doc.slug}: refracts on its docs page`, async ({ page }) => {
    await page.goto(`/components/${doc.slug}`);

    if (none) {
      // Deliberately no displacement surface (position-animating material).
      // Fire the demo and prove the surface exists WITHOUT an engine mode.
      await page.locator(`[data-demo="${doc.slug}"] [data-slot="button"]`).click();
      const toast = page.locator("[data-sonner-toast]").first();
      await expect(toast).toBeVisible();
      await expect(toast).not.toHaveAttribute("data-vsrc-glass", /.*/);
      return;
    }

    if (open) {
      const target = page.locator(open.target).first();
      if (open.action === "hover") await target.hover();
      else if (open.action === "context-menu") await target.click({ button: "right" });
      else await target.click();
    }

    const locator = open
      ? page.locator(surface!).first()
      : page.locator(`[data-demo="${doc.slug}"] ${surface}`).first();
    await expect(locator).toHaveAttribute("data-vsrc-glass", "refract");
  });
}
