"use client";

import { useState } from "react";
import AnimatedCounter from "./AnimatedCounter";
import { type CountryData, GLOBAL_STATS, getWealthThresholds } from "@/data/wealth-data";
import { formatCurrency } from "@/lib/format";
import { fromUSD } from "@/lib/currency";
import { getPPPFactor } from "@/lib/ppp";
import { REGIONS } from "@/data/regions";
import { useDictionary } from "@/components/LanguageProvider";
import { interpolate } from "@/lib/i18n/dictionary";

interface StatisticsSectionProps {
  readonly country: CountryData;
}

interface StatCardProps {
  readonly label: string;
  readonly children: React.ReactNode;
  readonly sublabel?: string;
  readonly accent?: "rose" | "amber" | "sage" | "periwinkle" | "lavender";
}

const accentColors = {
  rose: "text-accent-rose",
  amber: "text-accent-amber",
  sage: "text-accent-sage",
  periwinkle: "text-accent-periwinkle",
  lavender: "text-accent-lavender",
};

function StatCard({ label, children, sublabel, accent = "periwinkle" }: StatCardProps) {
  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8 text-center">
      <p className="text-text-secondary text-sm sm:text-base mb-3">{label}</p>
      <p className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${accentColors[accent]}`}>
        {children}
      </p>
      {sublabel && (
        <p className="text-text-muted text-xs sm:text-sm mt-3">{sublabel}</p>
      )}
    </div>
  );
}

export default function StatisticsSection({ country }: StatisticsSectionProps) {
  const t = useDictionary();
  const [showPPP, setShowPPP] = useState(false);
  const pppFactor = getPPPFactor(country.code);
  const hasPPP = pppFactor !== null && country.code !== "US" && country.code !== "GLOBAL";

  const meanToMedianRatio = country.meanWealthPerAdult / country.medianWealthPerAdult;

  // Average wealth of a top 1% member = (their share of total wealth) / (1% of adults)
  // = (top1% / 100) * meanWealthPerAdult / 0.01
  const avgTop1Wealth = (country.wealthShares.top1 / 100) * country.meanWealthPerAdult / 0.01;
  const yearsToEarnTop1 = Math.round(avgTop1Wealth / country.medianIncome);

  // Wealth thresholds for key percentile boundaries
  const thresholds = getWealthThresholds(country);

  // Convert USD values to local currency for display
  const cc = country.currency;
  const meanLocal = fromUSD(country.meanWealthPerAdult, cc);
  const medianLocal = fromUSD(country.medianWealthPerAdult, cc);
  const medianIncomeLocal = fromUSD(country.medianIncome, cc);
  const avgTop1Local = fromUSD(avgTop1Wealth, cc);

  // PPP-adjusted values (USD purchasing power equivalent)
  const pppMeanUSD = pppFactor ? meanLocal / pppFactor : null;
  const pppMedianUSD = pppFactor ? medianLocal / pppFactor : null;

  // Find which region this country belongs to
  const countryRegion = REGIONS.find((r) => r.countries.includes(country.code)) ?? null;

  const top1Sublabel =
    showPPP && pppMeanUSD
      ? interpolate(t.stats.pppSublabelTemplate, {
          value: Math.round(pppMeanUSD / 1000),
        })
      : t.stats.meanWealthSublabel;
  const medianSublabel =
    showPPP && pppMedianUSD
      ? interpolate(t.stats.pppSublabelTemplate, {
          value: Math.round(pppMedianUSD / 1000),
        })
      : t.stats.medianWealthSublabel;

  return (
    <div className="space-y-16">
      <div>
        <div className="flex flex-col items-center gap-3 mb-10">
          <h3 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl text-center text-text-primary">
            {t.stats.title}
          </h3>
          {hasPPP && (
            <button
              type="button"
              onClick={() => setShowPPP((v) => !v)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                showPPP
                  ? "bg-accent-amber/20 text-accent-amber border border-accent-amber/30"
                  : "bg-bg-card text-text-secondary border border-border-subtle hover:text-text-primary"
              }`}
            >
              {showPPP ? t.stats.togglePppOn : t.stats.togglePppOff}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            label={interpolate(t.stats.top1OwnsTemplate, { country: country.name })}
            accent="rose"
            sublabel={t.stats.top1OwnsSublabel}
          >
            <AnimatedCounter end={country.wealthShares.top1} suffix="%" decimals={1} />
          </StatCard>
          <StatCard
            label={t.stats.bottom50Owns}
            accent="sage"
            sublabel={t.stats.bottom50OwnsSublabel}
          >
            <AnimatedCounter end={country.wealthShares.bottom50} suffix="%" decimals={1} />
          </StatCard>
          <StatCard
            label={t.stats.giniLabel}
            accent="lavender"
            sublabel={t.stats.giniSublabel}
          >
            <AnimatedCounter end={country.giniWealth} decimals={2} />
          </StatCard>
          <StatCard
            label={t.stats.meanWealthLabel}
            accent="amber"
            sublabel={top1Sublabel}
          >
            {formatCurrency(meanLocal, cc, true)}
          </StatCard>
          <StatCard
            label={t.stats.medianWealthLabel}
            accent="periwinkle"
            sublabel={medianSublabel}
          >
            {formatCurrency(medianLocal, cc, true)}
          </StatCard>
          <StatCard
            label={t.stats.meanMedianRatioLabel}
            accent="rose"
            sublabel={t.stats.meanMedianRatioSublabel}
          >
            <AnimatedCounter end={meanToMedianRatio} suffix="x" decimals={1} />
          </StatCard>
        </div>
      </div>

      {/* Entry thresholds */}
      <div>
        <h3 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl text-center mb-4 text-text-primary">
          {t.stats.thresholdsTitle}
        </h3>
        <p className="text-text-muted text-sm text-center mb-8 max-w-lg mx-auto">
          {interpolate(t.stats.thresholdsLeadTemplate, { country: country.name })}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <ThresholdCard label={t.stats.thresholdTop50} amount={fromUSD(thresholds.p50, cc)} currency={cc} />
          <ThresholdCard label={t.stats.thresholdTop10} amount={fromUSD(thresholds.p90, cc)} currency={cc} />
          <ThresholdCard label={t.stats.thresholdTop1} amount={fromUSD(thresholds.p99, cc)} currency={cc} />
          <ThresholdCard label={t.stats.thresholdTop01} amount={fromUSD(thresholds.p999, cc)} currency={cc} />
        </div>
        <p className="text-text-muted text-xs text-center mt-4">
          {t.stats.thresholdsNote}
        </p>
      </div>

      {/* Big impact statement */}
      <div className="bg-gradient-to-br from-accent-periwinkle/8 to-accent-lavender/8 border border-accent-periwinkle/15 rounded-3xl p-8 sm:p-12 text-center">
        <p className="text-text-secondary text-lg sm:text-xl mb-4">
          {interpolate(t.stats.impactLeadTemplate, { country: country.name })}
        </p>
        <p className="text-5xl sm:text-6xl lg:text-7xl font-bold text-accent-amber font-[family-name:var(--font-heading)]">
          <AnimatedCounter end={yearsToEarnTop1} duration={2.5} /> {t.stats.impactYears}
        </p>
        <p className="text-text-secondary text-lg sm:text-xl mt-4">
          {t.stats.impactTrailing}
        </p>
        <p className="text-text-muted text-sm mt-6">
          {interpolate(t.stats.impactNoteTemplate, {
            income: formatCurrency(medianIncomeLocal, cc),
            wealth: formatCurrency(avgTop1Local, cc, true),
          })}
        </p>
      </div>

      {/* Income vs Wealth comparison */}
      <div>
        <h3 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl text-center mb-10 text-text-primary">
          {t.stats.doubleGapTitle}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8">
            <h4 className="text-accent-periwinkle font-semibold text-lg mb-6">{t.stats.incomeDistributionTitle}</h4>
            <div className="space-y-4">
              <BarRow label={t.stats.barLabelTop1} value={country.incomeShares.top1} color="#CC6677" />
              <BarRow label={t.stats.barLabelTop10} value={country.incomeShares.top10} color="#DDCC77" />
              <BarRow label={t.stats.barLabelMiddle40} value={country.incomeShares.middle40} color="#88CCEE" />
              <BarRow label={t.stats.barLabelBottom50} value={country.incomeShares.bottom50} color="#44AA99" />
            </div>
            <p className="text-text-muted text-xs mt-4">
              {interpolate(t.stats.giniIncomeLineTemplate, {
                value: country.giniIncome.toFixed(2),
              })}
            </p>
          </div>

          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8">
            <h4 className="text-accent-amber font-semibold text-lg mb-6">{t.stats.wealthDistributionTitle}</h4>
            <div className="space-y-4">
              <BarRow label={t.stats.barLabelTop1} value={country.wealthShares.top1} color="#CC6677" />
              <BarRow label={t.stats.barLabelTop10} value={country.wealthShares.top10} color="#DDCC77" />
              <BarRow label={t.stats.barLabelMiddle40} value={country.wealthShares.middle40} color="#88CCEE" />
              <BarRow label={t.stats.barLabelBottom50} value={country.wealthShares.bottom50} color="#44AA99" />
            </div>
            <p className="text-text-muted text-xs mt-4">
              {interpolate(t.stats.giniWealthLineTemplate, {
                value: country.giniWealth.toFixed(2),
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Global context */}
      <div className="text-center">
        <h3 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl mb-8 text-text-primary">
          {t.stats.globalPictureTitle}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label={t.stats.globalTop1Owns} accent="rose" sublabel={t.stats.globalTop1OwnsSublabel}>
            <AnimatedCounter end={GLOBAL_STATS.globalTop1WealthShare} suffix="%" decimals={1} />
          </StatCard>
          <StatCard label={t.stats.globalBottom50Owns} accent="sage" sublabel={t.stats.globalBottom50OwnsSublabel}>
            <AnimatedCounter end={GLOBAL_STATS.globalBottom50WealthShare} suffix="%" decimals={1} />
          </StatCard>
          <StatCard label={t.stats.globalGiniLabel} accent="lavender" sublabel={t.stats.globalGiniSublabel}>
            <AnimatedCounter end={GLOBAL_STATS.globalGiniWealth} decimals={2} />
          </StatCard>
        </div>
        <p className="text-text-muted text-sm mt-6">
          {interpolate(t.stats.sourceTemplate, { source: GLOBAL_STATS.source })}
        </p>
      </div>

      {/* Regional context */}
      {countryRegion && (
        <div>
          <h3 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl text-center mb-8 text-text-primary">
            {interpolate(t.stats.regionalContextTitleTemplate, {
              country: country.name,
            })}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REGIONS.filter((r) => r.countries.length > 1).map((r) => {
              const isCurrent = r.code === countryRegion.code;
              return (
                <div
                  key={r.code}
                  className={`bg-bg-card border rounded-xl p-4 text-center ${
                    isCurrent
                      ? "border-accent-periwinkle/40 ring-1 ring-accent-periwinkle/20"
                      : "border-border-subtle"
                  }`}
                >
                  <p className="text-text-secondary text-xs mb-1">{r.name}</p>
                  <p className="text-text-primary font-bold text-lg tabular-nums">
                    {formatCurrency(r.weightedMedianWealth, "USD", true)}
                  </p>
                  <p className="text-text-muted text-[10px] mt-1">
                    {t.stats.medianWealthUsdLabel}
                  </p>
                  <div className="flex justify-center gap-3 mt-2 text-[10px]">
                    <span className="text-accent-rose">
                      {interpolate(t.stats.regionTop1Template, {
                        value: r.weightedTop1Share,
                      })}
                    </span>
                    <span className="text-accent-sage">
                      {interpolate(t.stats.regionBottom50Template, {
                        value: r.weightedBottom50Share,
                      })}
                    </span>
                  </div>
                  {isCurrent && (
                    <p className="text-accent-periwinkle text-[10px] font-medium mt-1">
                      {interpolate(t.stats.thisCountryRegion, {
                        country: country.name,
                      })}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-text-muted text-xs text-center mt-4">
            {t.stats.regionalAggregatesNote}
          </p>
        </div>
      )}
    </div>
  );
}

function ThresholdCard({ label, amount, currency }: { readonly label: string; readonly amount: number; readonly currency: string }) {
  return (
    <div className="bg-bg-card border border-border-subtle rounded-xl p-4 text-center">
      <p className="text-text-muted text-xs mb-1">{label}</p>
      <p className="text-text-primary font-bold text-lg sm:text-xl tabular-nums">
        {formatCurrency(amount, currency, true)}
      </p>
    </div>
  );
}

function BarRow({ label, value, color }: { readonly label: string; readonly value: number; readonly color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-primary font-medium tabular-nums">{value.toFixed(1)}%</span>
      </div>
      <div className="h-2.5 bg-bg-primary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ backgroundColor: color, width: `${Math.max(0, value)}%` }}
        />
      </div>
    </div>
  );
}
