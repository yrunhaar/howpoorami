import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — How Poor Am I?",
  description:
    "How Poor Am I is a free, open-source tool that visualizes global wealth inequality using data from WID.world, OECD, and SWIID.",
  alternates: {
    canonical: "https://howpoorami.org/about",
  },
  openGraph: {
    title: "About — How Poor Am I?",
    description:
      "How Poor Am I is a free, open-source tool that visualizes global wealth inequality using data from WID.world, OECD, and SWIID.",
  },
};

export default function AboutPage() {
  return (
    <main className="bg-bg-primary text-text-primary min-h-screen pt-20 pb-16 px-4">
      <article className="max-w-3xl mx-auto">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold mb-8">
          About How Poor Am I?
        </h1>

        <p className="text-text-secondary text-lg leading-relaxed mb-10">
          How Poor Am I? is a free tool that makes wealth inequality tangible.
          Instead of abstract Gini coefficients and quintile tables, it shows you
          exactly where you stand in your country&apos;s wealth distribution — and
          how long it would take you to match the fortune of a billionaire. The
          goal is simple: turn dry economic data into something you can feel.
        </p>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            The tool has two modes:
          </p>
          <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-2 ml-2">
            <li>
              <strong className="text-text-primary">Wealth Percentile</strong> —
              Enter your income, answer a few optional questions about your
              financial situation, and see which percentile you fall into within
              your country&apos;s wealth distribution.
            </li>
            <li>
              <strong className="text-text-primary">Billionaire Comparison</strong> —
              See how many years, lifetimes, or entire historical eras it would
              take to earn as much as the wealthiest person in your country.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            Data Sources
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            All calculations are grounded in peer-reviewed or institutionally
            maintained datasets:
          </p>
          <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-2 ml-2">
            <li>
              <a
                href="https://wid.world"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-periwinkle hover:underline"
              >
                WID.world
              </a>{" "}
              — Wealth shares by percentile group (Distributional National Accounts)
            </li>
            <li>
              <a
                href="https://data.oecd.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-periwinkle hover:underline"
              >
                OECD
              </a>{" "}
              — Economic indicators and household statistics
            </li>
            <li>
              <a
                href="https://fsolt.org/swiid/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-periwinkle hover:underline"
              >
                SWIID
              </a>{" "}
              — Standardized World Income Inequality Database (Gini coefficients)
            </li>
            <li>
              <a
                href="https://www.forbes.com/real-time-billionaires/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-periwinkle hover:underline"
              >
                Forbes
              </a>{" "}
              — Real-Time Billionaires list
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            Open Source
          </h2>
          <p className="text-text-secondary leading-relaxed">
            The entire codebase is open source under the{" "}
            <strong className="text-text-primary">MIT License</strong>. You can
            inspect the data processing, suggest improvements, or run your own
            instance. Find the repository on{" "}
            <a
              href="https://github.com/yrunhaar/howpoorami"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-periwinkle hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            Privacy
          </h2>
          <p className="text-text-secondary leading-relaxed">
            All computation happens entirely in your browser. Your income, wealth,
            and personal details are never sent to any server. There is no
            tracking, no analytics, and no cookies. The app works fully offline
            once loaded.
          </p>
        </section>

        <nav className="flex gap-6 text-sm" aria-label="Related pages">
          <Link href="/" className="text-accent-periwinkle hover:underline">
            Back to calculator
          </Link>
          <Link
            href="/methodology"
            className="text-accent-periwinkle hover:underline"
          >
            Methodology
          </Link>
        </nav>
      </article>
    </main>
  );
}
