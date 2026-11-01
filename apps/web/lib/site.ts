/**
 * Canonical site constants for metadata, sitemap, robots, and structured data.
 * The origin is env-driven so a real domain is a one-variable swap on Vercel;
 * the fallback is the current live deploy. Trailing slash stripped so
 * `${SITE_URL}${path}` never doubles up.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://glass.vsrc.co.in"
).replace(/\/$/, "");

export const SITE_NAME = "vsrc";

export const SITE_TAGLINE = "Liquid glass components for React";

export const SITE_DESCRIPTION =
  "Open-source, shadcn-compatible React components with real refraction: a displacement-map optics engine bends what's behind the glass, not just blurs it.";

export const AUTHOR = {
  name: "Karthickrajan Somasundaram",
  url: "https://github.com/Karthick1242004",
};

/** Pro is sold on the V-/Src store. These slugs must match the store's product rows. */
export const PRO_PLANS = [
  {
    name: "Yearly",
    price: "$49",
    cadence: "per year",
    note: "Every Pro component and every update while your plan is active. What you installed stays yours if you stop.",
    href: "https://vsrc.co.in/drops/components/glass-pro-yearly",
  },
  {
    name: "Lifetime",
    price: "$99",
    cadence: "one payment",
    note: "Every Pro component and every future update, with no renewal.",
    href: "https://vsrc.co.in/drops/components/glass-pro-lifetime",
  },
] as const;
