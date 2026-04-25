"use client";

import Link from "next/link";
import { useDictionary, useLanguage } from "@/components/LanguageProvider";
import { interpolate } from "@/lib/i18n/dictionary";
import { localePath } from "@/lib/i18n/urls";

/** Build date stamped at module evaluation time (static export). */
const BUILD_DATE = new Date().toISOString().split("T")[0];

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
        <nav
          aria-label="Footer navigation"
          className="flex items-center justify-center gap-4 text-sm text-text-muted"
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
        <p className="text-xs text-text-muted/60 mt-3">
          {interpolate(t.footer.buildDateTemplate, { date: BUILD_DATE })}
        </p>
      </div>
    </footer>
  );
}
