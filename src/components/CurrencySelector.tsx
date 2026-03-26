"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface CurrencyOption {
  readonly code: string;
  readonly label: string;
  readonly symbol: string;
}

const CURRENCIES: readonly CurrencyOption[] = [
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "\u20AC" },
  { code: "GBP", label: "British Pound", symbol: "\u00A3" },
  { code: "JPY", label: "Japanese Yen", symbol: "\u00A5" },
  { code: "CHF", label: "Swiss Franc", symbol: "CHF" },
  { code: "CAD", label: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$" },
  { code: "NZD", label: "New Zealand Dollar", symbol: "NZ$" },
  { code: "SEK", label: "Swedish Krona", symbol: "kr" },
  { code: "NOK", label: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", label: "Danish Krone", symbol: "kr" },
  { code: "CNY", label: "Chinese Yuan", symbol: "\u00A5" },
  { code: "KRW", label: "South Korean Won", symbol: "\u20A9" },
  { code: "INR", label: "Indian Rupee", symbol: "\u20B9" },
  { code: "BRL", label: "Brazilian Real", symbol: "R$" },
  { code: "MXN", label: "Mexican Peso", symbol: "MX$" },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$" },
  { code: "ZAR", label: "South African Rand", symbol: "R" },
  { code: "PLN", label: "Polish Zloty", symbol: "z\u0142" },
  { code: "CZK", label: "Czech Koruna", symbol: "K\u010D" },
  { code: "CLP", label: "Chilean Peso", symbol: "CL$" },
  { code: "HUF", label: "Hungarian Forint", symbol: "Ft" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CurrencySelectorProps {
  readonly selected: string;
  readonly onSelect: (code: string) => void;
}

const dropdownVariants = {
  closed: { opacity: 0, scaleY: 0.95, y: -4 },
  open: { opacity: 1, scaleY: 1, y: 0 },
};

const dropdownTransition = { duration: 0.18, ease: [0.4, 0, 0.2, 1] as const };

export default function CurrencySelector({ selected, onSelect }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCurrency = useMemo(
    () => CURRENCIES.find((c) => c.code === selected) ?? CURRENCIES[0],
    [selected],
  );

  const close = useCallback(() => setIsOpen(false), []);

  // Click-outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
          bg-accent-periwinkle/10 text-accent-periwinkle border border-accent-periwinkle/20
          hover:bg-accent-periwinkle/20 transition-colors duration-200 cursor-pointer
        "
      >
        <span className="tabular-nums">{selectedCurrency.symbol}</span>
        <span>{selectedCurrency.code}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

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
              absolute z-50 mt-1 right-0 w-56
              rounded-xl border border-border-subtle bg-bg-card
              shadow-lg shadow-black/20 overflow-hidden
            "
          >
            <ul className="max-h-52 overflow-y-auto py-1">
              {CURRENCIES.map((currency) => {
                const isSelected = currency.code === selected;
                return (
                  <li key={currency.code}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(currency.code);
                        close();
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-sm cursor-pointer
                        transition-colors duration-100
                        ${isSelected
                          ? "bg-accent-periwinkle/15 text-accent-periwinkle"
                          : "text-text-secondary hover:bg-accent-periwinkle/10 hover:text-text-primary"
                        }
                      `}
                    >
                      <span className="w-8 text-right tabular-nums font-medium shrink-0">
                        {currency.symbol}
                      </span>
                      <span className="flex-1 text-left">{currency.label}</span>
                      <span className="text-text-muted text-xs">{currency.code}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
