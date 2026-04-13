/**
 * Core wealth data for 5 primary countries.
 *
 * Data source:  data/raw/*.json (fetched by scripts/fetch-all-data.mjs)
 * Raw files:
 *   - data/raw/country-metadata.json     — names, populations, currencies
 *   - data/raw/wealth-income-shares.json  — wealth & income distribution shares
 *   - data/raw/wid-historical.json        — historical wealth time series (WID.world)
 */

import rawMetadata from "../../data/raw/country-metadata.json";
import rawShares from "../../data/raw/wealth-income-shares.json";
import rawHistorical from "../../data/raw/wid-historical.json";
import rawDetailedShares from "../../data/raw/wid-detailed-shares.json";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CountryCode = "US" | "GB" | "FR" | "DE" | "NL";

interface ShareDistribution {
  readonly top1: number;
  readonly top10: number;
  readonly middle40: number;
  readonly bottom50: number;
}

interface HistoricalPoint {
  readonly year: number;
  readonly share: number;
}

export interface CountryData {
  readonly code: string;
  readonly name: string;
  readonly flag: string;
  readonly wealthShares: ShareDistribution;
  readonly incomeShares: ShareDistribution;
  readonly giniWealth: number;
  readonly giniIncome: number;
  readonly medianWealthPerAdult: number;
  readonly meanWealthPerAdult: number;
  readonly population: number;
  readonly currency: string;
  readonly medianIncome: number;
  readonly historicalWealthTop1: readonly HistoricalPoint[];
  readonly historicalWealthTop10: readonly HistoricalPoint[];
  readonly historicalWealthBottom50: readonly HistoricalPoint[];
}

export interface LorenzPoint {
  readonly population: number;
  readonly wealth: number;
}

// ─── Historical data processing ──────────────────────────────────────────────

const TARGET_YEARS = [
  1900, 1910, 1913, 1920, 1929, 1930, 1940, 1945, 1950, 1960,
  1970, 1980, 1985, 1990, 1995, 2000, 2005, 2008, 2010, 2015,
  2020, 2023,
];

const SHORT_TARGET_YEARS = [
  1980, 1985, 1990, 1995, 2000, 2005, 2008, 2010, 2015, 2020, 2023,
];

/**
 * Select data points near target years from a year→value map.
 * Looks for exact matches first, then nearby years (±2).
 */
function selectPoints(
  yearValueMap: Record<string, number>,
  targetYears: readonly number[],
): HistoricalPoint[] {
  const allYears = Object.keys(yearValueMap).map(Number).sort((a, b) => a - b);
  if (allYears.length === 0) return [];

  const selected = new Map<number, number>();

  for (const target of targetYears) {
    const key = String(target);
    if (yearValueMap[key] !== undefined) {
      selected.set(target, yearValueMap[key]);
    } else {
      for (const delta of [1, -1, 2, -2]) {
        const nearbyKey = String(target + delta);
        if (yearValueMap[nearbyKey] !== undefined) {
          selected.set(target + delta, yearValueMap[nearbyKey]);
          break;
        }
      }
    }
  }

  // Always include the latest available year
  const latestYear = allYears[allYears.length - 1];
  if (latestYear && !selected.has(latestYear)) {
    selected.set(latestYear, yearValueMap[String(latestYear)]);
  }

  return Array.from(selected.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, value]) => ({ year, share: Math.round(value * 1000) / 10 }));
}

/**
 * Align three historical series (top1, top10, bottom50) to common years.
 */
function alignSeries(
  top1Raw: Record<string, number>,
  top10Raw: Record<string, number>,
  bottom50Raw: Record<string, number>,
  targets: readonly number[],
): { top1: HistoricalPoint[]; top10: HistoricalPoint[]; bottom50: HistoricalPoint[] } {
  const top1Points = selectPoints(top1Raw, targets);
  const top10Points = selectPoints(top10Raw, targets);
  const bottom50Points = selectPoints(bottom50Raw, targets);

  const top1Years = new Set(top1Points.map(p => p.year));
  const top10Years = new Set(top10Points.map(p => p.year));
  const bottom50Years = new Set(bottom50Points.map(p => p.year));

  const commonYears = new Set(
    [...top10Years].filter(y => top1Years.has(y) && bottom50Years.has(y)),
  );

  return {
    top1: top1Points.filter(p => commonYears.has(p.year)),
    top10: top10Points.filter(p => commonYears.has(p.year)),
    bottom50: bottom50Points.filter(p => commonYears.has(p.year)),
  };
}

/**
 * Extract and align historical data for a country from the WID raw JSON.
 */
