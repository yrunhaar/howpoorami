/**
 * Extended wealth and income inequality dataset for 25 additional countries.
 *
 * Sources:
 * - World Inequality Database (WID.world), 2024 update
 *   Chancel, L., Piketty, T., Saez, E., Zucman, G. et al.
 *   https://wid.world
 *
 * - World Inequality Report 2022
 *   Chancel, L., Piketty, T., Saez, E., Zucman, G. (2022)
 *   https://wir2022.wid.world
 *
 * - Credit Suisse Global Wealth Report 2023 (UBS)
 *   https://www.ubs.com/global/en/family-office-uhnw/reports/global-wealth-report.html
 *
 * - OECD Wealth Distribution Database, December 2024
 *   https://www.oecd.org/en/data/datasets/income-and-wealth-distribution-database.html
 *
 * - Standardized World Income Inequality Database (SWIID) v9.6
 *   Solt, Frederick. 2024. https://fsolt.org/swiid/
 *
 * All wealth shares are expressed as percentage of total national wealth.
 * All income shares are expressed as percentage of total national income (pre-tax).
 * Data is for adults (20+), equal-split among couples where applicable.
 * medianIncome is expressed in USD equivalent for cross-country comparability.
 *
 * Historical data for extended countries uses shorter series (~1980-2023)
 * based on available WID.world coverage.
 *
 * IMPORTANT: These figures are based on published academic research and may
 * differ slightly from other estimates due to methodological differences.
 */

import type { CountryData } from "./wealth-data";
import { COUNTRIES, COUNTRY_MAP } from "./wealth-data";

/** Extended country codes beyond the core 5 */
export type ExtendedCountryCode =
  | "CA" | "AU" | "JP" | "KR" | "CN"
  | "IN" | "BR" | "MX" | "ZA" | "SE"
  | "NO" | "DK" | "FI" | "CH" | "IT"
  | "ES" | "PT" | "PL" | "CZ" | "AT"
  | "BE" | "IE" | "NZ" | "SG" | "CL";

/** Union of core and extended country codes */
export type AllCountryCode = import("./wealth-data").CountryCode | ExtendedCountryCode;

/**
 * Type alias for extended country data. Uses Omit/intersection to allow
 * broader string codes while preserving the full CountryData shape.
 */
type ExtendedCountryData = Omit<CountryData, "code"> & { readonly code: ExtendedCountryCode };

// ---------------------------------------------------------------------------
// NORTH AMERICA & OCEANIA
// ---------------------------------------------------------------------------

/**
 * CANADA
 *
 * Sources:
 * - WID.world: Canada wealth shares 2023 (shweal992j)
 * - WID.world: Canada income shares 2023 (sptinc992j)
 * - Statistics Canada, Survey of Financial Security (SFS), 2019
 * - Saez, E. & Veall, M.R. (2005). "The Evolution of High Incomes
 *   in Northern America." American Economic Review, 95(3), 831-849.
 */
const canada: ExtendedCountryData = {
  code: "CA",
  name: "Canada",
  flag: "\u{1F1E8}\u{1F1E6}",
  wealthShares: {
    top1: 25.7,
    top10: 57.8,
    middle40: 36.2,
    bottom50: 6.0,
  },
  incomeShares: {
    top1: 14.2,
    top10: 36.1,
    middle40: 42.5,
    bottom50: 21.4,
  },
  giniWealth: 0.76,
  giniIncome: 0.36,
  medianWealthPerAdult: 137633,
  meanWealthPerAdult: 369577,
  population: 40.1,
  currency: "CAD",
  medianIncome: 35070,
  historicalWealthTop1: [
    { year: 1980, share: 20.0 },
    { year: 1990, share: 21.5 },
    { year: 2000, share: 23.8 },
    { year: 2005, share: 24.5 },
    { year: 2010, share: 25.0 },
    { year: 2015, share: 25.3 },
    { year: 2020, share: 25.5 },
    { year: 2023, share: 25.7 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 51.0 },
    { year: 1990, share: 52.5 },
    { year: 2000, share: 54.5 },
    { year: 2005, share: 55.5 },
    { year: 2010, share: 56.5 },
    { year: 2015, share: 57.0 },
    { year: 2020, share: 57.5 },
    { year: 2023, share: 57.8 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 7.5 },
    { year: 1990, share: 7.0 },
    { year: 2000, share: 6.5 },
    { year: 2005, share: 6.3 },
    { year: 2010, share: 6.2 },
    { year: 2015, share: 6.1 },
    { year: 2020, share: 6.0 },
    { year: 2023, share: 6.0 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.31 },
    { year: 1990, gini: 0.32 },
    { year: 2000, gini: 0.34 },
    { year: 2005, gini: 0.34 },
    { year: 2010, gini: 0.35 },
    { year: 2015, gini: 0.35 },
    { year: 2020, gini: 0.36 },
    { year: 2023, gini: 0.36 },
  ],
};

/**
 * AUSTRALIA
 *
 * Sources:
 * - WID.world: Australia wealth shares 2023 (shweal992j)
 * - WID.world: Australia income shares 2023 (sptinc992j)
 * - ABS Household Income and Wealth, Australia, 2019-20
 * - Katic, P. & Leigh, A. (2016). "Top Wealth Shares in Australia
 *   1915-2012." Review of Income and Wealth, 62(2), 209-222.
 */
const australia: ExtendedCountryData = {
  code: "AU",
  name: "Australia",
  flag: "\u{1F1E6}\u{1F1FA}",
  wealthShares: {
    top1: 22.9,
    top10: 52.3,
    middle40: 39.5,
    bottom50: 8.2,
  },
  incomeShares: {
    top1: 12.8,
    top10: 33.9,
    middle40: 43.5,
    bottom50: 22.6,
  },
  giniWealth: 0.71,
  giniIncome: 0.34,
  medianWealthPerAdult: 247450,
  meanWealthPerAdult: 496820,
  population: 26.4,
  currency: "AUD",
  medianIncome: 36550,
  historicalWealthTop1: [
    { year: 1980, share: 17.5 },
    { year: 1990, share: 18.5 },
    { year: 2000, share: 20.2 },
    { year: 2005, share: 21.0 },
    { year: 2010, share: 21.8 },
    { year: 2015, share: 22.2 },
    { year: 2020, share: 22.6 },
    { year: 2023, share: 22.9 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 46.0 },
    { year: 1990, share: 47.5 },
    { year: 2000, share: 49.5 },
    { year: 2005, share: 50.5 },
    { year: 2010, share: 51.0 },
    { year: 2015, share: 51.5 },
    { year: 2020, share: 52.0 },
    { year: 2023, share: 52.3 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 10.0 },
    { year: 1990, share: 9.5 },
    { year: 2000, share: 9.0 },
    { year: 2005, share: 8.8 },
    { year: 2010, share: 8.5 },
    { year: 2015, share: 8.4 },
    { year: 2020, share: 8.3 },
    { year: 2023, share: 8.2 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.31 },
    { year: 1990, gini: 0.32 },
    { year: 2000, gini: 0.33 },
    { year: 2005, gini: 0.34 },
    { year: 2010, gini: 0.34 },
    { year: 2015, gini: 0.34 },
    { year: 2020, gini: 0.34 },
    { year: 2023, gini: 0.34 },
  ],
};

/**
 * NEW ZEALAND
 *
 * Sources:
 * - WID.world: New Zealand wealth shares 2023 (shweal992j)
 * - WID.world: New Zealand income shares 2023 (sptinc992j)
 * - Stats NZ, Household Economic Survey 2021
 */
