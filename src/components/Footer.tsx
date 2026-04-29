"use client";

import Link from "next/link";
import { useDictionary, useLanguage } from "@/components/LanguageProvider";
import { interpolate } from "@/lib/i18n/dictionary";
import { localePath } from "@/lib/i18n/urls";

/** Build date stamped at module evaluation time (static export). */
const BUILD_DATE = new Date().toISOString().split("T")[0];

const KOFI_URL = "https://ko-fi.com/yrunhaar";

export default function Footer() {
  const t = useDictionary();
  const { locale } = useLanguage();

  const footerLinks = [
    { defaultPath: "/about", label: t.footer.about },
    { defaultPath: "/faq", label: t.footer.faq },
    { defaultPath: "/methodology", label: t.footer.methodology },
  ];

  return (
    <footer className="border-t border-border-subtle px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-6xl mx-auto text-center">
        <SisterProjects />
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-text-muted"
        >
          {footerLinks.map((link, index) => (
            <span key={link.defaultPath} className="flex items-center gap-4">
              {index > 0 && (
                <span aria-hidden="true" className="text-border-subtle">
                  &middot;
                </span>
              )}
              <Link
                href={localePath(locale, link.defaultPath)}
                className="hover:text-accent-periwinkle transition-colors duration-200"
              >
                {link.label}
              </Link>
            </span>
          ))}
          <span aria-hidden="true" className="text-border-subtle">
            &middot;
          </span>
          <a
            href="https://github.com/yrunhaar/howpoorami"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-periwinkle transition-colors duration-200"
          >
            {t.footer.github}
          </a>
        </nav>

        {/* Subtle Ko-fi support link, deliberately set apart from the nav so
            it doesn't read as "yet another page". A coffee glyph is enough
            to hint at its purpose without shouting. */}
        <a
          href={KOFI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent-amber transition-colors duration-200"
        >
          <span aria-hidden="true">☕</span>
          <span>{t.footer.support}</span>
        </a>

        <p className="text-xs text-text-muted/60 mt-3">
          {interpolate(t.footer.buildDateTemplate, { date: BUILD_DATE })}
        </p>
      </div>
    </footer>
  );
}

/**
 * Cross-promotion strip linking the three sister apps in this family.
 * The current site is shown as the active pill; the other two are clickable.
 */
function SisterProjects() {
  const sites = [
    { id: "howpoorami", emoji: "💸", label: "howpoorami.org", url: "https://howpoorami.org" },
    { id: "howgreenami", emoji: "🌱", label: "howgreenami.org", url: "https://howgreenami.org" },
    { id: "howaffordable", emoji: "🏠", label: "howaffordable.org", url: "https://howaffordable.org" },
  ] as const;
  const current = "howpoorami";

  return (
    <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-xs">
      <span className="text-text-muted/70 mr-1">Sister projects:</span>
      {sites.map((s) => {
        const isCurrent = s.id === current;
        const className = isCurrent
          ? "inline-flex items-center gap-1 rounded-full border border-border-subtle bg-bg-card text-text-muted/70 px-3 py-1"
          : "inline-flex items-center gap-1 rounded-full border border-border-subtle bg-bg-card hover:border-accent-periwinkle/50 hover:text-accent-periwinkle text-text-secondary px-3 py-1 transition-colors";
        const inner = (
          <>
            <span aria-hidden="true">{s.emoji}</span>
            <span>{s.label}</span>
          </>
        );
        return isCurrent ? (
          <span key={s.id} className={className} aria-current="page">
            {inner}
          </span>
        ) : (
          <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className={className}>
            {inner}
          </a>
        );
      })}
    </div>
  );
}
