"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ALL_COUNTRY_MAP, type AllCountryCode } from "@/data/countries-extended";
import { RICHEST_BY_COUNTRY } from "@/data/billionaires";
import { formatCurrency, formatNumber } from "@/lib/format";
import CountrySelector from "@/components/CountrySelector";
import FormattedNumber from "@/components/FormattedNumber";
import TimeComparisons from "@/components/TimeComparisons";
import { useGeoCountry } from "@/hooks/useGeoCountry";

export default function ComparePage() {
  const [selectedCountry, setSelectedCountry] = useState<AllCountryCode>("US");
  const [salary, setSalary] = useState("");
  const geoCountry = useGeoCountry();

  useEffect(() => {
    if (geoCountry) {
      setSelectedCountry(geoCountry);
    }
  }, [geoCountry]);

  const handleCountrySelect = useCallback((code: string) => {
    setSelectedCountry(code as AllCountryCode);
  }, []);

  const country = ALL_COUNTRY_MAP[selectedCountry];
  const richest = RICHEST_BY_COUNTRY[selectedCountry] ?? null;

  const salaryValue = useMemo(() => {
    const raw = salary.replace(/[^0-9]/g, "");
    return raw.length > 0 ? parseInt(raw, 10) : null;
  }, [salary]);

  const displaySalary = useMemo(() => {
    if (!salaryValue) return "";
    return formatCurrency(salaryValue);
  }, [salaryValue]);

  const incomeToUse = salaryValue ?? country.medianIncome;

  const yearsToMatch = useMemo(
    () => (richest ? Math.round(richest.netWorth / incomeToUse) : 0),
    [richest, incomeToUse]
  );

  const lifetimes = useMemo(
    () => Math.round(yearsToMatch / 80),
    [yearsToMatch]
  );

  const secondsPerDollar = useMemo(() => {
    if (!richest) return 0;
    const secondsInYear = 365.25 * 24 * 3600;
    return richest.netWorth / secondsInYear;
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
            <h1 className="font-[family-name:var(--font-bitter)] text-4xl sm:text-5xl lg:text-6xl text-text-primary leading-tight mb-8">
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
    <main className="min-h-screen pt-14">
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h1 className="font-[family-name:var(--font-bitter)] text-4xl sm:text-5xl lg:text-6xl text-text-primary leading-tight">
              How Long Would It Take?
            </h1>
            <p className="text-text-secondary text-lg sm:text-xl mt-4 max-w-2xl mx-auto">
              Compare your income to the wealthiest person in each country.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-10"
          >
            <CountrySelector selected={selectedCountry} onSelect={handleCountrySelect} />
          </motion.div>

          {/* The richest person card */}
          <motion.div
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
                  {formatCurrency(richest.netWorth, true)}
                </p>
                <p className="text-text-muted text-sm mt-1">{richest.source}</p>
              </div>
            </div>
          </motion.div>

          {/* Salary input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="w-full max-w-md mx-auto mb-12"
          >
            <label
              htmlFor="salary-input"
              className="block text-sm text-text-secondary mb-2 text-center"
            >
              Enter your annual income (USD) — or we&apos;ll use the median
            </label>
            <input
              id="salary-input"
              type="text"
              inputMode="numeric"
              value={displaySalary}
              onChange={handleSalaryChange}
              placeholder={formatCurrency(country.medianIncome)}
              className="
                w-full px-6 py-4 rounded-2xl text-center text-2xl font-medium tabular-nums
                bg-bg-card border border-border-subtle
                text-text-primary placeholder:text-text-muted
                focus:outline-none focus:border-accent-periwinkle/50 focus:ring-2 focus:ring-accent-periwinkle/20
                transition-all duration-300
              "
            />
            <p className="text-text-muted text-xs text-center mt-2">
              {!salaryValue && `Using median income: ${formatCurrency(country.medianIncome)}/year`}
              {salaryValue && "Your data stays in your browser."}
            </p>
          </motion.div>

          {/* The big number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="bg-gradient-to-br from-accent-rose/8 to-accent-amber/8 border border-accent-rose/15 rounded-3xl p-8 sm:p-12 text-center mb-8"
          >
            <p className="text-text-secondary text-lg sm:text-xl mb-4">
              At {formatCurrency(incomeToUse)}/year, you would need
            </p>
            <div className="text-5xl sm:text-6xl lg:text-8xl font-bold text-accent-rose font-[family-name:var(--font-bitter)]">
              <FormattedNumber value={yearsToMatch} />
            </div>
            <p className="text-text-secondary text-xl sm:text-2xl mt-2">
              years of work
            </p>
            <p className="text-text-secondary text-lg sm:text-xl mt-4">
              to match {richest.name}&apos;s wealth
            </p>

            <div className="mt-8 pt-6 border-t border-border-subtle/50">
              <p className="text-text-muted text-sm">
                That&apos;s roughly <span className="text-accent-amber font-semibold">{formatNumber(lifetimes)} human lifetimes</span> (at 80 years each)
              </p>
            </div>
          </motion.div>

          {/* Time comparisons — the fun part */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="font-[family-name:var(--font-bitter)] text-2xl sm:text-3xl text-center mb-8 text-text-primary">
              To Put That In Perspective...
            </h3>
            <TimeComparisons yearsToMatch={yearsToMatch} billionaireName={richest.name} />
          </motion.div>

          {/* Comparison cards */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16"
          >
            <ComparisonCard
              label={`${richest.name} earns per second`}
              value={`${formatCurrency(secondsPerDollar)}`}
              sublabel="If their wealth grew at 8%/year"
              accent="amber"
              delay={0}
            />
            <ComparisonCard
              label="Your daily earnings"
              value={formatCurrency(incomeToUse / 365)}
              sublabel={`vs. ${richest.name}'s ${formatCurrency(richest.netWorth * 0.08 / 365, true)}/day`}
              accent="sage"
              delay={0.1}
            />
            <ComparisonCard
              label="Wealth ratio"
              value={`${formatNumber(Math.round(richest.netWorth / incomeToUse))}x`}
              sublabel={`${richest.name}'s wealth vs. your annual income`}
              accent="rose"
              delay={0.2}
            />
            <ComparisonCard
              label="If they gave you $1M"
              value={`${formatCurrency(incomeToUse * (1_000_000 / richest.netWorth))}`}
              sublabel={`Would feel like losing this from your annual income`}
              accent="periwinkle"
              delay={0.3}
            />
            <ComparisonCard
              label="Homes their wealth could buy"
              value={formatNumber(Math.round(richest.netWorth / 350_000))}
              sublabel="At $350K average US home price"
              accent="lavender"
              delay={0.4}
            />
            <ComparisonCard
              label="Years of healthcare"
              value={formatNumber(Math.round(richest.netWorth / 12_530))}
              sublabel="At US per-capita healthcare spending"
              accent="amber"
              delay={0.5}
            />
          </motion.div>

          {/* Source note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-text-muted text-xs max-w-xl mx-auto leading-relaxed">
              Net worth estimates from Bloomberg Billionaires Index and Forbes (March 2026).
              Median income data from OECD and national statistics offices.
              Wealth fluctuates daily — these are approximate figures for illustration.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

interface ComparisonCardProps {
  readonly label: string;
  readonly value: string;
  readonly sublabel: string;
  readonly accent: "rose" | "amber" | "sage" | "periwinkle" | "lavender";
  readonly delay: number;
}

function ComparisonCard({ label, value, sublabel, accent, delay }: ComparisonCardProps) {
  const accentColors = {
    rose: "text-accent-rose",
    amber: "text-accent-amber",
    sage: "text-accent-sage",
    periwinkle: "text-accent-periwinkle",
    lavender: "text-accent-lavender",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-bg-card border border-border-subtle rounded-2xl p-6 text-center"
    >
      <p className="text-text-secondary text-sm mb-2">{label}</p>
      <p className={`text-2xl sm:text-3xl font-bold ${accentColors[accent]} tabular-nums`}>
        {value}
      </p>
      <p className="text-text-muted text-xs mt-2">{sublabel}</p>
    </motion.div>
  );
}
