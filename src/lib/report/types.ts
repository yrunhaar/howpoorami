/**
 * Shared types for the personal-report feature.
 *
 * The wizard collects an `EstimateFields` object (mostly optional numeric
 * strings); we sum it into a single net-worth figure that drives the PDF.
 */

import type { LocaleCode } from "@/lib/i18n/locales";
import type { AllCountryCode } from "@/data/countries-extended";

export interface EstimateFields {
  homeValue: string;
  mortgageRemaining: string;
  otherProperty: string;
  stocks: string;
  retirement: string;
  crypto: string;
  cash: string;
  otherSavings: string;
  studentLoans: string;
  creditDebt: string;
  otherDebts: string;
}

export const EMPTY_ESTIMATE: EstimateFields = {
  homeValue: "",
  mortgageRemaining: "",
  otherProperty: "",
  stocks: "",
  retirement: "",
  crypto: "",
  cash: "",
  otherSavings: "",
  studentLoans: "",
  creditDebt: "",
  otherDebts: "",
};

/** Sum the optional numeric fields into a single net-worth number. Empty
 *  fields and non-numeric input contribute zero. */
export function estimateTotal(fields: Readonly<EstimateFields>): number {
  const n = (s: string): number => {
    const v = parseFloat(s.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(v) ? v : 0;
  };
  const assets =
    n(fields.homeValue) +
    n(fields.otherProperty) +
    n(fields.stocks) +
    n(fields.retirement) +
    n(fields.crypto) +
    n(fields.cash) +
    n(fields.otherSavings);
  const debts =
    n(fields.mortgageRemaining) +
    n(fields.studentLoans) +
    n(fields.creditDebt) +
    n(fields.otherDebts);
  return assets - debts;
}

/** State the wizard hands to the PDF generator. Country + age + the
 *  finalized net-worth value (in the country's local currency). */
export interface ReportInputs {
  readonly locale: LocaleCode;
  readonly countryCode: AllCountryCode;
  readonly netWorthLocal: number;
  readonly age: number | null;
}

export type WizardMode = "known" | "estimate";
