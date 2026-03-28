/**
 * Income-to-wealth estimation model.
 *
 * Converts annual income into an estimated net wealth **range** using
 * demographic and financial factors. Based on patterns from:
 *   - Federal Reserve Survey of Consumer Finances (SCF 2022)
 *   - OECD wealth distribution data
 *   - ECB Household Finance and Consumption Survey (HFCS)
 *   - Credit Suisse Global Wealth Databook
 *
 * Income alone is a weak predictor of wealth — inheritance, investment
 * returns, housing market timing, spending habits, and life events all
 * create enormous variance. This model produces a range (low–high) that
 * narrows as the user provides more context.
 */

import { type CountryData, findPercentile } from "@/data/wealth-data";

// ── Types ──────────────────────────────────────────────────────────

export interface IncomeFactors {
  readonly age: string;
  readonly householdSize: string;
  readonly hasProperty: boolean;
  readonly propertyValue: string;
  readonly hasMortgage: boolean;
  readonly mortgageRemaining: string;
  readonly hasDebts: boolean;
  readonly debtLevel: string;
  readonly savingsRate: string;
  readonly hasInvestments: boolean;
  readonly investmentValue: string;
  readonly hasRetirement: boolean;
  readonly retirementValue: string;
  readonly hasInheritance: boolean;
  readonly yearsWorked: string;
  readonly educationLevel: string;
  readonly employmentType: string;
  readonly maritalStatus: string;
}

export interface WealthRange {
  readonly low: number;
  readonly mid: number;
  readonly high: number;
}

export interface PercentileRange {
  readonly low: number;
  readonly mid: number;
  readonly high: number;
}

// ── Constants ──────────────────────────────────────────────────────

export const DEFAULT_INCOME_FACTORS: IncomeFactors = {
  age: "",
  householdSize: "",
  hasProperty: false,
  propertyValue: "",
  hasMortgage: false,
  mortgageRemaining: "",
  hasDebts: false,
  debtLevel: "",
  savingsRate: "moderate",
  hasInvestments: false,
  investmentValue: "",
  hasRetirement: false,
  retirementValue: "",
  hasInheritance: false,
  yearsWorked: "",
  educationLevel: "",
  employmentType: "",
  maritalStatus: "",
};

/** SCF-based wealth-to-income ratios by age bracket. */
const AGE_BRACKETS = [
  { min: 0, max: 24, multiplier: 0.3 },
  { min: 25, max: 29, multiplier: 0.6 },
  { min: 30, max: 34, multiplier: 1.2 },
  { min: 35, max: 39, multiplier: 2.0 },
  { min: 40, max: 44, multiplier: 2.8 },
  { min: 45, max: 49, multiplier: 3.5 },
  { min: 50, max: 54, multiplier: 4.2 },
  { min: 55, max: 59, multiplier: 5.0 },
  { min: 60, max: 64, multiplier: 5.5 },
  { min: 65, max: 999, multiplier: 6.5 },
] as const;

const SAVINGS_MULTIPLIERS: Record<string, number> = {
  very_low: 0.4,
  low: 0.65,
  moderate: 1.0,
  high: 1.4,
  very_high: 1.8,
};

const DEBT_LEVEL_MULTIPLIERS: Record<string, number> = {
  low: 0.85,
  moderate: 0.6,
  high: 0.35,
  very_high: 0.15,
};

/** SCF: higher education correlates with higher wealth-to-income ratios. */
const EDUCATION_MULTIPLIERS: Record<string, number> = {
  no_degree: 0.6,
  high_school: 0.8,
  bachelor: 1.0,
  master: 1.15,
  doctorate: 1.3,
};

/** Self-employed & business owners tend to have higher net worth (SCF). */
const EMPLOYMENT_MULTIPLIERS: Record<string, number> = {
  unemployed: 0.5,
  part_time: 0.7,
  full_time: 1.0,
  self_employed: 1.3,
  business_owner: 1.6,
  retired: 1.1,
};

/** Married/partnered households accumulate more (dual income, shared costs). */
const MARITAL_MULTIPLIERS: Record<string, number> = {
  single: 0.85,
  partnered: 1.1,
  married: 1.15,
  divorced: 0.7,
  widowed: 0.9,
};

