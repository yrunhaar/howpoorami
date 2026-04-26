"use client";

import { useState, useMemo, useCallback } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ALL_COUNTRIES,
  ALL_COUNTRY_MAP,
  type AllCountryCode,
  isAllCountryCode,
} from "@/data/countries-extended";
import { findPercentile, getWealthThresholds } from "@/data/wealth-data";
import type { CountryData } from "@/data/wealth-data";
import { toUSD, fromUSD } from "@/lib/currency";
import { formatCurrency, getCurrencySymbol } from "@/lib/format";
import { getPPPFactor } from "@/lib/ppp";
import { useDictionary, useLanguage } from "@/components/LanguageProvider";
import { interpolate, type Dictionary } from "@/lib/i18n/dictionary";
import { localizedCountryName } from "@/lib/i18n/country-names";
import { localePath } from "@/lib/i18n/urls";

// ─── Constants ──────────────────────────────────────────────────────────────

const MAX_COUNTRIES = 5;
const MIN_COUNTRIES = 2;

const DEFAULT_SELECTIONS: readonly AllCountryCode[] = ["US", "GB", "DE", "NL", "FR"];

const REGION_MAP: Readonly<Record<string, string>> = {
  US: "Americas", CA: "Americas", BR: "Americas", MX: "Americas", CL: "Americas",
  GB: "Europe", FR: "Europe", DE: "Europe", NL: "Europe", SE: "Europe",
  NO: "Europe", DK: "Europe", FI: "Europe", CH: "Europe", IT: "Europe",
  ES: "Europe", PT: "Europe", AT: "Europe", BE: "Europe", IE: "Europe",
  PL: "Europe", CZ: "Europe",
  JP: "Asia-Pacific", KR: "Asia-Pacific", CN: "Asia-Pacific", IN: "Asia-Pacific",
  SG: "Asia-Pacific", AU: "Asia-Pacific", NZ: "Asia-Pacific",
  ZA: "Africa",
};

// ─── Types ──────────────────────────────────────────────────────────────────

