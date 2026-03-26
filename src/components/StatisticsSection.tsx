"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import AnimatedCounter from "./AnimatedCounter";
import { type CountryData, GLOBAL_STATS } from "@/data/wealth-data";
import { formatCurrency } from "@/lib/format";

interface StatisticsSectionProps {
  readonly country: CountryData;
}

interface StatCardProps {
  readonly label: string;
  readonly children: React.ReactNode;
  readonly sublabel?: string;
  readonly delay?: number;
  readonly accent?: "rose" | "amber" | "sage" | "periwinkle" | "lavender";
}

function StatCard({ label, children, sublabel, delay = 0, accent = "periwinkle" }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  const accentColors = {
    rose: "text-accent-rose",
    amber: "text-accent-amber",
    sage: "text-accent-sage",
    periwinkle: "text-accent-periwinkle",
    lavender: "text-accent-lavender",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className="bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8 text-center"
    >
      <p className="text-text-secondary text-sm sm:text-base mb-3">{label}</p>
      <p className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${accentColors[accent]}`}>
        {children}
      </p>
      {sublabel && (
        <p className="text-text-muted text-xs sm:text-sm mt-3">{sublabel}</p>
      )}
    </motion.div>
  );
}

export default function StatisticsSection({ country }: StatisticsSectionProps) {
  const meanToMedianRatio = country.meanWealthPerAdult / country.medianWealthPerAdult;

  const medianDailyIncome = country.medianIncome / 365;
  const avgTop1Wealth =
    (country.wealthShares.top1 / 100) *
    country.meanWealthPerAdult *
    (country.population * 1_000_000 * 0.78) /
    (country.population * 1_000_000 * 0.78 * 0.01);
  const yearsToEarnTop1 = Math.round(avgTop1Wealth / medianDailyIncome / 365);

  return (
    <div className="space-y-16">
      <div>
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-[family-name:var(--font-bitter)] text-2xl sm:text-3xl text-center mb-10 text-text-primary"
        >
          The Numbers That Define Inequality
        </motion.h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatCard label={`The top 1% in ${country.name} owns`} accent="rose" delay={0} sublabel="of total national wealth">
            <AnimatedCounter end={country.wealthShares.top1} suffix="%" decimals={1} />
          </StatCard>
          <StatCard label="The bottom 50% shares just" accent="sage" delay={0.1} sublabel="of total national wealth">
            <AnimatedCounter end={country.wealthShares.bottom50} suffix="%" decimals={1} />
          </StatCard>
          <StatCard label="Wealth Gini coefficient" accent="lavender" delay={0.2} sublabel="0 = perfect equality, 1 = one person owns everything">
            <AnimatedCounter end={country.giniWealth} decimals={2} />
          </StatCard>
          <StatCard label="Mean wealth per adult" accent="amber" delay={0.3} sublabel="Skewed upward by the ultra-wealthy">
            {formatCurrency(country.meanWealthPerAdult, true)}
          </StatCard>
          <StatCard label="Median wealth per adult" accent="periwinkle" delay={0.4} sublabel="What the typical person actually has">
            {formatCurrency(country.medianWealthPerAdult, true)}
          </StatCard>
          <StatCard label="Mean / Median ratio" accent="rose" delay={0.5} sublabel="Higher = more skewed distribution">
            <AnimatedCounter end={meanToMedianRatio} suffix="x" decimals={1} />
          </StatCard>
        </div>
      </div>

      {/* Big impact statement */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-accent-periwinkle/8 to-accent-lavender/8 border border-accent-periwinkle/15 rounded-3xl p-8 sm:p-12 text-center"
      >
        <p className="text-text-secondary text-lg sm:text-xl mb-4">
          A median income earner in {country.name} would need to work for
        </p>
        <p className="text-5xl sm:text-6xl lg:text-7xl font-bold text-accent-amber font-[family-name:var(--font-bitter)]">
          <AnimatedCounter end={yearsToEarnTop1} duration={2.5} /> years
        </p>
        <p className="text-text-secondary text-lg sm:text-xl mt-4">
          to accumulate the average wealth of the top 1%
        </p>
        <p className="text-text-muted text-sm mt-6">
          Based on median income of {formatCurrency(country.medianIncome)}/year vs. average
          top 1% wealth of {formatCurrency(avgTop1Wealth, true)}
        </p>
      </motion.div>

      {/* Income vs Wealth comparison */}
      <div>
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-[family-name:var(--font-bitter)] text-2xl sm:text-3xl text-center mb-10 text-text-primary"
        >
          Income vs. Wealth: The Double Gap
        </motion.h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8"
          >
            <h4 className="text-accent-periwinkle font-semibold text-lg mb-6">Income Distribution</h4>
            <div className="space-y-4">
              <BarRow label="Top 1%" value={country.incomeShares.top1} color="#d4878f" />
              <BarRow label="Top 10%" value={country.incomeShares.top10} color="#c9a87c" />
              <BarRow label="Middle 40%" value={country.incomeShares.middle40} color="#929ee8" />
              <BarRow label="Bottom 50%" value={country.incomeShares.bottom50} color="#7eb8a8" />
            </div>
            <p className="text-text-muted text-xs mt-4">Gini (income): {country.giniIncome.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8"
          >
            <h4 className="text-accent-amber font-semibold text-lg mb-6">Wealth Distribution</h4>
            <div className="space-y-4">
              <BarRow label="Top 1%" value={country.wealthShares.top1} color="#d4878f" />
              <BarRow label="Top 10%" value={country.wealthShares.top10} color="#c9a87c" />
              <BarRow label="Middle 40%" value={country.wealthShares.middle40} color="#929ee8" />
              <BarRow label="Bottom 50%" value={country.wealthShares.bottom50} color="#7eb8a8" />
            </div>
            <p className="text-text-muted text-xs mt-4">Gini (wealth): {country.giniWealth.toFixed(2)}</p>
          </motion.div>
        </div>
      </div>

      {/* Global context */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h3 className="font-[family-name:var(--font-bitter)] text-2xl sm:text-3xl mb-8 text-text-primary">
          The Global Picture
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Global top 1% owns" accent="rose" sublabel="of all global wealth">
            <AnimatedCounter end={GLOBAL_STATS.globalTop1WealthShare} suffix="%" decimals={1} />
          </StatCard>
          <StatCard label="Global bottom 50% owns" accent="sage" sublabel="of all global wealth">
            <AnimatedCounter end={GLOBAL_STATS.globalBottom50WealthShare} suffix="%" decimals={1} />
          </StatCard>
          <StatCard label="Global wealth Gini" accent="lavender" sublabel="Among the highest of any metric measured">
            <AnimatedCounter end={GLOBAL_STATS.globalGiniWealth} decimals={2} />
          </StatCard>
        </div>
        <p className="text-text-muted text-sm mt-6">Source: {GLOBAL_STATS.source}</p>
      </motion.div>
    </div>
  );
}

function BarRow({ label, value, color }: { readonly label: string; readonly value: number; readonly color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref}>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-primary font-medium tabular-nums">{value.toFixed(1)}%</span>
      </div>
      <div className="h-2.5 bg-bg-primary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
