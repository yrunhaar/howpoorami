import type { MetadataRoute } from "next";
import { getAllCountrySeo, SITE_URL } from "@/lib/seo";
import { LOCALE_CODES, NON_DEFAULT_LOCALES } from "@/lib/i18n/locales";
import { localePath } from "@/lib/i18n/urls";

export const dynamic = "force-static";

/**
 * The sitemap lists every public URL across every locale, with priority
 * tilted towards English (the canonical version) and the home page. Each
 * URL also lists its `alternates.languages` so Google can discover the
 * full hreflang graph from the sitemap alone — a belt-and-suspenders
 * complement to the in-page `<link rel="alternate">` tags.
 *
 * Note on conflicts: at the URL root, country slugs that overlap with
 * locale codes (de, fr, it, es, pt) are owned by the locale interpretation
 * (e.g. `/de` = German home, NOT the English Germany page). For English,
 * we skip generating those country slugs to avoid duplicate URL entries
 * pointing at different content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const countries = getAllCountrySeo();
  const now = new Date().toISOString();

  const conflictingCountrySlugs = new Set<string>(NON_DEFAULT_LOCALES);

  // Default-locale paths that should exist in every language.
  const localizedDefaultPaths: ReadonlyArray<{
    readonly path: string;
    readonly priority: number;
    readonly changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/how-long", priority: 0.9, changeFrequency: "weekly" },
    { path: "/compare-countries", priority: 0.8, changeFrequency: "weekly" },
    { path: "/report", priority: 0.9, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/methodology", priority: 0.6, changeFrequency: "monthly" },
    ...countries.map((c) => ({
      path: `/${c.slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    ...countries.map((c) => ({
      path: `/how-long/${c.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];

  const isEnglishOnlyConflict = (path: string): boolean => {
    // Top-level country slug like `/de`, `/fr`, `/it`, `/es`, `/pt` — these
    // exist only at non-English locales; English doesn't have them as
    // country pages anymore (root locale wins).
    const segments = path.split("/").filter(Boolean);
    return segments.length === 1 && conflictingCountrySlugs.has(segments[0]);
  };

  const localizedEntries: MetadataRoute.Sitemap = localizedDefaultPaths.flatMap(
    ({ path, priority, changeFrequency }) => {
      const englishCollides = isEnglishOnlyConflict(path);
      return LOCALE_CODES.flatMap((locale) => {
        if (locale === "en" && englishCollides) return [];
        const localePriority =
          locale === "en"
            ? priority
            : Math.max(0.1, +(priority - 0.05).toFixed(2));
        return [
          {
            url: `${SITE_URL}${localePath(locale, path)}`,
            lastModified: now,
            changeFrequency,
            priority: localePriority,
            alternates: {
              languages: Object.fromEntries(
                LOCALE_CODES.filter(
                  (alt) => !(alt === "en" && englishCollides),
                ).map((alt) => {
                  const bcp47 = alt === "zh-cn" ? "zh-CN" : alt;
                  return [bcp47, `${SITE_URL}${localePath(alt, path)}`];
                }),
              ),
            },
          },
        ];
      });
    },
  );

  return localizedEntries;
}