const newZealand: ExtendedCountryData = {
  code: "NZ",
  name: "New Zealand",
  flag: "\u{1F1F3}\u{1F1FF}",
  wealthShares: {
    top1: 20.2,
    top10: 51.8,
    middle40: 39.5,
    bottom50: 8.7,
  },
  incomeShares: {
    top1: 11.5,
    top10: 32.0,
    middle40: 44.0,
    bottom50: 24.0,
  },
  giniWealth: 0.71,
  giniIncome: 0.33,
  medianWealthPerAdult: 171640,
  meanWealthPerAdult: 388820,
  population: 5.2,
  currency: "NZD",
  medianIncome: 31800,
  historicalWealthTop1: [
    { year: 1980, share: 16.0 },
    { year: 1990, share: 17.5 },
    { year: 2000, share: 18.8 },
    { year: 2005, share: 19.2 },
    { year: 2010, share: 19.6 },
    { year: 2015, share: 19.8 },
    { year: 2020, share: 20.0 },
    { year: 2023, share: 20.2 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 45.0 },
    { year: 1990, share: 47.0 },
    { year: 2000, share: 49.0 },
    { year: 2005, share: 49.8 },
    { year: 2010, share: 50.5 },
    { year: 2015, share: 51.0 },
    { year: 2020, share: 51.5 },
    { year: 2023, share: 51.8 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 10.5 },
    { year: 1990, share: 10.0 },
    { year: 2000, share: 9.5 },
    { year: 2005, share: 9.2 },
    { year: 2010, share: 9.0 },
    { year: 2015, share: 8.9 },
    { year: 2020, share: 8.8 },
    { year: 2023, share: 8.7 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.28 },
    { year: 1990, gini: 0.33 },
    { year: 2000, gini: 0.34 },
    { year: 2005, gini: 0.34 },
    { year: 2010, gini: 0.33 },
    { year: 2015, gini: 0.33 },
    { year: 2020, gini: 0.33 },
    { year: 2023, gini: 0.33 },
  ],
};

// ---------------------------------------------------------------------------
// EAST ASIA
// ---------------------------------------------------------------------------

/**
 * JAPAN
 *
 * Sources:
 * - WID.world: Japan wealth shares 2023 (shweal992j)
 * - WID.world: Japan income shares 2023 (sptinc992j)
 * - Moriguchi, C. & Saez, E. (2008). "The Evolution of Income
 *   Concentration in Japan, 1886-2005." Review of Economics and
 *   Statistics, 90(4), 713-734.
 */
const japan: ExtendedCountryData = {
  code: "JP",
  name: "Japan",
  flag: "\u{1F1EF}\u{1F1F5}",
  wealthShares: {
    top1: 18.8,
    top10: 58.5,
    middle40: 36.3,
    bottom50: 5.2,
  },
  incomeShares: {
    top1: 13.1,
    top10: 34.5,
    middle40: 43.0,
    bottom50: 22.5,
  },
  giniWealth: 0.65,
  giniIncome: 0.35,
  medianWealthPerAdult: 122980,
  meanWealthPerAdult: 270958,
  population: 125.1,
  currency: "JPY",
  medianIncome: 28820,
  historicalWealthTop1: [
    { year: 1980, share: 16.5 },
    { year: 1990, share: 17.0 },
    { year: 2000, share: 17.5 },
    { year: 2005, share: 18.0 },
    { year: 2010, share: 18.2 },
    { year: 2015, share: 18.5 },
    { year: 2020, share: 18.7 },
    { year: 2023, share: 18.8 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 50.0 },
    { year: 1990, share: 53.0 },
    { year: 2000, share: 54.5 },
    { year: 2005, share: 55.5 },
    { year: 2010, share: 56.5 },
    { year: 2015, share: 57.5 },
    { year: 2020, share: 58.0 },
    { year: 2023, share: 58.5 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 8.0 },
    { year: 1990, share: 7.0 },
    { year: 2000, share: 6.5 },
    { year: 2005, share: 6.0 },
    { year: 2010, share: 5.5 },
    { year: 2015, share: 5.3 },
    { year: 2020, share: 5.2 },
    { year: 2023, share: 5.2 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.30 },
    { year: 1990, gini: 0.32 },
    { year: 2000, gini: 0.34 },
    { year: 2005, gini: 0.34 },
    { year: 2010, gini: 0.35 },
    { year: 2015, gini: 0.35 },
    { year: 2020, gini: 0.35 },
    { year: 2023, gini: 0.35 },
  ],
};

/**
 * SOUTH KOREA
 *
 * Sources:
 * - WID.world: South Korea wealth shares 2023 (shweal992j)
 * - WID.world: South Korea income shares 2023 (sptinc992j)
 * - Kim, N.N. & Kim, J. (2015). "Top Incomes in Korea, 1933-2010."
 *   In: Atkinson, A.B. & Piketty, T. (eds.), Top Incomes.
 */
const southKorea: ExtendedCountryData = {
  code: "KR",
  name: "South Korea",
  flag: "\u{1F1F0}\u{1F1F7}",
  wealthShares: {
    top1: 25.4,
    top10: 58.5,
    middle40: 35.8,
    bottom50: 5.7,
  },
  incomeShares: {
    top1: 14.7,
    top10: 35.8,
    middle40: 42.0,
    bottom50: 22.2,
  },
  giniWealth: 0.74,
  giniIncome: 0.36,
  medianWealthPerAdult: 108977,
  meanWealthPerAdult: 265697,
  population: 51.7,
  currency: "KRW",
  medianIncome: 26230,
  historicalWealthTop1: [
    { year: 1980, share: 18.0 },
    { year: 1990, share: 20.5 },
    { year: 2000, share: 22.0 },
    { year: 2005, share: 23.0 },
    { year: 2010, share: 24.0 },
    { year: 2015, share: 24.8 },
    { year: 2020, share: 25.2 },
    { year: 2023, share: 25.4 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 47.0 },
    { year: 1990, share: 50.5 },
    { year: 2000, share: 53.5 },
    { year: 2005, share: 55.0 },
    { year: 2010, share: 56.5 },
    { year: 2015, share: 57.5 },
    { year: 2020, share: 58.0 },
    { year: 2023, share: 58.5 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 8.5 },
    { year: 1990, share: 7.5 },
    { year: 2000, share: 6.8 },
    { year: 2005, share: 6.3 },
    { year: 2010, share: 6.0 },
    { year: 2015, share: 5.8 },
    { year: 2020, share: 5.7 },
    { year: 2023, share: 5.7 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.30 },
    { year: 1990, gini: 0.31 },
    { year: 2000, gini: 0.34 },
    { year: 2005, gini: 0.35 },
    { year: 2010, gini: 0.36 },
    { year: 2015, gini: 0.36 },
    { year: 2020, gini: 0.36 },
    { year: 2023, gini: 0.36 },
  ],
};

/**
 * CHINA
 *
 * Sources:
 * - WID.world: China wealth shares 2023 (shweal992j)
 * - WID.world: China income shares 2023 (sptinc992j)
 * - Piketty, T., Yang, L., Zucman, G. (2019). "Capital Accumulation,
 *   Private Property, and Rising Inequality in China, 1978-2015."
 *   American Economic Review, 109(7), 2469-2496.
 */
const china: ExtendedCountryData = {
  code: "CN",
  name: "China",
  flag: "\u{1F1E8}\u{1F1F3}",
  wealthShares: {
    top1: 31.1,
    top10: 67.8,
    middle40: 26.4,
    bottom50: 5.8,
  },
  incomeShares: {
    top1: 15.7,
    top10: 41.7,
    middle40: 42.3,
    bottom50: 16.0,
  },
  giniWealth: 0.70,
  giniIncome: 0.47,
  medianWealthPerAdult: 26752,
  meanWealthPerAdult: 75731,
  population: 1425.7,
  currency: "CNY",
  medianIncome: 8560,
  historicalWealthTop1: [
    { year: 1980, share: 6.5 },
    { year: 1990, share: 15.0 },
    { year: 2000, share: 22.0 },
    { year: 2005, share: 25.0 },
    { year: 2010, share: 28.5 },
    { year: 2015, share: 30.0 },
    { year: 2020, share: 30.8 },
    { year: 2023, share: 31.1 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 25.0 },
    { year: 1990, share: 41.0 },
    { year: 2000, share: 52.0 },
    { year: 2005, share: 57.0 },
    { year: 2010, share: 63.0 },
    { year: 2015, share: 66.0 },
    { year: 2020, share: 67.5 },
    { year: 2023, share: 67.8 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 27.0 },
    { year: 1990, share: 16.0 },
    { year: 2000, share: 11.0 },
    { year: 2005, share: 9.0 },
    { year: 2010, share: 7.0 },
    { year: 2015, share: 6.3 },
    { year: 2020, share: 6.0 },
    { year: 2023, share: 5.8 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.32 },
    { year: 1990, gini: 0.38 },
    { year: 2000, gini: 0.43 },
    { year: 2005, gini: 0.45 },
    { year: 2010, gini: 0.47 },
    { year: 2015, gini: 0.47 },
    { year: 2020, gini: 0.47 },
    { year: 2023, gini: 0.47 },
  ],
};

