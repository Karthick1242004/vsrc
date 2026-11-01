import { expect, test } from "@playwright/test";

/** The Pro registry must refuse everyone without a valid key, and the public
 *  static registry must never contain Pro source. A valid-key download needs
 *  the store, so it is proven by hand (see HANDOFF), not here. */
test("pro registry: no key is 401", async ({ request }) => {
  const res = await request.get("/r/pro/glass-loupe.json");
  expect(res.status()).toBe(401);
  expect(JSON.stringify(await res.json())).not.toContain("export");
});

test("pro registry: malformed key is 403 without asking the store", async ({ request }) => {
  const res = await request.get("/r/pro/glass-loupe.json", {
    headers: { Authorization: "Bearer not-a-real-key" },
  });
  expect(res.status()).toBe(403);
});

test("pro registry: unknown and free names are 404", async ({ request }) => {
  expect((await request.get("/r/pro/no-such-thing.json")).status()).toBe(404);
  expect((await request.get("/r/pro/button.json")).status()).toBe(404);
  expect((await request.get("/r/pro/..%2F..%2Fpackage.json")).status()).toBe(404);
});

test("public registry never serves pro source", async ({ request }) => {
  expect((await request.get("/r/glass-loupe.json")).status()).toBe(404);
  const index = await (await request.get("/r/registry.json")).text();
  expect(index).not.toContain("glass-loupe");
});
