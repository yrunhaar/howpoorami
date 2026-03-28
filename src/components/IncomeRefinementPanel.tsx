"use client";

import { useCallback } from "react";
import {
  type IncomeFactors,
  countFilledFactors,
  MAX_FACTORS,
  computeSpreadFactor,
} from "@/lib/wealth-estimate";

interface IncomeRefinementPanelProps {
  readonly factors: IncomeFactors;
  readonly isOpen: boolean;
  readonly onToggle: () => void;
  readonly onChange: <K extends keyof IncomeFactors>(
    key: K,
    value: IncomeFactors[K],
  ) => void;
}

// ── Small UI primitives ────────────────────────────────────────────

function ChevronIcon({ open }: { readonly open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ConfidenceBar({ filled }: { readonly filled: number }) {
  const pct = Math.round((filled / MAX_FACTORS) * 100);
  const label =
    pct === 0
      ? "Very rough"
      : pct <= 20
        ? "Rough"
        : pct <= 40
          ? "Moderate"
          : pct <= 60
            ? "Good"
            : pct <= 80
              ? "Precise"
              : "Very precise";
  const color =
    pct <= 20
      ? "bg-accent-rose/60"
      : pct <= 40
        ? "bg-accent-amber/60"
        : "bg-accent-sage/60";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-border-subtle overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.max(5, pct)}%` }}
        />
      </div>
      <span className="text-xs text-text-muted whitespace-nowrap tabular-nums">
        {label} ({filled}/{MAX_FACTORS})
      </span>
    </div>
  );
}

function ToggleChip({
  active,
  label,
  onClick,
  variant = "neutral",
}: {
  readonly active: boolean;
  readonly label: string;
  readonly onClick: () => void;
  readonly variant?: "positive" | "negative" | "neutral";
}) {
  const activeStyles = {
    positive: "bg-accent-sage/20 text-accent-sage border-accent-sage/30",
    negative: "bg-accent-rose/20 text-accent-rose border-accent-rose/30",
    neutral:
      "bg-accent-periwinkle/20 text-accent-periwinkle border-accent-periwinkle/30",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
        active
          ? activeStyles[variant]
          : "bg-bg-primary text-text-muted border-border-subtle hover:text-text-secondary hover:border-text-muted/30"
      }`}
    >
      {label}
    </button>
  );
}