interface CountryResult {
  readonly country: CountryData;
  readonly percentile: number;
  readonly localAmount: number;
  readonly segment: string;
  readonly thresholdToNext: number | null;
  readonly thresholdToNextLabel: string | null;
  readonly pppEquivalent: number | null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getSegmentLabel(percentile: number, t: Dictionary): string {
  if (percentile >= 99.9) return t.segments.top01;
  if (percentile >= 99) return t.segments.top1;
  if (percentile >= 90) return t.segments.top10;
  if (percentile >= 50) return t.segments.top50;
  return t.segments.bottom50;
}

function getSegmentColor(percentile: number): string {
  if (percentile >= 99) return "text-accent-rose";
  if (percentile >= 90) return "text-accent-amber";
  if (percentile >= 50) return "text-accent-periwinkle";
  return "text-accent-sage";
}

function getNextThreshold(
  percentile: number,
  thresholds: ReturnType<typeof getWealthThresholds>,
  t: Dictionary,
): { amount: number; label: string } | null {
  if (percentile >= 99.9) return null;
  if (percentile >= 99) return { amount: thresholds.p999, label: t.segments.forTop01 };
  if (percentile >= 90) return { amount: thresholds.p99, label: t.segments.forTop1 };
  if (percentile >= 50) return { amount: thresholds.p90, label: t.segments.forTop10 };
  return { amount: thresholds.p50, label: t.segments.forTop50 };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function CrossCountryCompare() {
  const [inputValue, setInputValue] = useState("");
  const [inputCurrency, setInputCurrency] = useState<string>("USD");
  const [selectedCodes, setSelectedCodes] = useState<readonly AllCountryCode[]>(DEFAULT_SELECTIONS);
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const t = useDictionary();
  const { locale } = useLanguage();

  // Parse input amount to USD
  const amountUSD = useMemo(() => {
    const cleaned = inputValue.replace(/[^0-9.-]/g, "");
    const parsed = parseFloat(cleaned);
    if (!Number.isFinite(parsed)) return null;
    return toUSD(parsed, inputCurrency);
  }, [inputValue, inputCurrency]);

  // Compute results for each selected country
  const results: readonly CountryResult[] = useMemo(() => {
    if (amountUSD === null) return [];
    return selectedCodes.map((code) => {
      const rawCountry = ALL_COUNTRY_MAP[code];
      const country = {
        ...rawCountry,
        name: localizedCountryName(code, locale, rawCountry.name),
      };
      const percentile = findPercentile(amountUSD, country);
      const localAmount = fromUSD(amountUSD, country.currency);
      const thresholds = getWealthThresholds(country);
      const next = getNextThreshold(percentile, thresholds, t);
      // PPP: what does this local amount buy in US-dollar terms?
      const pppFactor = getPPPFactor(country.code);
      const pppEquivalent = pppFactor && pppFactor > 0 ? localAmount / pppFactor : null;

      return {
        country,
        percentile,
        localAmount,
        segment: getSegmentLabel(percentile, t),
        thresholdToNext: next ? fromUSD(next.amount, country.currency) : null,
        thresholdToNextLabel: next?.label ?? null,
        pppEquivalent,
      };
    }).sort((a, b) => b.percentile - a.percentile);
  }, [amountUSD, selectedCodes, t, locale]);

  // Available currencies from selected countries + USD
  const availableCurrencies = useMemo(() => {
    const set = new Set(["USD"]);
    for (const code of selectedCodes) {
      set.add(ALL_COUNTRY_MAP[code].currency);
    }
    return Array.from(set).sort();
  }, [selectedCodes]);

  // Country picker filtered list — search matches both English name (so
  // typing "Germany" works) and the locale-specific name (so typing "Alemania"
  // also works in Spanish).
  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const selSet = new Set<string>(selectedCodes);
    return ALL_COUNTRIES
      .filter((c) => !selSet.has(c.code))
      .filter((c) => {
        if (!q) return true;
        const localized = localizedCountryName(c.code, locale, c.name).toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          localized.includes(q)
        );
      })
      .sort((a, b) => {
        const rA = REGION_MAP[a.code] ?? "Other";
        const rB = REGION_MAP[b.code] ?? "Other";
        if (rA !== rB) return rA.localeCompare(rB);
        const aName = localizedCountryName(a.code, locale, a.name);
        const bName = localizedCountryName(b.code, locale, b.name);
        return aName.localeCompare(bName);
      });
  }, [searchQuery, selectedCodes, locale]);

  const handleToggleCountry = useCallback((code: string) => {
    if (!isAllCountryCode(code)) return;
    setSelectedCodes((prev) => {
      if (prev.includes(code)) {
        if (prev.length <= MIN_COUNTRIES) return prev;
        return prev.filter((c) => c !== code);
      }
      if (prev.length >= MAX_COUNTRIES) return prev;
      return [...prev, code];
    });
  }, []);

  const handleRemoveCountry = useCallback((code: AllCountryCode) => {
    setSelectedCodes((prev) => {
      if (prev.length <= MIN_COUNTRIES) return prev;
      return prev.filter((c) => c !== code);
    });
  }, []);

  const sym = getCurrencySymbol(inputCurrency);

  return (
    <LazyMotion features={domAnimation}>
      <main className="min-h-screen pt-14 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight">
              {t.compareCountries.h1}
            </h1>
            <p className="text-text-secondary text-base sm:text-lg mt-3 max-w-xl mx-auto">
              {t.compareCountries.subtitle}
            </p>
          </m.div>

          {/* Input Section */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8 mb-8"
          >
            <label className="block text-text-secondary text-sm mb-2">
              {t.compareCountries.enterNetWealthLabel}
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg pointer-events-none">
                  {sym}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t.compareCountries.amountPlaceholder}
                  className="w-full bg-bg-primary border border-border-subtle rounded-xl pl-10 pr-4 py-3 text-text-primary text-lg tabular-nums placeholder:text-text-muted/40 focus:outline-none focus:border-accent-periwinkle/50 focus:ring-1 focus:ring-accent-periwinkle/30 transition-colors"
                />
              </div>
              <select
                value={inputCurrency}
                onChange={(e) => setInputCurrency(e.target.value)}
                className="bg-bg-primary border border-border-subtle rounded-xl px-3 py-3 text-text-primary text-sm focus:outline-none focus:border-accent-periwinkle/50 cursor-pointer"
              >
                {availableCurrencies.map((cc) => (
                  <option key={cc} value={cc}>{cc}</option>
                ))}
              </select>
            </div>
            <p className="text-text-muted text-xs mt-2">
              {t.compareCountries.inputHint}
            </p>
          </m.div>

          {/* Country Selection */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-text-primary font-semibold text-sm">
                {interpolate(t.compareCountries.countriesCountTemplate, {
                  n: selectedCodes.length,
                  max: MAX_COUNTRIES,
                })}
              </h2>
              <button
                onClick={() => { setShowPicker(!showPicker); setSearchQuery(""); }}
                className="text-accent-periwinkle text-xs font-medium hover:underline cursor-pointer"
              >
                {showPicker
                  ? t.compareCountries.doneButton
                  : t.compareCountries.addRemoveButton}
              </button>
            </div>

            {/* Selected country chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCodes.map((code) => {
                const c = ALL_COUNTRY_MAP[code];
                const displayName = localizedCountryName(code, locale, c.name);
                return (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1.5 bg-bg-card border border-border-subtle rounded-full px-3 py-1 text-sm text-text-primary"
                  >
                    <span>{c.flag}</span>
                    <span>{displayName}</span>
                    {selectedCodes.length > MIN_COUNTRIES && (
                      <button
                        onClick={() => handleRemoveCountry(code)}
                        className="text-text-muted hover:text-accent-rose ml-0.5 cursor-pointer"
                        aria-label={interpolate(
                          t.compareCountries.removeAriaTemplate,
                          {
                            country: localizedCountryName(
                              code,
                              locale,
                              c.name,
                            ),
                          },
                        )}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </span>
                );
              })}
            </div>

            {/* Country picker dropdown */}
            <AnimatePresence>
              {showPicker && (
                <m.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="bg-bg-card border border-border-subtle rounded-xl p-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.compareCountries.searchPlaceholder}
                      className="w-full bg-bg-primary border border-border-subtle rounded-lg px-3 py-2 text-text-primary text-sm placeholder:text-text-muted/40 focus:outline-none focus:border-accent-periwinkle/50 mb-3"
                    />
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => handleToggleCountry(c.code)}
                          disabled={selectedCodes.length >= MAX_COUNTRIES}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:bg-bg-primary hover:text-text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {c.flag} {localizedCountryName(c.code, locale, c.name)}
                          <span className="text-text-muted text-xs ml-2">({c.currency})</span>
                        </button>
                      ))}
                      {filteredCountries.length === 0 && (
                        <p className="text-text-muted text-xs text-center py-2">
                          {t.compareCountries.noCountriesFound}
                        </p>
                      )}
                    </div>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </m.div>

          {/* Results */}
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              <m.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-3"
              >
                <h2 className="text-text-primary font-semibold text-sm mb-4">
                  {t.compareCountries.yourRankingTitle}
                </h2>
                {results.map((r, i) => (
                  <m.div
                    key={r.country.code}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="bg-bg-card border border-border-subtle rounded-xl p-4 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{r.country.flag}</span>
                          <span className="text-text-primary font-semibold text-sm sm:text-base truncate">
                            {r.country.name}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-bg-primary ${getSegmentColor(r.percentile)}`}>
                            {r.segment}
                          </span>
                        </div>

                        {/* Percentile bar */}
                        <div className="mb-3">
                          <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                            <m.div
                              className="h-full rounded-full bg-accent-periwinkle"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(r.percentile, 1)}%` }}
                              transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
                          <span className="text-text-muted">
                            {t.compareCountries.localValueLabel}{" "}
                            <span className="text-text-secondary font-medium tabular-nums">
                              {formatCurrency(r.localAmount, r.country.currency, true)}
                            </span>
                          </span>
                          {r.pppEquivalent !== null && r.country.code !== "US" && (
                            <span className="text-text-muted">
                              {interpolate(t.compareCountries.buyingPowerTemplate, {
                                amount: formatCurrency(r.pppEquivalent, "USD", true),
                              })}
                            </span>
                          )}
                          {r.thresholdToNext !== null && r.thresholdToNextLabel !== null && (
                            <span className="text-text-muted">
                              {interpolate(t.compareCountries.needTemplate, {
                                amount: formatCurrency(
                                  r.thresholdToNext,
                                  r.country.currency,
                                  true,
                                ),
                                label: r.thresholdToNextLabel,
                              })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Percentile number */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl sm:text-3xl font-bold text-accent-periwinkle tabular-nums">
                          {r.percentile.toFixed(1)}
                          <span className="text-sm font-normal text-text-muted">
                            {t.compareCountries.percentileSuffix}
                          </span>
                        </p>
                        <p className="text-text-muted text-[10px] mt-0.5">
                          {interpolate(t.compareCountries.richerThanTemplate, {
                            pct: r.percentile.toFixed(1),
                          })}
                        </p>
                      </div>
                    </div>
                  </m.div>
                ))}

                {/* Insight box */}
                {results.length >= 2 && (() => {
                  const top = results[0];
                  const bottom = results[results.length - 1];
                  const insight = interpolate(t.compareCountries.insightTemplate, {
                    topSegment: top.segment,
                    topCountry: top.country.name,
                    bottomSegment: bottom.segment,
                    bottomCountry: bottom.country.name,
                  });
                  return (
                    <m.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-br from-accent-periwinkle/8 to-accent-lavender/8 border border-accent-periwinkle/15 rounded-xl p-5 text-center mt-6"
                    >
                      <p className="text-text-secondary text-sm">{insight}</p>
                    </m.div>
                  );
                })()}
              </m.div>
            ) : amountUSD === null && inputValue.length > 0 ? (
              <m.p
                key="invalid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-text-muted text-sm"
              >
                {t.compareCountries.invalidNumber}
              </m.p>
            ) : inputValue.length === 0 ? (
              <m.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center py-12"
              >
                <p className="text-text-muted text-sm mb-2">
                  {t.compareCountries.enterToCompare}
                </p>
                <p className="text-text-muted text-xs">
                  {(() => {
                    const tpl = t.compareCountries.tipTemplate;
                    const placeholder = "{calculatorLink}";
                    const idx = tpl.indexOf(placeholder);
                    if (idx === -1) return tpl;
                    const before = tpl.slice(0, idx);
                    const after = tpl.slice(idx + placeholder.length);
                    return (
                      <>
                        {before}
                        <Link
                          href={localePath(locale, "/")}
                          className="text-accent-periwinkle hover:underline"
                        >
                          {t.compareCountries.tipCalculatorLinkLabel}
                        </Link>
                        {after}
                      </>
                    );
                  })()}
                </p>
              </m.div>
            ) : null}
          </AnimatePresence>

          {/* Methodology note */}
          <div className="mt-12 text-center">
            <p className="text-text-muted text-xs">
              {t.compareCountries.methodologyNote}
            </p>
            <p className="text-text-muted text-xs mt-1">
              <Link
                href={localePath(locale, "/methodology")}
                className="text-accent-periwinkle hover:underline"
              >
                {t.compareCountries.readMethodology}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </LazyMotion>
  );
}
