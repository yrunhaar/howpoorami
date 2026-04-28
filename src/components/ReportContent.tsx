"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ALL_COUNTRY_MAP,
  isAllCountryCode,
  type AllCountryCode,
} from "@/data/countries-extended";
import { useDictionary, useLanguage } from "@/components/LanguageProvider";
import { interpolate } from "@/lib/i18n/dictionary";
import { localizedCountryName } from "@/lib/i18n/country-names";
import { formatCurrency, getCurrencySymbol } from "@/lib/format";
import { useGeoCountry } from "@/hooks/useGeoCountry";
import CountrySelector from "@/components/CountrySelector";
import { generateReportPdf } from "@/lib/report/generate-pdf";
import {
  EMPTY_ESTIMATE,
  estimateTotal,
  type EstimateFields,
  type WizardMode,
} from "@/lib/report/types";

const KOFI_URL = "https://ko-fi.com/yrunhaar";

type Stage = "landing" | "wizard" | "done";

/**
 * The Report flow. Three stages on the same client surface:
 *   1. landing — the SEO copy, with a "Generate" CTA
 *   2. wizard  — country pick + known/estimate net worth + age
 *   3. done    — confirmation + Ko-fi tip CTA
 *
 * The whole flow is client-side; the only external call the user makes is
 * the optional ko-fi.com link they click after.
 */
