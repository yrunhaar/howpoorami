"use client";

import { useDictionary } from "@/components/LanguageProvider";

const KOFI_URL = "https://ko-fi.com/yrunhaar";
const BOOKSHOP_LIST_URL = "https://bookshop.org/lists/how-poor-am-i";

/**
 * Site-wide CTA rail rendered just above the footer on every page.
 *
 * Two cards side-by-side on desktop, stacked on mobile:
 *   - Ko-fi support card (amber accent)
 *   - Bookshop.org reading list (sage accent)
 *
 * Content is pulled from `t.cta.*` in the active locale's dictionary.
 * The rail is intentionally placed inside `layout.tsx` above `<Footer />`
 * so it appears once per page navigation regardless of which content
 * component owns the rest of the page.
 */
export default function SupportRail() {
  const t = useDictionary();

  return (
    <section
      className="border-t border-border-subtle bg-bg-secondary/30 px-4 sm:px-6 lg:px-8 py-12"
      aria-label="Support and further reading"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Ko-fi support card */}
        <div className="rounded-2xl border border-accent-amber/30 bg-accent-amber/8 p-6 sm:p-7 flex flex-col">
          <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold mb-3 text-text-primary">
            {t.cta.support.heading}
          </h2>
          <p className="text-text-secondary leading-relaxed text-sm sm:text-base mb-5 flex-1">
            {t.cta.support.body}
          </p>
          <div>
            <a
              href={KOFI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent-amber/20 hover:bg-accent-amber/30 text-accent-amber border border-accent-amber/40 px-5 py-2.5 text-sm font-semibold transition-colors duration-200"
            >
              <span aria-hidden="true">☕</span>
              <span>{t.cta.support.ctaLabel}</span>
            </a>
          </div>
        </div>

        {/* Bookshop.org reading list */}
        <div className="rounded-2xl border border-accent-sage/30 bg-accent-sage/8 p-6 sm:p-7 flex flex-col">
          <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold mb-3 text-text-primary">
            {t.cta.furtherReading.heading}
          </h2>
          <p className="text-text-secondary leading-relaxed text-sm sm:text-base mb-5 flex-1">
            {t.cta.furtherReading.body}
          </p>
          <div>
            <a
              href={BOOKSHOP_LIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent-sage/20 hover:bg-accent-sage/30 text-accent-sage border border-accent-sage/40 px-5 py-2.5 text-sm font-semibold transition-colors duration-200"
            >
              <span aria-hidden="true">📚</span>
              <span>{t.cta.furtherReading.ctaLabel}</span>
            </a>
            <p className="text-xs text-text-muted/80 mt-3 italic">
              {t.cta.furtherReading.disclosure}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
