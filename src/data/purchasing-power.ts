/**
 * Purchasing power and cost-of-living data.
 *
 * Sources:
 * - US Bureau of Labor Statistics (BLS), CPI data
 * - ONS (UK), Consumer Price Indices
 * - INSEE (France), Consumer Price Index
 * - Destatis (Germany), Consumer Price Index
 * - CBS (Netherlands), Consumer Price Index
 * - World Bank, GDP deflator series
 */

export interface BasketItem {
  readonly id: string;
  readonly label: string;
  readonly emoji: string;
  readonly unit: string;
}

export interface PurchasingPowerTimeline {
  readonly year: number;
  readonly cpiIndex: number; // 2023 = 100
  readonly items: Readonly<Record<string, number>>;
}

export interface CountryPurchasingPower {
  readonly countryCode: string;
  readonly currency: string;
  readonly currencySymbol: string;
  readonly baskets: readonly BasketItem[];
  readonly timeline: readonly PurchasingPowerTimeline[];
}

// ---------------------------------------------------------------------------
// Basket definitions
// ---------------------------------------------------------------------------

const US_BASKETS: readonly BasketItem[] = [
  { id: "bread", label: "Bread", emoji: "\uD83C\uDF5E", unit: "1 loaf" },
  { id: "milk", label: "Milk", emoji: "\uD83E\uDD5B", unit: "1 gallon" },
  { id: "rent", label: "Average Rent", emoji: "\uD83C\uDFE0", unit: "1 month, national median" },
  { id: "movie", label: "Movie Ticket", emoji: "\uD83C\uDFAC", unit: "1 ticket" },
  { id: "tuition", label: "University Tuition", emoji: "\uD83C\uDF93", unit: "1 year, public in-state" },
  { id: "car", label: "New Car", emoji: "\uD83D\uDE97", unit: "average new car" },
  { id: "home", label: "Median Home Price", emoji: "\uD83C\uDFE1", unit: "median sale price" },
  { id: "min_wage", label: "Minimum Hourly Wage", emoji: "\uD83D\uDCB5", unit: "federal per hour" },
] as const;

const GB_BASKETS: readonly BasketItem[] = [
  { id: "bread", label: "Bread", emoji: "\uD83C\uDF5E", unit: "1 loaf (800g)" },
  { id: "milk", label: "Milk", emoji: "\uD83E\uDD5B", unit: "1 litre" },
  { id: "rent", label: "Average Rent", emoji: "\uD83C\uDFE0", unit: "1 month, national median" },
  { id: "movie", label: "Movie Ticket", emoji: "\uD83C\uDFAC", unit: "1 ticket" },
  { id: "tuition", label: "University Tuition", emoji: "\uD83C\uDF93", unit: "1 year, home student" },
  { id: "car", label: "New Car", emoji: "\uD83D\uDE97", unit: "average new car" },
  { id: "home", label: "Median Home Price", emoji: "\uD83C\uDFE1", unit: "median sale price" },
  { id: "min_wage", label: "Minimum Hourly Wage", emoji: "\uD83D\uDCB5", unit: "national per hour" },
] as const;

const FR_BASKETS: readonly BasketItem[] = [
  { id: "bread", label: "Baguette", emoji: "\uD83E\uDD56", unit: "1 baguette (250g)" },
  { id: "milk", label: "Milk", emoji: "\uD83E\uDD5B", unit: "1 litre" },
  { id: "rent", label: "Average Rent", emoji: "\uD83C\uDFE0", unit: "1 month, national median" },
  { id: "movie", label: "Movie Ticket", emoji: "\uD83C\uDFAC", unit: "1 ticket" },
  { id: "tuition", label: "University Tuition", emoji: "\uD83C\uDF93", unit: "1 year, public" },
  { id: "car", label: "New Car", emoji: "\uD83D\uDE97", unit: "average new car" },
  { id: "home", label: "Median Home Price", emoji: "\uD83C\uDFE1", unit: "median sale price" },
  { id: "min_wage", label: "Minimum Hourly Wage (SMIC)", emoji: "\uD83D\uDCB5", unit: "gross per hour" },
] as const;

