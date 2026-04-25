"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { localePath, stripLocale } from "@/lib/i18n/urls";

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { locale, t } = useLanguage();

  // Build locale-aware nav item URLs from the same default-locale paths.
  const navItems = [
    { defaultPath: "/", label: t.nav.home },
    { defaultPath: "/compare", label: t.nav.howLong },
    { defaultPath: "/compare-countries", label: t.nav.compareCountries },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border-subtle"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between gap-2">
        <Link
          href={localePath(locale, "/")}
          className="font-[family-name:var(--font-heading)] text-sm sm:text-lg font-bold text-text-primary hover:text-accent-periwinkle transition-colors whitespace-nowrap shrink-0"
        >
          {t.nav.home}
        </Link>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {navItems.map((item) => {
            const href = localePath(locale, item.defaultPath);
            const NON_COUNTRY_PATHS = ["/about", "/faq", "/methodology", "/compare"];
            const stripped = stripLocale(pathname || "/").path;
            const isActive =
              item.defaultPath === "/"
                ? stripped === "/" ||
                  !NON_COUNTRY_PATHS.some((p) => stripped.startsWith(p))
                : stripped.startsWith(item.defaultPath);
            return (
              <Link
                key={item.defaultPath}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`
                  px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${
                    isActive
                      ? "bg-accent-periwinkle/15 text-accent-periwinkle"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}

          <LanguageSwitcher />

          <button
            onClick={toggleTheme}
            aria-label={t.nav.themeToggleAria}
            title={t.nav.themeToggleAria}
            className="ml-1 sm:ml-2 p-1.5 sm:p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all duration-200"
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
        </div>
      </div>
    </nav>
  );
}
