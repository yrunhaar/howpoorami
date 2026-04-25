/**
 * Locale registry for the site.
 *
 * `code` is what we use in URLs (path segment after `/lang/`).
 * `bcp47` is the canonical language tag used in HTML `lang` and hreflang.
 *
 * English is the default locale and lives at the URL root (no prefix);
 * other languages live at `/lang/{code}/...` to avoid conflicts with country
 * codes (e.g. `/de` is the Germany country page in English, not the German
 * language home).
 */

export const LOCALE_CODES = [
  "en",
  "es",
  "de",
  "fr",
  "zh-cn",
  "ja",
  "pt",
  "it",
] as const;

export type LocaleCode = (typeof LOCALE_CODES)[number];

export const DEFAULT_LOCALE: LocaleCode = "en";

export interface LocaleInfo {
  readonly code: LocaleCode;
  /** BCP-47 tag used for `<html lang>` and `hreflang`. */
  readonly bcp47: string;
  /** Display name in English (used in lists, accessibility labels). */
  readonly englishName: string;
  /** Display name in the locale's own script (used in the switcher UI). */
  readonly nativeName: string;
  readonly direction: "ltr" | "rtl";
}

export const LOCALES: Readonly<Record<LocaleCode, LocaleInfo>> = {
  en: {
    code: "en",
    bcp47: "en",
    englishName: "English",
    nativeName: "English",
    direction: "ltr",
  },
  es: {
    code: "es",
    bcp47: "es",
    englishName: "Spanish",
    nativeName: "Español",
    direction: "ltr",
  },
  de: {
    code: "de",
    bcp47: "de",
    englishName: "German",
    nativeName: "Deutsch",
    direction: "ltr",
  },
  fr: {
    code: "fr",
    bcp47: "fr",
    englishName: "French",
    nativeName: "Français",
    direction: "ltr",
  },
  "zh-cn": {
    code: "zh-cn",
    bcp47: "zh-CN",
    englishName: "Chinese (Simplified)",
    nativeName: "简体中文",
    direction: "ltr",
  },
  ja: {
    code: "ja",
    bcp47: "ja",
    englishName: "Japanese",
    nativeName: "日本語",
    direction: "ltr",
  },
  pt: {
    code: "pt",
    bcp47: "pt",
    englishName: "Portuguese",
    nativeName: "Português",
    direction: "ltr",
  },
  it: {
    code: "it",
    bcp47: "it",
    englishName: "Italian",
    nativeName: "Italiano",
    direction: "ltr",
  },
};

export function isLocaleCode(value: string): value is LocaleCode {
  return (LOCALE_CODES as readonly string[]).includes(value);
}

export function getLocale(code: string): LocaleInfo {
  return isLocaleCode(code) ? LOCALES[code] : LOCALES[DEFAULT_LOCALE];
}

/** Locales that get URL prefixes — i.e. everything except the default. */
export const NON_DEFAULT_LOCALES: readonly LocaleCode[] = LOCALE_CODES.filter(
  (c) => c !== DEFAULT_LOCALE,
);
