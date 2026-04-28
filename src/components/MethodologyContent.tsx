import Link from "next/link";
import TaxSourcesTable from "@/components/TaxSourcesTable";
import type { MethodologyContent as MethodologyContentData } from "@/lib/i18n/content/methodology";
import type { LocaleCode } from "@/lib/i18n/locales";
import { localePath } from "@/lib/i18n/urls";

interface MethodologyContentProps {
  readonly content: MethodologyContentData;
  readonly locale: LocaleCode;
}

/**
 * Renders the Methodology page from a locale-specific content tree. Used
 * by both the canonical `/methodology` route and `/lang/{locale}/methodology`.
 *
 * Inline emphasis is achieved by interpolating React nodes into template
 * strings. See `renderTemplate` for the format — `{key}` placeholders.
 */
export default function MethodologyContent({
  content,
  locale,
}: MethodologyContentProps) {
  const widLink = (
    <a
      href="https://wid.world"
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent-periwinkle hover:underline"
    >
      {content.wealthData.widLinkLabel}
    </a>
  );

  const forbesLink = (
    <a
      href="https://www.forbes.com/real-time-billionaires/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent-periwinkle hover:underline"
    >
      {content.billionaireComparison.forbesLinkLabel}
    </a>
  );

  const fetchScript = (
    <code className="text-text-primary text-sm bg-bg-card px-1.5 py-0.5 rounded">
      {content.dataFreshness.fetchScriptLabel}
    </code>
  );

  return (
    <main className="bg-bg-primary text-text-primary min-h-screen pt-20 pb-16 px-4">
      <article className="max-w-3xl mx-auto">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold mb-8">
          {content.h1}
        </h1>

        <p className="text-text-secondary text-lg leading-relaxed mb-10">
          {content.intro}
        </p>

        {/* Wealth Distribution Data */}
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            {content.wealthData.heading}
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            {renderTemplate(content.wealthData.bodyTemplate, { widLink })}
          </p>
          <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-2 ml-2">
            {content.wealthData.groups.map((group) => (
              <li key={group.bold}>
                <strong className="text-text-primary">{group.bold}</strong>{" "}
                — {group.description}
              </li>
            ))}
          </ul>
          <p className="text-text-secondary leading-relaxed mt-4">
            {content.wealthData.outro}
          </p>
        </section>

        {/* Income-to-Wealth Estimation */}
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            {content.incomeEstimation.heading}
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            {renderTemplate(content.incomeEstimation.bodyTemplate, {
              modelEmphasis: (
                <strong className="text-text-primary">
                  {content.incomeEstimation.modelEmphasis}
                </strong>
              ),
            })}
          </p>
          <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-1 ml-2">
            {content.incomeEstimation.factors.map((factor) => (
              <li key={factor}>{factor}</li>
            ))}
          </ul>
          <p className="text-text-secondary leading-relaxed mt-4">
            {renderTemplate(content.incomeEstimation.outroTemplate, {
              spreadHigh: (
                <strong className="text-text-primary">
                  {content.incomeEstimation.spreadHigh}
                </strong>
              ),
              spreadLow: (
                <strong className="text-text-primary">
                  {content.incomeEstimation.spreadLow}
                </strong>
              ),
            })}
          </p>
        </section>

        {/* Percentile Calculation */}
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            {content.percentileCalc.heading}
          </h2>
          <p className="text-text-secondary leading-relaxed">
            {renderTemplate(content.percentileCalc.bodyTemplate, {
              interpEmphasis: (
                <strong className="text-text-primary">
                  {content.percentileCalc.interpEmphasis}
                </strong>
              ),
            })}
          </p>
        </section>

        {/* Billionaire Comparison */}
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            {content.billionaireComparison.heading}
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            {renderTemplate(content.billionaireComparison.bodyOneTemplate, {
              forbesLink,
            })}
          </p>
          <p className="text-text-secondary leading-relaxed">
            {content.billionaireComparison.bodyTwo}
          </p>
        </section>

        {/* Tax Rate Data Sources */}
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            {content.taxData.heading}
          </h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            {content.taxData.body}
          </p>
          <TaxSourcesTable />
        </section>

        {/* Limitations */}
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            {content.limitations.heading}
          </h2>
          <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-2 ml-2">
            {content.limitations.items.map((item) => (
              <li key={item.bold}>
                <strong className="text-text-primary">{item.bold}</strong>{" "}
                — {item.description}
              </li>
            ))}
          </ul>
        </section>

        {/* Data Freshness */}
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            {content.dataFreshness.heading}
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            {renderTemplate(content.dataFreshness.bodyTemplate, { fetchScript })}
          </p>
          <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-1 ml-2 mb-4">
            {content.dataFreshness.sources.map((src) => (
              <li key={src.bold}>
                <strong className="text-text-primary">{src.bold}</strong>{" "}
                — {src.description}
              </li>
            ))}
          </ul>
          <p className="text-text-secondary leading-relaxed">
            {content.dataFreshness.outro}
          </p>
        </section>

        {/*
         * The Bookshop.org reading list card used to live here. It's now
         * promoted to the site-wide <SupportRail /> rendered in
         * `app/layout.tsx`, so every page shows it once above the footer.
         */}

        <nav className="flex gap-6 text-sm" aria-label="Related pages">
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
        </nav>
      </article>
    </main>
  );
}

function renderTemplate(
  template: string,
  vars: Readonly<Record<string, React.ReactNode>>,
): ReadonlyArray<React.ReactNode> {
  const segments: React.ReactNode[] = [];
  const regex = /\{(\w+)\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      segments.push(
        <span key={`s-${i++}`}>{template.slice(lastIndex, match.index)}</span>,
      );
    }
    const key = match[1];
    if (key in vars) {
      segments.push(<span key={`v-${i++}`}>{vars[key]}</span>);
    } else {
      segments.push(<span key={`u-${i++}`}>{`{${key}}`}</span>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < template.length) {
    segments.push(<span key={`s-${i++}`}>{template.slice(lastIndex)}</span>);
  }
  return segments;
}
