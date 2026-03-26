"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type CountryData } from "@/data/wealth-data";
import { DETAILED_SHARES, type DetailedWealthShares } from "@/data/billionaires";

interface WealthDistributionChartProps {
  readonly country: CountryData;
  readonly width: number;
  readonly height: number;
  readonly userPercentile: number | null;
}

type ZoomLevel = "overview" | "top10" | "top1";

interface BarSegment {
  readonly label: string;
  readonly populationPercent: number;
  readonly wealthShare: number;
  readonly color: string;
}

const COLORS = {
  bottom50: "#7eb8a8",
  middle40: "#929ee8",
  next9: "#b49ad4",
  next09: "#c9a87c",
  next009: "#d4878f",
  top001: "#e8636b",
};

function getSegments(shares: DetailedWealthShares, zoom: ZoomLevel): readonly BarSegment[] {
  if (zoom === "overview") {
    return [
      { label: "Bottom 50%", populationPercent: 50, wealthShare: shares.bottom50, color: COLORS.bottom50 },
      { label: "Middle 40%", populationPercent: 40, wealthShare: shares.middle40, color: COLORS.middle40 },
      { label: "Top 10–1%", populationPercent: 9, wealthShare: shares.next9, color: COLORS.next9 },
      { label: "Top 1–0.1%", populationPercent: 0.9, wealthShare: shares.next09, color: COLORS.next09 },
      { label: "Top 0.1–0.01%", populationPercent: 0.09, wealthShare: shares.next009, color: COLORS.next009 },
      { label: "Top 0.01%", populationPercent: 0.01, wealthShare: shares.top001, color: COLORS.top001 },
    ];
  }
  if (zoom === "top10") {
    return [
      { label: "Top 10–1%", populationPercent: 9, wealthShare: shares.next9, color: COLORS.next9 },
      { label: "Top 1–0.1%", populationPercent: 0.9, wealthShare: shares.next09, color: COLORS.next09 },
      { label: "Top 0.1–0.01%", populationPercent: 0.09, wealthShare: shares.next009, color: COLORS.next009 },
      { label: "Top 0.01%", populationPercent: 0.01, wealthShare: shares.top001, color: COLORS.top001 },
    ];
  }
  return [
    { label: "Top 1–0.1%", populationPercent: 0.9, wealthShare: shares.next09, color: COLORS.next09 },
    { label: "Top 0.1–0.01%", populationPercent: 0.09, wealthShare: shares.next009, color: COLORS.next009 },
    { label: "Top 0.01%", populationPercent: 0.01, wealthShare: shares.top001, color: COLORS.top001 },
  ];
}

function formatPeopleCount(count: number): string {
  if (count >= 1_000_000) {
    return `~${(count / 1_000_000).toFixed(1)}M people`;
  }
  if (count >= 1_000) {
    return `~${Math.round(count / 1_000).toLocaleString("en")}K people`;
  }
  return `~${Math.round(count).toLocaleString("en")} people`;
}

function formatPerPerson(wealthShare: number, populationPercent: number): string {
  const ratio = wealthShare / populationPercent;
  if (ratio >= 100) return `${Math.round(ratio)}x`;
  if (ratio >= 10) return `${ratio.toFixed(0)}x`;
  if (ratio >= 1) return `${ratio.toFixed(1)}x`;
  return `${ratio.toFixed(2)}x`;
}

