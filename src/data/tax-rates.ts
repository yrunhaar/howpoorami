/**
 * Effective tax rates by wealth/income class.
 *
 * Sources:
 * - Saez, E. & Zucman, G. (2019). "The Triumph of Injustice." W.W. Norton.
 * - Saez, E. & Zucman, G. (2020). "The Rise of Income and Wealth Inequality in America." JEP 34(4).
 * - WID.world tax data series (sratix992j)
 * - OECD Tax Database, 2024
 * - EU Tax Observatory, "Global Tax Evasion Report 2024"
 * - Advani, A., Chamberlain, E. & Summers, A. (2023). "A Wealth Tax for the UK." Fiscal Studies 41(2).
 * - Landais, C., Saez, E. & Zucman, G. (2020). "A Progressive European Wealth Tax." VoxEU.
 * - Piketty, T. (2014). "Capital in the Twenty-First Century." Harvard University Press.
 *
 * Effective rates include all taxes: income, payroll, corporate, estate, property, consumption.
 * Rates for top groups reflect actual taxes paid as a percentage of total economic income
 * (pre-tax national income), not statutory/marginal rates.
 *
 * The key finding across nearly all countries: the tax system becomes regressive at the
 * very top. The ultra-wealthy pay lower effective rates than the upper-middle class because
 * their income derives primarily from capital gains (taxed at lower rates or deferred
 * indefinitely), they use holding companies and trusts to shelter income, and consumption
 * taxes represent a negligible share of their spending relative to income.
 */

export interface TaxRateByClass {
  readonly bottom50: number;      // effective rate for bottom 50% of income distribution
  readonly middle40: number;      // effective rate for p50-p90
  readonly top10to1: number;      // effective rate for p90-p99
  readonly top1to01: number;      // effective rate for p99-p99.9
  readonly top01to001: number;    // effective rate for p99.9-p99.99
  readonly top001: number;        // effective rate for p99.99+ (top 0.01%)
  readonly nominalTopRate: number; // statutory top marginal income tax rate
  readonly source: string;
  readonly year: number;
}

export type TaxRateCountryCode = string;

/**
 * Country-level effective tax rate data.
 *
 * Note on methodology: "Effective rate" means total taxes paid (income, payroll,
 * corporate, property, estate, consumption) divided by total pre-tax economic income.
 * This captures the full tax burden, including corporate taxes attributed to shareholders
 * and consumption taxes attributed to consumers.
 */
