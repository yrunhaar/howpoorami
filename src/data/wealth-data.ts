/**
 * Curated wealth and income inequality dataset.
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
 * - OECD Wealth Distribution Database, December 2024
 *   https://www.oecd.org/en/data/datasets/income-and-wealth-distribution-database.html
 *
 * - Standardized World Income Inequality Database (SWIID) v9.6
 *   Solt, Frederick. 2024. https://fsolt.org/swiid/
 *
 * All wealth shares are expressed as percentage of total national wealth.
 * All income shares are expressed as percentage of total national income (pre-tax).
 * Data is for adults (20+), equal-split among couples where applicable.
 *
 * IMPORTANT: These figures are based on published academic research and may
 * differ slightly from other estimates due to methodological differences.
 */

export type CountryCode = "US" | "GB" | "FR" | "DE" | "NL";

export interface CountryData {
  readonly code: CountryCode;
  readonly name: string;
  readonly flag: string;
  readonly wealthShares: {
    readonly top1: number;
    readonly top10: number;
    readonly middle40: number;
    readonly bottom50: number;
  };
  readonly incomeShares: {
    readonly top1: number;
    readonly top10: number;
    readonly middle40: number;
    readonly bottom50: number;
  };
  readonly giniWealth: number;
  readonly giniIncome: number;
  readonly medianWealthPerAdult: number; // USD PPP 2023
  readonly meanWealthPerAdult: number; // USD PPP 2023
  readonly population: number; // millions, 2023
  readonly currency: string;
  readonly medianIncome: number; // annual, 2023 — local currency for core countries, USD PPP for extended
  readonly historicalWealthTop1: readonly { readonly year: number; readonly share: number }[];
  readonly historicalWealthTop10: readonly { readonly year: number; readonly share: number }[];
  readonly historicalWealthBottom50: readonly { readonly year: number; readonly share: number }[];
  readonly historicalGini: readonly { readonly year: number; readonly gini: number }[];
}

/**
 * Wealth distribution data by percentile for visualization.
 * Each entry represents a percentile point (0-100) and the cumulative
 * share of wealth held by that bottom percentage of the population.
 * This forms the Lorenz curve.
 *
 * Source: Derived from WID.world percentile data (2023/2024).
 * The curve is interpolated from reported percentile breakpoints
 * (p0-p50, p50-p90, p90-p99, p99-p100).
 */
export interface LorenzPoint {
  readonly population: number; // 0-100
  readonly wealth: number; // 0-100 (cumulative share)
}

// Helper to generate Lorenz curve from wealth share data
function generateLorenzCurve(
  bottom50Share: number,
  middle40Share: number,
  top10Share: number,
  top1Share: number
): readonly LorenzPoint[] {
  const next9Share = top10Share - top1Share;
  const points: LorenzPoint[] = [{ population: 0, wealth: 0 }];

  // Bottom 50% - distribute linearly (simplified)
  for (let i = 5; i <= 50; i += 5) {
    points.push({
      population: i,
      wealth: (i / 50) * bottom50Share,
    });
  }

  // Middle 40% (p50-p90)
  for (let i = 55; i <= 90; i += 5) {
    const progress = (i - 50) / 40;
    points.push({
      population: i,
      wealth: bottom50Share + progress * middle40Share,
    });
  }

  // Next 9% (p90-p99)
  for (let i = 91; i <= 99; i += 1) {
    const progress = (i - 90) / 9;
    points.push({
      population: i,
      wealth: bottom50Share + middle40Share + progress * next9Share,
    });
  }

  // Top 1%
  points.push({ population: 100, wealth: 100 });

  return points;
}

/**
 * UNITED STATES
 *
 * Sources:
 * - WID.world: USA wealth shares 2023 (shweal992j, equal-split adults)
 * - WID.world: USA income shares 2023 (sptinc992j)
 * - Federal Reserve Distributional Financial Accounts (DFA), Q4 2023
 * - Saez, E. & Zucman, G. (2016). "Wealth Inequality in the United States
 *   since 1913." Quarterly Journal of Economics, 131(2), 519-578.
 */