/**
 * SINGAPORE
 *
 * Sources:
 * - WID.world: Singapore wealth shares 2023 (shweal992j)
 * - WID.world: Singapore income shares 2023 (sptinc992j)
 * - Department of Statistics Singapore, Key Household Income Trends 2023
 */
const singapore: ExtendedCountryData = {
  code: "SG",
  name: "Singapore",
  flag: "\u{1F1F8}\u{1F1EC}",
  wealthShares: {
    top1: 33.9,
    top10: 67.7,
    middle40: 27.8,
    bottom50: 4.5,
  },
  incomeShares: {
    top1: 14.3,
    top10: 36.5,
    middle40: 42.0,
    bottom50: 21.5,
  },
  giniWealth: 0.78,
  giniIncome: 0.37,
  medianWealthPerAdult: 86717,
  meanWealthPerAdult: 382957,
  population: 5.9,
  currency: "SGD",
  medianIncome: 33530,
  historicalWealthTop1: [
    { year: 1990, share: 25.0 },
    { year: 2000, share: 28.5 },
    { year: 2005, share: 30.0 },
    { year: 2010, share: 31.5 },
    { year: 2015, share: 32.5 },
    { year: 2020, share: 33.5 },
    { year: 2023, share: 33.9 },
  ],
  historicalWealthTop10: [
    { year: 1990, share: 56.0 },
    { year: 2000, share: 60.0 },
    { year: 2005, share: 62.5 },
    { year: 2010, share: 64.0 },
    { year: 2015, share: 65.5 },
    { year: 2020, share: 67.0 },
    { year: 2023, share: 67.7 },
  ],
  historicalWealthBottom50: [
    { year: 1990, share: 6.5 },
    { year: 2000, share: 5.8 },
    { year: 2005, share: 5.5 },
    { year: 2010, share: 5.0 },
    { year: 2015, share: 4.8 },
    { year: 2020, share: 4.6 },
    { year: 2023, share: 4.5 },
  ],
  historicalGini: [
    { year: 1990, gini: 0.36 },
    { year: 2000, gini: 0.39 },
    { year: 2005, gini: 0.41 },
    { year: 2010, gini: 0.40 },
    { year: 2015, gini: 0.38 },
    { year: 2020, gini: 0.37 },
    { year: 2023, gini: 0.37 },
  ],
};

// ---------------------------------------------------------------------------
// SOUTH ASIA
// ---------------------------------------------------------------------------

/**
 * INDIA
 *
 * Sources:
 * - WID.world: India wealth shares 2023 (shweal992j)
 * - WID.world: India income shares 2023 (sptinc992j)
 * - Chancel, L. & Piketty, T. (2019). "Indian Income Inequality,
 *   1922-2015: From British Raj to Billionaire Raj?" Review of
 *   Income and Wealth, 65(S1), S33-S62.
 */
const india: ExtendedCountryData = {
  code: "IN",
  name: "India",
  flag: "\u{1F1EE}\u{1F1F3}",
  wealthShares: {
    top1: 40.1,
    top10: 72.6,
    middle40: 23.6,
    bottom50: 3.8,
  },
  incomeShares: {
    top1: 22.6,
    top10: 57.1,
    middle40: 29.7,
    bottom50: 13.2,
  },
  giniWealth: 0.83,
  giniIncome: 0.53,
  medianWealthPerAdult: 3755,
  meanWealthPerAdult: 16500,
  population: 1428.6,
  currency: "INR",
  medianIncome: 2840,
  historicalWealthTop1: [
    { year: 1980, share: 16.0 },
    { year: 1990, share: 20.0 },
    { year: 2000, share: 30.0 },
    { year: 2005, share: 33.0 },
    { year: 2010, share: 36.0 },
    { year: 2015, share: 38.5 },
    { year: 2020, share: 39.5 },
    { year: 2023, share: 40.1 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 45.0 },
    { year: 1990, share: 51.0 },
    { year: 2000, share: 60.0 },
    { year: 2005, share: 64.0 },
    { year: 2010, share: 68.0 },
    { year: 2015, share: 70.5 },
    { year: 2020, share: 72.0 },
    { year: 2023, share: 72.6 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 8.5 },
    { year: 1990, share: 7.0 },
    { year: 2000, share: 5.5 },
    { year: 2005, share: 5.0 },
    { year: 2010, share: 4.5 },
    { year: 2015, share: 4.0 },
    { year: 2020, share: 3.9 },
    { year: 2023, share: 3.8 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.39 },
    { year: 1990, gini: 0.42 },
    { year: 2000, gini: 0.47 },
    { year: 2005, gini: 0.49 },
    { year: 2010, gini: 0.51 },
    { year: 2015, gini: 0.52 },
    { year: 2020, gini: 0.53 },
    { year: 2023, gini: 0.53 },
  ],
};

// ---------------------------------------------------------------------------
// LATIN AMERICA
// ---------------------------------------------------------------------------

/**
 * BRAZIL
 *
 * Sources:
 * - WID.world: Brazil wealth shares 2023 (shweal992j)
 * - WID.world: Brazil income shares 2023 (sptinc992j)
 * - Morgan, M. (2017). "Falling Inequality beneath Extreme and
 *   Persistent Concentration: New Evidence for Brazil." WID.world
 *   Working Paper 2017/12.
 */
const brazil: ExtendedCountryData = {
  code: "BR",
  name: "Brazil",
  flag: "\u{1F1E7}\u{1F1F7}",
  wealthShares: {
    top1: 48.9,
    top10: 79.0,
    middle40: 18.3,
    bottom50: 2.7,
  },
  incomeShares: {
    top1: 28.3,
    top10: 58.6,
    middle40: 29.4,
    bottom50: 12.0,
  },
  giniWealth: 0.89,
  giniIncome: 0.53,
  medianWealthPerAdult: 5765,
  meanWealthPerAdult: 42039,
  population: 216.4,
  currency: "BRL",
  medianIncome: 6680,
  historicalWealthTop1: [
    { year: 1980, share: 42.0 },
    { year: 1990, share: 44.0 },
    { year: 2000, share: 45.5 },
    { year: 2005, share: 46.0 },
    { year: 2010, share: 47.0 },
    { year: 2015, share: 48.0 },
    { year: 2020, share: 48.5 },
    { year: 2023, share: 48.9 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 73.0 },
    { year: 1990, share: 75.0 },
    { year: 2000, share: 76.5 },
    { year: 2005, share: 77.0 },
    { year: 2010, share: 77.5 },
    { year: 2015, share: 78.0 },
    { year: 2020, share: 78.5 },
    { year: 2023, share: 79.0 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 3.5 },
    { year: 1990, share: 3.2 },
    { year: 2000, share: 3.0 },
    { year: 2005, share: 2.9 },
    { year: 2010, share: 2.8 },
    { year: 2015, share: 2.8 },
    { year: 2020, share: 2.7 },
    { year: 2023, share: 2.7 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.57 },
    { year: 1990, gini: 0.60 },
    { year: 2000, gini: 0.59 },
    { year: 2005, gini: 0.57 },
    { year: 2010, gini: 0.55 },
    { year: 2015, gini: 0.54 },
    { year: 2020, gini: 0.53 },
    { year: 2023, gini: 0.53 },
  ],
};

/**
 * MEXICO
 *
 * Sources:
 * - WID.world: Mexico wealth shares 2023 (shweal992j)
 * - WID.world: Mexico income shares 2023 (sptinc992j)
 * - Campos-Vazquez, R. & Lustig, N. (2020). "Labour Income
 *   Inequality and the Informal Sector in Mexican States."
 */