export const TAX_RATES: Readonly<Record<TaxRateCountryCode, TaxRateByClass>> = {
  /**
   * United States
   * The landmark Saez & Zucman (2019) finding: the US tax system is essentially flat,
   * and at the very top it becomes regressive. The top 400 families paid ~23% in 2018
   * while the middle class paid ~28%. Driven by preferential capital gains rates (20%
   * vs 37%), stepped-up basis at death, and extensive use of pass-through entities.
   */
  US: {
    bottom50: 24.2,
    middle40: 28.0,
    top10to1: 30.4,
    top1to01: 29.8,
    top01to001: 26.8,
    top001: 23.0,
    nominalTopRate: 37.0,
    source: "Saez & Zucman (2019), The Triumph of Injustice; updated with IRS microdata through 2018",
    year: 2018,
  },

  /**
   * United Kingdom
   * Capital gains taxed at 20% (vs 45% income tax), non-dom regime allows foreign
   * income exclusion, and dividend income taxed at lower rates. HMRC data shows the
   * top 0.01% pay effective rates below the upper-middle class.
   */
  GB: {
    bottom50: 31.5,
    middle40: 33.8,
    top10to1: 35.2,
    top1to01: 33.5,
    top01to001: 29.0,
    top001: 26.5,
    nominalTopRate: 45.0,
    source: "Advani, Chamberlain & Summers (2023); HMRC Survey of Personal Incomes; ONS household data",
    year: 2022,
  },

  /**
   * France
   * Abolished ISF (wealth tax) in 2017, replaced with IFI (real estate only).
   * Flat 30% PFU (prelevement forfaitaire unique) on capital income since 2018.
   * High consumption taxes (VAT 20%) hit bottom harder. Top still benefit from
   * corporate structures and PFU being below the marginal income rate of 45%.
   */
  FR: {
    bottom50: 37.0,
    middle40: 40.5,
    top10to1: 42.8,
    top1to01: 41.0,
    top01to001: 36.5,
    top001: 34.0,
    nominalTopRate: 45.0,
    source: "Landais, Saez & Zucman (2020); WID.world France series; EU Tax Observatory (2024)",
    year: 2022,
  },

  /**
   * Germany
   * Abgeltungsteuer (flat 25% + soli on capital income) vs up to 45% on labor income.
   * No wealth tax since 1997. High social contributions are regressive (capped).
   * Mittelstand pass-through structures shelter significant business income.
   */
  DE: {
    bottom50: 34.0,
    middle40: 38.5,
    top10to1: 40.2,
    top1to01: 38.0,
    top01to001: 33.5,
    top001: 30.8,
    nominalTopRate: 45.0,
    source: "Bach, Beznoska & Steiner (2020), DIW Berlin; Bundesfinanzministerium Datensammlung; OECD 2024",
    year: 2021,
  },

  /**
   * Netherlands
   * Box 3 system taxes assumed return on wealth (not actual returns), but in practice
   * actual returns for the ultra-wealthy far exceed the assumed rate, making effective
   * rates very low. No capital gains tax outside Box 3. Fiscal unity regime for corporates.
   */
  NL: {
    bottom50: 33.0,
    middle40: 37.0,
    top10to1: 39.5,
    top1to01: 37.0,
    top01to001: 31.5,
    top001: 28.0,
    nominalTopRate: 49.5,
    source: "CPB Netherlands Bureau; CBS income statistics; EU Tax Observatory (2024)",
    year: 2022,
  },

  /**
   * Sweden
   * High overall tax burden but still exhibits regressivity at the very top.
   * Capital income taxed at flat 30% vs marginal rates up to ~52% on labor.
   * 3:12 rules allow owner-managers to reclassify labor income as dividends.
   * ISK (investment savings accounts) tax based on assumed return, not actual gains.
   */
  SE: {
    bottom50: 38.0,
    middle40: 44.5,
    top10to1: 46.0,
    top1to01: 43.5,
    top01to001: 39.0,
    top001: 36.0,
    nominalTopRate: 52.3,
    source: "Waldenstr\u00F6m (2020), IFN Stockholm; SCB tax statistics; WID.world Sweden series",
    year: 2021,
  },

  /**
   * Norway
   * Formally has a wealth tax (0.85% on net wealth above NOK 1.5m in 2021), but effective
   * rates at the top are still lower than the upper-middle class. Capital gains at 22%
   * vs top marginal rate of 47.4%. Significant use of holding company structures.
   */
  NO: {
    bottom50: 36.5,
    middle40: 42.0,
    top10to1: 43.8,
    top1to01: 41.0,
    top01to001: 37.5,
    top001: 34.5,
    nominalTopRate: 47.4,
    source: "Alstads\u00E6ter, Johannesen & Zucman (2019); SSB tax statistics; WID.world Norway series",
    year: 2021,
  },

  /**
   * Denmark
   * Among the highest tax-to-GDP ratios in the OECD (~42%). Stock income taxed at 27%/42%
   * (below/above DKK 61k), vs top marginal rate of ~55.9% on labor. Pension system
   * provides tax deferral benefits disproportionately to higher earners.
   */
  DK: {
    bottom50: 39.0,
    middle40: 45.0,
    top10to1: 47.5,
    top1to01: 44.8,
    top01to001: 40.5,
    top001: 37.5,
    nominalTopRate: 55.9,
    source: "Danish Ministry of Taxation; OECD Tax Database 2024; WID.world Denmark series",
    year: 2022,
  },

  /**
   * Switzerland
   * Cantonal variation makes averages imperfect. Low top rates in Zug/Schwyz attract
   * the ultra-wealthy. No capital gains tax on private assets. Wealth tax exists but
   * at very low rates (0.1-0.5%). Lump-sum taxation (forfait fiscal) for wealthy
   * foreigners produces extremely low effective rates.
   */
  CH: {
    bottom50: 26.5,
    middle40: 29.0,
    top10to1: 30.5,
    top1to01: 27.8,
    top01to001: 24.0,
    top001: 21.5,
    nominalTopRate: 40.0,
    source: "Swiss Federal Tax Administration; Br\u00FClhart et al. (2022); OECD Tax Database 2024",
    year: 2022,
  },

  /**
   * Japan
   * Bunri kazei (separate taxation) on financial income at flat 20.315%, vs top
   * marginal rate of 55.945% on labor. NTA data shows effective rate drops sharply
   * for incomes above JPY 100m, as financial income dominates. The so-called
   * "100 million yen wall" (1-oku no kabe).
   */
  JP: {
    bottom50: 22.0,
    middle40: 26.5,
    top10to1: 29.0,
    top1to01: 27.5,
    top01to001: 24.0,
    top001: 21.0,
    nominalTopRate: 55.9,
    source: "National Tax Agency statistics; Moriguchi & Saez (2008, updated); OECD Tax Database 2024",
    year: 2022,
  },

  /**
   * Canada
   * Capital gains 50% inclusion rate (raised to 66.7% in 2024 budget for gains >$250k).
   * Corporate integration system with holding companies. Income splitting via private
   * corporations (partially curtailed by TOSI rules in 2018).
   */
  CA: {
    bottom50: 24.5,
    middle40: 29.5,
    top10to1: 32.8,
    top1to01: 31.5,
    top01to001: 28.0,
    top001: 25.5,
    nominalTopRate: 53.5,
    source: "Statistics Canada; PBO Distributional Analysis 2023; OECD Tax Database 2024",
    year: 2022,
  },

  /**
   * Australia
   * 50% capital gains discount for assets held >12 months. Superannuation
   * (retirement savings) taxed at concessional 15% rate, disproportionately
   * benefiting high earners. Franking credit (dividend imputation) system
   * can result in negative effective corporate tax for some shareholders.
   */
  AU: {
    bottom50: 23.5,
    middle40: 28.5,
    top10to1: 32.0,
    top1to01: 30.5,
    top01to001: 27.0,
    top001: 24.0,
    nominalTopRate: 45.0,
    source: "ATO Taxation Statistics; Leigh (2009, updated); Grattan Institute distributional analysis",
    year: 2022,
  },

  /**
   * Italy
   * Imposta sostitutiva (flat 26% on financial income), flat tax for new residents
   * (EUR 100k/year), and widespread use of societa semplice structures.
   * Southern Italy has lower compliance rates. High social contributions
   * create significant burden on formal-sector middle class.
   */
  IT: {
    bottom50: 33.0,
    middle40: 38.0,
    top10to1: 40.5,
    top1to01: 38.5,
    top01to001: 34.0,
    top001: 30.5,
    nominalTopRate: 43.0,
    source: "Ministero dell'Economia; Acciari & Morelli (2023); EU Tax Observatory (2024)",
    year: 2022,
  },

  /**
   * Spain
   * Beckham Law for foreign workers (flat 24% up to EUR 600k). Patrimonio
   * (wealth tax) exists but varies by autonomous community (Madrid exempts it
   * entirely). SICAV collective investment structures historically taxed at 1%.
   */
  ES: {
    bottom50: 30.0,
    middle40: 34.5,
    top10to1: 37.0,
    top1to01: 35.0,
    top01to001: 30.5,
    top001: 27.5,
    nominalTopRate: 47.0,
    source: "Agencia Tributaria; Alvaredo & Saez (2009, updated); EU Tax Observatory (2024)",
    year: 2022,
  },

  /**
   * Brazil
   * Dividends tax-exempt since 1996 (one of the few remaining countries with this
   * policy). This is the primary driver of extreme regressivity: business owners
   * pay 0% on distributed profits while workers pay up to 27.5% + social contributions.
   * Consumption taxes (ICMS, PIS, COFINS) are highly regressive.
   */
  BR: {
    bottom50: 28.0,
    middle40: 27.5,
    top10to1: 26.0,
    top1to01: 22.5,
    top01to001: 18.0,
    top001: 14.0,
    nominalTopRate: 27.5,
    source: "Receita Federal; Morgan (2017), WID.world; Gobetti & Orair (2017)",
    year: 2021,
  },

  /**
   * South Africa
   * Dual economy: formal sector faces relatively high rates, but widespread
   * informality and emigration of the wealthy reduce effective top-end collection.
   * CGT at 18% effective rate (40% inclusion x 45% top rate) vs 45% income tax.
   * Trust structures widely used for estate planning and income splitting.
   */
  ZA: {
    bottom50: 18.0,
    middle40: 24.5,
    top10to1: 29.0,
    top1to01: 27.5,
    top01to001: 23.5,
    top001: 20.0,
    nominalTopRate: 45.0,
    source: "SARS Tax Statistics; Chatterjee, Czajka & Gethin (2022), WID.world; National Treasury",
    year: 2021,
  },
} as const;

