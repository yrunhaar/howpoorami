"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { ALL_COUNTRY_MAP, type AllCountryCode, isAllCountryCode } from "@/data/countries-extended";
import { RICHEST_BY_COUNTRY } from "@/data/billionaires";
import { TAX_RATES } from "@/data/tax-rates";
import { PURCHASING_POWER } from "@/data/purchasing-power";
import CountrySelector from "@/components/CountrySelector";
import CurrencySelector from "@/components/CurrencySelector";
import DataProvenanceBanner from "@/components/DataProvenanceBanner";
import WealthInput from "@/components/WealthInput";
import SourcesSection from "@/components/SourcesSection";
import ResponsiveChart from "@/components/ResponsiveChart";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useGeoCountry } from "@/hooks/useGeoCountry";

import WealthDistributionChart from "@/components/WealthDistributionChart";
import WealthShareBars from "@/components/WealthShareBars";
import WealthHoardingChart from "@/components/WealthHoardingChart";
import TaxRateChart from "@/components/TaxRateChart";
import PurchasingPowerChart from "@/components/PurchasingPowerChart";
import HistoricalEvolutionChart from "@/components/HistoricalEvolutionChart";
import StatisticsSection from "@/components/StatisticsSection";

interface HomeClientProps {
  readonly initialCountry?: AllCountryCode;
}