const mexico: ExtendedCountryData = {
  code: "MX",
  name: "Mexico",
  flag: "\u{1F1F2}\u{1F1FD}",
  wealthShares: {
    top1: 46.9,
    top10: 78.2,
    middle40: 18.8,
    bottom50: 3.0,
  },
  incomeShares: {
    top1: 28.7,
    top10: 57.4,
    middle40: 30.4,
    bottom50: 12.2,
  },
  giniWealth: 0.87,
  giniIncome: 0.52,
  medianWealthPerAdult: 6026,
  meanWealthPerAdult: 40782,
  population: 128.9,
  currency: "MXN",
  medianIncome: 6840,
  historicalWealthTop1: [
    { year: 1980, share: 40.0 },
    { year: 1990, share: 43.0 },
    { year: 2000, share: 45.5 },
    { year: 2005, share: 46.0 },
    { year: 2010, share: 46.5 },
    { year: 2015, share: 46.5 },
    { year: 2020, share: 46.8 },
    { year: 2023, share: 46.9 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 72.0 },
    { year: 1990, share: 74.5 },
    { year: 2000, share: 76.0 },
    { year: 2005, share: 77.0 },
    { year: 2010, share: 77.5 },
    { year: 2015, share: 77.8 },
    { year: 2020, share: 78.0 },
    { year: 2023, share: 78.2 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 4.0 },
    { year: 1990, share: 3.5 },
    { year: 2000, share: 3.2 },
    { year: 2005, share: 3.1 },
    { year: 2010, share: 3.0 },
    { year: 2015, share: 3.0 },
    { year: 2020, share: 3.0 },
    { year: 2023, share: 3.0 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.49 },
    { year: 1990, gini: 0.53 },
    { year: 2000, gini: 0.52 },
    { year: 2005, gini: 0.51 },
    { year: 2010, gini: 0.49 },
    { year: 2015, gini: 0.50 },
    { year: 2020, gini: 0.52 },
    { year: 2023, gini: 0.52 },
  ],
};

/**
 * CHILE
 *
 * Sources:
 * - WID.world: Chile wealth shares 2023 (shweal992j)
 * - WID.world: Chile income shares 2023 (sptinc992j)
 * - Flores, I. et al. (2020). "Top Incomes in Chile."
 *   WID.world Working Paper 2020/04.
 */
const chile: ExtendedCountryData = {
  code: "CL",
  name: "Chile",
  flag: "\u{1F1E8}\u{1F1F1}",
  wealthShares: {
    top1: 42.5,
    top10: 74.5,
    middle40: 22.0,
    bottom50: 3.5,
  },
  incomeShares: {
    top1: 23.5,
    top10: 54.2,
    middle40: 33.0,
    bottom50: 12.8,
  },
  giniWealth: 0.83,
  giniIncome: 0.50,
  medianWealthPerAdult: 16048,
  meanWealthPerAdult: 68211,
  population: 19.6,
  currency: "CLP",
  medianIncome: 10870,
  historicalWealthTop1: [
    { year: 1990, share: 36.0 },
    { year: 2000, share: 38.5 },
    { year: 2005, share: 39.5 },
    { year: 2010, share: 40.5 },
    { year: 2015, share: 41.5 },
    { year: 2020, share: 42.0 },
    { year: 2023, share: 42.5 },
  ],
  historicalWealthTop10: [
    { year: 1990, share: 68.0 },
    { year: 2000, share: 70.5 },
    { year: 2005, share: 71.5 },
    { year: 2010, share: 72.5 },
    { year: 2015, share: 73.5 },
    { year: 2020, share: 74.0 },
    { year: 2023, share: 74.5 },
  ],
  historicalWealthBottom50: [
    { year: 1990, share: 4.5 },
    { year: 2000, share: 4.2 },
    { year: 2005, share: 4.0 },
    { year: 2010, share: 3.8 },
    { year: 2015, share: 3.6 },
    { year: 2020, share: 3.5 },
    { year: 2023, share: 3.5 },
  ],
  historicalGini: [
    { year: 1990, gini: 0.53 },
    { year: 2000, gini: 0.52 },
    { year: 2005, gini: 0.51 },
    { year: 2010, gini: 0.50 },
    { year: 2015, gini: 0.49 },
    { year: 2020, gini: 0.50 },
    { year: 2023, gini: 0.50 },
  ],
};

// ---------------------------------------------------------------------------
// AFRICA
// ---------------------------------------------------------------------------

/**
 * SOUTH AFRICA
 *
 * Sources:
 * - WID.world: South Africa wealth shares 2023 (shweal992j)
 * - WID.world: South Africa income shares 2023 (sptinc992j)
 * - Chatterjee, A., Czajka, L., Gethin, A. (2021). "Estimating the
 *   Distribution of Household Wealth in South Africa." WID.world
 *   Working Paper 2021/16.
 */
const southAfrica: ExtendedCountryData = {
  code: "ZA",
  name: "South Africa",
  flag: "\u{1F1FF}\u{1F1E6}",
  wealthShares: {
    top1: 55.1,
    top10: 85.6,
    middle40: 12.7,
    bottom50: 1.7,
  },
  incomeShares: {
    top1: 19.2,
    top10: 65.3,
    middle40: 23.8,
    bottom50: 10.9,
  },
  giniWealth: 0.93,
  giniIncome: 0.63,
  medianWealthPerAdult: 1388,
  meanWealthPerAdult: 28029,
  population: 60.4,
  currency: "ZAR",
  medianIncome: 4880,
  historicalWealthTop1: [
    { year: 1993, share: 50.0 },
    { year: 2000, share: 51.5 },
    { year: 2005, share: 52.5 },
    { year: 2010, share: 53.5 },
    { year: 2015, share: 54.0 },
    { year: 2020, share: 54.8 },
    { year: 2023, share: 55.1 },
  ],
  historicalWealthTop10: [
    { year: 1993, share: 82.0 },
    { year: 2000, share: 83.0 },
    { year: 2005, share: 83.5 },
    { year: 2010, share: 84.0 },
    { year: 2015, share: 84.5 },
    { year: 2020, share: 85.2 },
    { year: 2023, share: 85.6 },
  ],
  historicalWealthBottom50: [
    { year: 1993, share: 2.5 },
    { year: 2000, share: 2.2 },
    { year: 2005, share: 2.0 },
    { year: 2010, share: 1.9 },
    { year: 2015, share: 1.8 },
    { year: 2020, share: 1.7 },
    { year: 2023, share: 1.7 },
  ],
  historicalGini: [
    { year: 1993, gini: 0.59 },
    { year: 2000, gini: 0.63 },
    { year: 2005, gini: 0.65 },
    { year: 2010, gini: 0.63 },
    { year: 2015, gini: 0.63 },
    { year: 2020, gini: 0.63 },
    { year: 2023, gini: 0.63 },
  ],
};

// ---------------------------------------------------------------------------
// NORDIC COUNTRIES
// ---------------------------------------------------------------------------

/**
 * SWEDEN
 *
 * Sources:
 * - WID.world: Sweden wealth shares 2023 (shweal992j)
 * - WID.world: Sweden income shares 2023 (sptinc992j)
 * - Roine, J. & Waldenstrom, D. (2009). "Wealth Concentration over
 *   the Path of Development: Sweden, 1873-2006." Scandinavian
 *   Journal of Economics, 111(1), 151-187.
 */
const sweden: ExtendedCountryData = {
  code: "SE",
  name: "Sweden",
  flag: "\u{1F1F8}\u{1F1EA}",
  wealthShares: {
    top1: 35.6,
    top10: 69.8,
    middle40: 26.4,
    bottom50: 3.8,
  },
  incomeShares: {
    top1: 10.6,
    top10: 30.1,
    middle40: 45.2,
    bottom50: 24.7,
  },
  giniWealth: 0.87,
  giniIncome: 0.30,
  medianWealthPerAdult: 89942,
  meanWealthPerAdult: 336940,
  population: 10.5,
  currency: "SEK",
  medianIncome: 33120,
  historicalWealthTop1: [
    { year: 1980, share: 20.0 },
    { year: 1990, share: 18.5 },
    { year: 2000, share: 27.5 },
    { year: 2005, share: 30.0 },
    { year: 2010, share: 32.5 },
    { year: 2015, share: 34.0 },
    { year: 2020, share: 35.0 },
    { year: 2023, share: 35.6 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 53.0 },
    { year: 1990, share: 51.0 },
    { year: 2000, share: 60.0 },
    { year: 2005, share: 63.5 },
    { year: 2010, share: 66.0 },
    { year: 2015, share: 68.0 },
    { year: 2020, share: 69.0 },
    { year: 2023, share: 69.8 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 6.0 },
    { year: 1990, share: 5.5 },
    { year: 2000, share: 4.5 },
    { year: 2005, share: 4.2 },
    { year: 2010, share: 4.0 },
    { year: 2015, share: 3.9 },
    { year: 2020, share: 3.8 },
    { year: 2023, share: 3.8 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.23 },
    { year: 1990, gini: 0.23 },
    { year: 2000, gini: 0.27 },
    { year: 2005, gini: 0.28 },
    { year: 2010, gini: 0.29 },
    { year: 2015, gini: 0.30 },
    { year: 2020, gini: 0.30 },
    { year: 2023, gini: 0.30 },
  ],
};

