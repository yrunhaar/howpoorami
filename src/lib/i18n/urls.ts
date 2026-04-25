/**
 * URL builders that respect locale.
 *
 * URL convention:
 *   - English (default) lives at the URL root: `/`, `/us`, `/about`.
 *   - Other locales live directly under their code: `/es`, `/de/us`, `/zh-cn/about`.
 *
 * Because some country codes (de, fr, it, es, pt) collide with locale
 * codes, the dispatcher route at `app/[slug]/page.tsx` decides at request
 * time which interpretation applies for the conflicting codes (locale
 * wins). English country pages for those countries are still reachable
 * inside the dispatcher at the same URL only when the slug is not a
 * locale (i.e. for non-conflicting countries). For the conflicting ones,
 * the locale interpretation is canonical — the English page for that
 * country is not separately addressable.
 *
 * `localePath()` is the single source of truth — call it everywhere a URL
 * is constructed.
 */

import {
  DEFAULT_LOCALE,
  LOCALE_CODES,
  NON_DEFAULT_LOCALES,
  type LocaleCode,
} from "./locales";

/**
 * Build a path for `locale` from a default-locale path like `/us` or `/`.
 *
 * Examples:
 *   localePath("en", "/")      -> "/"
 *   localePath("en", "/us")    -> "/us"
 *   localePath("es", "/")      -> "/es"
 *   localePath("es", "/us")    -> "/es/us"
 *   localePath("zh-cn", "/")   -> "/zh-cn"
 */
export function localePath(locale: LocaleCode, defaultPath: string): string {
  const path = defaultPath.startsWith("/") ? defaultPath : `/${defaultPath}`;
  if (locale === DEFAULT_LOCALE) {
    return path === "/" ? "/" : path;
  }
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

/**
 * Strip the `/{locale}` prefix from a path, returning the
 * default-locale equivalent and the detected locale.
 *
 *   stripLocale("/es/us")    -> { locale: "es", path: "/us" }
 *   stripLocale("/us")       -> { locale: "en", path: "/us" }
 *   stripLocale("/zh-cn")    -> { locale: "zh-cn", path: "/" }
 *   stripLocale("/de/about") -> { locale: "de", path: "/about" }
 *
 * Note: A bare segment like `/de` is interpreted as locale (German home),
 * because the dispatcher gives locale precedence over country for the
 * five conflicting codes.
 */
export function stripLocale(pathname: string): {
  readonly locale: LocaleCode;
  readonly path: string;
} {
  const trimmed = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  if (trimmed.length === 0) {
    return { locale: DEFAULT_LOCALE, path: "/" };
  }
  const [first, ...rest] = trimmed.split("/");
  if ((LOCALE_CODES as readonly string[]).includes(first) && first !== DEFAULT_LOCALE) {
    const path = rest.length === 0 ? "/" : "/" + rest.join("/");
    return {
      locale: first as LocaleCode,
      path,
    };
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

/**
 * Returns true when `defaultPath` is a single-segment country slug whose
 * code overlaps with a non-default locale code (de, fr, it, es, pt). For
 * those URLs, the English version doesn't exist at root because the
 * locale interpretation owns it (e.g. `/de` is German home).
 */
function isEnglishConflictingCountryPath(defaultPath: string): boolean {
  const segments = defaultPath.split("/").filter(Boolean);
  if (segments.length !== 1) return false;
  return (NON_DEFAULT_LOCALES as readonly string[]).includes(segments[0]);
}

/**
 * Build the `alternates.languages` block for Next.js metadata. Each entry
 * maps a BCP-47 language tag to the absolute URL of that language version
 * for the same logical page.
 *
 *   buildHreflangAlternates("https://howpoorami.org", "/")
 *     -> { en: "https://howpoorami.org/", es: "https://howpoorami.org/es", ... }
 *
 * When `defaultPath` is a country slug that conflicts with a locale code
 * at the URL root (de/fr/it/es/pt), the English alternate is omitted —
 * the English version of that country page is no longer addressable since
 * the locale interpretation owns the URL.
 */
export function buildHreflangAlternates(
  siteUrl: string,
  defaultPath: string,
): Record<string, string> {
  const omitEnglish = isEnglishConflictingCountryPath(defaultPath);
  const result: Record<string, string> = {};
  for (const locale of LOCALE_CODES) {
    if (omitEnglish && locale === "en") continue;
    const path = localePath(locale, defaultPath);
    const bcp47 = locale === "zh-cn" ? "zh-CN" : locale;
    result[bcp47] = `${siteUrl}${path}`;
  }
  if (!omitEnglish) {
    // x-default points to the canonical English version per Google's recommendation.
    result["x-default"] = `${siteUrl}${localePath(DEFAULT_LOCALE, defaultPath)}`;
  }
  return result;
}