export default function HomeClient({ initialCountry }: HomeClientProps) {
  const [selectedCountry, setSelectedCountry] = useState<AllCountryCode>(initialCountry ?? "US");
  const [userPercentile, setUserPercentile] = useState<number | null>(null);
  const [globalCurrency, setGlobalCurrency] = useState("USD");
  const geoCountry = useGeoCountry();

  // Auto-select country on first load based on geolocation (only if no initial country from URL)
  useEffect(() => {
    if (!initialCountry && geoCountry) {
      setSelectedCountry(geoCountry);
    }
  }, [geoCountry, initialCountry]);

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
    if (isAllCountryCode(code)) {
      setSelectedCountry(code);
      setUserPercentile(null);
    }
  }, []);

  const hasTaxData = selectedCountry in TAX_RATES;
  const hasPurchasingPowerData = selectedCountry in PURCHASING_POWER;
  const hasRichestData = selectedCountry in RICHEST_BY_COUNTRY;

  return (
    <LazyMotion features={domAnimation}>
    <main className="min-h-screen pt-14">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto w-full">
          {/* Title */}
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-7xl font-bold text-text-primary leading-tight">
              How Poor Am I?
            </h1>
            <p className="text-text-secondary text-lg sm:text-xl mt-4 max-w-2xl mx-auto">
              Enter your income or wealth and discover where you really stand.
            </p>
          </m.div>

          {/* Data provenance disclaimer */}
          <DataProvenanceBanner />

          {/* Country Selector */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative mb-8"
          >
            <div className="flex flex-col items-center gap-3">
              <CountrySelector
                selected={selectedCountry}
                onSelect={handleCountrySelect}
              />
              {isGlobal && (
                <m.div
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
                </m.div>
              )}
            </div>
          </m.div>

          {/* Wealth Input */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-10"
          >
            <WealthInput
              country={country}
              onPercentileChange={handlePercentileChange}
            />
          </m.div>

          {/* Main Chart — Wealth Distribution */}
          <m.div
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
                  <span className="hidden md:inline">Hover over</span>
                  <span className="md:hidden">Tap</span> each group for details
                </p>
                <p className="text-text-muted text-xs">
                  Zoom in to see the top
                </p>
              </div>
            </div>

            <WealthDistributionChart
              country={country}
              userPercentile={userPercentile}
            />
          </m.div>

          {/* Wealth Share Bars */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 bg-bg-secondary/50 border border-border-subtle rounded-2xl p-4 sm:p-6"
          >
            <h3 className="text-text-primary font-semibold text-lg mb-4">
              Population vs. Wealth — {country.name}
            </h3>
            <WealthShareBars country={country} />
          </m.div>

          {/* Scroll indicator */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-text-muted text-sm mb-2">Scroll to explore more</p>
            <m.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-text-muted text-2xl"
            >
              ↓
            </m.div>
          </m.div>
        </div>
      </section>

      {/* The Scale of Concentration */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-text-primary">
              The Scale of Concentration
            </h2>
            <p className="text-text-secondary text-lg mt-4 max-w-2xl mx-auto">
              Each rectangle below represents wealth. The area shows how much each
              group actually owns. Look at who has what.
            </p>
          </div>

          <div className="bg-bg-secondary/50 border border-border-subtle rounded-2xl p-4 sm:p-6">
            <ErrorBoundary>
              <ResponsiveChart aspectRatio={16 / 6} minHeight={300} maxHeight={450}>
                {({ width, height }) => (
                  <WealthHoardingChart
                    country={country}
                    width={width}
                    height={height}
                  />
                )}
              </ResponsiveChart>
            </ErrorBoundary>
          </div>
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
            <div className="text-center mb-10">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-text-primary">
                Who Actually Pays?
              </h2>
              <p className="text-text-secondary text-lg mt-4 max-w-2xl mx-auto">
                Effective tax rates tell a different story than statutory rates.
                When you account for all taxes actually paid — including how investment
                income, capital gains, and corporate structures are treated — the
                system often becomes regressive at the very top.
              </p>
            </div>

            <div className="bg-bg-secondary/50 border border-border-subtle rounded-2xl p-4 sm:p-6">
              <ErrorBoundary>
                <ResponsiveChart aspectRatio={16 / 9} minHeight={350} maxHeight={500}>
                  {({ width, height }) => (
                    <TaxRateChart
                      countryCode={selectedCountry}
                      width={width}
                      height={height}
                    />
                  )}
                </ResponsiveChart>
              </ErrorBoundary>
            </div>
          </div>
        </section>
      )}

      {/* Historical Trends */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-text-primary">
              A Century of Change
            </h2>
            <p className="text-text-secondary text-lg mt-4 max-w-2xl mx-auto">
              How wealth concentration in {country.name} has evolved — and what
              policy choices drove each shift.
            </p>
          </div>

          <div className="bg-bg-secondary/50 border border-border-subtle rounded-2xl p-4 sm:p-6 overflow-visible">
            <ErrorBoundary>
              <ResponsiveChart aspectRatio={16 / 9} minHeight={350} maxHeight={500}>
                {({ width, height }) => (
                  <HistoricalEvolutionChart
                    country={country}
                    width={width}
                    height={height}
                  />
                )}
              </ResponsiveChart>
            </ErrorBoundary>
          </div>
        </div>
      </section>

      {/* Wages vs. Cost of Living */}
      {hasPurchasingPowerData && (
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-text-primary">
                Are Wages Keeping Up?
              </h2>
              <p className="text-text-secondary text-lg mt-4 max-w-2xl mx-auto">
                Wages, consumer prices, and house prices — all indexed to 2000.
                When the lines diverge, someone is falling behind.
              </p>
            </div>

            <div className="bg-bg-secondary/50 border border-border-subtle rounded-2xl p-4 sm:p-6">
              <ErrorBoundary>
                <ResponsiveChart aspectRatio={16 / 9} minHeight={350} maxHeight={500}>
                  {({ width, height }) => (
                    <PurchasingPowerChart
                      countryCode={selectedCountry}
                      width={width}
                      height={height}
                    />
                  )}
                </ResponsiveChart>
              </ErrorBoundary>
            </div>
          </div>
        </section>
      )}

      {/* Cross-link to Compare page */}
      {hasRichestData && !isGlobal && (
        <section className="px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-6xl mx-auto">
            <Link
              href={`/compare/${selectedCountry.toLowerCase()}`}
              className="block bg-accent-periwinkle/8 border border-accent-periwinkle/20 rounded-2xl p-6 sm:p-8 text-center hover:bg-accent-periwinkle/12 hover:border-accent-periwinkle/30 transition-all duration-300"
            >
              <p className="text-text-secondary text-base sm:text-lg">
                See how long it would take you to earn as much as the richest person in{" "}
                <span className="text-accent-periwinkle font-medium">{country.name}</span>
              </p>
              <span className="inline-block mt-3 text-accent-periwinkle text-sm font-medium">
                Try the billionaire comparison &rarr;
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* Sources */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <SourcesSection />
        </div>
      </section>

      {/* Data source attribution */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
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
        </div>
      </section>
    </main>
    </LazyMotion>
  );
}