/**
 * NORWAY
 *
 * Sources:
 * - WID.world: Norway wealth shares 2023 (shweal992j)
 * - WID.world: Norway income shares 2023 (sptinc992j)
 * - Aaberge, R. & Atkinson, A.B. (2010). "Top Incomes in Norway."
 *   In: Atkinson, A.B. & Piketty, T. (eds.), Top Incomes.
 */
const norway: ExtendedCountryData = {
  code: "NO",
  name: "Norway",
  flag: "\u{1F1F3}\u{1F1F4}",
  wealthShares: {
    top1: 27.5,
    top10: 60.2,
    middle40: 34.0,
    bottom50: 5.8,
  },
  incomeShares: {
    top1: 11.5,
    top10: 30.8,
    middle40: 44.5,
    bottom50: 24.7,
  },
  giniWealth: 0.79,
  giniIncome: 0.28,
  medianWealthPerAdult: 117950,
  meanWealthPerAdult: 353380,
  population: 5.5,
  currency: "NOK",
  medianIncome: 41320,
  historicalWealthTop1: [
    { year: 1980, share: 18.0 },
    { year: 1990, share: 19.0 },
    { year: 2000, share: 22.5 },
    { year: 2005, share: 24.0 },
    { year: 2010, share: 25.5 },
    { year: 2015, share: 26.5 },
    { year: 2020, share: 27.0 },
    { year: 2023, share: 27.5 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 50.0 },
    { year: 1990, share: 51.5 },
    { year: 2000, share: 55.0 },
    { year: 2005, share: 56.5 },
    { year: 2010, share: 58.0 },
    { year: 2015, share: 59.0 },
    { year: 2020, share: 59.8 },
    { year: 2023, share: 60.2 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 7.5 },
    { year: 1990, share: 7.0 },
    { year: 2000, share: 6.5 },
    { year: 2005, share: 6.2 },
    { year: 2010, share: 6.0 },
    { year: 2015, share: 5.9 },
    { year: 2020, share: 5.8 },
    { year: 2023, share: 5.8 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.24 },
    { year: 1990, gini: 0.25 },
    { year: 2000, gini: 0.28 },
    { year: 2005, gini: 0.28 },
    { year: 2010, gini: 0.27 },
    { year: 2015, gini: 0.27 },
    { year: 2020, gini: 0.28 },
    { year: 2023, gini: 0.28 },
  ],
};

/**
 * DENMARK
 *
 * Sources:
 * - WID.world: Denmark wealth shares 2023 (shweal992j)
 * - WID.world: Denmark income shares 2023 (sptinc992j)
 * - Atkinson, A.B. & Sogaard, J.E. (2016). "The Long-Run History
 *   of Income Inequality in Denmark." Scandinavian Journal of
 *   Economics, 118(2), 264-291.
 */
const denmark: ExtendedCountryData = {
  code: "DK",
  name: "Denmark",
  flag: "\u{1F1E9}\u{1F1F0}",
  wealthShares: {
    top1: 28.8,
    top10: 64.0,
    middle40: 31.8,
    bottom50: 4.2,
  },
  incomeShares: {
    top1: 10.8,
    top10: 29.8,
    middle40: 45.5,
    bottom50: 24.7,
  },
  giniWealth: 0.84,
  giniIncome: 0.29,
  medianWealthPerAdult: 165621,
  meanWealthPerAdult: 386733,
  population: 5.9,
  currency: "DKK",
  medianIncome: 38520,
  historicalWealthTop1: [
    { year: 1980, share: 20.0 },
    { year: 1990, share: 20.5 },
    { year: 2000, share: 24.0 },
    { year: 2005, share: 25.5 },
    { year: 2010, share: 27.0 },
    { year: 2015, share: 28.0 },
    { year: 2020, share: 28.5 },
    { year: 2023, share: 28.8 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 52.0 },
    { year: 1990, share: 54.0 },
    { year: 2000, share: 58.0 },
    { year: 2005, share: 60.0 },
    { year: 2010, share: 62.0 },
    { year: 2015, share: 63.0 },
    { year: 2020, share: 63.5 },
    { year: 2023, share: 64.0 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 6.5 },
    { year: 1990, share: 6.0 },
    { year: 2000, share: 5.0 },
    { year: 2005, share: 4.8 },
    { year: 2010, share: 4.5 },
    { year: 2015, share: 4.3 },
    { year: 2020, share: 4.2 },
    { year: 2023, share: 4.2 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.25 },
    { year: 1990, gini: 0.25 },
    { year: 2000, gini: 0.26 },
    { year: 2005, gini: 0.27 },
    { year: 2010, gini: 0.28 },
    { year: 2015, gini: 0.29 },
    { year: 2020, gini: 0.29 },
    { year: 2023, gini: 0.29 },
  ],
};

/**
 * FINLAND
 *
 * Sources:
 * - WID.world: Finland wealth shares 2023 (shweal992j)
 * - WID.world: Finland income shares 2023 (sptinc992j)
 * - Janntti, M. et al. (2010). "Top Incomes in Finland." In:
 *   Atkinson, A.B. & Piketty, T. (eds.), Top Incomes.
 */
const finland: ExtendedCountryData = {
  code: "FI",
  name: "Finland",
  flag: "\u{1F1EB}\u{1F1EE}",
  wealthShares: {
    top1: 19.4,
    top10: 52.5,
    middle40: 39.5,
    bottom50: 8.0,
  },
  incomeShares: {
    top1: 10.3,
    top10: 30.5,
    middle40: 45.0,
    bottom50: 24.5,
  },
  giniWealth: 0.74,
  giniIncome: 0.28,
  medianWealthPerAdult: 89170,
  meanWealthPerAdult: 196050,
  population: 5.6,
  currency: "EUR",
  medianIncome: 32370,
  historicalWealthTop1: [
    { year: 1980, share: 14.0 },
    { year: 1990, share: 13.5 },
    { year: 2000, share: 17.0 },
    { year: 2005, share: 18.0 },
    { year: 2010, share: 18.5 },
    { year: 2015, share: 19.0 },
    { year: 2020, share: 19.2 },
    { year: 2023, share: 19.4 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 43.0 },
    { year: 1990, share: 42.5 },
    { year: 2000, share: 47.5 },
    { year: 2005, share: 49.5 },
    { year: 2010, share: 50.5 },
    { year: 2015, share: 51.5 },
    { year: 2020, share: 52.0 },
    { year: 2023, share: 52.5 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 10.5 },
    { year: 1990, share: 10.0 },
    { year: 2000, share: 9.0 },
    { year: 2005, share: 8.5 },
    { year: 2010, share: 8.3 },
    { year: 2015, share: 8.1 },
    { year: 2020, share: 8.0 },
    { year: 2023, share: 8.0 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.22 },
    { year: 1990, gini: 0.23 },
    { year: 2000, gini: 0.27 },
    { year: 2005, gini: 0.27 },
    { year: 2010, gini: 0.28 },
    { year: 2015, gini: 0.28 },
    { year: 2020, gini: 0.28 },
    { year: 2023, gini: 0.28 },
  ],
};

// ---------------------------------------------------------------------------
// WESTERN & CENTRAL EUROPE
// ---------------------------------------------------------------------------

