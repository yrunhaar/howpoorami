/**
 * Approximate exchange rates: units of local currency per 1 USD.
 * Used to convert user input (local currency) → USD for percentile lookup.
 *
 * Source: approximate market rates as of early 2025.
 * Since WID wealth data is itself approximate, small FX fluctuations
 * don't materially affect the percentile result.
 */
const RATES_PER_USD: Readonly<Record<string, number>> = {
  USD: 1,
  GBP: 0.79,
  EUR: 0.92,
  CAD: 1.44,
  AUD: 1.57,
  NZD: 1.72,
  JPY: 150,
  KRW: 1450,
  CNY: 7.25,
  SGD: 1.34,
  INR: 85,
  BRL: 5.8,
  MXN: 20.5,
  CLP: 980,
  ZAR: 18.2,
  SEK: 10.8,
  NOK: 11.0,
  DKK: 6.85,
  CHF: 0.9,
  PLN: 4.05,
  CZK: 23.5,
};

/** Convert a local-currency amount to USD. */
export function toUSD(amount: number, currencyCode: string): number {
  const rate = RATES_PER_USD[currencyCode] ?? 1;
  return amount / rate;
}

/** Convert a USD amount to local currency. */
export function fromUSD(amountUSD: number, currencyCode: string): number {
  const rate = RATES_PER_USD[currencyCode] ?? 1;
  return amountUSD * rate;
}
