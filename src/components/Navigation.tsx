"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { localePath, stripLocale } from "@/lib/i18n/urls";
import { isAllCountryCode } from "@/data/countries-extended";

/**
 * Home is "active" when the user is on the root or on a single-segment
 * country page (e.g. `/us`, `/de`, `/fr`). Not active for any other named
 * top-level page.
 */
function isHomePath(path: string): boolean {
  if (path === "/" || path === "") return true;
  const segments = path.split("/").filter(Boolean);
  if (segments.length !== 1) return false;
  return isAllCountryCode(segments[0].toUpperCase());
}

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { locale, t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const navItems = [
    { defaultPath: "/", label: t.nav.home },
    { defaultPath: "/how-long", label: t.nav.howLong },
    { defaultPath: "/compare-countries", label: t.nav.compareCountries },
    { defaultPath: "/report", label: t.nav.report },
  ];

  const stripped = stripLocale(pathname || "/").path;
  const isItemActive = (defaultPath: string) =>
    defaultPath === "/" ? isHomePath(stripped) : stripped.startsWith(defaultPath);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/85 backdrop-blur-xl border-b border-border-subtle"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between gap-2">
          <Link
            href={localePath(locale, "/")}
            className="font-[family-name:var(--font-heading)] text-sm sm:text-lg font-bold text-text-primary hover:text-accent-periwinkle transition-colors whitespace-nowrap shrink-0"
            onClick={() => setOpen(false)}
          >
            {t.nav.home}
          </Link>

          {/* Desktop: full inline nav + lang + theme */}
          <div className="hidden md:flex items-center gap-0.5 sm:gap-1">
            {navItems.map((item) => {
              const href = localePath(locale, item.defaultPath);
              const isActive = isItemActive(item.defaultPath);
              return (
                <Link
                  key={item.defaultPath}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-accent-periwinkle/15 text-accent-periwinkle"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <LanguageSwitcher />

            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} ariaLabel={t.nav.themeToggleAria} />
          </div>

          {/* Mobile: language + theme + hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} ariaLabel={t.nav.themeToggleAria} />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav-drawer"
              className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
            >
              {open ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-nav-drawer"
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <div
          className={`absolute left-0 right-0 top-12 bg-bg-primary border-b border-border-subtle shadow-xl transition-transform duration-200 ${
            open ? "translate-y-0" : "-translate-y-2"
          }`}
        >
          <div className="max-w-6xl mx-auto px-3 py-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const href = localePath(locale, item.defaultPath);
              const isActive = isItemActive(item.defaultPath);
              return (
                <Link
                  key={item.defaultPath}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? "bg-accent-periwinkle/15 text-accent-periwinkle"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

interface ThemeToggleProps {
  readonly theme: "light" | "dark";
  readonly toggleTheme: () => void;
  readonly ariaLabel: string;
}

function ThemeToggleButton({ theme, toggleTheme, ariaLabel }: ThemeToggleProps) {
  return (
    <button
      onClick={toggleTheme}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="ml-1 p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all duration-200"
    >
      {theme === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
