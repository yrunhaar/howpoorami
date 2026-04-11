/**
 * Extended country data for 25 additional countries + GLOBAL aggregate.
 *
 * Data source:  data/raw/*.json (fetched by scripts/fetch-all-data.mjs)
 * Raw files:
 *   - data/raw/country-metadata.json     — names, populations, currencies
 *   - data/raw/wealth-income-shares.json  — wealth & income distribution shares
 *   - data/raw/wid-historical.json        — historical wealth time series (WID.world)
 */

import rawMetadata from "../../data/raw/country-metadata.json";
import rawShares from "../../data/raw/wealth-income-shares.json";
import { type CountryData, type CountryCode, COUNTRY_MAP, getHistoricalData } from "./wealth-data";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ExtendedCountryCode =
  | "CA" | "AU" | "NZ" | "JP" | "KR" | "CN" | "SG" | "IN" | "BR" | "MX"
  | "CL" | "ZA" | "SE" | "NO" | "DK" | "FI" | "CH" | "IT" | "ES" | "PT"
  | "AT" | "BE" | "IE" | "PL" | "CZ";

export type AllCountryCode = CountryCode | ExtendedCountryCode | "GLOBAL";

export type ExtendedCountryData = CountryData;

export function isAllCountryCode(code: string): code is AllCountryCode {
  return code in ALL_COUNTRY_MAP;
}

// ─── Build extended country data from raw JSON ───────────────────────────────

type RawMeta = Record<string, {
  name: string; flag: string; currency: string; population: number;
  medianIncome: number; medianWealthPerAdult: number; meanWealthPerAdult: number;
  giniWealth: number; giniIncome: number;
}>;

type RawShares = Record<string, {
  wealthShares: { top1: number; top10: number; middle40: number; bottom50: number };
  incomeShares: { top1: number; top10: number; middle40: number; bottom50: number };
}>;

function buildCountryData(cc: string): CountryData {
  const meta = (rawMetadata as unknown as RawMeta)[cc];
  const shares = (rawShares as unknown as RawShares)[cc];
  const hist = getHistoricalData(cc);

  return {
    code: cc,
    name: meta.name,
    flag: meta.flag,
    wealthShares: shares.wealthShares,
    incomeShares: shares.incomeShares,
    giniWealth: meta.giniWealth,
    giniIncome: meta.giniIncome,
    medianWealthPerAdult: meta.medianWealthPerAdult,
    meanWealthPerAdult: meta.meanWealthPerAdult,
    population: meta.population,
    currency: meta.currency,
    medianIncome: meta.medianIncome,
    historicalWealthTop1: hist?.top1 ?? [],
    historicalWealthTop10: hist?.top10 ?? [],
    historicalWealthBottom50: hist?.bottom50 ?? [],
  };
}

// ─── Extended countries ──────────────────────────────────────────────────────

const EXTENDED_CODES: readonly ExtendedCountryCode[] = [
  "CA", "AU", "NZ", "JP", "KR", "CN", "SG", "IN", "BR", "MX",
  "CL", "ZA", "SE", "NO", "DK", "FI", "CH", "IT", "ES", "PT",
  "AT", "BE", "IE", "PL", "CZ",
] as const;

const EXTENDED_COUNTRIES: readonly CountryData[] = EXTENDED_CODES.map(buildCountryData);

// ─── Global aggregate ────────────────────────────────────────────────────────

const GLOBAL: CountryData = buildCountryData("GLOBAL");

// ─── Exports ─────────────────────────────────────────────────────────────────

export const ALL_COUNTRY_MAP: Readonly<Record<AllCountryCode, CountryData>> = {
  ...Object.fromEntries(
    (["US", "GB", "FR", "DE", "NL"] as const).map(cc => [cc, COUNTRY_MAP[cc]]),
  ),
  ...Object.fromEntries(EXTENDED_COUNTRIES.map(c => [c.code, c])),
  GLOBAL,
} as Record<AllCountryCode, CountryData>;

/** All non-GLOBAL countries (core + extended), used by CountrySelector. */
export const ALL_COUNTRIES: readonly CountryData[] = [
  ...Object.values(COUNTRY_MAP),
  ...EXTENDED_COUNTRIES,
];

/** Convenience alias for the GLOBAL entry. */
export const GLOBAL_COUNTRY: CountryData = GLOBAL;
