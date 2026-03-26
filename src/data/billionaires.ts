/**
 * Richest person per country data.
 *
 * Sources:
 * - Bloomberg Billionaires Index, March 2026
 *   https://www.bloomberg.com/billionaires/
 * - Forbes World's Billionaires List, 2026
 *   https://www.forbes.com/real-time-billionaires/
 *
 * Net worth figures are estimates that fluctuate daily.
 * Values shown are approximate as of March 2026.
 */

export interface BillionaireData {
  readonly name: string;
  readonly netWorth: number; // USD
  readonly source: string;
  readonly country: string;
  readonly photoDescription: string;
}

export const RICHEST_BY_COUNTRY: Readonly<Record<string, BillionaireData>> = {
  US: {
    name: "Elon Musk",
    netWorth: 650_000_000_000,
    source: "Tesla, SpaceX, X",
    country: "US",
    photoDescription: "CEO of Tesla and SpaceX",
  },
  GB: {
    name: "Gopi Hinduja & family",
    netWorth: 35_000_000_000,
    source: "Hinduja Group (diversified conglomerate)",
    country: "GB",
    photoDescription: "Chair of Hinduja Group",
  },
  FR: {
    name: "Bernard Arnault",
    netWorth: 168_000_000_000,
    source: "LVMH (luxury goods)",
    country: "FR",
    photoDescription: "Chair and CEO of LVMH",
  },
  DE: {
    name: "Dieter Schwarz",
    netWorth: 40_000_000_000,
    source: "Schwarz Group (Lidl, Kaufland)",
    country: "DE",
    photoDescription: "Owner of Schwarz Group",
  },
  NL: {
    name: "Charlene de Carvalho-Heineken",
    netWorth: 15_000_000_000,
    source: "Heineken (brewing)",
    country: "NL",
    photoDescription: "Controlling shareholder of Heineken",
  },
  CA: {
    name: "David Thomson & family",
    netWorth: 50_000_000_000,
    source: "Thomson Reuters (media)",
    country: "CA",
    photoDescription: "Chair of Thomson Reuters",
  },
  AU: {
    name: "Gina Rinehart",
    netWorth: 42_000_000_000,
    source: "Hancock Prospecting (mining)",
    country: "AU",
    photoDescription: "Chair of Hancock Prospecting",
  },
  JP: {
    name: "Tadashi Yanai",
    netWorth: 62_000_000_000,
    source: "Fast Retailing (Uniqlo)",
    country: "JP",
    photoDescription: "Founder and CEO of Fast Retailing",
  },
  KR: {
    name: "Jay Y. Lee",
    netWorth: 12_000_000_000,
    source: "Samsung Group",
    country: "KR",
    photoDescription: "Executive Chair of Samsung Electronics",
  },
  CN: {
    name: "Zhong Shanshan",
    netWorth: 73_000_000_000,
    source: "Nongfu Spring, Wantai Biological",
    country: "CN",
    photoDescription: "Founder of Nongfu Spring",
  },
  IN: {
    name: "Mukesh Ambani",
    netWorth: 103_000_000_000,
    source: "Reliance Industries",
    country: "IN",
    photoDescription: "Chair of Reliance Industries",
  },
  BR: {
    name: "André Esteves",
    netWorth: 20_000_000_000,
    source: "BTG Pactual (investment banking)",
    country: "BR",
    photoDescription: "CEO and Chair of BTG Pactual",
  },
  MX: {
    name: "Carlos Slim Helú",
    netWorth: 125_000_000_000,
    source: "América Móvil (telecom)",
    country: "MX",
    photoDescription: "Chair of Grupo Carso",
  },
  ZA: {
    name: "Johann Rupert",
    netWorth: 14_000_000_000,
    source: "Richemont (luxury goods)",
    country: "ZA",
    photoDescription: "Chair of Compagnie Financière Richemont",
  },
  SE: {
    name: "Stefan Persson",
    netWorth: 20_000_000_000,
    source: "H&M (fashion retail)",
    country: "SE",
    photoDescription: "Chair of H&M",
  },
  NO: {
    name: "Torstein Hagen",
    netWorth: 15_000_000_000,
    source: "Viking Holdings (cruise lines)",
    country: "NO",
    photoDescription: "Founder and Chair of Viking Cruises",
  },
  DK: {
    name: "Anders Holch Povlsen",
    netWorth: 14_000_000_000,
    source: "Bestseller (fashion)",
    country: "DK",
    photoDescription: "Owner of Bestseller",
  },
  CH: {
    name: "Gianluigi Aponte",
    netWorth: 33_000_000_000,
    source: "MSC (shipping, cruises)",
    country: "CH",
    photoDescription: "Founder of Mediterranean Shipping Company",
  },
  IT: {
    name: "Giovanni Ferrero",
    netWorth: 55_000_000_000,
    source: "Ferrero Group (Nutella)",
    country: "IT",
    photoDescription: "CEO of Ferrero Group",
  },
  ES: {
    name: "Amancio Ortega",
    netWorth: 147_000_000_000,
    source: "Inditex (Zara)",
    country: "ES",
    photoDescription: "Founder of Inditex",
  },
  SG: {
    name: "Eduardo Saverin",
    netWorth: 35_000_000_000,
    source: "Meta co-founder, B Capital (venture capital)",
    country: "SG",
    photoDescription: "Co-founder of Facebook, based in Singapore",
  },
  IE: {
    name: "John Collison",
    netWorth: 13_000_000_000,
    source: "Stripe (fintech)",
    country: "IE",
    photoDescription: "Co-founder of Stripe",
  },
  NZ: {
    name: "Graeme Hart",
    netWorth: 9_000_000_000,
    source: "Rank Group (investments)",
    country: "NZ",
    photoDescription: "Owner of Rank Group",
  },
  CL: {
    name: "Iris Fontbona & family",
    netWorth: 24_000_000_000,
    source: "Antofagasta (mining)",
    country: "CL",
    photoDescription: "Head of Luksic Group",
  },
  AT: {
    name: "Mark Mateschitz",
    netWorth: 27_000_000_000,
    source: "Red Bull",
    country: "AT",
    photoDescription: "Owner of Red Bull (inherited from Dietrich Mateschitz)",
  },
  BE: {
    name: "Eric Wittouck",
    netWorth: 9_000_000_000,
    source: "Artal Group (investments, sugar industry)",
    country: "BE",
    photoDescription: "Investor and shareholder of Artal Group",
  },
  PL: {
    name: "Michał Sołowow",
    netWorth: 6_000_000_000,
    source: "Synthos, Barlinek (chemicals, manufacturing)",
    country: "PL",
    photoDescription: "Owner of Synthos Group",
  },
  FI: {
    name: "Antti Herlin",
    netWorth: 10_000_000_000,
    source: "KONE (elevators)",
    country: "FI",
    photoDescription: "Chair of KONE Corporation",
  },
  PT: {
    name: "Maria Fernanda Amorim",
    netWorth: 5_500_000_000,
    source: "Amorim Group (cork)",
    country: "PT",
    photoDescription: "Chair of Amorim Group",
  },
  CZ: {
    name: "Renáta Kellnerová",
    netWorth: 18_000_000_000,
    source: "PPF Group (finance)",
    country: "CZ",
    photoDescription: "Owner of PPF Group",
  },
} as const;

