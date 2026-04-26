"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDictionary, useLanguage } from "@/components/LanguageProvider";
import { localizedCountryName } from "@/lib/i18n/country-names";
import type { Dictionary } from "@/lib/i18n/dictionary";
// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Country {
  readonly code: string;
  readonly name: string;
  readonly flag: string;
}

interface CountrySearchDropdownProps {
  readonly selected: string;
  readonly onSelect: (code: string) => void;
  readonly countries: readonly Country[];
}

// ---------------------------------------------------------------------------
// Region mapping & helpers
// ---------------------------------------------------------------------------

const REGION_MAP: Record<string, string> = {
  US: "Americas",
  CA: "Americas",
  BR: "Americas",
  MX: "Americas",
  CL: "Americas",
  GB: "Europe",
  FR: "Europe",
  DE: "Europe",
  NL: "Europe",
  SE: "Europe",
  NO: "Europe",
  DK: "Europe",
  FI: "Europe",
  CH: "Europe",
  IT: "Europe",
  ES: "Europe",
  PT: "Europe",
  AT: "Europe",
  BE: "Europe",
  IE: "Europe",
  PL: "Europe",
  CZ: "Europe",
  JP: "Asia-Pacific",
  KR: "Asia-Pacific",
  CN: "Asia-Pacific",
  IN: "Asia-Pacific",
  SG: "Asia-Pacific",
  AU: "Asia-Pacific",
  NZ: "Asia-Pacific",
  ZA: "Africa",
};

/** Internal region keys (NOT user-facing). The dropdown maps these to
 *  localized labels at render time via the dictionary. */
const REGION_ORDER = ["Global", "Americas", "Europe", "Asia-Pacific", "Africa"] as const;

function regionOf(code: string): string {
  if (code === "GLOBAL") return "Global";
  return REGION_MAP[code] ?? "Other";
}

function localizedRegionLabel(region: string, t: Dictionary): string {
  switch (region) {
    case "Global":
      return t.regions.global;
    case "Americas":
      return t.regions.americas;
    case "Europe":
      return t.regions.europe;
    case "Asia-Pacific":
      return t.regions.asiaPacific;
    case "Africa":
      return t.regions.africa;
    case "Other":
      return t.regions.other;
    default:
      return region;
  }
}

