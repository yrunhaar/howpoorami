"use client";

import {
  getRelevantComparisons,
  type ComparisonResult,
} from "@/data/time-comparisons";
import { getYearsToMatchLineFor } from "@/lib/i18n/content/comedic";
import { useLanguage } from "@/components/LanguageProvider";
import { formatNumber } from "@/lib/format";

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
  comedicQuote,
}: {
  readonly comparison: ComparisonResult;
  readonly comedicQuote: string;
}) {
  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-8 sm:p-10 text-center">
      <span className="text-4xl sm:text-5xl mb-4 block" aria-hidden="true">
        {comparison.ref.emoji}
      </span>
      <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-accent-sage mb-3">
        {comparison.formatted}
      </p>
      <p className="text-text-muted text-sm sm:text-base">
        {comparison.ref.label} ({comparison.ref.years} years)
      </p>
      {comedicQuote && (
        <p className="text-text-muted text-sm italic mt-5 pt-5 border-t border-border-subtle/50 max-w-lg mx-auto">
          {comedicQuote}
        </p>
      )}
    </div>
  );
}

function ComparisonCard({
  comparison,
}: {
  readonly comparison: ComparisonResult;
}) {
  const accent = CATEGORY_ACCENT[comparison.ref.category] ?? "text-text-primary";
  const border = CATEGORY_BORDER[comparison.ref.category] ?? "border-border-subtle";

  return (
    <div className={`bg-bg-card border ${border} rounded-2xl p-5 sm:p-6 text-center`}>
      <span className="text-3xl sm:text-4xl mb-3 block" aria-hidden="true">
        {comparison.ref.emoji}
      </span>
      <p className={`text-lg sm:text-xl font-bold ${accent} mb-2`}>
        {comparison.formatted}
      </p>
      <p className="text-text-muted text-xs sm:text-sm">
        {comparison.ref.label}
      </p>
    </div>
  );
}

export default function TimeComparisons({
  yearsToMatch,
  billionaireName,
}: TimeComparisonsProps) {
  const { locale } = useLanguage();
  const comparisons = getRelevantComparisons(yearsToMatch, billionaireName);

  const lifetimeComparison = comparisons.find(
    (c) => c.ref.id === "human-lifetime",
  );

  const gridCards = comparisons
    .filter((c) => c.ref.id !== "human-lifetime")
    .slice(0, 6);

  const comedicQuote = getYearsToMatchLineFor(
    locale,
    yearsToMatch,
    billionaireName,
    formatNumber(yearsToMatch),
  );

  if (comparisons.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {lifetimeComparison && (
        <LifetimeHighlight
          comparison={lifetimeComparison}
          comedicQuote={comedicQuote}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {gridCards.map((comparison) => (
          <ComparisonCard
            key={comparison.ref.id}
            comparison={comparison}
          />
        ))}
      </div>
    </div>
  );
}