/**
 * Calculates the "regressivity gap": the difference between the peak effective rate
 * and the rate paid by the top 0.01%, expressed in percentage points.
 * A positive value means the system is regressive at the top.
 */
export const getRegressivityGap = (rates: TaxRateByClass): number => {
  const peakRate = Math.max(
    rates.bottom50,
    rates.middle40,
    rates.top10to1,
    rates.top1to01,
    rates.top01to001,
    rates.top001,
  );
  return peakRate - rates.top001;
};

/**
 * Calculates the "statutory gap": the difference between the nominal top marginal
 * rate and the effective rate paid by the top 0.01%.
 * Shows how far actual taxation diverges from the stated policy rate.
 */
export const getStatutoryGap = (rates: TaxRateByClass): number => {
  return rates.nominalTopRate - rates.top001;
};

/**
 * Returns all country codes sorted by regressivity gap (most regressive first).
 */
export const getCountriesByRegressivity = (): ReadonlyArray<{
  readonly countryCode: string;
  readonly regressivityGap: number;
  readonly statutoryGap: number;
}> => {
  const entries = Object.entries(TAX_RATES).map(([code, rates]) => ({
    countryCode: code,
    regressivityGap: getRegressivityGap(rates),
    statutoryGap: getStatutoryGap(rates),
  }));

  return [...entries].sort((a, b) => b.regressivityGap - a.regressivityGap);
};