export default function ReportContent() {
  const t = useDictionary();
  const { locale } = useLanguage();
  const geoCountry = useGeoCountry();

  const [stage, setStage] = useState<Stage>("landing");
  const [country, setCountry] = useState<AllCountryCode>(geoCountry ?? "US");
  const [mode, setMode] = useState<WizardMode>("known");
  const [knownInput, setKnownInput] = useState("");
  const [estimate, setEstimate] = useState<EstimateFields>(EMPTY_ESTIMATE);
  const [age, setAge] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countryData = ALL_COUNTRY_MAP[country];
  const currency = countryData.currency;
  const currencySymbol = getCurrencySymbol(currency);

  const localizedName = useMemo(
    () => localizedCountryName(country, locale, countryData.name),
    [country, locale, countryData.name],
  );

  const estimatedTotal = useMemo(() => estimateTotal(estimate), [estimate]);

  const netWorthLocal: number = useMemo(() => {
    if (mode === "estimate") return estimatedTotal;
    const parsed = parseFloat(knownInput.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }, [mode, knownInput, estimatedTotal]);

  const canGenerate = netWorthLocal !== 0;

  const handleCountrySelect = useCallback((code: string) => {
    if (isAllCountryCode(code)) setCountry(code);
  }, []);

  const handleEstimateField = useCallback(
    <K extends keyof EstimateFields>(key: K, value: string) => {
      setEstimate((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleGenerate = useCallback(async () => {
    if (!canGenerate || generating) return;
    setError(null);
    setGenerating(true);
    try {
      const ageNum = parseInt(age.replace(/[^0-9]/g, ""), 10);
      await generateReportPdf({
        locale,
        countryCode: country,
        netWorthLocal,
        age: Number.isFinite(ageNum) ? ageNum : null,
      });
      setStage("done");
    } catch {
      setError(t.report.wizardError);
    } finally {
      setGenerating(false);
    }
  }, [canGenerate, generating, age, country, locale, netWorthLocal, t.report.wizardError]);

  const handleRegenerate = useCallback(() => {
    setStage("wizard");
  }, []);

  return (
    <main className="min-h-screen pt-14">
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto w-full">
          {stage === "landing" && (
            <Landing onStart={() => setStage("wizard")} />
          )}

          {stage === "wizard" && (
            <Wizard
              country={country}
              localizedCountryName={localizedName}
              currency={currency}
              currencySymbol={currencySymbol}
              mode={mode}
              setMode={setMode}
              knownInput={knownInput}
              setKnownInput={setKnownInput}
              estimate={estimate}
              estimatedTotal={estimatedTotal}
              age={age}
              setAge={setAge}
              generating={generating}
              error={error}
              canGenerate={canGenerate}
              onCountrySelect={handleCountrySelect}
              onEstimateField={handleEstimateField}
              onGenerate={handleGenerate}
            />
          )}

          {stage === "done" && (
            <ThankYou
              localizedCountryName={localizedName}
              onRegenerate={handleRegenerate}
            />
          )}
        </div>
      </section>
    </main>
  );
}

// ── Landing (SEO surface) ──────────────────────────────────────────────────

function Landing({ onStart }: { readonly onStart: () => void }) {
  const t = useDictionary();
  return (
    <>
      {/* Header — matches the typographic scale of CompareClient/CrossCountryCompare. */}
      <div className="text-center mb-10">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl text-text-primary leading-tight">
          {t.report.landingTitle}
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl mt-4 max-w-2xl mx-auto">
          {t.report.landingSubtitle}
        </p>
        <span className="inline-block mt-6 text-xs font-semibold text-accent-amber bg-accent-amber/15 border border-accent-amber/30 rounded-full px-3 py-1.5">
          ☕ {t.report.landingFreeBadge}
        </span>
      </div>

      <div className="text-center mb-10">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-full bg-accent-periwinkle text-white hover:opacity-90 transition-opacity px-7 py-3 text-base font-semibold cursor-pointer"
        >
          {t.report.landingCta}
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <section className="bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8 mb-8">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-3 text-text-primary">
          {t.report.landingLeadHeading}
        </h2>
        <p className="text-text-secondary leading-relaxed">
          {t.report.landingLeadBody}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <FeatureCard
          accent="periwinkle"
          title={t.report.landingFeatureWealthTitle}
          body={t.report.landingFeatureWealthBody}
        />
        <FeatureCard
          accent="amber"
          title={t.report.landingFeatureContextTitle}
          body={t.report.landingFeatureContextBody}
        />
        <FeatureCard
          accent="sage"
          title={t.report.landingFeaturePrivateTitle}
          body={t.report.landingFeaturePrivateBody}
        />
      </div>

      <section className="bg-bg-secondary/50 border border-border-subtle rounded-2xl p-6 sm:p-8 mb-10">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-3 text-text-primary">
          {t.report.landingExampleTitle}
        </h2>
        <p className="text-text-secondary leading-relaxed">
          {t.report.landingExampleBody}
        </p>
      </section>

      <p className="text-text-muted text-xs text-center max-w-xl mx-auto">
        {t.report.landingPrivacyNote}
      </p>
    </>
  );
}

interface FeatureCardProps {
  readonly accent: "periwinkle" | "amber" | "sage";
  readonly title: string;
  readonly body: string;
}
function FeatureCard({ accent, title, body }: FeatureCardProps) {
  const accentClasses = {
    periwinkle:
      "border-accent-periwinkle/30 bg-accent-periwinkle/5 text-accent-periwinkle",
    amber: "border-accent-amber/30 bg-accent-amber/5 text-accent-amber",
    sage: "border-accent-sage/30 bg-accent-sage/5 text-accent-sage",
  } as const;
  return (
    <div className={`border rounded-2xl p-5 ${accentClasses[accent]}`}>
      <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold mb-2">
        {title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed">{body}</p>
    </div>
  );
}

// ── Wizard ─────────────────────────────────────────────────────────────────

interface WizardProps {
  readonly country: AllCountryCode;
  readonly localizedCountryName: string;
  readonly currency: string;
  readonly currencySymbol: string;
  readonly mode: WizardMode;
  readonly setMode: (m: WizardMode) => void;
  readonly knownInput: string;
  readonly setKnownInput: (v: string) => void;
  readonly estimate: EstimateFields;
  readonly estimatedTotal: number;
  readonly age: string;
  readonly setAge: (v: string) => void;
  readonly generating: boolean;
  readonly error: string | null;
  readonly canGenerate: boolean;
  readonly onCountrySelect: (code: string) => void;
  readonly onEstimateField: <K extends keyof EstimateFields>(
    k: K,
    v: string,
  ) => void;
  readonly onGenerate: () => void;
}
function Wizard(props: WizardProps) {
  const t = useDictionary();
  return (
    <>
      <div className="text-center mb-10">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl text-text-primary leading-tight">
          {t.report.wizardTitle}
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl mt-4 max-w-2xl mx-auto">
          {t.report.wizardSubtitle}
        </p>
      </div>

      {/* Country */}
      <div className="mb-6 text-center">
        <p className="text-sm text-text-secondary mb-3">
          {t.report.wizardCountryLabel}
        </p>
        <CountrySelector
          selected={props.country}
          onSelect={props.onCountrySelect}
        />
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center gap-1 mb-6">
        <ModeButton
          label={t.report.wizardModeKnown}
          active={props.mode === "known"}
          onClick={() => props.setMode("known")}
        />
        <ModeButton
          label={t.report.wizardModeEstimate}
          active={props.mode === "estimate"}
          onClick={() => props.setMode("estimate")}
        />
      </div>

      {/* Known mode */}
      {props.mode === "known" && (
        <div className="max-w-md mx-auto mb-6">
          <label
            htmlFor="known-input"
            className="block text-sm text-text-secondary mb-2 text-center"
          >
            {t.report.wizardKnownLabel} ({props.currency})
          </label>
          <input
            id="known-input"
            type="text"
            inputMode="decimal"
            value={props.knownInput}
            onChange={(e) =>
              props.setKnownInput(e.target.value.replace(/[^0-9.-]/g, ""))
            }
            placeholder={`${props.currencySymbol}${t.report.wizardKnownPlaceholder}`}
            className="w-full px-6 py-4 rounded-2xl text-center text-2xl font-medium tabular-nums bg-bg-card border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-periwinkle/50 focus:ring-2 focus:ring-accent-periwinkle/20 transition-all duration-300"
          />
          <p className="text-text-muted text-xs text-center mt-2">
            {t.report.wizardKnownHint}
          </p>
        </div>
      )}

      {/* Estimate mode */}
      {props.mode === "estimate" && (
        <div className="max-w-2xl mx-auto mb-6">
          <p className="text-sm text-text-muted text-center mb-4">
            {t.report.wizardEstimateIntro}
          </p>

          <FieldGroup label={t.report.wizardStepProperty}>
            <FieldRow
              id="f-home"
              label={t.report.wizardFieldHomeValue}
              symbol={props.currencySymbol}
              value={props.estimate.homeValue}
              onChange={(v) => props.onEstimateField("homeValue", v)}
            />
            <FieldRow
              id="f-mortgage"
              label={t.report.wizardFieldMortgage}
              symbol={props.currencySymbol}
              value={props.estimate.mortgageRemaining}
              onChange={(v) => props.onEstimateField("mortgageRemaining", v)}
              negative
            />
            <FieldRow
              id="f-other-property"
              label={t.report.wizardFieldOtherProperty}
              symbol={props.currencySymbol}
              value={props.estimate.otherProperty}
              onChange={(v) => props.onEstimateField("otherProperty", v)}
            />
          </FieldGroup>

          <FieldGroup label={t.report.wizardStepInvestments}>
            <FieldRow
              id="f-stocks"
              label={t.report.wizardFieldStocks}
              symbol={props.currencySymbol}
              value={props.estimate.stocks}
              onChange={(v) => props.onEstimateField("stocks", v)}
            />
            <FieldRow
              id="f-retirement"
              label={t.report.wizardFieldRetirement}
              symbol={props.currencySymbol}
              value={props.estimate.retirement}
              onChange={(v) => props.onEstimateField("retirement", v)}
            />
            <FieldRow
              id="f-crypto"
              label={t.report.wizardFieldCrypto}
              symbol={props.currencySymbol}
              value={props.estimate.crypto}
              onChange={(v) => props.onEstimateField("crypto", v)}
            />
          </FieldGroup>

          <FieldGroup label={t.report.wizardStepCash}>
            <FieldRow
              id="f-cash"
              label={t.report.wizardFieldCash}
              symbol={props.currencySymbol}
              value={props.estimate.cash}
              onChange={(v) => props.onEstimateField("cash", v)}
            />
            <FieldRow
              id="f-other-savings"
              label={t.report.wizardFieldOtherSavings}
              symbol={props.currencySymbol}
              value={props.estimate.otherSavings}
              onChange={(v) => props.onEstimateField("otherSavings", v)}
            />
          </FieldGroup>

          <FieldGroup label={t.report.wizardStepDebts}>
            <FieldRow
              id="f-student"
              label={t.report.wizardFieldStudentLoans}
              symbol={props.currencySymbol}
              value={props.estimate.studentLoans}
              onChange={(v) => props.onEstimateField("studentLoans", v)}
              negative
            />
            <FieldRow
              id="f-credit"
              label={t.report.wizardFieldCreditDebt}
              symbol={props.currencySymbol}
              value={props.estimate.creditDebt}
              onChange={(v) => props.onEstimateField("creditDebt", v)}
              negative
            />
            <FieldRow
              id="f-other-debt"
              label={t.report.wizardFieldOtherDebts}
              symbol={props.currencySymbol}
              value={props.estimate.otherDebts}
              onChange={(v) => props.onEstimateField("otherDebts", v)}
              negative
            />
          </FieldGroup>

          {/* Live total */}
          <div className="mt-2 px-4 py-3 rounded-2xl bg-accent-periwinkle/10 border border-accent-periwinkle/30 flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              {t.report.wizardEstimateTotalLabel}
            </span>
            <span className="text-xl font-bold text-text-primary tabular-nums">
              {formatCurrency(props.estimatedTotal, props.currency, true)}
            </span>
          </div>
        </div>
      )}

      {/* Optional age */}
      <div className="max-w-md mx-auto mb-8 flex items-center justify-center gap-3">
        <label htmlFor="age-input" className="text-text-muted text-sm">
          {t.report.wizardAgeLabel}
        </label>
        <input
          id="age-input"
          type="text"
          inputMode="numeric"
          value={props.age}
          onChange={(e) =>
            props.setAge(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))
          }
          placeholder={t.report.wizardAgePlaceholder}
          className="w-20 px-3 py-2 rounded-lg text-center text-sm tabular-nums bg-bg-card border border-border-subtle text-text-primary focus:outline-none focus:border-accent-periwinkle/50 transition-colors"
        />
      </div>

      {/* Generate */}
      <div className="text-center">
        <button
          type="button"
          onClick={props.onGenerate}
          disabled={!props.canGenerate || props.generating}
          className="inline-flex items-center gap-2 rounded-full bg-accent-periwinkle text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity px-7 py-3 text-base font-semibold cursor-pointer"
        >
          {props.generating ? t.report.wizardGenerating : t.report.wizardGenerateCta}
        </button>
        {props.error && (
          <p className="text-accent-rose text-sm mt-3">{props.error}</p>
        )}
        <p className="text-text-muted text-xs mt-4 max-w-md mx-auto">
          {interpolate(t.report.wizardCurrencyHint, { currency: props.currency })}
        </p>
      </div>
    </>
  );
}

// ── Wizard primitives ──────────────────────────────────────────────────────

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
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
        active
          ? "bg-accent-periwinkle/15 text-accent-periwinkle border border-accent-periwinkle/30"
          : "bg-bg-card text-text-muted border border-border-subtle hover:text-text-primary"
      }`}
    >
      {label}
    </button>
  );
}

function FieldGroup({
  label,
  children,
}: {
  readonly label: string;
  readonly children: React.ReactNode;
}) {
  return (
    <fieldset className="mb-4">
      <legend className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2">
        {label}
      </legend>
      <div className="space-y-2">{children}</div>
    </fieldset>
  );
}

function FieldRow({
  id,
  label,
  symbol,
  value,
  onChange,
  negative = false,
}: {
  readonly id: string;
  readonly label: string;
  readonly symbol: string;
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly negative?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor={id}
        className={`text-sm flex-1 ${negative ? "text-accent-rose" : "text-text-secondary"}`}
      >
        {negative && <span aria-hidden="true">− </span>}
        {label}
      </label>
      <div className="relative w-44">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm pointer-events-none">
          {symbol}
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
          className="w-full pl-7 pr-3 py-2 rounded-lg text-right text-sm tabular-nums bg-bg-card border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-periwinkle/40 transition-colors"
          placeholder="0"
        />
      </div>
    </div>
  );
}

// ── Thank-you stage ────────────────────────────────────────────────────────

function ThankYou({
  localizedCountryName,
  onRegenerate,
}: {
  readonly localizedCountryName: string;
  readonly onRegenerate: () => void;
}) {
  const t = useDictionary();
  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-sage/15 border border-accent-sage/30 text-accent-sage text-3xl">
        ✓
      </div>
      <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl text-text-primary leading-tight mb-4">
        {t.report.thankYouTitle}
      </h1>
      <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-8">
        {t.report.thankYouBody}
      </p>

      <a
        href={KOFI_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-accent-amber/20 hover:bg-accent-amber/30 text-accent-amber border border-accent-amber/40 px-6 py-3 text-base font-semibold transition-colors cursor-pointer mb-4"
      >
        <span aria-hidden="true">☕</span>
        <span>{t.report.thankYouTipCta}</span>
      </a>

      <div>
        <button
          type="button"
          onClick={onRegenerate}
          className="text-sm text-accent-periwinkle hover:underline cursor-pointer"
        >
          {t.report.thankYouRegenerate}
        </button>
      </div>

      {/* Tiny implicit link to the just-completed country, in case they
          want to keep exploring (matches the SEO-page tone). */}
      <p className="sr-only">{localizedCountryName}</p>
    </div>
  );
}
