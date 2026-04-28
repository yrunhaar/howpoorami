import Link from "next/link";
import { interpolate } from "@/lib/i18n/dictionary";
import type { AboutContent as AboutContentData } from "@/lib/i18n/content/about";
import type { LocaleCode } from "@/lib/i18n/locales";
import { localePath } from "@/lib/i18n/urls";

interface AboutContentProps {
  readonly content: AboutContentData;
  readonly locale: LocaleCode;
}

const KOFI_URL = "https://ko-fi.com/yrunhaar";

/**
 * Renders the About page from a locale-specific content tree. The same
 * component is used by both the canonical `/about` route and the localized
 * `/lang/{locale}/about` routes.
 */
export default function AboutContent({ content, locale }: AboutContentProps) {
  const license = (
    <strong className="text-text-primary">{content.openSource.licenseLabel}</strong>
  );
  const github = (
    <a
      href="https://github.com/yrunhaar/howpoorami"
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent-periwinkle hover:underline"
    >
      {content.openSource.githubLabel}
    </a>
  );

  // Split the open-source body into segments around {license} and {github} so
  // we can interleave React nodes (the placeholders are not plain strings).
  const openSourceParts = renderTemplate(content.openSource.body, {
    license,
    github,
  });

  return (
    <main className="bg-bg-primary text-text-primary min-h-screen pt-20 pb-16 px-4">
      <article className="max-w-3xl mx-auto">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold mb-8">
          {content.h1}
        </h1>

        <p className="text-text-secondary text-lg leading-relaxed mb-10">
          {content.intro}
        </p>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            {content.howItWorks.heading}
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            {content.howItWorks.intro}
          </p>
          <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-2 ml-2">
            {content.howItWorks.modes.map((mode) => (
              <li key={mode.title}>
                <strong className="text-text-primary">{mode.title}</strong> —{" "}
                {mode.description}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            {content.dataSources.heading}
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            {content.dataSources.intro}
          </p>
          <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-2 ml-2">
            {content.dataSources.items.map((item) => (
              <li key={item.label}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-periwinkle hover:underline"
                >
                  {item.label}
                </a>{" "}
                — {item.description}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            {content.openSource.heading}
          </h2>
          <p className="text-text-secondary leading-relaxed">
            {openSourceParts.map((part, i) =>
              typeof part === "string" ? (
                <span key={i}>{part}</span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            {content.privacy.heading}
          </h2>
          <p className="text-text-secondary leading-relaxed">
            {content.privacy.body}
          </p>
        </section>

        {/* Ko-fi support callout — visually distinct from regular sections so
            it reads as a CTA. The amber accent matches the Ko-fi-ish warmth
            without using their brand red (which clashes with the site palette). */}
        <section className="mb-10">
          <div className="rounded-2xl border border-accent-amber/30 bg-accent-amber/8 p-6 sm:p-8">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-3">
              {content.support.heading}
            </h2>
            <p className="text-text-secondary leading-relaxed mb-5">
              {content.support.body}
            </p>
            <a
              href={KOFI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent-amber/20 hover:bg-accent-amber/30 text-accent-amber border border-accent-amber/40 px-5 py-2.5 text-sm font-semibold transition-colors duration-200"
            >
              <span aria-hidden="true">☕</span>
              <span>{content.support.ctaLabel}</span>
            </a>
          </div>
        </section>

        <nav className="flex gap-6 text-sm" aria-label="Related pages">
          <Link
            href={localePath(locale, "/")}
            className="text-accent-periwinkle hover:underline"
          >
            {content.relatedNav.backToCalculator}
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
  );
}

/**
 * Render a template string containing `{key}` placeholders into a list of
 * strings and React nodes. Unknown placeholders are left as literal `{key}`.
 *
 * Doing this here (rather than in `interpolate`) lets us keep `interpolate`
 * a pure string→string helper used by metadata while still rendering React
 * nodes inline in body copy.
 */
function renderTemplate(
  template: string,
  vars: Readonly<Record<string, React.ReactNode>>,
): ReadonlyArray<React.ReactNode> {
  const segments: React.ReactNode[] = [];
  const regex = /\{(\w+)\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      segments.push(template.slice(lastIndex, match.index));
    }
    const key = match[1];
    if (key in vars) {
      segments.push(vars[key]);
    } else {
      segments.push(`{${key}}`);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < template.length) segments.push(template.slice(lastIndex));
  return segments;
}

// Suppress unused-import warning when the helper isn't used in template
// interpolation paths (kept for symmetry with other content components).
void interpolate;