const unitedStates: CountryData = {
  code: "US",
  name: "United States",
  flag: "🇺🇸",
  wealthShares: {
    top1: 34.9,
    top10: 71.1,
    middle40: 27.4,
    bottom50: 1.5,
  },
  incomeShares: {
    top1: 21.4,
    top10: 46.4,
    middle40: 40.6,
    bottom50: 13.0,
  },
  giniWealth: 0.85,
  giniIncome: 0.48,
  medianWealthPerAdult: 107740,
  meanWealthPerAdult: 551350,
  population: 334.9,
  currency: "USD",
  medianIncome: 40480,
  historicalWealthTop1: [
    { year: 1913, share: 42.0 },
    { year: 1929, share: 44.2 },
    { year: 1940, share: 33.0 },
    { year: 1950, share: 27.1 },
    { year: 1960, share: 26.0 },
    { year: 1970, share: 22.5 },
    { year: 1980, share: 22.8 },
    { year: 1990, share: 27.2 },
    { year: 2000, share: 32.6 },
    { year: 2010, share: 33.4 },
    { year: 2015, share: 36.7 },
    { year: 2020, share: 34.9 },
    { year: 2023, share: 34.9 },
  ],
  historicalWealthTop10: [
    { year: 1913, share: 81.0 },
    { year: 1929, share: 83.6 },
    { year: 1940, share: 74.0 },
    { year: 1950, share: 67.0 },
    { year: 1960, share: 65.6 },
    { year: 1970, share: 62.2 },
    { year: 1980, share: 62.4 },
    { year: 1990, share: 64.2 },
    { year: 2000, share: 69.8 },
    { year: 2010, share: 71.5 },
    { year: 2015, share: 73.0 },
    { year: 2020, share: 70.7 },
    { year: 2023, share: 71.2 },
  ],
  historicalWealthBottom50: [
    { year: 1913, share: 0.4 },
    { year: 1929, share: -0.1 },
    { year: 1940, share: 1.5 },
    { year: 1950, share: 3.3 },
    { year: 1960, share: 3.5 },
    { year: 1970, share: 4.1 },
    { year: 1980, share: 3.7 },
    { year: 1990, share: 3.0 },
    { year: 2000, share: 1.8 },
    { year: 2010, share: -0.2 },
    { year: 2015, share: 0.1 },
    { year: 2020, share: 1.5 },
    { year: 2023, share: 1.5 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.41 },
    { year: 1985, gini: 0.42 },
    { year: 1990, gini: 0.43 },
    { year: 1995, gini: 0.45 },
    { year: 2000, gini: 0.46 },
    { year: 2005, gini: 0.47 },
    { year: 2010, gini: 0.47 },
    { year: 2015, gini: 0.48 },
    { year: 2020, gini: 0.49 },
    { year: 2023, gini: 0.48 },
  ],
};

/**
 * UNITED KINGDOM
 *
 * Sources:
 * - WID.world: UK wealth shares 2023 (shweal992j)
 * - WID.world: UK income shares 2023 (sptinc992j)
 * - ONS Wealth and Assets Survey (WAS), Wave 8 (2018-2020)
 * - Alvaredo, F., Atkinson, A.B., Morelli, S. (2018).
 *   "Top Wealth Shares in the UK over More than a Century."
 *   Journal of Public Economics, 162, 26-47.
 */