/**
 * SWITZERLAND
 *
 * Sources:
 * - WID.world: Switzerland wealth shares 2023 (shweal992j)
 * - WID.world: Switzerland income shares 2023 (sptinc992j)
 * - Dell, F., Piketty, T., Saez, E. (2007). "Income and Wealth
 *   Concentration in Switzerland over the 20th Century." In:
 *   Atkinson, A.B. & Piketty, T. (eds.), Top Incomes over the
 *   Twentieth Century. Oxford University Press.
 */
const switzerland: ExtendedCountryData = {
  code: "CH",
  name: "Switzerland",
  flag: "\u{1F1E8}\u{1F1ED}",
  wealthShares: {
    top1: 42.3,
    top10: 74.7,
    middle40: 22.8,
    bottom50: 2.5,
  },
  incomeShares: {
    top1: 11.3,
    top10: 32.0,
    middle40: 44.8,
    bottom50: 23.2,
  },
  giniWealth: 0.88,
  giniIncome: 0.33,
  medianWealthPerAdult: 171057,
  meanWealthPerAdult: 685226,
  population: 8.8,
  currency: "CHF",
  medianIncome: 42380,
  historicalWealthTop1: [
    { year: 1980, share: 33.0 },
    { year: 1990, share: 34.5 },
    { year: 2000, share: 37.5 },
    { year: 2005, share: 39.0 },
    { year: 2010, share: 40.5 },
    { year: 2015, share: 41.5 },
    { year: 2020, share: 42.0 },
    { year: 2023, share: 42.3 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 65.0 },
    { year: 1990, share: 67.0 },
    { year: 2000, share: 70.0 },
    { year: 2005, share: 71.5 },
    { year: 2010, share: 73.0 },
    { year: 2015, share: 74.0 },
    { year: 2020, share: 74.5 },
    { year: 2023, share: 74.7 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 4.5 },
    { year: 1990, share: 4.0 },
    { year: 2000, share: 3.5 },
    { year: 2005, share: 3.0 },
    { year: 2010, share: 2.8 },
    { year: 2015, share: 2.6 },
    { year: 2020, share: 2.5 },
    { year: 2023, share: 2.5 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.31 },
    { year: 1990, gini: 0.31 },
    { year: 2000, gini: 0.32 },
    { year: 2005, gini: 0.32 },
    { year: 2010, gini: 0.33 },
    { year: 2015, gini: 0.33 },
    { year: 2020, gini: 0.33 },
    { year: 2023, gini: 0.33 },
  ],
};

/**
 * ITALY
 *
 * Sources:
 * - WID.world: Italy wealth shares 2023 (shweal992j)
 * - WID.world: Italy income shares 2023 (sptinc992j)
 * - Alvaredo, F. & Pisano, E. (2010). "Top Incomes in Italy,
 *   1974-2004." In: Atkinson, A.B. & Piketty, T. (eds.), Top Incomes.
 */
const italy: ExtendedCountryData = {
  code: "IT",
  name: "Italy",
  flag: "\u{1F1EE}\u{1F1F9}",
  wealthShares: {
    top1: 22.0,
    top10: 56.7,
    middle40: 37.0,
    bottom50: 6.3,
  },
  incomeShares: {
    top1: 13.8,
    top10: 35.2,
    middle40: 43.0,
    bottom50: 21.8,
  },
  giniWealth: 0.69,
  giniIncome: 0.36,
  medianWealthPerAdult: 118885,
  meanWealthPerAdult: 269364,
  population: 58.8,
  currency: "EUR",
  medianIncome: 22190,
  historicalWealthTop1: [
    { year: 1980, share: 16.0 },
    { year: 1990, share: 17.5 },
    { year: 2000, share: 19.5 },
    { year: 2005, share: 20.5 },
    { year: 2010, share: 21.0 },
    { year: 2015, share: 21.5 },
    { year: 2020, share: 21.8 },
    { year: 2023, share: 22.0 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 46.0 },
    { year: 1990, share: 48.5 },
    { year: 2000, share: 52.0 },
    { year: 2005, share: 53.5 },
    { year: 2010, share: 55.0 },
    { year: 2015, share: 55.8 },
    { year: 2020, share: 56.3 },
    { year: 2023, share: 56.7 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 9.5 },
    { year: 1990, share: 8.5 },
    { year: 2000, share: 7.5 },
    { year: 2005, share: 7.0 },
    { year: 2010, share: 6.5 },
    { year: 2015, share: 6.4 },
    { year: 2020, share: 6.3 },
    { year: 2023, share: 6.3 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.31 },
    { year: 1990, gini: 0.33 },
    { year: 2000, gini: 0.35 },
    { year: 2005, gini: 0.35 },
    { year: 2010, gini: 0.35 },
    { year: 2015, gini: 0.36 },
    { year: 2020, gini: 0.36 },
    { year: 2023, gini: 0.36 },
  ],
};

/**
 * SPAIN
 *
 * Sources:
 * - WID.world: Spain wealth shares 2023 (shweal992j)
 * - WID.world: Spain income shares 2023 (sptinc992j)
 * - Alvaredo, F. & Saez, E. (2009). "Income and Wealth Concentration
 *   in Spain from a Historical and Fiscal Perspective." Journal of the
 *   European Economic Association, 7(5), 1140-1167.
 */
const spain: ExtendedCountryData = {
  code: "ES",
  name: "Spain",
  flag: "\u{1F1EA}\u{1F1F8}",
  wealthShares: {
    top1: 21.3,
    top10: 55.7,
    middle40: 37.5,
    bottom50: 6.8,
  },
  incomeShares: {
    top1: 12.1,
    top10: 33.5,
    middle40: 43.8,
    bottom50: 22.7,
  },
  giniWealth: 0.70,
  giniIncome: 0.35,
  medianWealthPerAdult: 105831,
  meanWealthPerAdult: 247135,
  population: 47.4,
  currency: "EUR",
  medianIncome: 20850,
  historicalWealthTop1: [
    { year: 1980, share: 17.0 },
    { year: 1990, share: 18.0 },
    { year: 2000, share: 19.5 },
    { year: 2005, share: 20.0 },
    { year: 2010, share: 20.5 },
    { year: 2015, share: 21.0 },
    { year: 2020, share: 21.2 },
    { year: 2023, share: 21.3 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 45.0 },
    { year: 1990, share: 47.5 },
    { year: 2000, share: 51.0 },
    { year: 2005, share: 52.5 },
    { year: 2010, share: 54.0 },
    { year: 2015, share: 55.0 },
    { year: 2020, share: 55.5 },
    { year: 2023, share: 55.7 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 10.0 },
    { year: 1990, share: 9.0 },
    { year: 2000, share: 8.0 },
    { year: 2005, share: 7.5 },
    { year: 2010, share: 7.0 },
    { year: 2015, share: 6.9 },
    { year: 2020, share: 6.8 },
    { year: 2023, share: 6.8 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.33 },
    { year: 1990, gini: 0.34 },
    { year: 2000, gini: 0.34 },
    { year: 2005, gini: 0.33 },
    { year: 2010, gini: 0.35 },
    { year: 2015, gini: 0.36 },
    { year: 2020, gini: 0.35 },
    { year: 2023, gini: 0.35 },
  ],
};

/**
 * PORTUGAL
 *
 * Sources:
 * - WID.world: Portugal wealth shares 2023 (shweal992j)
 * - WID.world: Portugal income shares 2023 (sptinc992j)
 * - Alvaredo, F. (2009). "Top Incomes and Earnings in Portugal
 *   1936-2005." Explorations in Economic History, 46(4), 404-417.
 */
