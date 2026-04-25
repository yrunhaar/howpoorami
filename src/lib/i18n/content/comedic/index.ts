/**
 * Public surface for locale-aware comedic lines.
 *
 * Use `getPercentileLineFor(locale, percentile, country)` and
 * `getYearsToMatchLineFor(locale, years, name, formattedYears)` from any
 * client component that has access to the active locale via
 * `useLanguage()` from `@/components/LanguageProvider`.
 */

import type { LocaleCode } from "../../locales";
import type { ComedicLines, PercentileTier, YearsTier } from "./types";
import { en } from "./en";
import { es } from "./es";
import { de } from "./de";
import { fr } from "./fr";
import { zhCn } from "./zh-cn";
import { ja } from "./ja";
import { pt } from "./pt";
import { it } from "./it";

const LINES: Readonly<Record<LocaleCode, ComedicLines>> = {
  en,
  es,
  de,
  fr,
  "zh-cn": zhCn,
  ja,
  pt,
  it,
};

function getLines(locale: LocaleCode): ComedicLines {
  return LINES[locale] ?? LINES.en;
}

function pickTier<T extends PercentileTier | YearsTier>(
  tiers: readonly T[],
  value: number,
): T {
  return (
    tiers.find((t) => value >= t.min && value < t.max) ??
    tiers[tiers.length - 1]
  );
}

/**
 * Locale-aware percentile line. Picks a deterministic line within the tier
 * based on the percentile so that the same input always produces the same
 * line (avoids flicker on re-render).
 */
export function getPercentileLineFor(
  locale: LocaleCode,
  percentile: number,
  countryName: string,
): string {
  const { percentileTiers } = getLines(locale);
  const tier = pickTier(percentileTiers, percentile);
  const index = Math.abs(Math.floor((percentile * 7.3) % tier.lines.length));
  return tier.lines[index].replace(/\{country\}/g, countryName);
}

/**
 * Locale-aware years-to-match line.
 */
export function getYearsToMatchLineFor(
  locale: LocaleCode,
  years: number,
  billionaireName: string,
  formattedYears: string,
): string {
  const { yearsTiers } = getLines(locale);
  const tier = pickTier(yearsTiers, years);
  const index = Math.floor((years * 3.7) % tier.lines.length);
  return tier.lines[index]
    .replace(/\{name\}/g, billionaireName)
    .replace(/\{years\}/g, formattedYears);
}