const unitedKingdom: CountryData = {
  code: "GB",
  name: "United Kingdom",
  flag: "🇬🇧",
  wealthShares: {
    top1: 22.6,
    top10: 57.4,
    middle40: 36.8,
    bottom50: 5.8,
  },
  incomeShares: {
    top1: 14.6,
    top10: 35.3,
    middle40: 42.9,
    bottom50: 21.8,
  },
  giniWealth: 0.75,
  giniIncome: 0.37,
  medianWealthPerAdult: 151084,
  meanWealthPerAdult: 308462,
  population: 68.3,
  currency: "GBP",
  medianIncome: 29588,
  historicalWealthTop1: [
    { year: 1913, share: 69.0 },
    { year: 1929, share: 60.0 },
    { year: 1940, share: 55.0 },
    { year: 1950, share: 43.0 },
    { year: 1960, share: 34.0 },
    { year: 1970, share: 27.0 },
    { year: 1980, share: 20.0 },
    { year: 1990, share: 17.0 },
    { year: 2000, share: 20.5 },
    { year: 2010, share: 20.9 },
    { year: 2015, share: 21.4 },
    { year: 2020, share: 22.0 },
    { year: 2023, share: 22.6 },
  ],
  historicalWealthTop10: [
    { year: 1913, share: 92.0 },
    { year: 1929, share: 86.0 },
    { year: 1940, share: 80.0 },
    { year: 1950, share: 72.0 },
    { year: 1960, share: 67.0 },
    { year: 1970, share: 62.0 },
    { year: 1980, share: 50.0 },
    { year: 1990, share: 47.0 },
    { year: 2000, share: 52.5 },
    { year: 2010, share: 54.0 },
    { year: 2015, share: 55.5 },
    { year: 2020, share: 56.8 },
    { year: 2023, share: 57.4 },
  ],
  historicalWealthBottom50: [
    { year: 1913, share: 0.5 },
    { year: 1929, share: 1.0 },
    { year: 1940, share: 2.0 },
    { year: 1950, share: 3.5 },
    { year: 1960, share: 5.0 },
    { year: 1970, share: 6.5 },
    { year: 1980, share: 8.5 },
    { year: 1990, share: 8.0 },
    { year: 2000, share: 7.0 },
    { year: 2010, share: 6.5 },
    { year: 2015, share: 6.2 },
    { year: 2020, share: 5.9 },
    { year: 2023, share: 5.8 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.33 },
    { year: 1985, gini: 0.33 },
    { year: 1990, gini: 0.37 },
    { year: 1995, gini: 0.37 },
    { year: 2000, gini: 0.37 },
    { year: 2005, gini: 0.36 },
    { year: 2010, gini: 0.36 },
    { year: 2015, gini: 0.37 },
    { year: 2020, gini: 0.37 },
    { year: 2023, gini: 0.37 },
  ],
};

/**
 * FRANCE
 *
 * Sources:
 * - WID.world: France wealth shares 2023 (shweal992j)
 * - WID.world: France income shares 2023 (sptinc992j)
 * - Piketty, T. (2014). Capital in the Twenty-First Century.
 *   Harvard University Press. (Historical French wealth data)
 * - Garbinti, B., Goupille-Lebret, J., Piketty, T. (2021).
 *   "Accounting for Wealth Inequality Dynamics." Journal of the
 *   European Economic Association, 19(1), 620-668.
 */
const france: CountryData = {
  code: "FR",
  name: "France",
  flag: "🇫🇷",
  wealthShares: {
    top1: 24.7,
    top10: 59.3,
    middle40: 35.0,
    bottom50: 5.7,
  },
  incomeShares: {
    top1: 12.5,
    top10: 32.8,
    middle40: 44.9,
    bottom50: 22.3,
  },
  giniWealth: 0.73,
  giniIncome: 0.33,
  medianWealthPerAdult: 133927,
  meanWealthPerAdult: 322048,
  population: 68.5,
  currency: "EUR",
  medianIncome: 24330,
  historicalWealthTop1: [
    { year: 1913, share: 55.0 },
    { year: 1929, share: 47.0 },
    { year: 1940, share: 40.0 },
    { year: 1950, share: 31.0 },
    { year: 1960, share: 28.5 },
    { year: 1970, share: 24.0 },
    { year: 1980, share: 19.0 },
    { year: 1990, share: 19.5 },
    { year: 2000, share: 23.0 },
    { year: 2010, share: 23.8 },
    { year: 2015, share: 24.0 },
    { year: 2020, share: 24.3 },
    { year: 2023, share: 24.7 },
  ],
  historicalWealthTop10: [
    { year: 1913, share: 89.0 },
    { year: 1929, share: 82.0 },
    { year: 1940, share: 76.0 },
    { year: 1950, share: 65.0 },
    { year: 1960, share: 62.0 },
    { year: 1970, share: 58.0 },
    { year: 1980, share: 50.0 },
    { year: 1990, share: 50.5 },
    { year: 2000, share: 55.0 },
    { year: 2010, share: 56.5 },
    { year: 2015, share: 57.5 },
    { year: 2020, share: 58.6 },
    { year: 2023, share: 59.3 },
  ],
  historicalWealthBottom50: [
    { year: 1913, share: 0.5 },
    { year: 1929, share: 1.5 },
    { year: 1940, share: 2.5 },
    { year: 1950, share: 4.0 },
    { year: 1960, share: 5.5 },
    { year: 1970, share: 7.0 },
    { year: 1980, share: 8.5 },
    { year: 1990, share: 8.0 },
    { year: 2000, share: 7.0 },
    { year: 2010, share: 6.0 },
    { year: 2015, share: 5.8 },
    { year: 2020, share: 5.7 },
    { year: 2023, share: 5.7 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.31 },
    { year: 1985, gini: 0.31 },
    { year: 1990, gini: 0.32 },
    { year: 1995, gini: 0.32 },
    { year: 2000, gini: 0.32 },
    { year: 2005, gini: 0.31 },
    { year: 2010, gini: 0.33 },
    { year: 2015, gini: 0.33 },
    { year: 2020, gini: 0.33 },
    { year: 2023, gini: 0.33 },
  ],
};

