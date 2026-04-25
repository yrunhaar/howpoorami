/**
 * URL builders that respect locale.
 *
 * URL convention:
 *   - English (default) lives at the URL root: `/`, `/us`, `/about`.
 *   - Other locales live under `/lang/{locale}/...`: `/lang/es`, `/lang/es/us`.
 *
 * `localePath()` is the single source of truth — call it everywhere a URL
 * is constructed so we never accidentally create `/es/us` or `/zh-cn/us`
 * (which would collide with country-code routes).
 */

import {
  DEFAULT_LOCALE,
  LOCALE_CODES,
  type LocaleCode,
} from "./locales";

const LANG_PREFIX = "/lang";

/**
 * Build a path for `locale` from a default-locale path like `/us` or `/`.
 *
 * Examples:
 *   localePath("en", "/")      -> "/"
 *   localePath("en", "/us")    -> "/us"
 *   localePath("es", "/")      -> "/lang/es"
 *   localePath("es", "/us")    -> "/lang/es/us"
 *   localePath("zh-cn", "/")   -> "/lang/zh-cn"
 */
export function localePath(locale: LocaleCode, defaultPath: string): string {
  const path = defaultPath.startsWith("/") ? defaultPath : `/${defaultPath}`;
  if (locale === DEFAULT_LOCALE) {
    return path === "/" ? "/" : path;
  }
  if (path === "/") return `${LANG_PREFIX}/${locale}`;
  return `${LANG_PREFIX}/${locale}${path}`;
}

/**
 * Strip the `/lang/{locale}` prefix from a path, returning the
 * default-locale equivalent and the detected locale.
 *
 *   stripLocale("/lang/es/us")    -> { locale: "es", path: "/us" }
 *   stripLocale("/us")            -> { locale: "en", path: "/us" }
 *   stripLocale("/lang/zh-cn")    -> { locale: "zh-cn", path: "/" }
 */
export function stripLocale(pathname: string): {
  readonly locale: LocaleCode;
  readonly path: string;
} {
  if (pathname.startsWith(`${LANG_PREFIX}/`)) {
    const remainder = pathname.slice(LANG_PREFIX.length + 1);
    const [maybeLocale, ...rest] = remainder.split("/");
    if ((LOCALE_CODES as readonly string[]).includes(maybeLocale)) {
      const path = "/" + rest.join("/");
      return {
        locale: maybeLocale as LocaleCode,
        path: path === "/" ? "/" : path,
      };
    }
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

/**
 * Build the `alternates.languages` block for Next.js metadata. Each entry
 * maps a BCP-47 language tag to the absolute URL of that language version
 * for the same logical page.
 *
 *   buildHreflangAlternates("https://howpoorami.org", "/")
 *     -> { en: "https://howpoorami.org/", es: "https://howpoorami.org/lang/es", ... }
 */
export function buildHreflangAlternates(
  siteUrl: string,
  defaultPath: string,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const locale of LOCALE_CODES) {
    const path = localePath(locale, defaultPath);
    // Use the BCP-47 form for the hreflang key so search engines parse it correctly.
    // (Map our internal "zh-cn" to "zh-CN", everything else passes through.)
    const bcp47 = locale === "zh-cn" ? "zh-CN" : locale;
    result[bcp47] = `${siteUrl}${path}`;
  }
  // x-default points to the canonical English version per Google's recommendation.
  result["x-default"] = `${siteUrl}${localePath(DEFAULT_LOCALE, defaultPath)}`;
  return result;
}