export default function WealthDistributionChart({
  country,
}: WealthDistributionChartProps) {
  const [zoom, setZoom] = useState<ZoomLevel>("overview");
  const [expandedLabels, setExpandedLabels] = useState<ReadonlySet<string>>(new Set());

  const shares = DETAILED_SHARES[country.code] ?? {
    bottom50: country.wealthShares.bottom50,
    middle40: country.wealthShares.middle40,
    next9: country.wealthShares.top10 - country.wealthShares.top1,
    next09: country.wealthShares.top1 * 0.55,
    next009: country.wealthShares.top1 * 0.28,
    top001: country.wealthShares.top1 * 0.17,
  };
  const segments = useMemo(() => getSegments(shares, zoom), [shares, zoom]);

  const populationAdults = country.population * 0.78;

  const maxWealth = useMemo(
    () => Math.max(...segments.map((s) => s.wealthShare)),
    [segments]
  );

  const maxPop = useMemo(
    () => Math.max(...segments.map((s) => s.populationPercent)),
    [segments]
  );

  const zoomOptions: { value: ZoomLevel; label: string }[] = [
    { value: "overview", label: "All groups" },
    { value: "top10", label: "Top 10%" },
    { value: "top1", label: "Top 1%" },
  ];

  function toggleExpand(label: string) {
    setExpandedLabels((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  return (
    <div className="relative">
      {/* Zoom controls */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-text-muted text-xs mr-2">Zoom:</span>
        {zoomOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { setZoom(opt.value); setExpandedLabels(new Set()); }}
            className={`
              px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer
              ${
                zoom === opt.value
                  ? "bg-accent-periwinkle/20 text-accent-periwinkle border border-accent-periwinkle/30"
                  : "bg-bg-card text-text-secondary border border-border-subtle hover:text-text-primary"
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Chart rows */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {segments.map((seg, i) => {
            const wealthBarPct = (seg.wealthShare / maxWealth) * 100;
            const popBarPct = (seg.populationPercent / maxPop) * 100;
            const peopleCount = Math.round(populationAdults * 1_000_000 * (seg.populationPercent / 100));
            const perPersonMultiple = formatPerPerson(seg.wealthShare, seg.populationPercent);
            const isExpanded = expandedLabels.has(seg.label);

            return (
              <motion.div
                key={seg.label}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={`
                  rounded-xl border transition-all duration-200
                  ${isExpanded
                    ? "border-border-subtle bg-bg-card/80 shadow-lg"
                    : "border-border-subtle/50 bg-bg-card/40 hover:bg-bg-card/60"
                  }
                `}
              >
                {/* Clickable row */}
                <button
                  type="button"
                  onClick={() => toggleExpand(seg.label)}
                  className="w-full text-left p-4 cursor-pointer"
                >
                  {/* Row header */}
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="flex items-baseline gap-3">
                      <span className="text-text-primary text-sm font-semibold">
                        {seg.label}
                      </span>
                      <span className="text-text-muted text-xs hidden sm:inline">
                        {formatPeopleCount(peopleCount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-sm font-bold tabular-nums"
                        style={{ color: seg.color }}
                      >
                        {seg.wealthShare.toFixed(1)}% of wealth
                      </span>
                      <span className="text-text-muted text-xs tabular-nums hidden sm:inline">
                        {perPersonMultiple} per person
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`text-text-muted transition-transform duration-200 flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>

                  {/* Dual bars */}
                  <div className="space-y-1.5">
                    {/* Wealth bar */}
                    <div className="flex items-center gap-3">
                      <span className="text-text-muted text-[10px] w-12 text-right flex-shrink-0">
                        Wealth
                      </span>
                      <div className="flex-1 h-5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: seg.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(wealthBarPct, 1)}%` }}
                          transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" as const }}
                        />
                      </div>
                      <span
                        className="text-xs font-semibold tabular-nums w-12 text-right flex-shrink-0"
                        style={{ color: seg.color }}
                      >
                        {seg.wealthShare.toFixed(1)}%
                      </span>
                    </div>

                    {/* Population bar */}
                    <div className="flex items-center gap-3">
                      <span className="text-text-muted text-[10px] w-12 text-right flex-shrink-0">
                        People
                      </span>
                      <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full opacity-40"
                          style={{ backgroundColor: seg.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(popBarPct, 0.5)}%` }}
                          transition={{ duration: 0.6, delay: i * 0.05 + 0.1, ease: "easeOut" as const }}
                        />
                      </div>
                      <span className="text-text-muted text-[10px] tabular-nums w-12 text-right flex-shrink-0">
                        {seg.populationPercent}%
                      </span>
                    </div>
                  </div>
                </button>

                {/* Expandable detail panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" as const }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-border-subtle/30">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <p className="text-text-muted mb-0.5">People</p>
                            <p className="text-text-primary font-semibold tabular-nums">
                              {formatPeopleCount(peopleCount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-text-muted mb-0.5">Population share</p>
                            <p className="text-text-primary font-semibold tabular-nums">
                              {seg.populationPercent}%
                            </p>
                          </div>
                          <div>
                            <p className="text-text-muted mb-0.5">Per-person share</p>
                            <p className="text-text-primary font-semibold tabular-nums">
                              {perPersonMultiple} average
                            </p>
                          </div>
                          <div>
                            <p className="text-text-muted mb-0.5">Concentration</p>
                            <p className="text-text-primary font-semibold tabular-nums">
                              {seg.populationPercent}% of people hold {seg.wealthShare.toFixed(1)}% of wealth
                            </p>
                          </div>
                        </div>
                        {seg.populationPercent <= 0.01 && (
                          <p className="text-accent-rose/80 text-xs mt-3 italic">
                            That&apos;s just {formatPeopleCount(peopleCount).replace("~", "")} controlling more wealth than the bottom half of the entire country.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-5 text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded-sm bg-white/5 overflow-hidden">
            <div className="w-full h-full rounded-sm" style={{ backgroundColor: COLORS.bottom50 }} />
          </div>
          <span>Wealth share</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-2 rounded-sm bg-white/5 overflow-hidden">
            <div className="w-full h-full rounded-sm opacity-40" style={{ backgroundColor: COLORS.bottom50 }} />
          </div>
          <span>Population share</span>
        </div>
        <span className="text-text-muted">Click any group for details</span>
      </div>
    </div>
  );
}
