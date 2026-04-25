/**
 * Public surface for i18n.
 *
 * Usage in server components / metadata:
 *   import { getDictionary } from "@/lib/i18n";
 *   const t = getDictionary("es");
 *   return { title: t.meta.homeTitle };
 *
 * Usage in client components: prefer the `useDictionary()` hook from
 * `LanguageProvider` so the active locale flows through React context.
 */

import type { Dictionary } from "./dictionary";
import {
  DEFAULT_LOCALE,
  isLocaleCode,
  type LocaleCode,
} from "./locales";
import { en } from "./translations/en";
import { es } from "./translations/es";
import { de } from "./translations/de";
import { fr } from "./translations/fr";
import { zhCn } from "./translations/zh-cn";
import { ja } from "./translations/ja";
import { pt } from "./translations/pt";
import { it } from "./translations/it";

const DICTIONARIES: Readonly<Record<LocaleCode, Dictionary>> = {
  en,
  es,
  de,
  fr,
  "zh-cn": zhCn,
  ja,
  pt,
  it,
};

/**
 * Resolve the dictionary for `locale`. Falls back to English if the locale
 * code is unknown — this keeps the type system happy without throwing on
 * unexpected URL segments.
 */
export function getDictionary(locale: string | LocaleCode): Dictionary {
  if (isLocaleCode(locale)) return DICTIONARIES[locale];
  return DICTIONARIES[DEFAULT_LOCALE];
}

export { interpolate } from "./dictionary";
export type { Dictionary } from "./dictionary";
export {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_CODES,
  NON_DEFAULT_LOCALES,
  getLocale,
  isLocaleCode,
} from "./locales";
export type { LocaleCode, LocaleInfo } from "./locales";
