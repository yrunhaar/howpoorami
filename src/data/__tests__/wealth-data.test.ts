import { describe, it, expect } from "vitest";
import { COUNTRIES, findPercentile, type CountryData } from "@/data/wealth-data";

// ── Helpers ────────────────────────────────────────────────────────

const US: CountryData = COUNTRIES.find((c) => c.code === "US")!;

// ── COUNTRIES array ────────────────────────────────────────────────

describe("COUNTRIES", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(COUNTRIES)).toBe(true);
    expect(COUNTRIES.length).toBeGreaterThan(0);
  });

  it("contains the expected country codes", () => {
    const codes = COUNTRIES.map((c) => c.code);
    expect(codes).toContain("US");
    expect(codes).toContain("GB");
    expect(codes).toContain("FR");
    expect(codes).toContain("DE");
    expect(codes).toContain("NL");
  });

  it.each(COUNTRIES.map((c) => ({ code: c.code, country: c })))(
    "country $code has all required fields",
    ({ country }) => {
      expect(country.code).toBeTruthy();
      expect(country.name).toBeTruthy();
      expect(country.flag).toBeTruthy();
      expect(country.currency).toBeTruthy();
      expect(country.population).toBeGreaterThan(0);
      expect(country.medianIncome).toBeGreaterThan(0);
      expect(country.medianWealthPerAdult).toBeGreaterThan(0);
      expect(country.meanWealthPerAdult).toBeGreaterThan(0);
      expect(country.giniWealth).toBeGreaterThan(0);
      expect(country.giniWealth).toBeLessThanOrEqual(1);
      expect(country.giniIncome).toBeGreaterThan(0);
      expect(country.giniIncome).toBeLessThanOrEqual(1);
    },
  );

  it.each(COUNTRIES.map((c) => ({ code: c.code, country: c })))(
    "country $code has valid wealth share distributions",
    ({ country }) => {
      const { wealthShares, incomeShares } = country;

      // Wealth shares should sum to approximately 100.
      const wealthSum =
        wealthShares.bottom50 + wealthShares.middle40 + wealthShares.top10;
      expect(wealthSum).toBeCloseTo(100, 0);

      // Income shares should sum to approximately 100.
      const incomeSum =
        incomeShares.bottom50 + incomeShares.middle40 + incomeShares.top10;
      expect(incomeSum).toBeCloseTo(100, 0);

      // top1 should be less than or equal to top10.
      expect(wealthShares.top1).toBeLessThanOrEqual(wealthShares.top10);
      expect(incomeShares.top1).toBeLessThanOrEqual(incomeShares.top10);
    },
  );
});

// ── findPercentile ─────────────────────────────────────────────────

describe("findPercentile", () => {
  it("returns a value between 0 and 99.99 for positive wealth", () => {
    const pct = findPercentile(100_000, US);
    expect(pct).toBeGreaterThanOrEqual(0);
    expect(pct).toBeLessThanOrEqual(99.99);
  });

  it("returns a low percentile for zero wealth (above negative-wealth segment)", () => {
    const pct = findPercentile(0, US);
    // ~12% of US adults have negative net wealth, so $0 ≈ 12th percentile
    expect(pct).toBeGreaterThan(5);
    expect(pct).toBeLessThan(25);
  });

  it("returns a very low (possibly negative) percentile for negative wealth", () => {
    const pct = findPercentile(-50_000, US);
    // Negative wealth produces a negative interpolated percentile
    // because the piecewise model extrapolates below zero.
    expect(pct).toBeLessThan(50);
    // It should be lower than the zero-wealth percentile.
    const zeroPct = findPercentile(0, US);
    expect(pct).toBeLessThan(zeroPct);
  });

  it("returns 99.99 for extremely high wealth (billionaire)", () => {
    const pct = findPercentile(10_000_000_000, US);
    expect(pct).toBe(99.99);
  });

  it("returns a higher percentile for higher wealth", () => {
    const low = findPercentile(10_000, US);
    const mid = findPercentile(500_000, US);
    const high = findPercentile(5_000_000, US);

    expect(mid).toBeGreaterThan(low);
    expect(high).toBeGreaterThan(mid);
  });

  it("works correctly for all countries", () => {
    for (const country of COUNTRIES) {
      const pct = findPercentile(100_000, country);
      expect(pct).toBeGreaterThanOrEqual(0);
      expect(pct).toBeLessThanOrEqual(99.99);
    }
  });

  it("never exceeds 99.99", () => {
    const pct = findPercentile(Number.MAX_SAFE_INTEGER, US);
    expect(pct).toBe(99.99);
  });

  it("median US wealth should be near the 50th percentile", () => {
    const pct = findPercentile(US.medianWealthPerAdult, US);
    // The model is approximate, so allow a wide margin.
    expect(pct).toBeGreaterThan(20);
    expect(pct).toBeLessThan(80);
  });
});
