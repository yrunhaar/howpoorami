"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DEFAULT_LOCALE,
  LOCALE_CODES,
  isLocaleCode,
  type LocaleCode,
} from "@/lib/i18n/locales";
import { getDictionary, type Dictionary } from "@/lib/i18n";
import { localePath, stripLocale } from "@/lib/i18n/urls";

const LANGUAGE_STORAGE_KEY = "howpoorami:locale";

interface LanguageContextValue {
  readonly locale: LocaleCode;
  readonly t: Dictionary;
  readonly setLocale: (next: LocaleCode) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  t: getDictionary(DEFAULT_LOCALE),
  setLocale: () => {},
});

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}

/** Convenience hook when only the dictionary is needed. */
export function useDictionary(): Dictionary {
  return useContext(LanguageContext).t;
}

interface LanguageProviderProps {
  readonly children: React.ReactNode;
}

/**
 * Resolves locale from the URL path on every render so the active language
 * always matches the URL — including after client-side navigation.
 *
 * `useSyncExternalStore` guarantees SSR and the first client render agree
 * (it returns DEFAULT_LOCALE on the server and the URL-derived locale on
 * the client).
 */
export function LanguageProvider({ children }: LanguageProviderProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Derive locale from pathname. Falls back to DEFAULT_LOCALE for "/" and
  // any non-/lang path. The pathname is itself reactive (Next.js updates it
  // on navigation), so we don't need a separate subscription.
  const pathLocale = useMemo<LocaleCode>(() => {
    if (!pathname) return DEFAULT_LOCALE;
    return stripLocale(pathname).locale;
  }, [pathname]);

  // Read the persisted preference once at mount via useSyncExternalStore so
  // SSR and first client render align.
  const persistedLocale = useSyncExternalStore(
    () => () => {},
    readPersistedLocale,
    getServerLocale,
  );

  // The active locale is the URL's locale. We only consult the persisted
  // value when at the root and no explicit URL locale exists.
  const locale: LocaleCode = pathLocale ?? persistedLocale ?? DEFAULT_LOCALE;
  const t = useMemo(() => getDictionary(locale), [locale]);

  const setLocale = useCallback(
    (next: LocaleCode) => {
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
      } catch {
        // Ignore storage failures — navigation will still work.
      }
      // Convert the current path to the equivalent path in the target locale.
      const { path: defaultPath } = stripLocale(pathname || "/");
      const target = localePath(next, defaultPath);
      router.push(target);
    },
    [pathname, router],
  );

  // Sync HTML `lang` attribute so screen readers and Google know the
  // document language. Done in an effect so it runs after commit and
  // doesn't trigger the React 19 immutability lint rule.
  useEffect(() => {
    const desiredLang = locale === "zh-cn" ? "zh-CN" : locale;
    if (document.documentElement.lang !== desiredLang) {
      document.documentElement.lang = desiredLang;
    }
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, t, setLocale }),
    [locale, t, setLocale],
  );

  return (
    <LanguageContext value={value}>{children}</LanguageContext>
  );
}

// ─── helpers (module-scoped to keep useSyncExternalStore stable) ────────────

function readPersistedLocale(): LocaleCode | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && isLocaleCode(stored)) return stored;
  } catch {
    // localStorage unavailable — fall through.
  }
  // Fallback to navigator.language if no preference stored.
  if (typeof navigator !== "undefined" && navigator.language) {
    const lower = navigator.language.toLowerCase();
    // Try exact match (e.g. "zh-cn"), then primary subtag (e.g. "zh-tw" -> "zh-cn" not safe; only "en", "es", etc.)
    if ((LOCALE_CODES as readonly string[]).includes(lower)) {
      return lower as LocaleCode;
    }
    const primary = lower.split("-")[0];
    if (
      (LOCALE_CODES as readonly string[]).includes(primary) &&
      primary !== "zh"
    ) {
      return primary as LocaleCode;
    }
    if (primary === "zh") return "zh-cn";
  }
  return null;
}

function getServerLocale(): LocaleCode | null {
  return null;
}