/**
 * Detailed wealth shares for fine-grained percentiles.
 *
 * Source: WID.world 2024 update — percentile breakpoints
 * shweal992j for top 0.1% and top 0.01% shares.
 *
 * These represent the share of total national wealth
 * held by each sub-group within the top percentiles.
 */
export interface DetailedWealthShares {
  readonly bottom50: number;
  readonly middle40: number;    // p50-p90
  readonly next9: number;       // p90-p99 (top 10% minus top 1%)
  readonly next09: number;      // p99-p99.9 (top 1% minus top 0.1%)
  readonly next009: number;     // p99.9-p99.99 (top 0.1% minus top 0.01%)
  readonly top001: number;      // p99.99-p100 (top 0.01%)
}

export const DETAILED_SHARES: Readonly<Record<string, DetailedWealthShares>> = {
  US: {
    bottom50: 1.5,
    middle40: 27.4,
    next9: 36.3,       // 71.2 - 34.9
    next09: 19.4,      // 34.9 - 15.5
    next009: 9.8,      // 15.5 - 5.7
    top001: 5.7,       // top 0.01%
  },
  GB: {
    bottom50: 5.8,
    middle40: 36.8,
    next9: 34.8,
    next09: 13.2,
    next009: 6.2,
    top001: 3.2,
  },
  FR: {
    bottom50: 5.7,
    middle40: 35.0,
    next9: 34.6,
    next09: 14.2,
    next009: 6.8,
    top001: 3.7,
  },
  DE: {
    bottom50: 4.5,
    middle40: 35.7,
    next9: 36.4,
    next09: 13.6,
    next009: 6.4,
    top001: 3.4,
  },
  NL: {
    bottom50: 2.9,
    middle40: 37.0,
    next9: 35.9,
    next09: 14.0,
    next009: 6.6,
    top001: 3.6,
  },
  CA: { bottom50: 5.5, middle40: 32.5, next9: 35.0, next09: 15.0, next009: 7.5, top001: 4.5 },
  AU: { bottom50: 4.8, middle40: 34.2, next9: 35.5, next09: 14.5, next009: 7.0, top001: 4.0 },
  JP: { bottom50: 6.0, middle40: 38.0, next9: 34.0, next09: 12.5, next009: 6.0, top001: 3.5 },
  KR: { bottom50: 5.2, middle40: 35.8, next9: 35.0, next09: 13.5, next009: 6.5, top001: 4.0 },
  CN: { bottom50: 6.3, middle40: 27.0, next9: 32.0, next09: 18.0, next009: 10.0, top001: 6.7 },
  IN: { bottom50: 5.9, middle40: 28.0, next9: 30.0, next09: 18.5, next009: 10.5, top001: 7.1 },
  BR: { bottom50: 3.2, middle40: 25.0, next9: 32.0, next09: 20.0, next009: 12.0, top001: 7.8 },
  MX: { bottom50: 4.5, middle40: 26.0, next9: 31.0, next09: 19.5, next009: 11.5, top001: 7.5 },
  ZA: { bottom50: 2.0, middle40: 22.0, next9: 33.0, next09: 22.0, next009: 13.0, top001: 8.0 },
  SE: { bottom50: 7.0, middle40: 37.0, next9: 33.0, next09: 13.0, next009: 6.5, top001: 3.5 },
  NO: { bottom50: 6.5, middle40: 38.5, next9: 33.0, next09: 12.5, next009: 6.0, top001: 3.5 },
  DK: { bottom50: 5.0, middle40: 35.0, next9: 35.0, next09: 14.0, next009: 7.0, top001: 4.0 },
  CH: { bottom50: 3.5, middle40: 33.5, next9: 35.0, next09: 15.5, next009: 8.0, top001: 4.5 },
  IT: { bottom50: 6.2, middle40: 36.8, next9: 34.0, next09: 13.5, next009: 6.0, top001: 3.5 },
  ES: { bottom50: 6.0, middle40: 36.0, next9: 34.5, next09: 13.5, next009: 6.5, top001: 3.5 },
  SG: { bottom50: 3.0, middle40: 30.0, next9: 34.0, next09: 17.0, next009: 9.5, top001: 6.5 },
  IE: { bottom50: 4.5, middle40: 34.5, next9: 35.0, next09: 14.5, next009: 7.5, top001: 4.0 },
} as const;
