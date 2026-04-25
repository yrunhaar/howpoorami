"use client";

import { type ReactNode, useCallback } from "react";
import {
  type IncomeFactors,
  type FactorImpact,
  countFilledFactors,
  MAX_FACTORS,
  computeSpreadFactor,
  computeFactorImpacts,
} from "@/lib/wealth-estimate";
import { useDictionary } from "@/components/LanguageProvider";
import { interpolate, type Dictionary } from "@/lib/i18n/dictionary";

interface IncomeRefinementPanelProps {
  readonly factors: IncomeFactors;
  readonly isOpen: boolean;
  readonly onToggle: () => void;
  readonly onChange: <K extends keyof IncomeFactors>(
    key: K,
    value: IncomeFactors[K],
  ) => void;
  readonly currencyCode?: string;
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

function ConfidenceBar({
  filled,
  t,
}: {
  readonly filled: number;
  readonly t: Dictionary;
}) {
  const pct = Math.round((filled / MAX_FACTORS) * 100);
  const label =
    pct === 0
      ? t.refine.precisionVeryRough
      : pct <= 20
        ? t.refine.precisionRough
        : pct <= 40
          ? t.refine.precisionModerate
          : pct <= 60
            ? t.refine.precisionGood
            : pct <= 80
              ? t.refine.precisionPrecise
              : t.refine.precisionVeryPrecise;
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
  readonly label: ReactNode;
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

function FactorImpactSummary({
  impacts,
  t,
}: {
  readonly impacts: readonly FactorImpact[];
  readonly t: Dictionary;
}) {
  if (impacts.length === 0) return null;

  const upFactors = impacts.filter((i) => i.direction === "up");
  const downFactors = impacts.filter((i) => i.direction === "down");

  return (
    <div className="pt-3 border-t border-border-subtle space-y-2">
      <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
        {t.refine.factorImpactTitle}
      </p>
      {upFactors.length > 0 && (
        <div className="space-y-1">
          {upFactors.map((f) => (
            <div key={f.key} className="flex items-start gap-2 text-xs">
              <span className="text-accent-sage mt-0.5 flex-shrink-0" aria-hidden="true">↑</span>
              <div>
                <span className="font-medium text-accent-sage">{f.label}</span>
                <span className="text-text-muted ml-1">— {f.reason}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {downFactors.length > 0 && (
        <div className="space-y-1">
          {downFactors.map((f) => (
            <div key={f.key} className="flex items-start gap-2 text-xs">
              <span className="text-accent-rose mt-0.5 flex-shrink-0" aria-hidden="true">↓</span>
              <div>
                <span className="font-medium text-accent-rose">{f.label}</span>
                <span className="text-text-muted ml-1">— {f.reason}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────

export default function IncomeRefinementPanel({
  factors,
  isOpen,
  onToggle,
  onChange,
  currencyCode = "USD",
}: IncomeRefinementPanelProps) {
  const t = useDictionary();
  const filled = countFilledFactors(factors);
  const spread = computeSpreadFactor(factors);
  const spreadPct = Math.round(spread * 100);
  const impacts = computeFactorImpacts(factors);

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
            {t.refine.panelToggle}
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
              {interpolate(t.refine.factorsCountTemplate, { count: filled })}
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
            <ConfidenceBar filled={filled} t={t} />

            {/* ── Demographics ── */}
            <fieldset>
              <SectionLegend>{t.refine.legendDemographics}</SectionLegend>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                <SmallInput
                  id="ref-age"
                  label={t.refine.fieldAge}
                  value={factors.age}
                  placeholder={t.refine.placeholderAge}
                  onChange={(v) => numChange("age", v, 3)}
                />
                <SmallInput
                  id="ref-household"
                  label={t.refine.fieldHouseholdSize}
                  value={factors.householdSize}
                  placeholder={t.refine.placeholderHousehold}
                  onChange={(v) => numChange("householdSize", v, 2)}
                />
                <SmallInput
                  id="ref-years-worked"
                  label={t.refine.fieldYearsWorked}
                  value={factors.yearsWorked}
                  placeholder={t.refine.placeholderYearsWorked}
                  onChange={(v) => numChange("yearsWorked", v, 2)}
                />
              </div>

              {/* Education */}
              <div className="mb-2">
                <span className="block text-xs text-text-muted mb-1">
                  {t.refine.fieldEducation}
                </span>
                <SegmentedButtons
                  options={[
                    ["no_degree", t.refine.eduNoDegree],
                    ["high_school", t.refine.eduHighSchool],
                    ["bachelor", t.refine.eduBachelor],
                    ["master", t.refine.eduMaster],
                    ["doctorate", t.refine.eduPhd],
                  ]}
                  value={factors.educationLevel}
                  onSelect={(v) => onChange("educationLevel", v)}
                />
              </div>

              {/* Employment type */}
              <div className="mb-2">
                <span className="block text-xs text-text-muted mb-1">
                  {t.refine.fieldEmployment}
                </span>
                <SegmentedButtons
                  options={[
                    ["unemployed", t.refine.empUnemployed],
                    ["part_time", t.refine.empPartTime],
                    ["full_time", t.refine.empFullTime],
                    ["self_employed", t.refine.empSelfEmployed],
                    ["business_owner", t.refine.empBusinessOwner],
                    ["retired", t.refine.empRetired],
                  ]}
                  value={factors.employmentType}
                  onSelect={(v) => onChange("employmentType", v)}
                />
              </div>

              {/* Marital status */}
              <div>
                <span className="block text-xs text-text-muted mb-1">
                  {t.refine.fieldMaritalStatus}
                </span>
                <SegmentedButtons
                  options={[
                    ["single", t.refine.relSingle],
                    ["partnered", t.refine.relPartnered],
                    ["married", t.refine.relMarried],
                    ["divorced", t.refine.relDivorced],
                    ["widowed", t.refine.relWidowed],
                  ]}
                  value={factors.maritalStatus}
                  onSelect={(v) => onChange("maritalStatus", v)}
                />
              </div>
            </fieldset>

            {/* ── Financial Profile ── */}
            <fieldset>
              <SectionLegend>{t.refine.legendFinancialProfile}</SectionLegend>

              <div className="mb-2">
                <span className="block text-xs text-text-muted mb-1">
                  {t.refine.fieldSavingsHabit}
                </span>
                <SegmentedButtons
                  options={[
                    ["very_low", t.refine.savingsVeryLow],
                    ["low", t.refine.savingsLow],
                    ["moderate", t.refine.savingsModerate],
                    ["high", t.refine.savingsHigh],
                    ["very_high", t.refine.savingsVeryHigh],
                  ]}
                  value={factors.savingsRate}
                  onSelect={(v) => onChange("savingsRate", v)}
                />
              </div>

              {/* Asset chips + optional values */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <ToggleChip
                  active={factors.hasInvestments}
                  label={<><span aria-hidden="true">📈 </span>{t.refine.toggleInvestments}</>}
                  onClick={() =>
                    onChange("hasInvestments", !factors.hasInvestments)
                  }
                  variant="positive"
                />
                <ToggleChip
                  active={factors.hasRetirement}
                  label={<><span aria-hidden="true">🏛️ </span>{t.refine.toggleRetirementFund}</>}
                  onClick={() =>
                    onChange("hasRetirement", !factors.hasRetirement)
                  }
                  variant="positive"
                />
                <ToggleChip
                  active={factors.hasInheritance}
                  label={<><span aria-hidden="true">🏦 </span>{t.refine.toggleInheritance}</>}
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
                      label={interpolate(t.refine.investmentValueTemplate, {
                        currency: currencyCode,
                      })}
                      value={factors.investmentValue}
                      placeholder={t.refine.placeholderInvestment}
                      onChange={(v) => numChange("investmentValue", v, 10)}
                      maxLen={10}
                    />
                  )}
                  {factors.hasRetirement && (
                    <SmallInput
                      id="ref-ret-val"
                      label={interpolate(t.refine.pensionPotTemplate, {
                        currency: currencyCode,
                      })}
                      value={factors.retirementValue}
                      placeholder={t.refine.placeholderPension}
                      onChange={(v) => numChange("retirementValue", v, 10)}
                      maxLen={10}
                    />
                  )}
                </div>
              )}
            </fieldset>

            {/* ── Property ── */}
            <fieldset>
              <SectionLegend>{t.refine.legendProperty}</SectionLegend>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  <ToggleChip
                    active={factors.hasProperty}
                    label={<><span aria-hidden="true">🏠 </span>{t.refine.toggleOwnsProperty}</>}
                    onClick={() =>
                      onChange("hasProperty", !factors.hasProperty)
                    }
                    variant="positive"
                  />
                  <ToggleChip
                    active={factors.hasMortgage}
                    label={<><span aria-hidden="true">🏗️ </span>{t.refine.toggleMortgage}</>}
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
                        label={interpolate(t.refine.propertyValueTemplate, {
                          currency: currencyCode,
                        })}
                        value={factors.propertyValue}
                        placeholder={t.refine.placeholderProperty}
                        onChange={(v) => numChange("propertyValue", v, 10)}
                        maxLen={10}
                      />
                    )}
                    {factors.hasMortgage && (
                      <SmallInput
                        id="ref-mort-val"
                        label={interpolate(t.refine.mortgageRemainingTemplate, {
                          currency: currencyCode,
                        })}
                        value={factors.mortgageRemaining}
                        placeholder={t.refine.placeholderMortgage}
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
              <SectionLegend>{t.refine.legendDebts}</SectionLegend>
              <div className="space-y-2">
                <ToggleChip
                  active={factors.hasDebts}
                  label={<><span aria-hidden="true">💳 </span>{t.refine.toggleSignificantDebts}</>}
                  onClick={() => onChange("hasDebts", !factors.hasDebts)}
                  variant="negative"
                />
                {factors.hasDebts && (
                  <div className="ml-1">
                    <span className="block text-xs text-text-muted mb-1">
                      {t.refine.debtLevelLabel}
                    </span>
                    <SegmentedButtons
                      options={[
                        ["low", t.refine.debtLessThan1Yr],
                        ["moderate", t.refine.debt1to3Yr],
                        ["high", t.refine.debt3to5Yr],
                        ["very_high", t.refine.debtMoreThan5Yr],
                      ]}
                      value={factors.debtLevel}
                      onSelect={(v) => onChange("debtLevel", v)}
                      variant="negative"
                    />
                  </div>
                )}
              </div>
            </fieldset>

            {/* Factor impact summary */}
            <FactorImpactSummary impacts={impacts} t={t} />

            {/* Methodology note */}
            <p className="text-xs text-text-muted/70 leading-relaxed pt-2 border-t border-border-subtle">
              {interpolate(t.refine.methodologyNoteTemplate, {
                spreadPct,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
