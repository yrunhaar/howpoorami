"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { ALL_COUNTRY_MAP, type AllCountryCode, isAllCountryCode } from "@/data/countries-extended";
import { RICHEST_BY_COUNTRY } from "@/data/billionaires";
import { getCountryEconomics } from "@/data/country-economics";
import { formatCurrency, formatNumber } from "@/lib/format";
import { toUSD, fromUSD } from "@/lib/currency";
import CountrySelector from "@/components/CountrySelector";
import CurrencySelector from "@/components/CurrencySelector";
import FormattedNumber from "@/components/FormattedNumber";
import TimeComparisons from "@/components/TimeComparisons";
import { useGeoCountry } from "@/hooks/useGeoCountry";

const ANNUAL_RETURN_RATE = 0.08; // 8% assumed annual return on wealth

interface CompareClientProps {
  readonly initialCountry?: AllCountryCode;
}

export default function CompareClient({ initialCountry }: CompareClientProps) {
  const [selectedCountry, setSelectedCountry] = useState<AllCountryCode>(initialCountry ?? "US");
  const searchParams = useSearchParams();
  const [salary, setSalary] = useState("");
  const [globalCurrency, setGlobalCurrency] = useState("USD");
  const geoCountry = useGeoCountry();

  // Pre-fill salary from URL param (e.g. /compare/us?income=50000)
  useEffect(() => {
    const incomeParam = searchParams.get("income");
    if (incomeParam && /^\d+$/.test(incomeParam) && salary === "") {
      setSalary(incomeParam);
    }
  }, [searchParams, salary]);

  useEffect(() => {
    if (!initialCountry && geoCountry) {
      setSelectedCountry(geoCountry);
    }
  }, [geoCountry, initialCountry]);

  const handleCountrySelect = useCallback((code: string) => {
    if (isAllCountryCode(code)) {
      setSelectedCountry(code);
    }
  }, []);

  const isGlobal = selectedCountry === "GLOBAL";
  const rawCountry = ALL_COUNTRY_MAP[selectedCountry];
  const country = isGlobal
    ? { ...rawCountry, currency: globalCurrency }
    : rawCountry;
  const richest = RICHEST_BY_COUNTRY[selectedCountry] ?? null;
  const economics = getCountryEconomics(isGlobal ? "US" : selectedCountry);

  const salaryValue = useMemo(() => {
    const raw = salary.replace(/[^0-9]/g, "");
    return raw.length > 0 ? parseInt(raw, 10) : null;
  }, [salary]);

  const displaySalary = useMemo(() => {
    if (!salaryValue) return "";
    return formatCurrency(salaryValue, country.currency);
  }, [salaryValue, country.currency]);

  // salaryValue is in local currency; medianIncome is in USD → convert to local for fallback
  const medianIncomeLocal = fromUSD(country.medianIncome, country.currency);
  const incomeLocal = salaryValue ?? medianIncomeLocal;
  const incomeUSD = salaryValue
    ? toUSD(salaryValue, country.currency)
    : country.medianIncome;
  const safeIncomeUSD = incomeUSD > 0 ? incomeUSD : 1;

  const yearsToMatch = useMemo(
    () => (richest ? Math.round(richest.netWorth / safeIncomeUSD) : 0),
    [richest, safeIncomeUSD]
  );

  const dollarsPerSecond = useMemo(() => {
    if (!richest) return 0;
    const secondsInYear = 365.25 * 24 * 3600;
    // Approximate earning rate assuming annual return on net worth
    return (richest.netWorth * ANNUAL_RETURN_RATE) / secondsInYear;
  }, [richest]);

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setSalary(raw);
  };

  if (!richest) {
    return (
      <main className="min-h-screen pt-14">
        <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto w-full text-center">
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl text-text-primary leading-tight mb-8">
              How Long Would It Take?
            </h1>
            <CountrySelector selected={selectedCountry} onSelect={handleCountrySelect} />
            <p className="text-text-secondary text-lg mt-12">
              Billionaire comparison data is not yet available for {country.name}.
            </p>
            <p className="text-text-muted text-sm mt-2">
              Try selecting a major economy like the US, UK, France, Germany, or Japan.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
    <main className="min-h-screen pt-14">
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto w-full">
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl text-text-primary leading-tight">
              How Long Would It Take?
            </h1>
            <p className="text-text-secondary text-lg sm:text-xl mt-4 max-w-2xl mx-auto">
              Compare your income to the wealthiest person in each country.
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative mb-10"
          >
            <div className="flex flex-col items-center gap-3">
              <CountrySelector selected={selectedCountry} onSelect={handleCountrySelect} />
              {isGlobal && (
                <m.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-2"
                >
                  <span className="text-text-muted text-xs">Currency:</span>
                  <CurrencySelector selected={globalCurrency} onSelect={setGlobalCurrency} />
                </m.div>
              )}
            </div>
          </m.div>

          {/* The richest person card */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8 mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-accent-amber/15 border border-accent-amber/30 flex items-center justify-center text-3xl flex-shrink-0">
                {country.flag}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-text-muted text-sm">Richest person in {country.name}</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">
                  {richest.name}
                </h2>
                <p className="text-accent-amber text-xl sm:text-2xl font-semibold mt-1 tabular-nums">
                  {formatCurrency(richest.netWorth, "USD", true)}
                </p>
                <p className="text-text-muted text-sm mt-1">{richest.source}</p>
              </div>
            </div>
          </m.div>

          {/* Salary input */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="w-full max-w-md mx-auto mb-12"
          >
            <label
              htmlFor="salary-input"
              className="block text-sm text-text-secondary mb-2 text-center"
            >
              Enter your annual income ({country.currency}) — or we&apos;ll use the median
            </label>
            <input
              id="salary-input"
              type="text"
              inputMode="numeric"
              value={displaySalary}
              onChange={handleSalaryChange}
              placeholder={formatCurrency(medianIncomeLocal, country.currency)}
              className="
                w-full px-6 py-4 rounded-2xl text-center text-2xl font-medium tabular-nums
                bg-bg-card border border-border-subtle
                text-text-primary placeholder:text-text-muted
                focus:outline-none focus:border-accent-periwinkle/50 focus:ring-2 focus:ring-accent-periwinkle/20
                transition-all duration-300
              "
            />
            <p className="text-text-muted text-xs text-center mt-2">
              {!salaryValue && `Using median pre-tax national income: ${formatCurrency(medianIncomeLocal, country.currency)}/year`}
              {salaryValue && "Your data stays in your browser."}
            </p>
          </m.div>

          {/* The big number */}
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="bg-gradient-to-br from-accent-rose/8 to-accent-amber/8 border border-accent-rose/15 rounded-3xl p-8 sm:p-12 text-center mb-8"
          >
            <p className="text-text-secondary text-lg sm:text-xl mb-4">
              At {formatCurrency(incomeLocal, country.currency)}/year, you would need
            </p>
            <div className="text-5xl sm:text-6xl lg:text-8xl font-bold text-accent-rose font-[family-name:var(--font-heading)]">
              <FormattedNumber value={yearsToMatch} />
            </div>
            <p className="text-text-secondary text-xl sm:text-2xl mt-2">
              years of work
            </p>
            <p className="text-text-secondary text-lg sm:text-xl mt-4">
              to match {richest.name}&apos;s wealth
            </p>
          </m.div>

          {/* Time comparisons — the fun part */}
          <div className="mb-16">
            <h3 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl text-center mb-8 text-text-primary">
              To Put That In Perspective...
            </h3>
            <TimeComparisons yearsToMatch={yearsToMatch} billionaireName={richest.name} />
          </div>

          {/* Comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16">
            <ComparisonCard
              label={`${richest.name} earns per second`}
              value={`${formatCurrency(fromUSD(dollarsPerSecond, country.currency), country.currency)}`}
              sublabel={`If their wealth grew at ${ANNUAL_RETURN_RATE * 100}%/year`}
              accent="amber"
              delay={0}
            />
            <ComparisonCard
              label="Your daily earnings"
              value={formatCurrency(incomeLocal / 365, country.currency)}
              sublabel={`vs. ${richest.name}'s ${formatCurrency(fromUSD(richest.netWorth * ANNUAL_RETURN_RATE / 365, country.currency), country.currency, true)}/day`}
              accent="sage"
              delay={0.1}
            />
            <ComparisonCard
              label="Wealth ratio"
              value={`${formatNumber(Math.round(richest.netWorth / safeIncomeUSD))}x`}
              sublabel={`${richest.name}'s wealth vs. your annual income`}
              accent="rose"
              delay={0.2}
            />
            <ComparisonCard
              label={`If they gave you ${formatCurrency(fromUSD(1_000_000, country.currency), country.currency)}`}
              value={`${formatCurrency(incomeLocal * (1_000_000 / richest.netWorth), country.currency)}`}
              sublabel={`Would feel like losing this from your annual income`}
              accent="periwinkle"
              delay={0.3}
            />
            <ComparisonCard
              label="Homes their wealth could buy"
              value={formatNumber(Math.round(richest.netWorth / economics.avgHomePrice))}
              sublabel={`At ${formatCurrency(economics.avgHomePrice, "USD")} average home price in ${country.name}`}
              accent="lavender"
              delay={0.4}
            />
            <ComparisonCard
              label="Years of healthcare"
              value={formatNumber(Math.round(richest.netWorth / economics.healthcarePerCapita))}
              sublabel={`At ${formatCurrency(economics.healthcarePerCapita, "USD")} per-capita spending in ${country.name}`}
              accent="amber"
              delay={0.5}
            />
          </div>

          {/* Source note */}
          <div className="mt-16 text-center">
            <p className="text-text-muted text-xs max-w-xl mx-auto leading-relaxed">
              Net worth estimates from Forbes Real-Time Billionaires (March 2026).
              Default income is median pre-tax national income from WID.world (includes capital income
              and imputed corporate profits — typically 30–50% higher than wage-only statistics).
              Wealth fluctuates daily — these are approximate figures for illustration.
            </p>
          </div>

          {/* Cross-link to wealth distribution page */}
          {!isGlobal && (
            <div className="mt-12">
              <Link
                href={`/${selectedCountry.toLowerCase()}`}
                className="block bg-accent-periwinkle/8 border border-accent-periwinkle/20 rounded-2xl p-6 sm:p-8 text-center hover:bg-accent-periwinkle/12 hover:border-accent-periwinkle/30 transition-all duration-300"
              >
                <p className="text-text-secondary text-base sm:text-lg">
                  See where you stand in{" "}
                  <span className="text-accent-periwinkle font-medium">{country.name}&apos;s</span>{" "}
                  wealth distribution
                </p>
                <span className="inline-block mt-3 text-accent-periwinkle text-sm font-medium">
                  Explore wealth inequality &rarr;
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
    </LazyMotion>
  );
}

interface ComparisonCardProps {
  readonly label: string;
  readonly value: string;
  readonly sublabel: string;
  readonly accent: "rose" | "amber" | "sage" | "periwinkle" | "lavender";
  readonly delay: number;
}

const comparisonAccentColors = {
  rose: "text-accent-rose",
  amber: "text-accent-amber",
  sage: "text-accent-sage",
  periwinkle: "text-accent-periwinkle",
  lavender: "text-accent-lavender",
};

function ComparisonCard({ label, value, sublabel, accent }: ComparisonCardProps) {
  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 text-center">
      <p className="text-text-secondary text-sm mb-2">{label}</p>
      <p className={`text-2xl sm:text-3xl font-bold ${comparisonAccentColors[accent]} tabular-nums`}>
        {value}
      </p>
      <p className="text-text-muted text-xs mt-2">{sublabel}</p>
    </div>
  );
}