const DE_BASKETS: readonly BasketItem[] = [
  { id: "bread", label: "Bread", emoji: "\uD83C\uDF5E", unit: "1 loaf (500g)" },
  { id: "milk", label: "Milk", emoji: "\uD83E\uDD5B", unit: "1 litre" },
  { id: "rent", label: "Average Rent", emoji: "\uD83C\uDFE0", unit: "1 month, national median" },
  { id: "movie", label: "Movie Ticket", emoji: "\uD83C\uDFAC", unit: "1 ticket" },
  { id: "tuition", label: "University Tuition", emoji: "\uD83C\uDF93", unit: "1 year, public" },
  { id: "car", label: "New Car", emoji: "\uD83D\uDE97", unit: "average new car" },
  { id: "home", label: "Median Home Price", emoji: "\uD83C\uDFE1", unit: "median sale price" },
  { id: "min_wage", label: "Minimum Hourly Wage", emoji: "\uD83D\uDCB5", unit: "gross per hour" },
] as const;

const NL_BASKETS: readonly BasketItem[] = [
  { id: "bread", label: "Bread", emoji: "\uD83C\uDF5E", unit: "1 loaf (800g)" },
  { id: "milk", label: "Milk", emoji: "\uD83E\uDD5B", unit: "1 litre" },
  { id: "rent", label: "Average Rent", emoji: "\uD83C\uDFE0", unit: "1 month, national median" },
  { id: "movie", label: "Movie Ticket", emoji: "\uD83C\uDFAC", unit: "1 ticket" },
  { id: "tuition", label: "University Tuition", emoji: "\uD83C\uDF93", unit: "1 year, public (WO)" },
  { id: "car", label: "New Car", emoji: "\uD83D\uDE97", unit: "average new car" },
  { id: "home", label: "Median Home Price", emoji: "\uD83C\uDFE1", unit: "median sale price" },
  { id: "min_wage", label: "Minimum Hourly Wage", emoji: "\uD83D\uDCB5", unit: "gross per hour (21+)" },
] as const;

// ---------------------------------------------------------------------------
// Timeline data
// ---------------------------------------------------------------------------

const US_TIMELINE: readonly PurchasingPowerTimeline[] = [
  {
    year: 1970,
    cpiIndex: 12.2,
    items: {
      bread: 0.25, milk: 1.32, rent: 108, movie: 1.55,
      tuition: 394, car: 3_542, home: 23_000, min_wage: 1.60,
    },
  },
  {
    year: 1980,
    cpiIndex: 26.0,
    items: {
      bread: 0.50, milk: 1.60, rent: 243, movie: 2.69,
      tuition: 804, car: 7_609, home: 47_200, min_wage: 3.10,
    },
  },
  {
    year: 1990,
    cpiIndex: 39.8,
    items: {
      bread: 0.70, milk: 2.15, rent: 447, movie: 4.23,
      tuition: 1_888, car: 15_472, home: 79_100, min_wage: 3.80,
    },
  },
  {
    year: 2000,
    cpiIndex: 51.1,
    items: {
      bread: 0.99, milk: 2.78, rent: 602, movie: 5.39,
      tuition: 3_501, car: 21_850, home: 119_600, min_wage: 5.15,
    },
  },
  {
    year: 2010,
    cpiIndex: 67.1,
    items: {
      bread: 1.39, milk: 3.32, rent: 901, movie: 7.89,
      tuition: 7_605, car: 29_217, home: 221_800, min_wage: 7.25,
    },
  },
  {
    year: 2020,
    cpiIndex: 88.4,
    items: {
      bread: 1.55, milk: 3.54, rent: 1_098, movie: 9.16,
      tuition: 9_349, car: 37_851, home: 329_000, min_wage: 7.25,
    },
  },
  {
    year: 2023,
    cpiIndex: 100.0,
    items: {
      bread: 1.99, milk: 4.10, rent: 1_372, movie: 10.78,
      tuition: 10_662, car: 48_008, home: 412_000, min_wage: 7.25,
    },
  },
] as const;