function SegmentedButtons({
  options,
  value,
  onSelect,
  variant = "neutral",
}: {
  readonly options: readonly (readonly [string, string])[];
  readonly value: string;
  readonly onSelect: (v: string) => void;
  readonly variant?: "neutral" | "negative";
}) {
  const activeClass =
    variant === "negative"
      ? "bg-accent-rose/15 text-accent-rose border-accent-rose/30"
      : "bg-accent-periwinkle/15 text-accent-periwinkle border-accent-periwinkle/30";

  return (
    <div className="flex flex-wrap gap-1">
      {options.map(([val, label]) => (
        <button
          key={val}
          type="button"
          onClick={() => onSelect(val)}
          className={`px-2 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer ${
            value === val
              ? activeClass
              : "bg-bg-primary text-text-muted border-border-subtle hover:text-text-secondary"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function SmallInput({
  id,
  label,
  value,
  placeholder,
  onChange,
  maxLen = 3,
}: {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly placeholder: string;
  readonly onChange: (val: string) => void;
  readonly maxLen?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-text-muted mb-0.5">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/[^0-9]/g, "").slice(0, maxLen);
          onChange(cleaned);
        }}
        placeholder={placeholder}
        className="w-full px-2.5 py-1.5 rounded-lg text-sm bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-periwinkle/40 transition-colors tabular-nums"
      />
    </div>
  );
}

function SectionLegend({ children }: { readonly children: string }) {
  return (
    <legend className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2">
      {children}
    </legend>
  );
}

// ── Main component ─────────────────────────────────────────────────

export default function IncomeRefinementPanel({
  factors,
  isOpen,
  onToggle,
  onChange,
}: IncomeRefinementPanelProps) {
  const filled = countFilledFactors(factors);
  const spread = computeSpreadFactor(factors);
  const spreadPct = Math.round(spread * 100);

  const numChange = useCallback(
    (key: keyof IncomeFactors, raw: string, maxLen = 3) => {
      const cleaned = raw.replace(/[^0-9]/g, "").slice(0, maxLen);
      onChange(key, cleaned as IncomeFactors[typeof key]);
    },
    [onChange],
  );

  return (
    <div className="mt-3 rounded-xl border border-border-subtle overflow-hidden transition-all duration-300">
      {/* Header / toggle */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-4 py-3 bg-bg-card hover:bg-bg-secondary/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-secondary">
            Refine estimate
          </span>
          {filled > 0 && (
            <span className="text-xs tabular-nums text-accent-periwinkle bg-accent-periwinkle/10 px-1.5 py-0.5 rounded-full">
              ±{spreadPct}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-text-muted">
          {filled > 0 && !isOpen && (
            <span className="text-xs tabular-nums">
              {filled} factor{filled !== 1 ? "s" : ""}
            </span>
          )}
          <ChevronIcon open={isOpen} />
        </div>
      </button>

      {/* Collapsible body */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-2 space-y-4 bg-bg-card border-t border-border-subtle">
            <ConfidenceBar filled={filled} />

            {/* ── Demographics ── */}
            <fieldset>
              <SectionLegend>Demographics</SectionLegend>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <SmallInput
                  id="ref-age"
                  label="Age"
                  value={factors.age}
                  placeholder="35"
                  onChange={(v) => numChange("age", v, 3)}
                />
                <SmallInput
                  id="ref-household"
                  label="Household"
                  value={factors.householdSize}
                  placeholder="adults"
                  onChange={(v) => numChange("householdSize", v, 2)}
                />
                <SmallInput
                  id="ref-years-worked"
                  label="Yrs worked"
                  value={factors.yearsWorked}
                  placeholder="10"
                  onChange={(v) => numChange("yearsWorked", v, 2)}
                />
              </div>

              {/* Education */}
              <div className="mb-2">
                <span className="block text-xs text-text-muted mb-1">
                  Education
                </span>
                <SegmentedButtons
                  options={[
                    ["no_degree", "No degree"],
                    ["high_school", "High school"],
                    ["bachelor", "Bachelor"],
                    ["master", "Master"],
                    ["doctorate", "PhD"],
                  ]}
                  value={factors.educationLevel}
                  onSelect={(v) => onChange("educationLevel", v)}
                />
              </div>

              {/* Employment type */}
              <div className="mb-2">
                <span className="block text-xs text-text-muted mb-1">
                  Employment
                </span>
                <SegmentedButtons
                  options={[
                    ["unemployed", "Unemployed"],
                    ["part_time", "Part-time"],
                    ["full_time", "Full-time"],
                    ["self_employed", "Self-empl."],
                    ["business_owner", "Business"],
                    ["retired", "Retired"],
                  ]}
                  value={factors.employmentType}
                  onSelect={(v) => onChange("employmentType", v)}
                />
              </div>

              {/* Marital status */}
              <div>
                <span className="block text-xs text-text-muted mb-1">
                  Marital status
                </span>
                <SegmentedButtons
                  options={[
                    ["single", "Single"],
                    ["partnered", "Partner"],
                    ["married", "Married"],
                    ["divorced", "Divorced"],
                    ["widowed", "Widowed"],
                  ]}
                  value={factors.maritalStatus}
                  onSelect={(v) => onChange("maritalStatus", v)}
                />
              </div>
            </fieldset>

            {/* ── Financial Profile ── */}
            <fieldset>
              <SectionLegend>Financial profile</SectionLegend>

              <div className="mb-2">
                <span className="block text-xs text-text-muted mb-1">
                  Savings habit
                </span>
                <SegmentedButtons
                  options={[
                    ["very_low", "Minimal"],
                    ["low", "Below avg"],
                    ["moderate", "Average"],
                    ["high", "Above avg"],
                    ["very_high", "Aggressive"],
                  ]}
                  value={factors.savingsRate}
                  onSelect={(v) => onChange("savingsRate", v)}
                />
              </div>

              {/* Asset chips + optional values */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <ToggleChip
                  active={factors.hasInvestments}
                  label="📈 Investments"
                  onClick={() =>
                    onChange("hasInvestments", !factors.hasInvestments)
                  }
                  variant="positive"
                />
                <ToggleChip
                  active={factors.hasRetirement}
                  label="🏛️ Retirement fund"
                  onClick={() =>
                    onChange("hasRetirement", !factors.hasRetirement)
                  }
                  variant="positive"
                />
                <ToggleChip
                  active={factors.hasInheritance}
                  label="🏦 Inheritance"
                  onClick={() =>
                    onChange("hasInheritance", !factors.hasInheritance)
                  }
                  variant="positive"
                />
              </div>

              {/* Conditional value inputs for investments & retirement */}
              {(factors.hasInvestments || factors.hasRetirement) && (
                <div className="grid grid-cols-2 gap-2 mt-2 ml-1">
                  {factors.hasInvestments && (
                    <SmallInput
                      id="ref-inv-val"
                      label="Investment value"
                      value={factors.investmentValue}
                      placeholder="e.g. 50000"
                      onChange={(v) => numChange("investmentValue", v, 10)}
                      maxLen={10}
                    />
                  )}
                  {factors.hasRetirement && (
                    <SmallInput
                      id="ref-ret-val"
                      label="Retirement value"
                      value={factors.retirementValue}
                      placeholder="e.g. 80000"
                      onChange={(v) => numChange("retirementValue", v, 10)}
                      maxLen={10}
                    />
                  )}
                </div>
              )}
            </fieldset>

            {/* ── Property ── */}
            <fieldset>
              <SectionLegend>Property</SectionLegend>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  <ToggleChip
                    active={factors.hasProperty}
                    label="🏠 I own property"
                    onClick={() =>
                      onChange("hasProperty", !factors.hasProperty)
                    }
                    variant="positive"
                  />
                  <ToggleChip
                    active={factors.hasMortgage}
                    label="🏗️ Mortgage"
                    onClick={() =>
                      onChange("hasMortgage", !factors.hasMortgage)
                    }
                    variant="negative"
                  />
                </div>
                {(factors.hasProperty || factors.hasMortgage) && (
                  <div className="grid grid-cols-2 gap-2 ml-1">
                    {factors.hasProperty && (
                      <SmallInput
                        id="ref-prop-val"
                        label="Property value"
                        value={factors.propertyValue}
                        placeholder="e.g. 350000"
                        onChange={(v) => numChange("propertyValue", v, 10)}
                        maxLen={10}
                      />
                    )}
                    {factors.hasMortgage && (
                      <SmallInput
                        id="ref-mort-val"
                        label="Mortgage remaining"
                        value={factors.mortgageRemaining}
                        placeholder="e.g. 200000"
                        onChange={(v) => numChange("mortgageRemaining", v, 10)}
                        maxLen={10}
                      />
                    )}
                  </div>
                )}
              </div>
            </fieldset>

            {/* ── Debts ── */}
            <fieldset>
              <SectionLegend>Non-mortgage debts</SectionLegend>
              <div className="space-y-2">
                <ToggleChip
                  active={factors.hasDebts}
                  label="💳 I have significant debts"
                  onClick={() => onChange("hasDebts", !factors.hasDebts)}
                  variant="negative"
                />
                {factors.hasDebts && (
                  <div className="ml-1">
                    <span className="block text-xs text-text-muted mb-1">
                      Debt level (excl. mortgage)
                    </span>
                    <SegmentedButtons
                      options={[
                        ["low", "< 1yr income"],
                        ["moderate", "1–3yr"],
                        ["high", "3–5yr"],
                        ["very_high", "> 5yr"],
                      ]}
                      value={factors.debtLevel}
                      onSelect={(v) => onChange("debtLevel", v)}
                      variant="negative"
                    />
                  </div>
                )}
              </div>
            </fieldset>

            {/* Methodology note */}
            <p className="text-xs text-text-muted/70 leading-relaxed pt-2 border-t border-border-subtle">
              Based on Federal Reserve SCF, OECD, ECB HFCS, and Credit Suisse
              data. Model: income × age × education × employment × marital ×
              savings × assets − debts. Currently ±{spreadPct}% uncertainty.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
