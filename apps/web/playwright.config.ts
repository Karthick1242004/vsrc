import { defineConfig, devices } from "@playwright/test";

// The site is fully static — `next build` must have run before these tests.
// Chromium only: it is the one engine that paints real refraction, and the
// suite asserts the data-vsrc-glass attribute, not pixels (WebKit computes but
// never paints backdrop-filter under Playwright — see the engine e2e notes).
export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://127.0.0.1:3100" },
  webServer: {
    command: "pnpm exec next start -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
