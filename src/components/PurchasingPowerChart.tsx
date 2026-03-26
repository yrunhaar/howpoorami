"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PURCHASING_POWER } from "@/data/purchasing-power";

interface PurchasingPowerChartProps {
  readonly countryCode: string;
}

const BUDGET_AMOUNT = 100;

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" as const },
  }),
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
};

function formatPrice(value: number, symbol: string): string {
  if (value >= 1_000_000) {
    return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${symbol}${value.toLocaleString("en", { maximumFractionDigits: 0 })}`;
  }
  return `${symbol}${value.toFixed(2)}`;
}

function formatMultiplier(earliest: number, latest: number): string {
  if (earliest <= 0) return "N/A";
  const ratio = latest / earliest;
  if (ratio >= 10) return `${Math.round(ratio)}x`;
  return `${ratio.toFixed(1)}x`;
}

export default function PurchasingPowerChart({
  countryCode,
}: PurchasingPowerChartProps) {
  const data = PURCHASING_POWER[countryCode];

  const years = useMemo(() => {
    if (!data) return [];
    return data.timeline.map((t) => t.year);
  }, [data]);

  const earliestYear = years[0] ?? 1970;
  const latestYear = years[years.length - 1] ?? 2023;

  const [selectedYear, setSelectedYear] = useState(earliestYear);

  const earliestSnapshot = data?.timeline[0];
  const latestSnapshot = data?.timeline[data.timeline.length - 1];

  const closestSnapshot = useMemo(() => {
    if (!data) return undefined;
    let closest = data.timeline[0];
    for (const t of data.timeline) {
      if (
        Math.abs(t.year - selectedYear) <
        Math.abs(closest.year - selectedYear)
      ) {
        closest = t;
      }
    }
    return closest;
  }, [data, selectedYear]);

  const buyableItems = useMemo(() => {
    if (!data || !closestSnapshot) return [];
    const results: Array<{
      readonly id: string;
      readonly emoji: string;
      readonly label: string;
      readonly unit: string;
      readonly quantity: number;
      readonly price: number;
    }> = [];

    for (const basket of data.baskets) {
      const price = closestSnapshot.items[basket.id];
      if (price === undefined || price <= 0) continue;
      const quantity = Math.floor(BUDGET_AMOUNT / price);
      if (quantity >= 1) {
        results.push({
          id: basket.id,
          emoji: basket.emoji,
          label: basket.label,
          unit: basket.unit,
          quantity,
          price,
        });
      }
    }

    return [...results].sort((a, b) => b.quantity - a.quantity);
  }, [data, closestSnapshot]);

  const maxQuantity = useMemo(() => {
    if (buyableItems.length === 0) return 1;
    return Math.max(...buyableItems.map((item) => item.quantity));
  }, [buyableItems]);

  if (!data) {
    return (
      <div className="rounded-xl border border-border-subtle bg-bg-card p-8 text-center">
        <p className="text-text-secondary text-lg">
          No purchasing power data available for this country.
        </p>
        <p className="text-text-muted mt-2 text-sm">
          Data is currently available for US, GB, FR, DE, and NL.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Part 1: Then vs Now */}
      <section>
        <h3 className="text-text-primary mb-1 text-xl font-semibold">
          Then vs Now
        </h3>
        <p className="text-text-muted mb-6 text-sm">
          How prices changed from {earliestSnapshot?.year} to{" "}
          {latestSnapshot?.year} ({data.currencySymbol})
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.baskets.map((basket, i) => {
            const earlyPrice = earliestSnapshot?.items[basket.id] ?? 0;
            const latePrice = latestSnapshot?.items[basket.id] ?? 0;
            const multiplier =
              earlyPrice > 0 ? latePrice / earlyPrice : 0;
            const barWidth =
              earlyPrice > 0
                ? Math.min((latePrice / earlyPrice / 20) * 100, 100)
                : 0;

            return (
              <motion.div
                key={basket.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="rounded-xl border border-border-subtle bg-bg-card p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl" role="img" aria-label={basket.label}>
                    {basket.emoji}
                  </span>
                  <span className="text-text-primary text-sm font-medium">
                    {basket.label}
                  </span>
                </div>

                <div className="text-text-muted mb-1 text-xs">
                  {earliestSnapshot?.year}:{" "}
                  <span className="text-text-secondary font-medium">
                    {formatPrice(earlyPrice, data.currencySymbol)}
                  </span>
                </div>

                <div className="text-text-muted mb-2 text-xs">
                  {latestSnapshot?.year}:{" "}
                  <span className="font-medium text-amber-400">
                    {formatPrice(latePrice, data.currencySymbol)}
                  </span>
                </div>

                {earlyPrice > 0 && (
                  <div className="mb-2 text-xs font-bold text-amber-400">
                    {formatMultiplier(earlyPrice, latePrice)} more expensive
                  </div>
                )}

                {earlyPrice <= 0 && (
                  <div className="text-text-muted mb-2 text-xs italic">
                    No earlier data
                  </div>
                )}

                <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full bg-amber-400/80"
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                  />
                </div>
                <div className="text-text-muted mt-1 text-[10px]">
                  {basket.unit}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Part 2: What $100 Bought */}
      <section>
        <h3 className="text-text-primary mb-1 text-xl font-semibold">
          What {data.currencySymbol}{BUDGET_AMOUNT} Bought
        </h3>
        <p className="text-text-muted mb-6 text-sm">
          Drag the slider to see how far {data.currencySymbol}{BUDGET_AMOUNT}{" "}
          stretched across different decades.
        </p>

        {/* Slider */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-text-muted text-sm">{earliestYear}</span>
            <motion.span
              key={closestSnapshot?.year}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-bold text-periwinkle-400"
            >
              {closestSnapshot?.year}
            </motion.span>
            <span className="text-text-muted text-sm">{latestYear}</span>
          </div>

          <input
            type="range"
            min={earliestYear}
            max={latestYear}
            step={1}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="slider-periwinkle h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-periwinkle-400 outline-none"
            aria-label="Select year"
          />

          {/* Year markers */}
          <div className="mt-1 flex justify-between">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={`text-[10px] transition-colors ${
                  closestSnapshot?.year === year
                    ? "font-bold text-periwinkle-400"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Buyable items grid */}
        <AnimatePresence mode="popLayout">
          {buyableItems.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-text-muted py-8 text-center text-sm"
            >
              No items could be purchased for {data.currencySymbol}
              {BUDGET_AMOUNT} at {closestSnapshot?.year} prices.
            </motion.p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {buyableItems.map((item, i) => {
                const barPct = Math.min(
                  (item.quantity / maxQuantity) * 100,
                  100,
                );

                return (
                  <motion.div
                    key={item.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="rounded-xl border border-border-subtle bg-bg-card p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-2xl" role="img" aria-label={item.label}>
                        {item.emoji}
                      </span>
                      <span className="text-text-primary text-sm font-medium">
                        {item.label}
                      </span>
                    </div>

                    <motion.div
                      key={`${item.id}-${closestSnapshot?.year}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mb-1 text-2xl font-bold text-periwinkle-400"
                    >
                      {item.quantity}
                    </motion.div>

                    <div className="text-text-muted mb-2 text-xs">
                      at {formatPrice(item.price, data.currencySymbol)} each
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full bg-periwinkle-400/80"
                        initial={{ width: 0 }}
                        animate={{ width: `${barPct}%` }}
                        transition={{
                          duration: 0.4,
                          delay: i * 0.03,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                    <div className="text-text-muted mt-1 text-[10px]">
                      {item.unit}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