const GB_TIMELINE: readonly PurchasingPowerTimeline[] = [
  {
    year: 1970,
    cpiIndex: 5.8,
    items: {
      bread: 0.09, milk: 0.05, rent: 32, movie: 0.30,
      tuition: 0, car: 1_020, home: 4_975, min_wage: 0,
    },
  },
  {
    year: 1980,
    cpiIndex: 17.0,
    items: {
      bread: 0.33, milk: 0.17, rent: 90, movie: 1.20,
      tuition: 0, car: 4_500, home: 22_677, min_wage: 0,
    },
  },
  {
    year: 1990,
    cpiIndex: 30.3,
    items: {
      bread: 0.50, milk: 0.29, rent: 200, movie: 3.00,
      tuition: 1_025, car: 10_800, home: 59_785, min_wage: 0,
    },
  },
  {
    year: 2000,
    cpiIndex: 40.7,
    items: {
      bread: 0.52, milk: 0.34, rent: 375, movie: 4.50,
      tuition: 1_050, car: 15_200, home: 81_628, min_wage: 3.60,
    },
  },
  {
    year: 2010,
    cpiIndex: 62.1,
    items: {
      bread: 1.15, milk: 0.45, rent: 550, movie: 6.80,
      tuition: 3_290, car: 22_800, home: 167_802, min_wage: 5.93,
    },
  },
  {
    year: 2020,
    cpiIndex: 82.3,
    items: {
      bread: 1.06, milk: 0.50, rent: 700, movie: 8.50,
      tuition: 9_250, car: 28_100, home: 249_309, min_wage: 8.72,
    },
  },
  {
    year: 2023,
    cpiIndex: 100.0,
    items: {
      bread: 1.30, milk: 0.65, rent: 825, movie: 10.50,
      tuition: 9_250, car: 33_500, home: 285_000, min_wage: 10.42,
    },
  },
] as const;

const FR_TIMELINE: readonly PurchasingPowerTimeline[] = [
  {
    year: 1970,
    cpiIndex: 6.4,
    items: {
      bread: 0.16, milk: 0.15, rent: 30, movie: 1.00,
      tuition: 30, car: 8_500, home: 12_000, min_wage: 0.56,
    },
  },
  {
    year: 1980,
    cpiIndex: 16.5,
    items: {
      bread: 0.34, milk: 0.30, rent: 100, movie: 3.00,
      tuition: 80, car: 30_000, home: 45_000, min_wage: 1.67,
    },
  },
  {
    year: 1990,
    cpiIndex: 30.8,
    items: {
      bread: 0.55, milk: 0.48, rent: 230, movie: 5.50,
      tuition: 120, car: 65_000, home: 80_000, min_wage: 4.77,
    },
  },
  {
    year: 2000,
    cpiIndex: 42.0,
    items: {
      bread: 0.65, milk: 0.62, rent: 420, movie: 7.00,
      tuition: 150, car: 15_000, home: 100_000, min_wage: 6.41,
    },
  },
  {
    year: 2010,
    cpiIndex: 57.0,
    items: {
      bread: 0.87, milk: 0.75, rent: 600, movie: 9.50,
      tuition: 174, car: 22_500, home: 185_000, min_wage: 8.86,
    },
  },
  {
    year: 2020,
    cpiIndex: 84.2,
    items: {
      bread: 0.90, milk: 0.80, rent: 700, movie: 10.50,
      tuition: 170, car: 26_000, home: 220_000, min_wage: 10.15,
    },
  },
  {
    year: 2023,
    cpiIndex: 100.0,
    items: {
      bread: 1.07, milk: 0.95, rent: 800, movie: 12.00,
      tuition: 170, car: 32_000, home: 255_000, min_wage: 11.52,
    },
  },
] as const;

const DE_TIMELINE: readonly PurchasingPowerTimeline[] = [
  {
    year: 1970,
    cpiIndex: 11.0,
    items: {
      bread: 0.40, milk: 0.26, rent: 50, movie: 2.00,
      tuition: 0, car: 7_000, home: 30_000, min_wage: 0,
    },
  },
  {
    year: 1980,
    cpiIndex: 19.5,
    items: {
      bread: 0.75, milk: 0.42, rent: 120, movie: 4.00,
      tuition: 0, car: 14_000, home: 70_000, min_wage: 0,
    },
  },
  {
    year: 1990,
    cpiIndex: 24.0,
    items: {
      bread: 0.95, milk: 0.50, rent: 200, movie: 6.00,
      tuition: 0, car: 20_000, home: 100_000, min_wage: 0,
    },
  },
  {
    year: 2000,
    cpiIndex: 33.4,
    items: {
      bread: 1.10, milk: 0.55, rent: 350, movie: 7.50,
      tuition: 0, car: 23_000, home: 140_000, min_wage: 0,
    },
  },
  {
    year: 2010,
    cpiIndex: 49.0,
    items: {
      bread: 1.30, milk: 0.62, rent: 450, movie: 8.50,
      tuition: 500, car: 27_500, home: 175_000, min_wage: 0,
    },
  },
  {
    year: 2020,
    cpiIndex: 82.0,
    items: {
      bread: 1.45, milk: 0.69, rent: 550, movie: 10.00,
      tuition: 0, car: 32_000, home: 260_000, min_wage: 9.35,
    },
  },
  {
    year: 2023,
    cpiIndex: 100.0,
    items: {
      bread: 1.85, milk: 0.95, rent: 680, movie: 12.00,
      tuition: 0, car: 42_790, home: 310_000, min_wage: 12.00,
    },
  },
] as const;