// ── Factor counting ────────────────────────────────────────────────

/** All trackable factor keys with their "filled" test. */
function isFactorFilled(factors: IncomeFactors, key: keyof IncomeFactors): boolean {
  switch (key) {
    case "age": return factors.age.length > 0;
    case "householdSize": return factors.householdSize.length > 0;
    case "hasProperty": return factors.hasProperty;
    case "propertyValue": return factors.propertyValue.length > 0;
    case "hasMortgage": return factors.hasMortgage;
    case "mortgageRemaining": return factors.mortgageRemaining.length > 0;
    case "hasDebts": return factors.hasDebts;
    case "debtLevel": return factors.debtLevel.length > 0;
    case "savingsRate": return factors.savingsRate !== "moderate";
    case "hasInvestments": return factors.hasInvestments;
    case "investmentValue": return factors.investmentValue.length > 0;
    case "hasRetirement": return factors.hasRetirement;
    case "retirementValue": return factors.retirementValue.length > 0;
    case "hasInheritance": return factors.hasInheritance;
    case "yearsWorked": return factors.yearsWorked.length > 0;
    case "educationLevel": return factors.educationLevel.length > 0;
    case "employmentType": return factors.employmentType.length > 0;
    case "maritalStatus": return factors.maritalStatus.length > 0;
    default: return false;
  }
}

const ALL_FACTOR_KEYS = [
  "age", "householdSize", "hasProperty", "propertyValue",
  "hasMortgage", "mortgageRemaining", "hasDebts", "debtLevel",
  "savingsRate", "hasInvestments", "investmentValue",
  "hasRetirement", "retirementValue", "hasInheritance",
  "yearsWorked", "educationLevel", "employmentType", "maritalStatus",
] as const;

export const MAX_FACTORS = ALL_FACTOR_KEYS.length;

export function countFilledFactors(factors: IncomeFactors): number {
  return ALL_FACTOR_KEYS.reduce(
    (n, key) => n + (isFactorFilled(factors, key) ? 1 : 0),
    0,
  );
}

// ── Spread (uncertainty) ───────────────────────────────────────────

/**
 * Each factor the user fills in reduces uncertainty.
 * - No factors: ±70%
 * - All factors: ±10%
 */
export function computeSpreadFactor(factors: IncomeFactors): number {
  const maxSpread = 0.70;
  const minSpread = 0.10;
  const filled = countFilledFactors(factors);
  const range = maxSpread - minSpread;

  return Math.max(minSpread, maxSpread - (filled / MAX_FACTORS) * range);
}

// ── Helpers ────────────────────────────────────────────────────────

