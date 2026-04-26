"use client";

import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { type CountryData, findPercentile } from "@/data/wealth-data";
import { formatCurrency, getCurrencySymbol } from "@/lib/format";
import { toUSD, fromUSD } from "@/lib/currency";
import { getPercentileLineFor } from "@/lib/i18n/content/comedic";
import { RICHEST_BY_COUNTRY } from "@/data/billionaires";
import {
  type IncomeFactors,
  type PercentileRange,
  DEFAULT_INCOME_FACTORS,
  estimateWealthRange,
  computePercentileRange,
} from "@/lib/wealth-estimate";
import {
  adjustPercentileForAge,
  hasAgeData,
  AGE_GROUP_LABELS,
  type AgeAdjustedResult,
} from "@/data/age-adjustment";
import {
  useShareableState,
  type ShareableState,
} from "@/hooks/useShareableState";
import { useDictionary, useLanguage } from "@/components/LanguageProvider";
import { interpolate } from "@/lib/i18n/dictionary";
import { localePath } from "@/lib/i18n/urls";
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
  const [ageInput, setAgeInput] = useState("");
  const [ageResult, setAgeResult] = useState<AgeAdjustedResult | null>(null);
  const refinePanelRef = useRef<HTMLDivElement>(null);

  // Shareable URL state — read once on mount, write on each input change
  const { initial: initialUrlState, pushState, buildUrl } = useShareableState();
  const hasAppliedInitialRef = useRef(false);
  const t = useDictionary();
  const { locale } = useLanguage();

  // Auto-scroll refinement panel into view on mobile when opened
  useEffect(() => {
    if (refinePanelOpen && refinePanelRef.current) {
      // Small delay to allow the panel animation to start
      const timer = setTimeout(() => {
        refinePanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [refinePanelOpen]);

  // Convert input and recompute when country changes (instead of resetting)
  const prevCurrencyRef = useRef(country.currency);
  const prevCountryCodeRef = useRef(country.code);
  useEffect(() => {
    if (prevCountryCodeRef.current === country.code) return;
    const prevCurrency = prevCurrencyRef.current;
    prevCurrencyRef.current = country.currency;
    prevCountryCodeRef.current = country.code;

    if (inputValue.length === 0 || inputValue === "-") {
      setPercentile(null);
      setPercentileRange(null);
      setZeroIncomeMessage(null);
      onPercentileChange(null);
      return;
    }

    // Convert the input value from old currency to new currency
    const parsed = parseInt(inputValue, 10);
    if (!Number.isFinite(parsed)) return;
    const usd = toUSD(parsed, prevCurrency);
    const converted = Math.round(fromUSD(usd, country.currency));
    const newRaw = String(converted);
    setInputValue(newRaw);

    // Recompute percentile for the new country
    if (mode === "income") {
      // computeFromIncome will be called by the incomeFactors effect
    } else {
      const p = findPercentile(usd, country);
      setPercentile(p);
      setPercentileRange(null);
      onPercentileChange(p);
    }
  }, [country.code, country.currency, inputValue, mode, onPercentileChange]);

  const [zeroIncomeMessage, setZeroIncomeMessage] = useState<string | null>(
    null,
  );

  const computeFromIncome = useCallback(
    (raw: string, factors: IncomeFactors) => {
      if (raw.length === 0 || raw === "-") {
        setPercentile(null);
        setPercentileRange(null);
        setZeroIncomeMessage(null);
        onPercentileChange(null);
        return;
      }
      const value = parseInt(raw, 10);
      if (!Number.isFinite(value)) return;

      if (value === 0) {
        setPercentile(null);
        setPercentileRange(null);
        setZeroIncomeMessage(
          "Enter your annual income to see where you stand. For zero or no income, try Net Wealth mode instead.",
        );
        onPercentileChange(null);
        return;
      }

      setZeroIncomeMessage(null);
      const valueUSD = toUSD(value, country.currency);
      const wRange = estimateWealthRange(valueUSD, country, factors, country.currency);
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

  // Apply initial URL state once it's loaded (post-hydration).
  // This populates the input + computes the percentile from a shared link.
  useEffect(() => {
    if (hasAppliedInitialRef.current) return;
    if (initialUrlState === null) return;
    hasAppliedInitialRef.current = true;

    const { mode: urlMode, amount, age } = initialUrlState;
    if (urlMode === "income") setMode("income");
    if (age.length > 0) setAgeInput(age);
    if (amount.length === 0) return;

    setInputValue(amount);
    if (urlMode === "income") {
      computeFromIncome(amount, DEFAULT_INCOME_FACTORS);
    } else {
      const parsed = parseInt(amount, 10);
      if (!Number.isFinite(parsed)) return;
      const usd = toUSD(parsed, country.currency);
      const p = findPercentile(usd, country);
      setPercentile(p);
      setPercentileRange(null);
      onPercentileChange(p);
    }
    // We intentionally exclude `country` and `computeFromIncome` from deps:
    // this effect only runs once when the initial URL state arrives. Country
    // changes are handled separately by the currency-conversion effect above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrlState]);

  // Sync state → URL whenever the user changes input/mode/age
  useEffect(() => {
    // Skip the very first render — wait until we've applied any initial URL state
    if (!hasAppliedInitialRef.current && initialUrlState === null) return;
    const state: ShareableState = {
      mode,
      amount: inputValue,
      age: ageInput,
    };
    pushState(state);
  }, [mode, inputValue, ageInput, pushState, initialUrlState]);

  // Compute age-adjusted percentile when age or wealth changes
  useEffect(() => {
    const age = parseInt(ageInput, 10);
    if (!Number.isFinite(age) || age < 18 || age > 120 || percentile === null) {
      setAgeResult(null);
      return;
    }
    if (!hasAgeData(country.code)) {
      setAgeResult(null);
      return;
    }
    // Get the USD wealth from the current input
    if (inputValue.length === 0 || inputValue === "-") {
      setAgeResult(null);
      return;
    }
    const parsed = parseInt(inputValue, 10);
    if (!Number.isFinite(parsed)) { setAgeResult(null); return; }
    const usd = mode === "income"
      ? estimateWealthRange(toUSD(parsed, country.currency), country, incomeFactors, country.currency).mid
      : toUSD(parsed, country.currency);
    setAgeResult(adjustPercentileForAge(usd, age, country));
  }, [ageInput, percentile, inputValue, country, mode, incomeFactors]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Strip everything except digits and leading minus (wealth can be negative)
      const cleaned = mode === "wealth"
        ? e.target.value.replace(/(?!^-)[^0-9]/g, "").replace(/^(-?)0+(?=\d)/, "$1")
        : e.target.value.replace(/[^0-9]/g, "");
      const raw = cleaned;
      setInputValue(raw);

      if (mode === "income") {
        computeFromIncome(raw, incomeFactors);
      } else if (raw.length > 0 && raw !== "-") {
        const localAmount = parseInt(raw, 10);
        const usdAmount = toUSD(localAmount, country.currency);
        const p = findPercentile(usdAmount, country);
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
      setZeroIncomeMessage(null);
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
    if (inputValue.length === 0 || inputValue === "-") return inputValue;
    const parsed = parseInt(inputValue, 10);
    if (!Number.isFinite(parsed)) return inputValue;
    return formatCurrency(parsed, country.currency);
  }, [inputValue, country.currency]);

  const comedic = useMemo(() => {
    if (percentile === null) return null;
    return getPercentileLineFor(locale, percentile, country.name);
  }, [percentile, country.name, locale]);

  const wealthRange = useMemo(() => {
    if (mode !== "income" || inputValue.length === 0) return null;
    const value = parseInt(inputValue, 10);
    if (!Number.isFinite(value)) return null;
    const valueUSD = toUSD(value, country.currency);
    const rangeUSD = estimateWealthRange(valueUSD, country, incomeFactors, country.currency);
    // Convert back to local currency for display
    const rate = value / valueUSD; // local per USD
    return {
      low: Math.round(rangeUSD.low * rate),
      mid: Math.round(rangeUSD.mid * rate),
      high: Math.round(rangeUSD.high * rate),
    };
  }, [mode, inputValue, country, incomeFactors]);

  const isRange = mode === "income" && percentileRange !== null;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mode toggle — Net Wealth first */}
      <div className="flex justify-center gap-1 mb-4">
        <ModeButton
          label={t.input.modeWealth}
          active={mode === "wealth"}
          onClick={() => handleModeSwitch("wealth")}
        />
        <ModeButton
          label={t.input.modeIncome}
          active={mode === "income"}
          onClick={() => handleModeSwitch("income")}
        />
      </div>

      <label
        htmlFor="wealth-input"
        className="block text-sm text-text-secondary mb-2 text-center"
      >
        {mode === "income"
          ? interpolate(t.input.incomeLabelTemplate, {
              currency: country.currency,
            })
          : interpolate(t.input.wealthLabelTemplate, {
              currency: country.currency,
            })}
      </label>
      <p className="text-text-muted text-[11px] text-center mb-2">
        {mode === "income" ? t.input.incomeHint : t.input.wealthHint}
      </p>

      <div className="relative">
        <input
          id="wealth-input"
          type="text"
          inputMode={mode === "wealth" ? "text" : "numeric"}
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

      {/* Optional age input */}
      {percentile !== null && hasAgeData(country.code) && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <label htmlFor="age-input" className="text-text-muted text-xs">
            {t.input.ageOptional}
          </label>
          <input
            id="age-input"
            type="text"
            inputMode="numeric"
            value={ageInput}
            onChange={(e) => setAgeInput(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
            placeholder={t.input.agePlaceholder}
            className="w-16 px-2 py-1 rounded-lg text-center text-sm tabular-nums bg-bg-card border border-border-subtle text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent-periwinkle/50 transition-colors"
          />
        </div>
      )}

      {/* Income refinement panel */}
      {mode === "income" && (
        <div ref={refinePanelRef}>
          {!refinePanelOpen && inputValue.length > 0 && inputValue !== "0" && (
            <button
              type="button"
              onClick={() => setRefinePanelOpen(true)}
              className="w-full text-center text-xs text-accent-periwinkle hover:text-accent-periwinkle/80 mt-2 mb-1 cursor-pointer transition-colors"
            >
              {t.input.knowYourAssets}
            </button>
          )}
          <IncomeRefinementPanel
            factors={incomeFactors}
            isOpen={refinePanelOpen}
            onToggle={() => setRefinePanelOpen((o) => !o)}
            onChange={updateFactor}
            currencyCode={country.currency}
          />
        </div>
      )}

      {/* Estimated wealth range */}
      {wealthRange !== null && (
        <p className="text-text-muted text-[11px] text-center mt-2 tabular-nums">
          {t.input.estimatedNetWealth}{" "}
          <span className="text-text-secondary font-medium">
            {formatCurrency(wealthRange.low, country.currency)}
          </span>
          <span className="mx-1">–</span>
          <span className="text-text-secondary font-medium">
            {formatCurrency(wealthRange.high, country.currency)}
          </span>
        </p>
      )}

      {/* Zero income message */}
      {zeroIncomeMessage && (
        <p className="text-text-muted text-sm text-center mt-4 animate-fade-in">
          {zeroIncomeMessage}
        </p>
      )}

      {/* Result */}
      {percentile !== null && (
        <div className="mt-4 text-center animate-fade-in">
          <p className="text-text-secondary text-sm">
            {mode === "income"
              ? interpolate(t.input.resultIncomeTemplate, {
                  country: country.name,
                })
              : interpolate(t.input.resultWealthTemplate, {
                  country: country.name,
                })}
          </p>

          {isRange && percentileRange ? (
            <PercentileRangeDisplay
              range={percentileRange}
              refinePanelOpen={refinePanelOpen}
            />
          ) : (
            <PercentilePreciseDisplay percentile={percentile} />
          )}

          {/* Age-adjusted result */}
          {ageResult && (
            <div className="mt-3 bg-accent-periwinkle/5 border border-accent-periwinkle/15 rounded-xl px-4 py-3 max-w-sm mx-auto">
              <p className="text-text-secondary text-xs mb-1">
                For your age group ({AGE_GROUP_LABELS[ageResult.ageGroup]}):
              </p>
              <p className="text-2xl font-bold tabular-nums">
                <span className={percentileColor(ageResult.ageAdjustedPercentile)}>
                  {ageResult.ageAdjustedPercentile.toFixed(1)}%
                </span>
              </p>
              <p className="text-text-muted text-[10px] mt-1">
                {ageResult.ageAdjustedPercentile > ageResult.overallPercentile
                  ? `You're doing better among your age peers than overall (${ageResult.overallPercentile.toFixed(1)}%)`
                  : ageResult.ageAdjustedPercentile < ageResult.overallPercentile
                    ? `Your age group typically has more wealth — your overall rank (${ageResult.overallPercentile.toFixed(1)}%) is higher`
                    : "Your ranking is similar among your age peers"}
              </p>
            </div>
          )}

          {comedic && (
            <p className="text-text-muted text-sm mt-3 italic max-w-sm mx-auto">
              {comedic}
            </p>
          )}

          {/* Negative wealth context */}
          {mode === "wealth" && inputValue.startsWith("-") && (
            <p className="text-text-muted text-xs mt-2 max-w-sm mx-auto">
              Negative net wealth (debt exceeding assets) is common.
              In many countries, 10-20% of adults have negative net wealth.
              WID.world data includes these individuals in the bottom percentiles.
            </p>
          )}

          {percentile < 50 && !(mode === "wealth" && inputValue.startsWith("-")) && (
            <p className="text-text-muted text-xs mt-2">
              {interpolate(t.input.belowTheMedian, {
                amount: formatCurrency(
                  fromUSD(country.medianWealthPerAdult, country.currency),
                  country.currency,
                ),
              })}
            </p>
          )}
          {percentile >= 99 && (
            <p className="text-accent-amber/80 text-xs mt-2">
              {t.input.inTheTop1}
            </p>
          )}

          <ShareButtons
            percentile={percentile}
            percentileRange={isRange ? percentileRange : null}
            countryName={country.name}
            countryCode={country.code}
            shareUrl={buildUrl({ mode, amount: inputValue, age: ageInput })}
          />

          {/* Cross-link to How Long page */}
          {(() => {
            const richest = RICHEST_BY_COUNTRY[country.code];
            if (!richest || country.code === "GLOBAL") return null;

            // Estimate annual income in local currency for the link
            const incomeForLink = mode === "income" && inputValue
              ? inputValue
              : null;

            const howLongPath = `/how-long/${country.code.toLowerCase()}`;
            const compareUrl = incomeForLink
              ? `${localePath(locale, howLongPath)}?income=${incomeForLink}`
              : localePath(locale, howLongPath);

            // Calculate gap to top 1%
            const totalWealth = country.meanWealthPerAdult * country.population * 1_000_000;
            const adults = country.population * 1_000_000;
            const avgTop1Wealth = (totalWealth * country.wealthShares.top1 / 100) / (adults * 0.01);
            const avgTop1Local = fromUSD(avgTop1Wealth, country.currency);

            return (
              <div className="mt-5 pt-4 border-t border-border-subtle/50 max-w-sm mx-auto">
                <p className="text-text-muted text-xs mb-1">
                  {interpolate(t.home.avgTop1WealthTemplate, {
                    amount: formatCurrency(avgTop1Local, country.currency),
                  })}
                </p>
                <p className="text-text-muted text-xs mb-3">
                  {interpolate(t.home.richestInCountryTemplate, {
                    country: country.name,
                    name: richest.name,
                    amount: formatCurrency(
                      fromUSD(richest.netWorth, country.currency),
                      country.currency,
                    ),
                  })}
                </p>
                <Link
                  href={compareUrl}
                  className="inline-block text-accent-periwinkle text-xs font-medium hover:underline"
                >
                  {t.home.seeMatchThemLink}
                </Link>
              </div>
            );
          })()}
        </div>
      )}

      <p className="text-text-muted text-xs text-center mt-3">
        {t.input.privacyNote}
        {mode === "income" && (
          <span className="block mt-1">{t.input.incomeConvertedNote}</span>
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
  const t = useDictionary();
  return (
    <>
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
      <p className="text-text-secondary text-sm mt-1">{t.input.ofThePopulation}</p>
      {!refinePanelOpen && (
        <p className="text-text-muted text-[11px] mt-1 sr-only" aria-hidden>
          {/* range narrowing hint left in legend below to avoid translation churn */}
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
  const t = useDictionary();
  return (
    <>
      <p className="text-5xl font-bold mt-1 tabular-nums">
        <span className={percentileColor(percentile)}>
          {percentile.toFixed(1)}%
        </span>
      </p>
      <p className="text-text-secondary text-sm mt-1">{t.input.ofThePopulation}</p>
    </>
  );
}

function ShareButtons({
  percentile,
  percentileRange,
  countryName,
  countryCode,
  shareUrl,
}: {
  readonly percentile: number;
  readonly percentileRange: PercentileRange | null;
  readonly countryName: string;
  readonly countryCode: string;
  readonly shareUrl: string;
}) {
  const [copyStatus, setCopyStatus] = useState<
    "idle" | "copied" | "failed"
  >("idle");
  // Whether the browser exposes the Web Share API. Resolved post-mount via
  // useSyncExternalStore so SSR and the first client render agree.
  const canNativeShare = useNativeShareSupported();
  const t = useDictionary();

  const pText = percentileRange
    ? `${percentileRange.low.toFixed(1)}–${percentileRange.high.toFixed(1)}%`
    : `${percentile.toFixed(1)}%`;
  const shareText = interpolate(t.share.shareTextTemplate, {
    percentile: pText,
    country: countryName,
  });
  // Prefer the live, state-encoded URL passed by the parent. Fall back to a
  // bare country URL when the caller didn't have an origin available (SSR).
  const url =
    shareUrl ||
    (countryCode === "GLOBAL"
      ? "https://howpoorami.org"
      : `https://howpoorami.org/${countryCode.toLowerCase()}`);

  const handleCopy = useCallback(() => {
    const onSuccess = () => {
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    };
    const onFailure = () => {
      setCopyStatus("failed");
      setTimeout(() => setCopyStatus("idle"), 2000);
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(onSuccess).catch(onFailure);
    } else {
      onFailure();
    }
  }, [url]);

  const handleNativeShare = useCallback(async () => {
    if (typeof navigator === "undefined" || !("share" in navigator)) return;
    try {
      await navigator.share({
        title: t.meta.siteName,
        text: shareText,
        url,
      });
    } catch (error: unknown) {
      // Treat AbortError as a normal user cancellation. Fall back to copy
      // for any other failure (permission denied, unsupported MIME, etc.)
      if (error instanceof DOMException && error.name === "AbortError") return;
      handleCopy();
    }
  }, [shareText, url, handleCopy, t.meta.siteName]);

  const copyLabel =
    copyStatus === "copied"
      ? t.share.copied
      : copyStatus === "failed"
        ? t.share.copyFailed
        : t.share.copyLink;

  const btnClass =
    "px-2.5 py-1 rounded-lg text-[11px] font-medium min-h-[44px] min-w-[44px] bg-bg-card border border-border-subtle text-text-secondary hover:text-text-primary hover:border-accent-periwinkle/30 transition-all cursor-pointer";

  return (
    <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
      <span className="text-text-muted text-xs">{t.share.label}</span>
      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className={btnClass}
          aria-label={t.share.nativeShareAria}
          title={t.share.nativeShareAria}
        >
          {t.share.nativeShareButton}
        </button>
      )}
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
        aria-label={t.share.twitter}
      >
        {t.share.twitter}
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
        aria-label={t.share.whatsapp}
      >
        {t.share.whatsapp}
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className={`${btnClass} ${
          copyStatus === "copied"
            ? "!text-accent-sage !border-accent-sage/30"
            : copyStatus === "failed"
              ? "!text-accent-rose !border-accent-rose/30"
              : ""
        }`}
        aria-label={t.share.copyLink}
      >
        {copyLabel}
      </button>
    </div>
  );
}

// ─── Hooks ──────────────────────────────────────────────────────────────────

/** Hydration-safe detection of `navigator.share` support. */
function useNativeShareSupported(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => typeof navigator !== "undefined" && "share" in navigator,
    () => false,
  );
}