const NL_TIMELINE: readonly PurchasingPowerTimeline[] = [
  {
    year: 1970,
    cpiIndex: 9.8,
    items: {
      bread: 0.30, milk: 0.18, rent: 40, movie: 1.50,
      tuition: 200, car: 6_500, home: 25_000, min_wage: 0.90,
    },
  },
  {
    year: 1980,
    cpiIndex: 19.0,
    items: {
      bread: 0.65, milk: 0.38, rent: 120, movie: 4.00,
      tuition: 500, car: 14_000, home: 65_000, min_wage: 2.50,
    },
  },
  {
    year: 1990,
    cpiIndex: 23.5,
    items: {
      bread: 0.80, milk: 0.50, rent: 225, movie: 6.00,
      tuition: 900, car: 20_000, home: 80_000, min_wage: 3.50,
    },
  },
  {
    year: 2000,
    cpiIndex: 36.5,
    items: {
      bread: 0.95, milk: 0.65, rent: 400, movie: 7.50,
      tuition: 1_200, car: 22_000, home: 145_000, min_wage: 5.80,
    },
  },
  {
    year: 2010,
    cpiIndex: 52.0,
    items: {
      bread: 1.15, milk: 0.78, rent: 600, movie: 9.50,
      tuition: 1_672, car: 27_000, home: 225_000, min_wage: 7.79,
    },
  },
  {
    year: 2020,
    cpiIndex: 82.8,
    items: {
      bread: 1.35, milk: 0.89, rent: 750, movie: 11.00,
      tuition: 2_083, car: 32_000, home: 335_000, min_wage: 9.44,
    },
  },
  {
    year: 2023,
    cpiIndex: 100.0,
    items: {
      bread: 1.75, milk: 1.15, rent: 900, movie: 13.00,
      tuition: 2_314, car: 38_000, home: 405_000, min_wage: 12.40,
    },
  },
] as const;

// ---------------------------------------------------------------------------
// Assembled data
// ---------------------------------------------------------------------------

export const PURCHASING_POWER: Readonly<Record<string, CountryPurchasingPower>> = {
  US: {
    countryCode: "US",
    currency: "USD",
    currencySymbol: "$",
    baskets: US_BASKETS,
    timeline: US_TIMELINE,
  },
  GB: {
    countryCode: "GB",
    currency: "GBP",
    currencySymbol: "\u00A3",
    baskets: GB_BASKETS,
    timeline: GB_TIMELINE,
  },
  FR: {
    countryCode: "FR",
    currency: "EUR",
    currencySymbol: "\u20AC",
    baskets: FR_BASKETS,
    timeline: FR_TIMELINE,
  },
  DE: {
    countryCode: "DE",
    currency: "EUR",
    currencySymbol: "\u20AC",
    baskets: DE_BASKETS,
    timeline: DE_TIMELINE,
  },
  NL: {
    countryCode: "NL",
    currency: "EUR",
    currencySymbol: "\u20AC",
    baskets: NL_BASKETS,
    timeline: NL_TIMELINE,
  },
} as const;

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

interface BuyableItem {
  readonly item: string;
  readonly quantity: number;
}

/**
 * Given an amount of money, a year, and a country code, returns a list of
 * everyday items and how many you could buy with that amount at that year's
 * prices. Only items with quantity >= 1 are included.
 *
 * If the country or year is not found, returns an empty array.
 */
export function getWhatYouCouldBuy(
  amount: number,
  year: number,
  countryCode: string,
): readonly BuyableItem[] {
  const country = PURCHASING_POWER[countryCode];
  if (!country) {
    return [];
  }

  const snapshot = country.timeline.find((t) => t.year === year);
  if (!snapshot) {
    return [];
  }

  const results: BuyableItem[] = [];

  for (const basket of country.baskets) {
    const price = snapshot.items[basket.id];
    if (price === undefined || price <= 0) {
      continue;
    }

    const quantity = Math.floor(amount / price);
    if (quantity >= 1) {
      results.push({
        item: `${basket.emoji} ${basket.label} (${basket.unit})`,
        quantity,
      });
    }
  }

  // Sort descending by quantity so the most-affordable items come first
  return [...results].sort((a, b) => b.quantity - a.quantity);
}
