import type { MetadataRoute } from "next";
import { getAllCountrySeo, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const countries = getAllCountrySeo();
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/methodology`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const countryPages: MetadataRoute.Sitemap = countries.flatMap((c) => [
    {
      url: `${SITE_URL}/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/compare/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]);

  return [...staticPages, ...countryPages];
}
