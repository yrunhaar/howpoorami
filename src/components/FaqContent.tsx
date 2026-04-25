import Link from "next/link";
import type { FaqContent as FaqContentData, FaqItem } from "@/lib/i18n/content/faq";
import type { LocaleCode } from "@/lib/i18n/locales";
import { localePath } from "@/lib/i18n/urls";

interface FaqContentProps {
  readonly content: FaqContentData;
  readonly locale: LocaleCode;
}

function buildFaqJsonLd(items: readonly FaqItem[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });
}

/**
 * Renders the FAQ page from a locale-specific content tree. Used by the
 * canonical `/faq` route and the localized `/lang/{locale}/faq` routes.
 *
 * The FAQPage JSON-LD is also localized so Google can render rich results
 * for non-English search queries.
 */
export default function FaqContent({ content, locale }: FaqContentProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildFaqJsonLd(content.items) }}
      />

      <main className="bg-bg-primary text-text-primary min-h-screen pt-20 pb-16 px-4">
        <article className="max-w-3xl mx-auto">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold mb-4">
            {content.h1}
          </h1>

          <p className="text-text-secondary text-lg leading-relaxed mb-10">
            {content.intro}
          </p>

          <div className="space-y-4">
            {content.items.map((item) => (
              <details
                key={item.question}
                className="group border border-text-secondary/20 rounded-lg"
              >
                <summary className="cursor-pointer select-none px-5 py-4 font-[family-name:var(--font-heading)] text-lg font-bold list-none flex items-center justify-between gap-4">
                  <span>{item.question}</span>
                  <span
                    className="shrink-0 text-text-secondary transition-transform duration-200 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-text-secondary leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>

          <nav className="flex gap-6 text-sm mt-12" aria-label="Related pages">
            <Link
              href={localePath(locale, "/")}
              className="text-accent-periwinkle hover:underline"
            >
              {content.relatedNav.backToCalculator}
            </Link>
            <Link
              href={localePath(locale, "/about")}
              className="text-accent-periwinkle hover:underline"
            >
              {content.relatedNav.about}
            </Link>
            <Link
              href={localePath(locale, "/methodology")}
              className="text-accent-periwinkle hover:underline"
            >
              {content.relatedNav.methodology}
            </Link>
          </nav>
        </article>
      </main>
    </>
  );
}
