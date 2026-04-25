import type { MetadataRoute } from "next";
import { getAllCountrySeo, SITE_URL } from "@/lib/seo";
import { LOCALE_CODES } from "@/lib/i18n/locales";
import { localePath } from "@/lib/i18n/urls";

export const dynamic = "force-static";

/**
 * The sitemap lists every public URL across every locale, with priority
 * tilted towards English (the canonical version) and the home page. Each
 * URL also lists its `alternates.languages` so Google can discover the
 * full hreflang graph from the sitemap alone — a belt-and-suspenders
 * complement to the in-page `<link rel="alternate">` tags.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const countries = getAllCountrySeo();
  const now = new Date().toISOString();

  // Default-locale paths that should exist in every language.
  const localizedDefaultPaths: ReadonlyArray<{
    readonly path: string;
    readonly priority: number;
    readonly changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/compare", priority: 0.9, changeFrequency: "weekly" },
    { path: "/compare-countries", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/methodology", priority: 0.6, changeFrequency: "monthly" },
    ...countries.map((c) => ({
      path: `/${c.slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    ...countries.map((c) => ({
      path: `/compare/${c.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];

  const localizedEntries: MetadataRoute.Sitemap = localizedDefaultPaths.flatMap(
    ({ path, priority, changeFrequency }) =>
      LOCALE_CODES.map((locale) => {
        // Lower priority slightly for non-default locales so Google still
        // ranks the canonical English version highest.
        const localePriority =
          locale === "en"
            ? priority
            : Math.max(0.1, +(priority - 0.05).toFixed(2));
        return {
          url: `${SITE_URL}${localePath(locale, path)}`,
          lastModified: now,
          changeFrequency,
          priority: localePriority,
          alternates: {
            languages: Object.fromEntries(
              LOCALE_CODES.map((alt) => {
                const bcp47 = alt === "zh-cn" ? "zh-CN" : alt;
                return [bcp47, `${SITE_URL}${localePath(alt, path)}`];
              }),
            ),
          },
        };
      }),
  );

  return localizedEntries;
}
