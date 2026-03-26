"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ALL_COUNTRY_MAP, type AllCountryCode } from "@/data/countries-extended";
import { TAX_RATES } from "@/data/tax-rates";
import { PURCHASING_POWER } from "@/data/purchasing-power";
import CountrySelector from "@/components/CountrySelector";
import CurrencySelector from "@/components/CurrencySelector";
import WealthInput from "@/components/WealthInput";
import WealthDistributionChart from "@/components/WealthDistributionChart";
import WealthShareBars from "@/components/WealthShareBars";
import WealthHoardingChart from "@/components/WealthHoardingChart";
import TaxRateChart from "@/components/TaxRateChart";
import PurchasingPowerChart from "@/components/PurchasingPowerChart";
import HistoricalEvolutionChart from "@/components/HistoricalEvolutionChart";
import StatisticsSection from "@/components/StatisticsSection";
import SourcesSection from "@/components/SourcesSection";
import ResponsiveChart from "@/components/ResponsiveChart";
import { useGeoCountry } from "@/hooks/useGeoCountry";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<AllCountryCode>("US");
  const [userPercentile, setUserPercentile] = useState<number | null>(null);
  const [globalCurrency, setGlobalCurrency] = useState("USD");
  const geoCountry = useGeoCountry();

  // Auto-select country on first load based on geolocation
  useEffect(() => {
    if (geoCountry) {
      setSelectedCountry(geoCountry);
    }
  }, [geoCountry]);

  const isGlobal = selectedCountry === "GLOBAL";
  const rawCountry = ALL_COUNTRY_MAP[selectedCountry];
  // When Global is selected, override the currency with the user's choice
  const country = isGlobal
    ? { ...rawCountry, currency: globalCurrency }
    : rawCountry;

  const handlePercentileChange = useCallback((p: number | null) => {
    setUserPercentile(p);
  }, []);

  const handleCountrySelect = useCallback((code: string) => {
    setSelectedCountry(code as AllCountryCode);
    setUserPercentile(null);
  }, []);

  const hasTaxData = selectedCountry in TAX_RATES;
  const hasPurchasingPowerData = selectedCountry in PURCHASING_POWER;

  return (
    <main className="min-h-screen pt-14">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto w-full">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="font-[family-name:var(--font-bitter)] text-4xl sm:text-5xl lg:text-7xl font-bold text-text-primary leading-tight">
              How Poor Am I?
            </h1>
            <p className="text-text-secondary text-lg sm:text-xl mt-4 max-w-2xl mx-auto">
              Enter your income or wealth and discover where you really stand.
            </p>
          </motion.div>

          {/* Country Selector */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col items-center gap-3">
              <CountrySelector
                selected={selectedCountry}
                onSelect={handleCountrySelect}
              />
              {isGlobal && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-text-muted text-xs">Currency:</span>
                  <CurrencySelector
                    selected={globalCurrency}
                    onSelect={setGlobalCurrency}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Wealth Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-10"
          >
            <WealthInput
              country={country}
              onPercentileChange={handlePercentileChange}
            />
          </motion.div>

          {/* Main Chart — Wealth Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="bg-bg-secondary/50 border border-border-subtle rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-text-primary font-semibold text-lg">
                  {country.flag} {country.name} — Wealth Distribution
                </h2>
                <p className="text-text-muted text-sm">
                  Wealth share by population group (2023)
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-text-muted text-xs">
                  Hover over each group for details
                </p>
                <p className="text-text-muted text-xs">
                  Zoom in to see the top
                </p>
              </div>
            </div>

            <WealthDistributionChart
              country={country}
              width={0}
              height={0}
              userPercentile={userPercentile}
            />
          </motion.div>

          {/* Wealth Share Bars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 bg-bg-secondary/50 border border-border-subtle rounded-2xl p-4 sm:p-6"
          >
            <h3 className="text-text-primary font-semibold text-lg mb-4">
              Population vs. Wealth — {country.name}
            </h3>
            <WealthShareBars country={country} />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-text-muted text-sm mb-2">Scroll to explore more</p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-text-muted text-2xl"
            >
              ↓
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Scale of Concentration */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-[family-name:var(--font-bitter)] text-3xl sm:text-4xl font-bold text-text-primary">
              The Scale of Concentration
            </h2>
            <p className="text-text-secondary text-lg mt-4 max-w-2xl mx-auto">
              Each rectangle below represents wealth. The area shows how much each
              group actually owns. Look at who has what.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bg-secondary/50 border border-border-subtle rounded-2xl p-4 sm:p-6"
          >
            <ResponsiveChart aspectRatio={16 / 6} minHeight={300} maxHeight={450}>
              {({ width, height }) => (
                <WealthHoardingChart
                  country={country}
                  width={width}
                  height={height}
                />
              )}
            </ResponsiveChart>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <StatisticsSection country={country} />
        </div>
      </section>

      {/* Who Actually Pays? — Tax Rates */}
      {hasTaxData && (
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="font-[family-name:var(--font-bitter)] text-3xl sm:text-4xl font-bold text-text-primary">
                Who Actually Pays?
              </h2>
              <p className="text-text-secondary text-lg mt-4 max-w-2xl mx-auto">
                Effective tax rates tell a different story than statutory rates.
                When you account for all taxes actually paid — including how investment
                income, capital gains, and corporate structures are treated — the
                system often becomes regressive at the very top.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-bg-secondary/50 border border-border-subtle rounded-2xl p-4 sm:p-6"
            >
              <ResponsiveChart aspectRatio={16 / 9} minHeight={350} maxHeight={500}>
                {({ width, height }) => (
                  <TaxRateChart
                    countryCode={selectedCountry}
                    width={width}
                    height={height}
                  />
                )}
              </ResponsiveChart>
            </motion.div>
          </div>
        </section>
      )}

      {/* Historical Trends */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-[family-name:var(--font-bitter)] text-3xl sm:text-4xl font-bold text-text-primary">
              A Century of Change
            </h2>
            <p className="text-text-secondary text-lg mt-4 max-w-2xl mx-auto">
              How wealth concentration in {country.name} has evolved — and what
              policy choices drove each shift.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bg-secondary/50 border border-border-subtle rounded-2xl p-4 sm:p-6"
          >
            <ResponsiveChart aspectRatio={16 / 9} minHeight={350} maxHeight={500}>
              {({ width, height }) => (
                <HistoricalEvolutionChart
                  country={country}
                  width={width}
                  height={height}
                />
              )}
            </ResponsiveChart>
          </motion.div>
        </div>
      </section>

      {/* What Your Money Actually Buys */}
      {hasPurchasingPowerData && (
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="font-[family-name:var(--font-bitter)] text-3xl sm:text-4xl font-bold text-text-primary">
                What Your Money Actually Buys
              </h2>
              <p className="text-text-secondary text-lg mt-4 max-w-2xl mx-auto">
                While the top accumulates more wealth, everyday purchasing power has eroded
                dramatically. Here&apos;s what the same money buys now versus decades ago.
              </p>
            </motion.div>

            <PurchasingPowerChart countryCode={selectedCountry} />
          </div>
        </section>
      )}

      {/* Sources */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <SourcesSection />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-text-muted text-sm">
            Data sourced from{" "}
            <a
              href="https://wid.world"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-periwinkle hover:underline"
            >
              WID.world
            </a>
            ,{" "}
            <a
              href="https://www.oecd.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-periwinkle hover:underline"
            >
              OECD
            </a>
            , and{" "}
            <a
              href="https://fsolt.org/swiid/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-periwinkle hover:underline"
            >
              SWIID
            </a>
            . Open-source project for educational purposes.
          </p>
          <p className="text-text-muted text-sm mt-2">
            <a
              href="https://github.com/yrunhaar/howpoorami"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-accent-periwinkle hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