function groupByRegion(
  items: readonly Country[],
): { region: string; items: readonly Country[] }[] {
  const buckets = new Map<string, Country[]>();

  for (const country of items) {
    const region = regionOf(country.code);
    const bucket = buckets.get(region);
    if (bucket) {
      bucket.push(country);
    } else {
      buckets.set(region, [country]);
    }
  }

  const ordered: { region: string; items: readonly Country[] }[] = [];

  for (const region of REGION_ORDER) {
    const bucket = buckets.get(region);
    if (bucket && bucket.length > 0) {
      ordered.push({ region, items: bucket });
    }
  }

  // Anything not in the known regions goes into "Other"
  const other = buckets.get("Other");
  if (other && other.length > 0) {
    ordered.push({ region: "Other", items: other });
  }

  return ordered;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CountrySearchDropdown({
  selected,
  onSelect,
  countries,
}: CountrySearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const t = useDictionary();
  const { locale } = useLanguage();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);

  // Derived ------------------------------------------------------------------

  const selectedCountry = useMemo(
    () => countries.find((c) => c.code === selected) ?? null,
    [countries, selected],
  );

  const filtered = useMemo(() => {
    if (query.trim() === "") return [...countries];
    const lower = query.toLowerCase();
    return countries.filter((c) => {
      const localized = localizedCountryName(c.code, locale, c.name).toLowerCase();
      return (
        c.name.toLowerCase().includes(lower) ||
        c.code.toLowerCase().includes(lower) ||
        localized.includes(lower)
      );
    });
  }, [countries, query, locale]);

  const grouped = useMemo(() => groupByRegion(filtered), [filtered]);

  /** Flat list of items in display order (region-grouped). */
  const flatItems = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  const itemIndexMap = useMemo(
    () => new Map(flatItems.map((item, i) => [item, i])),
    [flatItems],
  );

  // Callbacks ----------------------------------------------------------------

  const open = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(true);
    setQuery("");
    setActiveIndex(-1);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(-1);
  }, []);

  const selectCountry = useCallback(
    (code: string) => {
      onSelect(code);
      close();
    },
    [onSelect, close],
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click-outside (checks both trigger container and portal dropdown) --------

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inTrigger = containerRef.current?.contains(target);
      const inDropdown = dropdownRef.current?.contains(target);
      if (!inTrigger && !inDropdown) {
        close();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  // Reposition dropdown on scroll / resize -----------------------------------

  useEffect(() => {
    if (!isOpen) return;

    function updatePosition() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    }

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // Focus input when opened ---------------------------------------------------

  useEffect(() => {
    if (isOpen) {
      // Small delay so the animation starts before focus forces layout
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [isOpen]);

  // Scroll active option into view -------------------------------------------

  useEffect(() => {
    if (activeIndex < 0 || !listboxRef.current) return;
    const active = listboxRef.current.querySelector(
      `[data-index="${activeIndex}"]`,
    );
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Keyboard -----------------------------------------------------------------

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < flatItems.length - 1 ? prev + 1 : 0,
          );
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : flatItems.length - 1,
          );
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < flatItems.length) {
            selectCountry(flatItems[activeIndex].code);
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          close();
          break;
        }
        case "Home": {
          e.preventDefault();
          setActiveIndex(0);
          break;
        }
        case "End": {
          e.preventDefault();
          setActiveIndex(flatItems.length - 1);
          break;
        }
        default:
          break;
      }
    },
    [isOpen, flatItems, activeIndex, open, close, selectCountry],
  );

  // IDs for ARIA -------------------------------------------------------------

  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const activeOptionId =
    activeIndex >= 0 ? `country-option-${flatItems[activeIndex]?.code}` : undefined;

  // Render -------------------------------------------------------------------

  return (
    <div ref={containerRef} className="relative w-full max-w-xs mx-auto">
      {/* Trigger / input */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-owns={listboxId}
        aria-controls={listboxId}
        className={`
          flex items-center gap-2 w-full rounded-xl border
          bg-bg-card border-border-subtle
          transition-colors duration-200
          ${isOpen ? "ring-2 ring-accent-periwinkle/40" : ""}
        `}
      >
        {isOpen ? (
          <input
            ref={inputRef}
            type="text"
            role="searchbox"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            placeholder={t.dropdown.searchCountriesPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            className="
              w-full bg-transparent px-4 py-2.5 text-sm
              text-text-primary placeholder:text-text-muted
              outline-none
            "
          />
        ) : (
          <button
            type="button"
            onClick={open}
            onKeyDown={handleKeyDown}
            className="
              flex items-center gap-2 w-full px-4 py-2.5
              text-sm text-text-primary cursor-pointer
              outline-none focus-visible:ring-2 focus-visible:ring-accent-periwinkle/40
              rounded-xl
            "
          >
            {selectedCountry ? (
              <>
                <span className="text-lg">{selectedCountry.flag}</span>
                <span className="font-medium">
                  {localizedCountryName(
                    selectedCountry.code,
                    locale,
                    selectedCountry.name,
                  )}
                </span>
              </>
            ) : (
              <span className="text-text-muted">{t.dropdown.selectCountry}</span>
            )}
            <ChevronDown className="ml-auto" />
          </button>
        )}
      </div>

      {/* Dropdown — rendered as portal to escape stacking contexts */}
      {typeof document !== "undefined" && createPortal(
          isOpen && dropdownPos ? (
            <div
              ref={dropdownRef}
              style={{
                position: "absolute",
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
              }}
              className="
                z-[9999]
                rounded-xl border border-border-subtle bg-bg-card
                shadow-lg shadow-black/20
                overflow-hidden
                animate-dropdown-in
              "
            >
              <ul
                ref={listboxRef}
                id={listboxId}
                role="listbox"
                aria-label={t.dropdown.countriesAriaLabel}
                className="max-h-64 overflow-y-auto py-1"
              >
                {grouped.length === 0 && (
                  <li className="px-4 py-3 text-sm text-text-muted text-center">
                    {t.compareCountries.noCountriesFound}
                  </li>
                )}
                {grouped.map((group) => {
                  const regionLabel = localizedRegionLabel(group.region, t);
                  return (
                  <li key={group.region} role="presentation">
                    <span
                      className="
                        block px-4 pt-3 pb-1 text-xs font-semibold uppercase
                        tracking-wider text-text-muted select-none
                      "
                      role="presentation"
                    >
                      {regionLabel}
                    </span>
                    <ul role="group" aria-label={regionLabel}>
                      {group.items.map((country) => {
                        const idx = itemIndexMap.get(country) ?? -1;
                        const isActive = idx === activeIndex;
                        const isSelected = country.code === selected;

                        return (
                          <li
                            key={country.code}
                            id={`country-option-${country.code}`}
                            role="option"
                            data-index={idx}
                            aria-selected={isSelected}
                            className={`
                              flex items-center gap-3 px-4 py-2 text-sm cursor-pointer
                              transition-colors duration-100
                              ${isActive ? "bg-accent-periwinkle/15 text-accent-periwinkle" : ""}
                              ${isSelected && !isActive ? "text-accent-periwinkle" : ""}
                              ${!isActive && !isSelected ? "text-text-secondary hover:bg-accent-periwinkle/10 hover:text-text-primary" : ""}
                            `}
                            onMouseEnter={() => setActiveIndex(idx)}
                            onMouseDown={(e) => {
                              // Prevent input blur before selection registers
                              e.preventDefault();
                            }}
                            onClick={() => selectCountry(country.code)}
                          >
                            <span className="text-lg leading-none">
                              {country.flag}
                            </span>
                            <span>
                              {localizedCountryName(country.code, locale, country.name)}
                            </span>
                            {isSelected && (
                              <CheckIcon className="ml-auto flex-shrink-0" />
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                  );
                })}
              </ul>
            </div>
          ) : null,
          document.body,
        )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline icons (no external dependency)
// ---------------------------------------------------------------------------

function ChevronDown({ className }: { readonly className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
