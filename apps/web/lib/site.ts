/**
 * Canonical site constants for metadata, sitemap, robots, and structured data.
 * The origin is env-driven so a real domain is a one-variable swap on Vercel;
 * the fallback is the current live deploy. Trailing slash stripped so
 * `${SITE_URL}${path}` never doubles up.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vsrc-weld.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "vsrc";

export const SITE_TAGLINE = "Liquid glass components for React";

export const SITE_DESCRIPTION =
  "Open-source, shadcn-compatible React components with real refraction: a displacement-map optics engine bends what's behind the glass, not just blurs it.";

export const AUTHOR = {
  name: "Karthickrajan Somasundaram",
  url: "https://github.com/Karthick1242004",
};