const portugal: ExtendedCountryData = {
  code: "PT",
  name: "Portugal",
  flag: "\u{1F1F5}\u{1F1F9}",
  wealthShares: {
    top1: 20.5,
    top10: 54.8,
    middle40: 38.0,
    bottom50: 7.2,
  },
  incomeShares: {
    top1: 12.5,
    top10: 34.0,
    middle40: 43.5,
    bottom50: 22.5,
  },
  giniWealth: 0.69,
  giniIncome: 0.35,
  medianWealthPerAdult: 80510,
  meanWealthPerAdult: 183570,
  population: 10.3,
  currency: "EUR",
  medianIncome: 15420,
  historicalWealthTop1: [
    { year: 1980, share: 16.0 },
    { year: 1990, share: 17.0 },
    { year: 2000, share: 18.5 },
    { year: 2005, share: 19.0 },
    { year: 2010, share: 19.5 },
    { year: 2015, share: 20.0 },
    { year: 2020, share: 20.3 },
    { year: 2023, share: 20.5 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 44.0 },
    { year: 1990, share: 46.5 },
    { year: 2000, share: 50.0 },
    { year: 2005, share: 51.5 },
    { year: 2010, share: 53.0 },
    { year: 2015, share: 54.0 },
    { year: 2020, share: 54.5 },
    { year: 2023, share: 54.8 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 9.5 },
    { year: 1990, share: 9.0 },
    { year: 2000, share: 8.0 },
    { year: 2005, share: 7.8 },
    { year: 2010, share: 7.5 },
    { year: 2015, share: 7.3 },
    { year: 2020, share: 7.2 },
    { year: 2023, share: 7.2 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.33 },
    { year: 1990, gini: 0.36 },
    { year: 2000, gini: 0.37 },
    { year: 2005, gini: 0.37 },
    { year: 2010, gini: 0.36 },
    { year: 2015, gini: 0.35 },
    { year: 2020, gini: 0.35 },
    { year: 2023, gini: 0.35 },
  ],
};

/**
 * AUSTRIA
 *
 * Sources:
 * - WID.world: Austria wealth shares 2023 (shweal992j)
 * - WID.world: Austria income shares 2023 (sptinc992j)
 * - Eckerstorfer, P. et al. (2016). "Top Incomes in Austria,
 *   1981-2010." Review of Income and Wealth, 62(2), 221-246.
 */
const austria: ExtendedCountryData = {
  code: "AT",
  name: "Austria",
  flag: "\u{1F1E6}\u{1F1F9}",
  wealthShares: {
    top1: 25.2,
    top10: 61.8,
    middle40: 33.2,
    bottom50: 5.0,
  },
  incomeShares: {
    top1: 11.0,
    top10: 31.5,
    middle40: 44.5,
    bottom50: 24.0,
  },
  giniWealth: 0.78,
  giniIncome: 0.31,
  medianWealthPerAdult: 72380,
  meanWealthPerAdult: 275690,
  population: 9.1,
  currency: "EUR",
  medianIncome: 30760,
  historicalWealthTop1: [
    { year: 1980, share: 18.0 },
    { year: 1990, share: 19.5 },
    { year: 2000, share: 22.0 },
    { year: 2005, share: 23.0 },
    { year: 2010, share: 24.0 },
    { year: 2015, share: 24.8 },
    { year: 2020, share: 25.0 },
    { year: 2023, share: 25.2 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 50.0 },
    { year: 1990, share: 52.5 },
    { year: 2000, share: 56.0 },
    { year: 2005, share: 58.0 },
    { year: 2010, share: 59.5 },
    { year: 2015, share: 60.5 },
    { year: 2020, share: 61.5 },
    { year: 2023, share: 61.8 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 7.5 },
    { year: 1990, share: 7.0 },
    { year: 2000, share: 6.0 },
    { year: 2005, share: 5.5 },
    { year: 2010, share: 5.2 },
    { year: 2015, share: 5.0 },
    { year: 2020, share: 5.0 },
    { year: 2023, share: 5.0 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.26 },
    { year: 1990, gini: 0.27 },
    { year: 2000, gini: 0.29 },
    { year: 2005, gini: 0.29 },
    { year: 2010, gini: 0.30 },
    { year: 2015, gini: 0.30 },
    { year: 2020, gini: 0.31 },
    { year: 2023, gini: 0.31 },
  ],
};

/**
 * BELGIUM
 *
 * Sources:
 * - WID.world: Belgium wealth shares 2023 (shweal992j)
 * - WID.world: Belgium income shares 2023 (sptinc992j)
 * - Rademaekers, K. & Vuchelen, J. (2005). "The Distribution of
 *   Household Wealth in Belgium." Journal of Income Distribution,
 *   14(3-4), 50-83.
 */
const belgium: ExtendedCountryData = {
  code: "BE",
  name: "Belgium",
  flag: "\u{1F1E7}\u{1F1EA}",
  wealthShares: {
    top1: 18.6,
    top10: 50.5,
    middle40: 40.5,
    bottom50: 9.0,
  },
  incomeShares: {
    top1: 9.8,
    top10: 29.8,
    middle40: 45.5,
    bottom50: 24.7,
  },
  giniWealth: 0.67,
  giniIncome: 0.28,
  medianWealthPerAdult: 249937,
  meanWealthPerAdult: 393740,
  population: 11.7,
  currency: "EUR",
  medianIncome: 29650,
  historicalWealthTop1: [
    { year: 1980, share: 16.0 },
    { year: 1990, share: 16.5 },
    { year: 2000, share: 17.5 },
    { year: 2005, share: 17.8 },
    { year: 2010, share: 18.0 },
    { year: 2015, share: 18.3 },
    { year: 2020, share: 18.5 },
    { year: 2023, share: 18.6 },
  ],
  historicalWealthTop10: [
    { year: 1980, share: 44.0 },
    { year: 1990, share: 45.5 },
    { year: 2000, share: 47.5 },
    { year: 2005, share: 48.5 },
    { year: 2010, share: 49.0 },
    { year: 2015, share: 49.8 },
    { year: 2020, share: 50.2 },
    { year: 2023, share: 50.5 },
  ],
  historicalWealthBottom50: [
    { year: 1980, share: 11.5 },
    { year: 1990, share: 11.0 },
    { year: 2000, share: 10.0 },
    { year: 2005, share: 9.5 },
    { year: 2010, share: 9.3 },
    { year: 2015, share: 9.1 },
    { year: 2020, share: 9.0 },
    { year: 2023, share: 9.0 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.26 },
    { year: 1990, gini: 0.26 },
    { year: 2000, gini: 0.28 },
    { year: 2005, gini: 0.28 },
    { year: 2010, gini: 0.28 },
    { year: 2015, gini: 0.28 },
    { year: 2020, gini: 0.28 },
    { year: 2023, gini: 0.28 },
  ],
};

/**
 * IRELAND
 *
 * Sources:
 * - WID.world: Ireland wealth shares 2023 (shweal992j)
 * - WID.world: Ireland income shares 2023 (sptinc992j)
 * - CSO (Central Statistics Office), Household Finance and
 *   Consumption Survey (HFCS) 2020
 */
const ireland: ExtendedCountryData = {
  code: "IE",
  name: "Ireland",
  flag: "\u{1F1EE}\u{1F1EA}",
  wealthShares: {
    top1: 22.8,
    top10: 56.5,
    middle40: 36.8,
    bottom50: 6.7,
  },
  incomeShares: {
    top1: 12.8,
    top10: 34.5,
    middle40: 43.0,
    bottom50: 22.5,
  },
  giniWealth: 0.74,
  giniIncome: 0.35,
  medianWealthPerAdult: 184820,
  meanWealthPerAdult: 386710,
  population: 5.1,
  currency: "EUR",
  medianIncome: 32450,
  historicalWealthTop1: [
    { year: 1990, share: 17.5 },
    { year: 2000, share: 19.5 },
    { year: 2005, share: 20.5 },
    { year: 2010, share: 21.5 },
    { year: 2015, share: 22.0 },
    { year: 2020, share: 22.5 },
    { year: 2023, share: 22.8 },
  ],
  historicalWealthTop10: [
    { year: 1990, share: 48.0 },
    { year: 2000, share: 51.5 },
    { year: 2005, share: 53.0 },
    { year: 2010, share: 54.5 },
    { year: 2015, share: 55.5 },
    { year: 2020, share: 56.0 },
    { year: 2023, share: 56.5 },
  ],
  historicalWealthBottom50: [
    { year: 1990, share: 8.5 },
    { year: 2000, share: 7.8 },
    { year: 2005, share: 7.3 },
    { year: 2010, share: 7.0 },
    { year: 2015, share: 6.8 },
    { year: 2020, share: 6.7 },
    { year: 2023, share: 6.7 },
  ],
  historicalGini: [
    { year: 1990, gini: 0.34 },
    { year: 2000, gini: 0.33 },
    { year: 2005, gini: 0.33 },
    { year: 2010, gini: 0.33 },
    { year: 2015, gini: 0.35 },
    { year: 2020, gini: 0.35 },
    { year: 2023, gini: 0.35 },
  ],
};

