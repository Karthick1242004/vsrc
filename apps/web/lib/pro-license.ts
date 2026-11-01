import { createHash } from "node:crypto";

/**
 * Pro install-key checks against the store (vsrc.co.in), which owns purchases
 * and keys. Server-only: VSRC_PRO_VERIFY_SECRET must never reach a client bundle.
 */
export interface ProLicense {
  licensee: string;
  orderId: string;
}

/** The store unreachable or unconfigured: the caller answers 503, never "invalid key". */
export class ProVerifyUnavailable extends Error {}

/** Keys are `vsrc_pro_` + 24 random bytes in base64url (the store's generateProKey). */
const KEY_FORMAT = /^vsrc_pro_[A-Za-z0-9_-]{32}$/;
const VALID_TTL_MS = 5 * 60_000;
const INVALID_TTL_MS = 60_000;
const MAX_ENTRIES = 5_000;

// shortcut: per-instance memory, so a revoked key keeps working on a warm instance
// for up to 5 minutes and limits reset on cold start. Move to Redis/KV if abuse shows up.
const verified = new Map<string, { until: number; license: ProLicense | null }>();
const hits = new Map<string, number[]>();

function remember<V>(map: Map<string, V>, id: string, value: V) {
  if (map.size >= MAX_ENTRIES) map.clear();
  map.set(id, value);
}

/** Sliding-window limit per caller: 120 downloads an hour covers installing all 35 twice over. */
export function allowDownload(ip: string, limit = 120, windowMs = 3_600_000): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => t > now - windowMs);
  if (recent.length >= limit) return false;
  recent.push(now);
  remember(hits, ip, recent);
  return true;
}

export async function verifyProKey(key: string): Promise<ProLicense | null> {
  if (!KEY_FORMAT.test(key)) return null;
  const store = process.env.VSRC_STORE_URL;
  const secret = process.env.VSRC_PRO_VERIFY_SECRET;
  if (!store || !secret) throw new ProVerifyUnavailable("VSRC_STORE_URL or VSRC_PRO_VERIFY_SECRET is not set");

  const id = createHash("sha256").update(key).digest("hex");
  const cached = verified.get(id);
  if (cached && cached.until > Date.now()) return cached.license;

  const res = await fetch(`${store.replace(/\/$/, "")}/api/pro/verify`, {
    method: "POST",
    headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
    body: JSON.stringify({ key }),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  }).catch((err: unknown) => {
    throw new ProVerifyUnavailable(err instanceof Error ? err.message : "store unreachable");
  });
  if (res.status === 403) {
    remember(verified, id, { until: Date.now() + INVALID_TTL_MS, license: null });
    return null;
  }
  if (!res.ok) throw new ProVerifyUnavailable(`store answered ${res.status}`);

  const data = ((await res.json()) as { data?: { licensee?: unknown; orderId?: unknown } }).data;
  if (typeof data?.licensee !== "string" || typeof data.orderId !== "string") {
    throw new ProVerifyUnavailable("store returned an unexpected body");
  }
  const license = { licensee: data.licensee, orderId: data.orderId };
  remember(verified, id, { until: Date.now() + VALID_TTL_MS, license });
  return license;
}