/**
 * GERMANY
 *
 * Sources:
 * - WID.world: Germany wealth shares 2023 (shweal992j)
 * - WID.world: Germany income shares 2023 (sptinc992j)
 * - Deutsche Bundesbank, Household Wealth Survey (PHF), 2021
 * - Bach, S., Thiemann, A., Zucco, A. (2019). "Looking Back at
 *   Wealth Concentration in Germany, 1895-2018." DIW Discussion
 *   Paper No. 1804.
 */
const germany: CountryData = {
  code: "DE",
  name: "Germany",
  flag: "🇩🇪",
  wealthShares: {
    top1: 23.4,
    top10: 59.8,
    middle40: 35.7,
    bottom50: 4.5,
  },
  incomeShares: {
    top1: 13.3,
    top10: 36.6,
    middle40: 42.7,
    bottom50: 20.7,
  },
  giniWealth: 0.77,
  giniIncome: 0.35,
  medianWealthPerAdult: 65374,
  meanWealthPerAdult: 294559,
  population: 84.5,
  currency: "EUR",
  medianIncome: 27756,
  historicalWealthTop1: [
    { year: 1913, share: 44.0 },
    { year: 1929, share: 38.0 },
    { year: 1940, share: 32.0 },
    { year: 1950, share: 24.0 },
    { year: 1960, share: 23.0 },
    { year: 1970, share: 21.0 },
    { year: 1980, share: 19.0 },
    { year: 1990, share: 19.5 },
    { year: 2000, share: 21.5 },
    { year: 2010, share: 22.8 },
    { year: 2015, share: 23.0 },
    { year: 2020, share: 23.2 },
    { year: 2023, share: 23.4 },
  ],
  historicalWealthTop10: [
    { year: 1913, share: 80.0 },
    { year: 1929, share: 72.0 },
    { year: 1940, share: 66.0 },
    { year: 1950, share: 56.0 },
    { year: 1960, share: 55.0 },
    { year: 1970, share: 54.0 },
    { year: 1980, share: 50.5 },
    { year: 1990, share: 52.0 },
    { year: 2000, share: 55.0 },
    { year: 2010, share: 58.0 },
    { year: 2015, share: 59.0 },
    { year: 2020, share: 59.5 },
    { year: 2023, share: 59.8 },
  ],
  historicalWealthBottom50: [
    { year: 1913, share: 2.0 },
    { year: 1929, share: 3.0 },
    { year: 1940, share: 4.0 },
    { year: 1950, share: 5.5 },
    { year: 1960, share: 6.5 },
    { year: 1970, share: 7.0 },
    { year: 1980, share: 7.5 },
    { year: 1990, share: 6.5 },
    { year: 2000, share: 5.5 },
    { year: 2010, share: 4.5 },
    { year: 2015, share: 4.5 },
    { year: 2020, share: 4.5 },
    { year: 2023, share: 4.5 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.28 },
    { year: 1985, gini: 0.27 },
    { year: 1990, gini: 0.28 },
    { year: 1995, gini: 0.29 },
    { year: 2000, gini: 0.30 },
    { year: 2005, gini: 0.32 },
    { year: 2010, gini: 0.34 },
    { year: 2015, gini: 0.35 },
    { year: 2020, gini: 0.35 },
    { year: 2023, gini: 0.35 },
  ],
};

