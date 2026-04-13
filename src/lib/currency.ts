/**
 * Currency conversion utilities.
 *
 * Exchange rates are fetched at build time by scripts/fetch-all-data.mjs
 * from the ECB via Frankfurter API, stored in data/raw/exchange-rates.json.
 *
 * Rates are "units of local currency per 1 USD".
 */

import rawRates from "../../data/raw/exchange-rates.json";

const rates = (rawRates as { rates: Record<string, number> }).rates ?? {};

const RATES_PER_USD: Readonly<Record<string, number>> = {
  USD: 1,
  ...rates,
};

/** Convert a local-currency amount to USD. */
export function toUSD(amount: number, currencyCode: string): number {
  const rate = RATES_PER_USD[currencyCode];
  if (rate === undefined) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[currency] Unknown currency code "${currencyCode}", treating as USD`);
    }
    return amount;
  }
  return amount / rate;
}

/** Convert a USD amount to local currency. */
export function fromUSD(amountUSD: number, currencyCode: string): number {
  const rate = RATES_PER_USD[currencyCode];
  if (rate === undefined) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[currency] Unknown currency code "${currencyCode}", treating as USD`);
    }
    return amountUSD;
  }
  return amountUSD * rate;
}
