import fs from "node:fs/promises";
import path from "node:path";

import { CATALOG } from "@/lib/component-catalog";
import pkg from "@/package.json";
import { allowDownload, ProVerifyUnavailable, verifyProKey } from "@/lib/pro-license";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const PRO_SLUGS = new Set(CATALOG.filter((entry) => entry.tier === "pro").map((entry) => entry.slug));
const SETUP = `${SITE_URL}/pro#setup`;

function fail(status: number, error: string, headers?: HeadersInit) {
  return Response.json({ error }, { status, headers: { "cache-control": "no-store", ...headers } });
}

/** npm packages and registry items a Pro file needs, read off its import lines. */
function dependenciesOf(source: string) {
  const dependencies = new Set<string>();
  const registryDependencies = new Set<string>();
  for (const [, spec = ""] of source.matchAll(/^import[^"']*["']([^"']+)["']/gm)) {
    const local = /^@\/registry\/(vsrc|pro)\/ui\/([a-z0-9-]+)$/.exec(spec);
    if (local) registryDependencies.add(`@${local[1] === "pro" ? "vsrc-pro" : "vsrc"}/${local[2]}`);
    else if (spec === "@/lib/utils") registryDependencies.add("@vsrc/utils");
    else if (!spec.startsWith(".") && !spec.startsWith("@/")) {
      const name = spec.split("/").slice(0, spec.startsWith("@") ? 2 : 1).join("/");
      // Pinned to the range this site builds and tests with, so a buyer never gets an untested major.
      const range = (pkg.dependencies as Record<string, string>)[name];
      if (name !== "react" && name !== "react-dom") dependencies.add(range && !range.startsWith("workspace:") ? `${name}@${range}` : name);
    }
  }
  return { dependencies: [...dependencies], registryDependencies: [...registryDependencies] };
}

/**
 * The key-gated Pro registry: `npx shadcn add @vsrc-pro/<name>` with
 * `Authorization: Bearer <install key>`. Source is read from registry/pro/ui at
 * request time (traced into the function by next.config.ts) and never copied
 * into public/, so the static /r/ registry can never serve it.
 */
export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const slug = (await params).name.replace(/\.json$/, "");
  if (!PRO_SLUGS.has(slug)) return fail(404, `No Pro component named "${slug}".`);

  const ip = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!allowDownload(ip)) return fail(429, "Too many downloads. Try again in an hour.", { "retry-after": "3600" });

  const [scheme, key] = (req.headers.get("authorization") ?? "").split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !key) {
    return fail(401, `This is a Pro component. Add your install key to the @vsrc-pro registry: ${SETUP}`);
  }

  let license;
  try {
    license = await verifyProKey(key.trim());
  } catch (err) {
    if (!(err instanceof ProVerifyUnavailable)) throw err;
    console.error(JSON.stringify({ event: "pro.verify_unavailable", reason: err.message }));
    return fail(503, "Key check is unavailable right now. Try again in a few minutes.");
  }
  if (!license) return fail(403, `This install key is not valid, has been replaced, or its access has ended. ${SETUP}`);

  const source = await fs.readFile(path.join(process.cwd(), "registry", "pro", "ui", `${slug}.tsx`), "utf8");
  const licensee = license.licensee.replace(/[^\w .@-]/g, "").slice(0, 80);
  const stamp = `// vsrc Pro. Licensed to ${licensee}, order ${license.orderId}. Use it in your own and client projects; do not share or resell it. ${SITE_URL}/pro#licence\n`;

  console.info(JSON.stringify({ event: "pro.download", item: slug, licensee, orderId: license.orderId, ip }));
  return Response.json(
    {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: slug,
      type: "registry:ui",
      ...dependenciesOf(source),
      files: [{ path: `registry/pro/ui/${slug}.tsx`, content: stamp + source, type: "registry:ui" }],
    },
    { headers: { "cache-control": "private, no-store" } },
  );
}
