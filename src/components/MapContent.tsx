"use client";

import { useState, useMemo } from "react";
import { useDictionary, useLanguage } from "@/components/LanguageProvider";
import {
  ALL_COUNTRY_MAP,
  type AllCountryCode,
} from "@/data/countries-extended";
import { localePath } from "@/lib/i18n/urls";
import WorldMap from "./WorldMap";

type Metric = "top1" | "medianWealth" | "meanWealth";

const METRIC_CONFIG: Record<
  Metric,
  {
    readonly accessor: (c: (typeof ALL_COUNTRY_MAP)[AllCountryCode]) => number;
    readonly unit: string;
    readonly format: (v: number) => string;
    readonly scaleMin: number;
    readonly scaleMax: number;
    readonly stops: readonly string[];
  }
> = {
  top1: {
    accessor: (c) => c.wealthShares.top1,
    unit: "%",
    format: (v) => `${v.toFixed(1)}%`,
    scaleMin: 15,
    scaleMax: 50,
    stops: ["#deebf7", "#88a4d4", "#d4a64a", "#A5404E"],
  },
  medianWealth: {
    accessor: (c) => c.medianWealthPerAdult,
    unit: "USD",
    format: (v) =>
      v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M`
      : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}k`
      : `$${v.toFixed(0)}`,
    scaleMin: 1_000,
    scaleMax: 200_000,
    stops: ["#deefe5", "#7fb89c", "#88a4d4", "#3170A0"],
  },
  meanWealth: {
    accessor: (c) => c.meanWealthPerAdult,
    unit: "USD",
    format: (v) =>
      v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M`
      : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}k`
      : `$${v.toFixed(0)}`,
    scaleMin: 5_000,
    scaleMax: 600_000,
    stops: ["#deefe5", "#7fb89c", "#88a4d4", "#3170A0"],
  },
};

export default function MapContent() {
  const { t, locale } = useLanguage();
  void useDictionary;
  const [metric, setMetric] = useState<Metric>("top1");

  const cfg = METRIC_CONFIG[metric];

  const dataByCountry = useMemo(() => {
    const out: Record<string, number> = {};
    for (const code of Object.keys(ALL_COUNTRY_MAP) as AllCountryCode[]) {
      if (code === "GLOBAL") continue;
      out[code] = cfg.accessor(ALL_COUNTRY_MAP[code]);
    }
    return out;
  }, [cfg]);

  const metricLabels: Record<Metric, string> = {
    top1: t.map.metricTop1,
    medianWealth: t.map.metricMedianWealth,
    meanWealth: t.map.metricMeanWealth,
  };

  return (
    <main className="bg-bg-primary text-text-primary min-h-screen pt-20 pb-16 px-4">
      <article className="max-w-5xl mx-auto">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold mb-3 text-center">
          {t.map.title}
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed text-center mb-8 max-w-2xl mx-auto">
          {t.map.subtitle}
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {(Object.keys(metricLabels) as Metric[]).map((m) => {
            const active = metric === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMetric(m)}
                aria-pressed={active}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  active
                    ? "bg-accent-periwinkle text-white"
                    : "border border-border-subtle text-text-secondary hover:text-text-primary"
                }`}
              >
                {metricLabels[m]}
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-border-subtle bg-bg-card shadow-card p-4 sm:p-6">
          <WorldMap
            dataByCountry={dataByCountry}
            scale={{
              min: cfg.scaleMin,
              max: cfg.scaleMax,
              stops: cfg.stops,
              noData: "var(--bg-secondary)",
            }}
            unit={cfg.unit}
            formatValue={cfg.format}
            hrefForCountry={(code) => localePath(locale, `/${code.toLowerCase()}`)}
            noDataLabel={t.map.noDataLabel}
            belowLabel={t.map.legendLow}
            aboveLabel={t.map.legendHigh}
          />
        </div>

        <p className="text-xs text-text-muted mt-4 text-center">{t.map.source}</p>
      </article>
    </main>
  );
}
