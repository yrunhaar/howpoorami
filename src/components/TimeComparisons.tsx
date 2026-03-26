"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  getRelevantComparisons,
  type ComparisonResult,
} from "@/data/time-comparisons";

interface TimeComparisonsProps {
  readonly yearsToMatch: number;
  readonly billionaireName: string;
}

const CATEGORY_ACCENT: Record<string, string> = {
  historical: "text-accent-amber",
  scientific: "text-accent-periwinkle",
  religious: "text-accent-lavender",
  human: "text-accent-sage",
  comedic: "text-accent-rose",
  pop_culture: "text-accent-rose",
};

const CATEGORY_BORDER: Record<string, string> = {
  historical: "border-accent-amber/20",
  scientific: "border-accent-periwinkle/20",
  religious: "border-accent-lavender/20",
  human: "border-accent-sage/20",
  comedic: "border-accent-rose/20",
  pop_culture: "border-accent-rose/20",
};

function LifetimeHighlight({
  comparison,
}: {
  readonly comparison: ComparisonResult;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-bg-card border border-border-subtle rounded-2xl p-8 sm:p-10 text-center"
    >
      <span className="text-4xl sm:text-5xl mb-4 block">
        {comparison.ref.emoji}
      </span>
      <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-accent-sage mb-3">
        {comparison.formatted.includes("lifetime")
          ? comparison.formatted
          : comparison.formatted}
      </p>
      <p className="text-text-muted text-sm sm:text-base">
        {comparison.ref.label}
      </p>
    </motion.div>
  );
}

function ComparisonCard({
  comparison,
  delay,
}: {
  readonly comparison: ComparisonResult;
  readonly delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  const accentClass =
    CATEGORY_ACCENT[comparison.ref.category] ?? "text-accent-periwinkle";
  const borderClass =
    CATEGORY_BORDER[comparison.ref.category] ?? "border-border-subtle";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`bg-bg-card border ${borderClass} rounded-2xl p-5 sm:p-6 flex items-start gap-4`}
    >
      <span className="text-2xl sm:text-3xl shrink-0 mt-0.5">
        {comparison.ref.emoji}
      </span>
      <div className="min-w-0">
        <p className={`text-sm sm:text-base font-medium ${accentClass} mb-1`}>
          {comparison.ref.label}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {comparison.formatted}
        </p>
      </div>
    </motion.div>
  );
}

export default function TimeComparisons({
  yearsToMatch,
  billionaireName,
}: TimeComparisonsProps) {
  const comparisons = getRelevantComparisons(yearsToMatch, billionaireName);

  if (comparisons.length === 0) {
    return null;
  }

  // Find the "human-lifetime" comparison for the prominent top display
  const lifetimeComparison = comparisons.find(
    (c) => c.ref.id === "human-lifetime",
  );

  // Remaining comparisons go into the grid
  const gridComparisons = comparisons.filter(
    (c) => c.ref.id !== "human-lifetime",
  );

  return (
    <div className="space-y-8">
      {lifetimeComparison && (
        <LifetimeHighlight comparison={lifetimeComparison} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {gridComparisons.map((comparison, index) => (
          <ComparisonCard
            key={comparison.ref.id}
            comparison={comparison}
            delay={index * 0.08}
          />
        ))}
      </div>
    </div>
  );
}
