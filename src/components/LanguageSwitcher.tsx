"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { LOCALES, LOCALE_CODES, type LocaleCode } from "@/lib/i18n/locales";

/**
 * Compact language switcher rendered next to the theme toggle in the nav bar.
 * Click → dropdown with native names; selecting a locale navigates to the
 * equivalent URL in that locale.
 */
export default function LanguageSwitcher() {
  const { locale, t, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click-outside / Escape to close
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const current = LOCALES[locale];

  const handleSelect = (next: LocaleCode) => {
    setOpen(false);
    if (next !== locale) setLocale(next);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t.nav.languageSwitchAria}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={t.nav.languageSwitchAria}
        className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all duration-200 cursor-pointer"
      >
        {current.code === "zh-cn" ? "中" : current.code.toUpperCase()}
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.nav.languageSwitchAria}
          className="absolute right-0 top-full mt-1 w-40 bg-bg-secondary border border-border-subtle rounded-xl shadow-lg overflow-hidden z-50"
        >
          {LOCALE_CODES.map((code) => {
            const info = LOCALES[code];
            const active = code === locale;
            return (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => handleSelect(code)}
                  lang={info.bcp47}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                    active
                      ? "bg-accent-periwinkle/10 text-accent-periwinkle"
                      : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
                  }`}
                >
                  <span className="font-medium">{info.nativeName}</span>
                  <span className="text-text-muted text-[10px] uppercase">
                    {info.code}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
