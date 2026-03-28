"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { type CountryData, findPercentile } from "@/data/wealth-data";
import { formatCurrency, getCurrencySymbol } from "@/lib/format";
import { getPercentileLine } from "@/data/comedic-lines";
import {
  type IncomeFactors,
  type PercentileRange,
  DEFAULT_INCOME_FACTORS,
  estimateWealthRange,
  computePercentileRange,
} from "@/lib/wealth-estimate";
import IncomeRefinementPanel from "./IncomeRefinementPanel";

interface WealthInputProps {
  readonly country: CountryData;
  readonly onPercentileChange: (percentile: number | null) => void;
}

type InputMode = "wealth" | "income";

export default function WealthInput({
  country,
  onPercentileChange,
}: WealthInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [percentile, setPercentile] = useState<number | null>(null);
  const [percentileRange, setPercentileRange] =
    useState<PercentileRange | null>(null);
  const [mode, setMode] = useState<InputMode>("wealth");
  const [incomeFactors, setIncomeFactors] = useState<IncomeFactors>(
    DEFAULT_INCOME_FACTORS,
  );
  const [refinePanelOpen, setRefinePanelOpen] = useState(false);

  // Reset state when country changes
  useEffect(() => {
    setInputValue("");
    setPercentile(null);
    setPercentileRange(null);
    onPercentileChange(null);
  }, [country.code, onPercentileChange]);

  const computeFromIncome = useCallback(
    (raw: string, factors: IncomeFactors) => {
      if (raw.length === 0) {
        setPercentile(null);
        setPercentileRange(null);
        onPercentileChange(null);
        return;
      }
      const value = parseInt(raw, 10);
      if (!Number.isFinite(value)) return;

      const wRange = estimateWealthRange(value, country, factors);
      const pRange = computePercentileRange(wRange, country);

      setPercentile(pRange.mid);
      setPercentileRange(pRange);
      onPercentileChange(pRange.mid);
    },
    [country, onPercentileChange],
  );

  // Recompute when income factors change
  useEffect(() => {
    if (mode !== "income") return;
    computeFromIncome(inputValue, incomeFactors);
  }, [incomeFactors, mode, inputValue, computeFromIncome]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      setInputValue(raw);

      if (mode === "income") {
        computeFromIncome(raw, incomeFactors);
      } else if (raw.length > 0) {
        const p = findPercentile(parseInt(raw, 10), country);
        setPercentile(p);
        setPercentileRange(null);
        onPercentileChange(p);
      } else {
        setPercentile(null);
        setPercentileRange(null);
        onPercentileChange(null);
      }
    },
    [country, onPercentileChange, mode, incomeFactors, computeFromIncome],
  );

  const handleModeSwitch = useCallback(
    (newMode: InputMode) => {
      setMode(newMode);
      setInputValue("");
      setPercentile(null);
      setPercentileRange(null);
      setIncomeFactors(DEFAULT_INCOME_FACTORS);
      setRefinePanelOpen(false);
      onPercentileChange(null);
    },
    [onPercentileChange],
  );

  const updateFactor = useCallback(
    <K extends keyof IncomeFactors>(key: K, value: IncomeFactors[K]) => {
      setIncomeFactors((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const displayValue = useMemo(() => {
    if (inputValue.length === 0) return "";
    return formatCurrency(parseInt(inputValue, 10), country.currency);
  }, [inputValue, country.currency]);

  const comedic = useMemo(() => {
    if (percentile === null) return null;
    return getPercentileLine(percentile, country.name);
  }, [percentile, country.name]);

  const wealthRange = useMemo(() => {
    if (mode !== "income" || inputValue.length === 0) return null;
    const value = parseInt(inputValue, 10);
    if (!Number.isFinite(value)) return null;
    return estimateWealthRange(value, country, incomeFactors);
  }, [mode, inputValue, country, incomeFactors]);

  const isRange = mode === "income" && percentileRange !== null;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mode toggle — Net Wealth first */}
      <div className="flex justify-center gap-1 mb-4">
        <ModeButton
          label="Net Wealth"
          active={mode === "wealth"}
          onClick={() => handleModeSwitch("wealth")}
        />
        <ModeButton
          label="Annual Income"
          active={mode === "income"}
          onClick={() => handleModeSwitch("income")}
        />
      </div>

      <label
        htmlFor="wealth-input"
        className="block text-sm text-text-secondary mb-2 text-center"
      >
        {mode === "income"
          ? `Enter your annual income (${country.currency}) to see where you stand`
          : `Enter your net wealth (${country.currency}) to see where you stand`}
      </label>

      <div className="relative">
        <input
          id="wealth-input"
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={`${getCurrencySymbol(country.currency)}0`}
          className="
            w-full px-6 py-4 rounded-2xl text-center text-2xl font-medium tabular-nums
            bg-bg-card border border-border-subtle
            text-text-primary placeholder:text-text-muted
            focus:outline-none focus:border-accent-periwinkle/50 focus:ring-2 focus:ring-accent-periwinkle/20
            transition-all duration-300
          "
        />
      </div>

      {/* Income refinement panel */}
      {mode === "income" && (
        <IncomeRefinementPanel
          factors={incomeFactors}
          isOpen={refinePanelOpen}
          onToggle={() => setRefinePanelOpen((o) => !o)}
          onChange={updateFactor}
        />
      )}

      {/* Estimated wealth range */}
      {wealthRange !== null && (
        <p className="text-text-muted text-[11px] text-center mt-2 tabular-nums">
          Est. net wealth:{" "}
          <span className="text-text-secondary font-medium">
            {formatCurrency(wealthRange.low, country.currency)}
          </span>
          <span className="mx-1">–</span>
          <span className="text-text-secondary font-medium">
            {formatCurrency(wealthRange.high, country.currency)}
          </span>
        </p>
      )}

      {/* Result */}
      {percentile !== null && (
        <div className="mt-4 text-center animate-fade-in">
          <p className="text-text-secondary text-sm">
            In {country.name}, you are wealthier than
          </p>

          {isRange && percentileRange ? (
            <PercentileRangeDisplay
              range={percentileRange}
              refinePanelOpen={refinePanelOpen}
            />
          ) : (
            <PercentilePreciseDisplay percentile={percentile} />
          )}

          {comedic && (
            <p className="text-text-muted text-sm mt-3 italic max-w-sm mx-auto">
              {comedic}
            </p>
          )}

          {percentile < 50 && (
            <p className="text-text-muted text-xs mt-2">
              Below the median wealth of{" "}
              {formatCurrency(
                country.medianWealthPerAdult,
                country.currency,
              )}
            </p>
          )}
          {percentile >= 99 && (
            <p className="text-accent-amber/80 text-xs mt-2">
              You are in the top 1%
            </p>
          )}

          <ShareButtons
            percentile={percentile}
            percentileRange={isRange ? percentileRange : null}
            countryName={country.name}
            countryCode={country.code}
          />
        </div>
      )}

      <p className="text-text-muted text-xs text-center mt-3">
        Your data stays in your browser. Nothing is stored or sent anywhere.
        {mode === "income" && (
          <span className="block mt-1">
            Income is converted to an estimated wealth range. For exact
            results, use &quot;Net Wealth&quot; mode.
          </span>
        )}
      </p>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────

function ModeButton({
  label,
  active,
  onClick,
}: {
  readonly label: string;
  readonly active: boolean;
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
        active
          ? "bg-accent-periwinkle/20 text-accent-periwinkle border border-accent-periwinkle/30"
          : "bg-bg-card text-text-secondary border border-border-subtle hover:text-text-primary"
      }`}
    >
      {label}
    </button>
  );
}

function percentileColor(p: number): string {
  if (p >= 90) return "text-accent-amber";
  if (p >= 50) return "text-accent-sage";
  return "text-accent-rose";
}

function PercentileRangeDisplay({
  range,
  refinePanelOpen,
}: {
  readonly range: PercentileRange;
  readonly refinePanelOpen: boolean;
}) {
  return (
    <>
      <p className="text-text-secondary text-sm mt-1">approximately</p>
      <p className="text-4xl sm:text-5xl font-bold mt-1 tabular-nums">
        <span className={percentileColor(range.low)}>
          {range.low.toFixed(1)}%
        </span>
        <span className="text-text-muted text-lg sm:text-xl mx-1 font-normal">
          –
        </span>
        <span className={percentileColor(range.high)}>
          {range.high.toFixed(1)}%
        </span>
      </p>
      <p className="text-text-secondary text-sm mt-1">of the population</p>
      {!refinePanelOpen && (
        <p className="text-text-muted text-[11px] mt-1">
          Open &quot;Refine estimate&quot; above to narrow this range
        </p>
      )}
    </>
  );
}

function PercentilePreciseDisplay({
  percentile,
}: {
  readonly percentile: number;
}) {
  return (
    <>
      <p className="text-5xl font-bold mt-1 tabular-nums">
        <span className={percentileColor(percentile)}>
          {percentile.toFixed(1)}%
        </span>
      </p>
      <p className="text-text-secondary text-sm mt-1">of the population</p>
    </>
  );
}

function ShareButtons({
  percentile,
  percentileRange,
  countryName,
  countryCode,
}: {
  readonly percentile: number;
  readonly percentileRange: PercentileRange | null;
  readonly countryName: string;
  readonly countryCode: string;
}) {
  const pText = percentileRange
    ? `${percentileRange.low.toFixed(1)}–${percentileRange.high.toFixed(1)}%`
    : `${percentile.toFixed(1)}%`;
  const shareText = `I'm wealthier than ${pText} of the population in ${countryName}. Where do you stand?`;
  const url = `https://howpoorami.org/${countryCode.toLowerCase()}`;

  const btnClass =
    "px-2.5 py-1 rounded-lg text-[11px] font-medium min-h-[44px] min-w-[44px] bg-bg-card border border-border-subtle text-text-secondary hover:text-text-primary hover:border-accent-periwinkle/30 transition-all cursor-pointer";

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <span className="text-text-muted text-xs">Share:</span>
      <button
        type="button"
        onClick={() =>
          window.open(
            `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
            "_blank",
            "noopener,noreferrer",
          )
        }
        className={btnClass}
        aria-label="Share on X"
      >
        X / Twitter
      </button>
      <button
        type="button"
        onClick={() =>
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
            "_blank",
            "noopener,noreferrer",
          )
        }
        className={btnClass}
        aria-label="Share on WhatsApp"
      >
        WhatsApp
      </button>
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(url).catch(() => { /* silent fallback */ })}
        className={btnClass}
        aria-label="Copy link"
      >
        Copy link
      </button>
    </div>
  );
}
