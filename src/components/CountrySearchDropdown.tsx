"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

const REGION_ORDER = ["Americas", "Europe", "Asia-Pacific", "Africa"] as const;

function regionOf(code: string): string {
  return REGION_MAP[code] ?? "Other";
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
// Animation variants
// ---------------------------------------------------------------------------

const dropdownVariants = {
  closed: { opacity: 0, scaleY: 0.95, y: -4 },
  open: { opacity: 1, scaleY: 1, y: 0 },
};

const dropdownTransition = { duration: 0.18, ease: [0.4, 0, 0.2, 1] as const };

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

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Derived ------------------------------------------------------------------

  const selectedCountry = useMemo(
    () => countries.find((c) => c.code === selected) ?? null,
    [countries, selected],
  );

  const filtered = useMemo(() => {
    if (query.trim() === "") return [...countries];
    const lower = query.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.code.toLowerCase().includes(lower),
    );
  }, [countries, query]);

  /** Flat list of items in display order (region-grouped). */
  const flatItems = useMemo(() => {
    const groups = groupByRegion(filtered);
    return groups.flatMap((g) => g.items);
  }, [filtered]);

  const grouped = useMemo(() => groupByRegion(filtered), [filtered]);

  // Callbacks ----------------------------------------------------------------

  const open = useCallback(() => {
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

  // Click-outside ------------------------------------------------------------

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

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

  const listboxId = "country-search-listbox";
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
            placeholder="Search countries..."
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
                <span className="font-medium">{selectedCountry.name}</span>
              </>
            ) : (
              <span className="text-text-muted">Select a country</span>
            )}
            <ChevronDown className="ml-auto" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={dropdownVariants}
            transition={dropdownTransition}
            style={{ originY: 0 }}
            className="
              absolute z-50 mt-2 w-full
              rounded-xl border border-border-subtle bg-bg-card
              shadow-lg shadow-black/20
              overflow-hidden
            "
          >
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-label="Countries"
              className="max-h-64 overflow-y-auto py-1"
            >
              {grouped.length === 0 && (
                <li className="px-4 py-3 text-sm text-text-muted text-center">
                  No countries found
                </li>
              )}
              {grouped.map((group) => (
                <li key={group.region} role="presentation">
                  <span
                    className="
                      block px-4 pt-3 pb-1 text-xs font-semibold uppercase
                      tracking-wider text-text-muted select-none
                    "
                    role="presentation"
                  >
                    {group.region}
                  </span>
                  <ul role="group" aria-label={group.region}>
                    {group.items.map((country) => {
                      const idx = flatItems.indexOf(country);
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
                          <span>{country.name}</span>
                          {isSelected && (
                            <CheckIcon className="ml-auto flex-shrink-0" />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
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
