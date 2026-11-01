import type { MetadataRoute } from "next";

import { COMPONENT_DOCS } from "@/lib/component-docs";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/components`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...COMPONENT_DOCS.map((doc) => ({
      url: `${SITE_URL}/components/${doc.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/pro`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ];
}