export function getHistoricalData(
  cc: string,
): { top1: HistoricalPoint[]; top10: HistoricalPoint[]; bottom50: HistoricalPoint[] } | null {
  const d = (rawHistorical as Record<string, Record<string, Record<string, number>>>)[cc];
  if (!d) return null;

  const top1Var = d["shweal_p99p100_992_j"] ?? {};
  const top1Years = Object.keys(top1Var).map(Number).sort((a, b) => a - b);
  const earliestYear = top1Years[0] ?? 1980;
  const targets = earliestYear < 1970 ? TARGET_YEARS : SHORT_TARGET_YEARS;

  return alignSeries(
    top1Var,
    d["shweal_p90p100_992_j"] ?? {},
    d["shweal_p0p50_992_j"] ?? {},
    targets,
  );
}

// ─── Build country data from raw JSON ────────────────────────────────────────

type RawMeta = Record<string, {
  name: string; flag: string; currency: string; population: number;
  medianIncome: number; medianWealthPerAdult: number; meanWealthPerAdult: number;
  giniWealth: number; giniIncome: number;
}>;

type RawShares = Record<string, {
  wealthShares: ShareDistribution;
  incomeShares: ShareDistribution;
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

// ─── Exports ─────────────────────────────────────────────────────────────────

const CORE_CODES: readonly CountryCode[] = ["US", "GB", "FR", "DE", "NL"] as const;

export const COUNTRIES: readonly CountryData[] = CORE_CODES.map(buildCountryData);

export const COUNTRY_MAP: Readonly<Record<CountryCode, CountryData>> = Object.fromEntries(
  COUNTRIES.map(c => [c.code, c]),
) as Record<CountryCode, CountryData>;

// ─── Utility functions ───────────────────────────────────────────────────────

export function generateLorenzCurve(country: CountryData): readonly LorenzPoint[] {
  const { bottom50, middle40, top10, top1 } = country.wealthShares;
  const top9 = top10 - top1;
  return [
    { population: 0, wealth: 0 },
    { population: 50, wealth: bottom50 },
    { population: 90, wealth: bottom50 + middle40 },
    { population: 99, wealth: bottom50 + middle40 + top9 },
    { population: 100, wealth: 100 },
  ];
}

// ─── Detailed shares lookup ────────────────────────────────────────────────

interface DetailedShares {
  readonly bottom50: number;
  readonly middle40: number;
  readonly next9: number;
  readonly next09: number;
  readonly next009: number;
  readonly top001: number;
}

type RawDetailedShares = Record<string, DetailedShares>;

function getDetailedSharesForCountry(cc: string): DetailedShares | null {
  const entry = (rawDetailedShares as unknown as RawDetailedShares)[cc];
  return entry ?? null;
}

// ─── Percentile estimation ─────────────────────────────────────────────────

/**
 * Estimate the Pareto tail exponent from the ratio of wealth shares.
 *
 * For a Pareto tail: share(topX) / share(topY) = (X/Y)^(1 - 1/α)
 * We compute α from the top1/top10 share ratio.
 */
function estimateParetoAlpha(top1Share: number, top10Share: number): number {
  if (top10Share <= 0 || top1Share <= 0 || top1Share >= top10Share) return 1.5;
  const ratio = top1Share / top10Share;
  // ratio = 0.1^(1 - 1/α) → ln(ratio) = (1 - 1/α) * ln(0.1)
  const exponent = Math.log(ratio) / Math.log(0.1);
  if (exponent <= 0 || exponent >= 1) return 1.5;
  const alpha = 1 / (1 - exponent);
  return Math.max(1.1, Math.min(3.0, alpha));
}

/**
 * Estimate the fraction of adults with negative net wealth.
 *
 * Based on the bottom-50% wealth share: lower/negative share → more people
 * below zero. Calibrated against SCF (US ≈ 12.5% negative).
 */
function estimateNegativeFraction(bottom50Share: number): number {
  if (bottom50Share < -5) return 0.25;
  if (bottom50Share < 0) return 0.18;
  if (bottom50Share < 3) return 0.12;
  if (bottom50Share < 8) return 0.08;
  return 0.05;
}

/**
 * Estimate percentile position given a wealth amount in USD.
 *
 * Uses the known median (p50 threshold from WID) as the primary anchor,
 * Pareto-estimated thresholds for the upper tail, and a modelled negative-
 * wealth segment for the lower tail. Interpolation uses piecewise linear
 * segments between estimated threshold points.
 *
 * Returns a value between 0 and 99.99.
 */
export function findPercentile(wealthUSD: number, country: CountryData): number {
  const mean = country.meanWealthPerAdult;
  const median = country.medianWealthPerAdult;
  const { bottom50, top10, top1 } = country.wealthShares;

  // ── Retrieve detailed sub-percentile shares ──
  const detailed = getDetailedSharesForCountry(country.code);
  const next9Share = detailed?.next9 ?? (top10 - top1);
  const next09Share = detailed?.next09 ?? (top1 * 0.45);
  const next009Share = detailed?.next009 ?? (top1 * 0.17);
  const top001Share = detailed?.top001 ?? (top1 * 0.10);

  // ── Pareto tail exponent ──
  const alpha = estimateParetoAlpha(top1, top10);
  const bCoeff = alpha / (alpha - 1);

  // ── Segment averages (per-adult wealth within each segment) ──
  const avgTop10 = mean * top10 / 10;
  const avgTop1 = mean * top1 / 1;
  const avgNext9 = mean * next9Share / 9;
  const avgNext09 = mean * next09Share / 0.9;
  const avgNext009 = mean * next009Share / 0.09;
  const avgTop001 = mean * top001Share / 0.01;

  // ── Estimate thresholds at key percentile boundaries ──
  // p50: use WID-provided median (the most accurate anchor point)
  const p50 = Math.max(0, median);

  // p90: threshold to enter top 10%.
  // Use Pareto estimate with body-to-tail correction (+0.5 to alpha).
  const bAdj90 = (alpha + 0.5) / (alpha + 0.5 - 1);
  const p90 = Math.max(p50 * 1.5, avgTop10 / bAdj90);

  // p99: threshold to enter top 1% (Pareto more reliable in deep tail)
  const p99 = Math.max(p90 * 1.5, avgTop1 / bCoeff);

  // p99.9: threshold to enter top 0.1%
  const avgTop01Combined = mean * (next009Share + top001Share) / 0.1;
  const p999 = Math.max(p99 * 2, avgTop01Combined / bCoeff);

  // p99.99: threshold to enter top 0.01%
  const p9999 = Math.max(p999 * 2, avgTop001 / bCoeff);

  // ── Negative wealth segment ──
  const negFraction = estimateNegativeFraction(bottom50);
  const negPct = negFraction * 100; // percentile where wealth = $0
  // Floor: estimate a reasonable minimum from the data
  const negFloor = -Math.max(median, mean * 0.4);

  // ── Interpolation anchor points: [wealth, percentile] ──
  // Sorted by wealth ascending. Each pair defines a piecewise linear segment.
  const anchors: [number, number][] = [
    [negFloor, 0],
    [0, negPct],
    [p50, 50],
    [p90, 90],
    [p99, 99],
    [p999, 99.9],
    [p9999, 99.99],
  ];

  // Filter out any degenerate segments where wealth doesn't increase
  const points: [number, number][] = [anchors[0]];
  for (let i = 1; i < anchors.length; i++) {
    if (anchors[i][0] > points[points.length - 1][0]) {
      points.push(anchors[i]);
    }
  }

  // ── Piecewise linear interpolation ──
  if (wealthUSD <= points[0][0]) return 0;

  for (let i = 1; i < points.length; i++) {
    const [prevW, prevP] = points[i - 1];
    const [curW, curP] = points[i];
    if (wealthUSD <= curW) {
      const fraction = (wealthUSD - prevW) / (curW - prevW);
      return Math.max(0, Math.min(prevP + fraction * (curP - prevP), 99.99));
    }
  }

  return 99.99;
}

// ─── Global statistics ───────────────────────────────────────────────────────

const globalShares = (rawShares as unknown as RawShares).GLOBAL;
const globalMeta = (rawMetadata as unknown as RawMeta).GLOBAL;

export const GLOBAL_STATS = {
  globalTop1WealthShare: globalShares.wealthShares.top1,
  globalBottom50WealthShare: globalShares.wealthShares.bottom50,
  globalGiniWealth: globalMeta.giniWealth,
  source: "WID.world — World Inequality Database (2023)",
} as const;

// ─── Data sources (used by SourcesSection) ───────────────────────────────────

export const DATA_SOURCES = [
  {
    name: "World Inequality Database (WID.world)",
    url: "https://wid.world",
    description: "Wealth and income distribution data for 100+ countries. Uses tax records, surveys, and national accounts to produce the most comprehensive inequality database available.",
    citation: "Chancel, L., Piketty, T., Saez, E., Zucman, G. (2022). World Inequality Report 2022.",
    accessed: "2026",
  },
  {
    name: "Forbes Real-Time Billionaires",
    url: "https://www.forbes.com/real-time-billionaires/",
    description: "Daily tracking of the world's wealthiest individuals. Net worth figures are estimates based on stock prices, exchange rates, and reported assets.",
    accessed: "2026",
  },
  {
    name: "OECD Data Explorer",
    url: "https://data-explorer.oecd.org",
    description: "Average annual wages, tax statistics, and economic indicators for OECD member countries.",
    accessed: "2026",
  },
  {
    name: "World Bank Open Data",
    url: "https://data.worldbank.org",
    description: "Consumer price indices, GDP, and development indicators for all countries.",
    accessed: "2026",
  },
  {
    name: "FRED (Federal Reserve Economic Data)",
    url: "https://fred.stlouisfed.org",
    description: "House price indices (BIS residential property prices) and other economic time series.",
    accessed: "2026",
  },
] as const;