/**
 * THE NETHERLANDS
 *
 * Sources:
 * - WID.world: Netherlands wealth shares 2023 (shweal992j)
 * - WID.world: Netherlands income shares 2023 (sptinc992j)
 * - CBS (Statistics Netherlands), Wealth of households, 2023
 * - DNB (De Nederlandsche Bank), Household Wealth Survey
 * - Salverda, W. (2015). "Top Incomes in the Netherlands." In:
 *   Atkinson, A.B. & Piketty, T. (eds.), Top Incomes: A Global
 *   Perspective. Oxford University Press.
 */
const netherlands: CountryData = {
  code: "NL",
  name: "The Netherlands",
  flag: "🇳🇱",
  wealthShares: {
    top1: 24.2,
    top10: 60.1,
    middle40: 37.0,
    bottom50: 2.9,
  },
  incomeShares: {
    top1: 10.4,
    top10: 30.5,
    middle40: 44.8,
    bottom50: 24.7,
  },
  giniWealth: 0.78,
  giniIncome: 0.30,
  medianWealthPerAdult: 116950,
  meanWealthPerAdult: 365806,
  population: 17.9,
  currency: "EUR",
  medianIncome: 30192,
  historicalWealthTop1: [
    { year: 1913, share: 60.0 },
    { year: 1929, share: 52.0 },
    { year: 1940, share: 45.0 },
    { year: 1950, share: 38.0 },
    { year: 1960, share: 34.0 },
    { year: 1970, share: 28.0 },
    { year: 1980, share: 22.0 },
    { year: 1990, share: 20.0 },
    { year: 2000, share: 22.0 },
    { year: 2010, share: 23.0 },
    { year: 2015, share: 23.5 },
    { year: 2020, share: 24.0 },
    { year: 2023, share: 24.2 },
  ],
  historicalWealthTop10: [
    { year: 1913, share: 90.0 },
    { year: 1929, share: 84.0 },
    { year: 1940, share: 78.0 },
    { year: 1950, share: 68.0 },
    { year: 1960, share: 63.0 },
    { year: 1970, share: 58.0 },
    { year: 1980, share: 52.0 },
    { year: 1990, share: 51.0 },
    { year: 2000, share: 55.5 },
    { year: 2010, share: 58.0 },
    { year: 2015, share: 59.0 },
    { year: 2020, share: 59.8 },
    { year: 2023, share: 60.1 },
  ],
  historicalWealthBottom50: [
    { year: 1913, share: 0.5 },
    { year: 1929, share: 1.0 },
    { year: 1940, share: 2.0 },
    { year: 1950, share: 3.5 },
    { year: 1960, share: 5.0 },
    { year: 1970, share: 6.5 },
    { year: 1980, share: 7.5 },
    { year: 1990, share: 6.0 },
    { year: 2000, share: 4.5 },
    { year: 2010, share: 3.5 },
    { year: 2015, share: 3.0 },
    { year: 2020, share: 2.9 },
    { year: 2023, share: 2.9 },
  ],
  historicalGini: [
    { year: 1980, gini: 0.27 },
    { year: 1985, gini: 0.27 },
    { year: 1990, gini: 0.28 },
    { year: 1995, gini: 0.28 },
    { year: 2000, gini: 0.29 },
    { year: 2005, gini: 0.28 },
    { year: 2010, gini: 0.29 },
    { year: 2015, gini: 0.29 },
    { year: 2020, gini: 0.30 },
    { year: 2023, gini: 0.30 },
  ],
};

export const COUNTRIES: readonly CountryData[] = [
  unitedStates,
  unitedKingdom,
  france,
  germany,
  netherlands,
];

export const COUNTRY_MAP: Readonly<Record<CountryCode, CountryData>> = {
  US: unitedStates,
  GB: unitedKingdom,
  FR: france,
  DE: germany,
  NL: netherlands,
};

export function getLorenzCurve(country: CountryData): readonly LorenzPoint[] {
  return generateLorenzCurve(
    country.wealthShares.bottom50,
    country.wealthShares.middle40,
    country.wealthShares.top10,
    country.wealthShares.top1
  );
}

/**
 * Find the percentile a given wealth value falls into for a country.
 * Uses linear interpolation between known breakpoints.
 * Returns a number 0-100.
 */