function parseNonNegativeInt(raw: string): number {
  const val = parseInt(raw.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(val) && val >= 0 ? val : NaN;
}

// ── Core estimation ────────────────────────────────────────────────

export function estimateWealthRange(
  annualIncome: number,
  country: CountryData,
  factors: IncomeFactors,
): WealthRange {
  const medianIncome = country.medianIncome > 0 ? country.medianIncome : 1;
  const incomeRatio = annualIncome / medianIncome;

  // 1. Age-based wealth-to-income ratio (SCF lifecycle pattern)
  const age = parseNonNegativeInt(factors.age);
  const ageBracket = Number.isFinite(age)
    ? AGE_BRACKETS.find((b) => age >= b.min && age <= b.max)
    : undefined;
  const ageMultiplier = ageBracket?.multiplier ?? 2.0;

  // 2. Income-level adjustment — higher earners save/invest more (SCF)
  const incomeAdj =
    incomeRatio <= 0.3 ? 0.2
    : incomeRatio <= 0.5 ? 0.4
    : incomeRatio <= 1 ? 0.8
    : incomeRatio <= 2 ? 1.0
    : incomeRatio <= 5 ? 1.4
    : incomeRatio <= 10 ? 1.8
    : 2.2;

  // 3. Savings behavior
  const savingsMul = SAVINGS_MULTIPLIERS[factors.savingsRate] ?? 1.0;

  // 4. Property — additive if value given, multiplicative otherwise
  let propertyAddon = 0;
  let propertyMul = 1.0;
  if (factors.hasProperty) {
    const propVal = parseNonNegativeInt(factors.propertyValue);
    if (Number.isFinite(propVal) && propVal > 0) {
      propertyAddon = propVal * 0.7; // ~70% avg equity
    } else {
      propertyMul = 1.8;
    }
  }

  // 5. Mortgage — subtracts from property equity
  let mortgageDeduction = 0;
  if (factors.hasMortgage) {
    const mortVal = parseNonNegativeInt(factors.mortgageRemaining);
    if (Number.isFinite(mortVal)) {
      mortgageDeduction = mortVal;
    } else if (factors.hasProperty) {
      // Estimate: avg mortgage is ~60% of property value
      const propVal = parseNonNegativeInt(factors.propertyValue);
      mortgageDeduction = Number.isFinite(propVal) ? propVal * 0.6 : annualIncome * 3;
    }
  }

  // 6. Debt adjustment (non-mortgage)
  let debtMul = 1.0;
  if (factors.hasDebts) {
    debtMul = factors.debtLevel.length > 0
      ? (DEBT_LEVEL_MULTIPLIERS[factors.debtLevel] ?? 0.6)
      : 0.5;
  }

  // 7. Investment portfolio — additive if value given
  let investmentAddon = 0;
  let investmentMul = 1.0;
  if (factors.hasInvestments) {
    const invVal = parseNonNegativeInt(factors.investmentValue);
    if (Number.isFinite(invVal) && invVal > 0) {
      investmentAddon = invVal;
    } else {
      investmentMul = 1.35;
    }
  }

  // 8. Retirement savings (401k, pension, etc.) — additive if value given
  let retirementAddon = 0;
  let retirementMul = 1.0;
  if (factors.hasRetirement) {
    const retVal = parseNonNegativeInt(factors.retirementValue);
    if (Number.isFinite(retVal) && retVal > 0) {
      retirementAddon = retVal;
    } else {
      retirementMul = 1.25;
    }
  }

  // 9. Inheritance / gifts
  const inheritanceMul = factors.hasInheritance ? 1.5 : 1.0;

  // 10. Years worked — more time = more accumulation
  const yrsWorked = parseNonNegativeInt(factors.yearsWorked);
  const yrsMultiplier = Number.isFinite(yrsWorked)
    ? Math.max(0.3, Math.min(2.0, 0.5 + yrsWorked * 0.04))
    : 1.0;

  // 11. Household size — OECD modified equivalence scale
  const hhSize = parseNonNegativeInt(factors.householdSize);
  const hhMultiplier = Number.isFinite(hhSize) && hhSize > 1
    ? 1 / Math.sqrt(hhSize)
    : 1.0;

  // 12. Education level (SCF: college grads have 3–4× wealth of non-grads)
  const educationMul = EDUCATION_MULTIPLIERS[factors.educationLevel] ?? 1.0;

  // 13. Employment type
  const employmentMul = EMPLOYMENT_MULTIPLIERS[factors.employmentType] ?? 1.0;

  // 14. Marital status
  const maritalMul = MARITAL_MULTIPLIERS[factors.maritalStatus] ?? 1.0;

  // Combine multiplicative factors
  const baseWealth =
    annualIncome *
    ageMultiplier *
    incomeAdj *
    savingsMul *
    propertyMul *
    debtMul *
    investmentMul *
    retirementMul *
    inheritanceMul *
    yrsMultiplier *
    hhMultiplier *
    educationMul *
    employmentMul *
    maritalMul;

  // Add explicit asset values, subtract mortgage
  const totalAddons = propertyAddon + investmentAddon + retirementAddon - mortgageDeduction;
  const mid = Math.round(baseWealth + totalAddons);

  const spread = computeSpreadFactor(factors);
  const low = Math.round(mid * (1 - spread));
  const high = Math.round(mid * (1 + spread));

  // If mid is negative, swap low/high so low < mid < high
  return {
    low: Math.min(low, high),
    mid,
    high: Math.max(low, high),
  };
}

// ── Percentile range from wealth range ─────────────────────────────

export function computePercentileRange(
  wealthRange: WealthRange,
  country: CountryData,
): PercentileRange {
  return {
    low: findPercentile(wealthRange.low, country),
    mid: findPercentile(wealthRange.mid, country),
    high: findPercentile(wealthRange.high, country),
  };
}
