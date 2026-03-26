"use client";

import { useState, useCallback, useMemo } from "react";
import { type CountryData, findPercentile } from "@/data/wealth-data";
import { formatCurrency } from "@/lib/format";

interface WealthInputProps {
  readonly country: CountryData;
  readonly onPercentileChange: (percentile: number | null) => void;
}

type InputMode = "wealth" | "income";

function getComedicResponse(percentile: number, countryName: string): string {
  if (percentile >= 99.9) return "Congrats, you're basically a rounding error away from ruling the world.";
  if (percentile >= 99) return "Top 1%. You probably have a financial advisor who has a financial advisor.";
  if (percentile >= 95) return "Doing very well. Your problems are mostly about which problems to solve first.";
  if (percentile >= 90) return "Top 10%. The system is working... for you at least.";
  if (percentile >= 75) return "Above average. You can afford to worry about retirement, which is a luxury in itself.";
  if (percentile >= 50) return "Welcome to the middle. The American Dream brochure was... optimistic.";
  if (percentile >= 25) return `Most people in ${countryName} have more than you. Let that sink in.`;
  if (percentile >= 10) return "You're poorer than 3 out of 4 people around you. It's not your imagination — things are tough.";
  return "You are in the bottom 10%. The system wasn't built for you — and the data proves it.";
}

function estimateWealthFromIncome(annualIncome: number, country: CountryData): number {
  // Rough wealth-to-income ratio based on typical savings and assets
  // Lower incomes save less, higher incomes accumulate more
  const medianIncome = country.medianIncome;
  const incomeRatio = annualIncome / medianIncome;

  if (incomeRatio <= 0.5) return annualIncome * 0.5;
  if (incomeRatio <= 1) return annualIncome * 2;
  if (incomeRatio <= 2) return annualIncome * 4;
  if (incomeRatio <= 5) return annualIncome * 8;
  return annualIncome * 15;
}

export default function WealthInput({ country, onPercentileChange }: WealthInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [percentile, setPercentile] = useState<number | null>(null);
  const [mode, setMode] = useState<InputMode>("income");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      setInputValue(raw);

      if (raw.length > 0) {
        const value = parseInt(raw, 10);
        const wealthValue = mode === "income"
          ? estimateWealthFromIncome(value, country)
          : value;
        const p = findPercentile(wealthValue, country);
        setPercentile(p);
        onPercentileChange(p);
      } else {
        setPercentile(null);
        onPercentileChange(null);
      }
    },
    [country, onPercentileChange, mode]
  );

  const handleModeSwitch = useCallback((newMode: InputMode) => {
    setMode(newMode);
    setInputValue("");
    setPercentile(null);
    onPercentileChange(null);
  }, [onPercentileChange]);

  const displayValue = useMemo(() => {
    if (inputValue.length === 0) return "";
    return formatCurrency(parseInt(inputValue, 10));
  }, [inputValue]);

  const comedic = useMemo(() => {
    if (percentile === null) return null;
    return getComedicResponse(percentile, country.name);
  }, [percentile, country.name]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mode toggle */}
      <div className="flex justify-center gap-1 mb-4">
        <button
          type="button"
          onClick={() => handleModeSwitch("income")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
            mode === "income"
              ? "bg-accent-periwinkle/20 text-accent-periwinkle border border-accent-periwinkle/30"
              : "bg-bg-card text-text-secondary border border-border-subtle hover:text-text-primary"
          }`}
        >
          Annual Income
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch("wealth")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
            mode === "wealth"
              ? "bg-accent-periwinkle/20 text-accent-periwinkle border border-accent-periwinkle/30"
              : "bg-bg-card text-text-secondary border border-border-subtle hover:text-text-primary"
          }`}
        >
          Net Wealth
        </button>
      </div>

      <label
        htmlFor="wealth-input"
        className="block text-sm text-text-secondary mb-2 text-center"
      >
        {mode === "income"
          ? "Enter your annual income (USD) to see where you stand"
          : "Enter your net wealth (USD) to see where you stand"}
      </label>
      <div className="relative">
        <input
          id="wealth-input"
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder="$0"
          className="
            w-full px-6 py-4 rounded-2xl text-center text-2xl font-medium tabular-nums
            bg-bg-card border border-border-subtle
            text-text-primary placeholder:text-text-muted
            focus:outline-none focus:border-accent-periwinkle/50 focus:ring-2 focus:ring-accent-periwinkle/20
            transition-all duration-300
          "
        />
      </div>

      {percentile !== null && (
        <div className="mt-4 text-center animate-fade-in">
          <p className="text-text-secondary text-sm">
            In {country.name}, you are wealthier than
          </p>
          <p className="text-5xl font-bold mt-1 tabular-nums">
            <span
              className={
                percentile >= 90
                  ? "text-accent-amber"
                  : percentile >= 50
                  ? "text-accent-sage"
                  : "text-accent-rose"
              }
            >
              {percentile.toFixed(1)}%
            </span>
          </p>
          <p className="text-text-secondary text-sm mt-1">of the population</p>

          {/* Comedic response */}
          {comedic && (
            <p className="text-text-muted text-sm mt-3 italic max-w-sm mx-auto">
              {comedic}
            </p>
          )}

          {percentile < 50 && (
            <p className="text-text-muted text-xs mt-2">
              Below the median wealth of {formatCurrency(country.medianWealthPerAdult)}
            </p>
          )}
          {percentile >= 99 && (
            <p className="text-accent-amber/80 text-xs mt-2">
              You are in the top 1%
            </p>
          )}
        </div>
      )}

      <p className="text-text-muted text-xs text-center mt-3">
        Your data stays in your browser. Nothing is stored or sent anywhere.
        {mode === "income" && (
          <span className="block mt-1">
            Income is converted to estimated wealth using typical savings patterns.
          </span>
        )}
      </p>
    </div>
  );
}