export function findPercentile(wealthUSD: number, country: CountryData): number {
  const totalWealth = country.meanWealthPerAdult * country.population * 1_000_000;
  const adults = country.population * 1_000_000 * 0.78; // ~78% of population are adults

  // Rough breakpoints based on wealth distribution
  const bottom50Threshold =
    (country.wealthShares.bottom50 / 100) * totalWealth / (adults * 0.5);
  const p50to90Threshold =
    (country.wealthShares.middle40 / 100) * totalWealth / (adults * 0.4);
  const p90to99Threshold =
    ((country.wealthShares.top10 - country.wealthShares.top1) / 100) * totalWealth / (adults * 0.09);
  const top1Threshold =
    (country.wealthShares.top1 / 100) * totalWealth / (adults * 0.01);

  if (wealthUSD <= 0) return 0;

  // Use average wealth per group as rough midpoint anchors
  if (wealthUSD <= bottom50Threshold * 2) {
    // In the bottom 50%
    return Math.min(50, (wealthUSD / (bottom50Threshold * 2)) * 50);
  }
  if (wealthUSD <= p50to90Threshold * 2) {
    return 50 + ((wealthUSD - bottom50Threshold * 2) / (p50to90Threshold * 2 - bottom50Threshold * 2)) * 40;
  }
  if (wealthUSD <= p90to99Threshold * 2) {
    return 90 + ((wealthUSD - p50to90Threshold * 2) / (p90to99Threshold * 2 - p50to90Threshold * 2)) * 9;
  }

  // In the top 1%
  const top1Position = Math.min(
    1,
    (wealthUSD - p90to99Threshold * 2) / (top1Threshold * 2 - p90to99Threshold * 2)
  );
  return 99 + top1Position;
}

/**
 * Global / combined statistics.
 * Source: World Inequality Report 2022, Chapter 3.
 */
export const GLOBAL_STATS = {
  globalTop1WealthShare: 37.8,
  globalTop10WealthShare: 75.6,
  globalBottom50WealthShare: 2.0,
  globalGiniWealth: 0.88,
  medianGlobalWealthPerAdult: 8654,
  meanGlobalWealthPerAdult: 87489,
  totalGlobalWealth: 463_600_000_000_000, // $463.6 trillion, 2023
  source: "World Inequality Report 2022 & WID.world 2024 update",
} as const;

export const DATA_SOURCES = [
  {
    name: "World Inequality Database (WID.world)",
    url: "https://wid.world",
    description:
      "Primary source for wealth and income shares by percentile. Maintained by the World Inequality Lab (Chancel, Piketty, Saez, Zucman et al.). Data covers 200+ countries with historical series going back to 1820 for some nations.",
    accessed: "2024",
  },
  {
    name: "World Inequality Report 2022",
    url: "https://wir2022.wid.world",
    description:
      "Comprehensive analysis of global inequality trends. Provides the global aggregate figures used in this visualization.",
    citation:
      'Chancel, L., Piketty, T., Saez, E., Zucman, G. (2022). "World Inequality Report 2022." World Inequality Lab.',
  },
  {
    name: "OECD Wealth Distribution Database",
    url: "https://www.oecd.org/en/data/datasets/income-and-wealth-distribution-database.html",
    description:
      "Cross-country comparable wealth and income distribution data. Used for validation and supplementary Gini coefficients.",
    accessed: "December 2024",
  },
  {
    name: "Standardized World Income Inequality Database (SWIID) v9.6",
    url: "https://fsolt.org/swiid/",
    description:
      "Provides standardized Gini coefficients for market and disposable income across countries and time.",
    citation:
      "Solt, Frederick. 2024. SWIID Version 9.6. https://fsolt.org/swiid/",
  },
  {
    name: "Saez & Zucman (2016)",
    url: "https://gabriel-zucman.eu/uswealth/",
    description:
      "US historical wealth concentration estimates since 1913. Foundational research for US wealth data in WID.world.",
    citation:
      'Saez, E. & Zucman, G. (2016). "Wealth Inequality in the United States since 1913." Quarterly Journal of Economics, 131(2), 519-578.',
  },
  {
    name: "Piketty (2014)",
    url: "http://piketty.pse.ens.fr/en/capital21c2",
    description:
      "Historical wealth data for France and cross-country comparisons spanning two centuries.",
    citation:
      "Piketty, T. (2014). Capital in the Twenty-First Century. Harvard University Press.",
  },
] as const;