// ---------------------------------------------------------------------------
// CENTRAL & EASTERN EUROPE
// ---------------------------------------------------------------------------

/**
 * POLAND
 *
 * Sources:
 * - WID.world: Poland wealth shares 2023 (shweal992j)
 * - WID.world: Poland income shares 2023 (sptinc992j)
 * - Novokmet, F., Piketty, T., Zucman, G. (2018). "From Soviets to
 *   Oligarchs: Inequality and Property in Russia 1905-2016."
 *   (Methodology applied across Eastern Europe.)
 */
const poland: ExtendedCountryData = {
  code: "PL",
  name: "Poland",
  flag: "\u{1F1F5}\u{1F1F1}",
  wealthShares: {
    top1: 20.3,
    top10: 57.0,
    middle40: 36.5,
    bottom50: 6.5,
  },
  incomeShares: {
    top1: 14.1,
    top10: 36.5,
    middle40: 42.0,
    bottom50: 21.5,
  },
  giniWealth: 0.73,
  giniIncome: 0.36,
  medianWealthPerAdult: 30713,
  meanWealthPerAdult: 90432,
  population: 36.8,
  currency: "PLN",
  medianIncome: 16280,
  historicalWealthTop1: [
    { year: 1990, share: 8.0 },
    { year: 2000, share: 14.0 },
    { year: 2005, share: 16.5 },
    { year: 2010, share: 18.0 },
    { year: 2015, share: 19.0 },
    { year: 2020, share: 20.0 },
    { year: 2023, share: 20.3 },
  ],
  historicalWealthTop10: [
    { year: 1990, share: 30.0 },
    { year: 2000, share: 42.0 },
    { year: 2005, share: 48.0 },
    { year: 2010, share: 52.0 },
    { year: 2015, share: 55.0 },
    { year: 2020, share: 56.5 },
    { year: 2023, share: 57.0 },
  ],
  historicalWealthBottom50: [
    { year: 1990, share: 14.0 },
    { year: 2000, share: 10.0 },
    { year: 2005, share: 8.5 },
    { year: 2010, share: 7.5 },
    { year: 2015, share: 7.0 },
    { year: 2020, share: 6.6 },
    { year: 2023, share: 6.5 },
  ],
  historicalGini: [
    { year: 1990, gini: 0.27 },
    { year: 2000, gini: 0.34 },
    { year: 2005, gini: 0.35 },
    { year: 2010, gini: 0.35 },
    { year: 2015, gini: 0.35 },
    { year: 2020, gini: 0.36 },
    { year: 2023, gini: 0.36 },
  ],
};

/**
 * CZECH REPUBLIC
 *
 * Sources:
 * - WID.world: Czech Republic wealth shares 2023 (shweal992j)
 * - WID.world: Czech Republic income shares 2023 (sptinc992j)
 * - Czech Statistical Office, EU-SILC data
 */
const czechRepublic: ExtendedCountryData = {
  code: "CZ",
  name: "Czech Republic",
  flag: "\u{1F1E8}\u{1F1FF}",
  wealthShares: {
    top1: 17.5,
    top10: 53.0,
    middle40: 39.0,
    bottom50: 8.0,
  },
  incomeShares: {
    top1: 11.2,
    top10: 30.5,
    middle40: 44.5,
    bottom50: 25.0,
  },
  giniWealth: 0.70,
  giniIncome: 0.27,
  medianWealthPerAdult: 43970,
  meanWealthPerAdult: 108230,
  population: 10.8,
  currency: "CZK",
  medianIncome: 17930,
  historicalWealthTop1: [
    { year: 1993, share: 7.0 },
    { year: 2000, share: 11.5 },
    { year: 2005, share: 13.5 },
    { year: 2010, share: 15.0 },
    { year: 2015, share: 16.0 },
    { year: 2020, share: 17.0 },
    { year: 2023, share: 17.5 },
  ],
  historicalWealthTop10: [
    { year: 1993, share: 28.0 },
    { year: 2000, share: 38.0 },
    { year: 2005, share: 43.0 },
    { year: 2010, share: 47.5 },
    { year: 2015, share: 50.5 },
    { year: 2020, share: 52.5 },
    { year: 2023, share: 53.0 },
  ],
  historicalWealthBottom50: [
    { year: 1993, share: 16.0 },
    { year: 2000, share: 12.0 },
    { year: 2005, share: 10.0 },
    { year: 2010, share: 9.0 },
    { year: 2015, share: 8.5 },
    { year: 2020, share: 8.0 },
    { year: 2023, share: 8.0 },
  ],
  historicalGini: [
    { year: 1993, gini: 0.21 },
    { year: 2000, gini: 0.26 },
    { year: 2005, gini: 0.27 },
    { year: 2010, gini: 0.27 },
    { year: 2015, gini: 0.27 },
    { year: 2020, gini: 0.27 },
    { year: 2023, gini: 0.27 },
  ],
};

// ---------------------------------------------------------------------------
// AGGREGATED EXPORTS
// ---------------------------------------------------------------------------

/**
 * Array of all 25 extended country data entries.
 * Does not include the core 5 (US, GB, FR, DE, NL).
 */
export const EXTENDED_COUNTRIES: readonly CountryData[] = [
  canada as unknown as CountryData,
  australia as unknown as CountryData,
  newZealand as unknown as CountryData,
  japan as unknown as CountryData,
  southKorea as unknown as CountryData,
  china as unknown as CountryData,
  singapore as unknown as CountryData,
  india as unknown as CountryData,
  brazil as unknown as CountryData,
  mexico as unknown as CountryData,
  chile as unknown as CountryData,
  southAfrica as unknown as CountryData,
  sweden as unknown as CountryData,
  norway as unknown as CountryData,
  denmark as unknown as CountryData,
  finland as unknown as CountryData,
  switzerland as unknown as CountryData,
  italy as unknown as CountryData,
  spain as unknown as CountryData,
  portugal as unknown as CountryData,
  austria as unknown as CountryData,
  belgium as unknown as CountryData,
  ireland as unknown as CountryData,
  poland as unknown as CountryData,
  czechRepublic as unknown as CountryData,
];

/**
 * Map of extended country code to data (excludes core 5).
 */
export const EXTENDED_COUNTRY_MAP: Readonly<Record<ExtendedCountryCode, CountryData>> = {
  CA: canada as unknown as CountryData,
  AU: australia as unknown as CountryData,
  NZ: newZealand as unknown as CountryData,
  JP: japan as unknown as CountryData,
  KR: southKorea as unknown as CountryData,
  CN: china as unknown as CountryData,
  SG: singapore as unknown as CountryData,
  IN: india as unknown as CountryData,
  BR: brazil as unknown as CountryData,
  MX: mexico as unknown as CountryData,
  CL: chile as unknown as CountryData,
  ZA: southAfrica as unknown as CountryData,
  SE: sweden as unknown as CountryData,
  NO: norway as unknown as CountryData,
  DK: denmark as unknown as CountryData,
  FI: finland as unknown as CountryData,
  CH: switzerland as unknown as CountryData,
  IT: italy as unknown as CountryData,
  ES: spain as unknown as CountryData,
  PT: portugal as unknown as CountryData,
  AT: austria as unknown as CountryData,
  BE: belgium as unknown as CountryData,
  IE: ireland as unknown as CountryData,
  PL: poland as unknown as CountryData,
  CZ: czechRepublic as unknown as CountryData,
};

/**
 * Combined array of all 30 countries (core 5 + extended 25).
 */
export const ALL_COUNTRIES: readonly CountryData[] = [
  ...COUNTRIES,
  ...EXTENDED_COUNTRIES,
];

/**
 * Combined map of all 30 country codes to data.
 */
export const ALL_COUNTRY_MAP: Readonly<Record<AllCountryCode, CountryData>> = {
  ...COUNTRY_MAP,
  ...EXTENDED_COUNTRY_MAP,
} as Readonly<Record<AllCountryCode, CountryData>>;
