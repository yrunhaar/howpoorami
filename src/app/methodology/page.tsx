import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology — How Poor Am I?",
  description:
    "Technical methodology behind How Poor Am I? — data sources, wealth estimation model, percentile calculations, and limitations.",
  alternates: {
    canonical: "https://howpoorami.org/methodology",
  },
  openGraph: {
    title: "Methodology — How Poor Am I?",
    description:
      "Technical methodology behind How Poor Am I? — data sources, wealth estimation model, percentile calculations, and limitations.",
  },
};

export default function MethodologyPage() {
  return (
    <main className="bg-bg-primary text-text-primary min-h-screen pt-20 pb-16 px-4">
      <article className="max-w-3xl mx-auto">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold mb-8">
          Methodology
        </h1>

        <p className="text-text-secondary text-lg leading-relaxed mb-10">
          This page explains the data sources, models, and assumptions behind How
          Poor Am I?. The goal is full transparency — every number you see in the
          tool can be traced back to its source and calculation.
        </p>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            Wealth Distribution Data
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Wealth share data comes from the{" "}
            <a
              href="https://wid.world"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-periwinkle hover:underline"
            >
              World Inequality Database
            </a>{" "}
            (WID.world), which publishes Distributional National Accounts (DINA)
            for dozens of countries. These accounts split national wealth into
            groups:
          </p>
          <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-2 ml-2">
            <li>
              <strong className="text-text-primary">Bottom 50%</strong> — The
              lower half of the population by net wealth
            </li>
            <li>
              <strong className="text-text-primary">Middle 40%</strong> — The
              50th to 90th percentile, often called the &quot;middle class&quot;
            </li>
            <li>
              <strong className="text-text-primary">Top 10%</strong> — The
              wealthiest tenth, which in most countries holds 60-80% of total
              wealth
            </li>
            <li>
              <strong className="text-text-primary">Top 1%</strong> — A subset of
              the top 10%, typically holding 25-40% of total wealth
            </li>
          </ul>
          <p className="text-text-secondary leading-relaxed mt-4">
            These shares define the boundaries used to place you in the
            distribution. The more granular the boundary data for a country, the
            more precise the final percentile.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            Income-to-Wealth Estimation
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Most people know their income but not their net wealth. To bridge this
            gap, the tool uses an <strong className="text-text-primary">18-factor
            estimation model</strong> that adjusts the income-to-wealth ratio based
            on demographic and financial characteristics:
          </p>
          <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-1 ml-2">
            <li>Age brackets (younger people typically have lower wealth-to-income ratios)</li>
            <li>Education level (higher education correlates with higher lifetime earnings and savings)</li>
            <li>Employment type (self-employed vs. salaried, public vs. private)</li>
            <li>Savings rate and investment behavior</li>
            <li>Property ownership and mortgage status</li>
            <li>Outstanding debts (student loans, consumer debt)</li>
          </ul>
          <p className="text-text-secondary leading-relaxed mt-4">
            Each factor narrows the uncertainty range. With no factors provided, the
            model carries a spread of roughly <strong className="text-text-primary">
            ±70%</strong>. With all 18 factors answered, uncertainty drops to
            approximately <strong className="text-text-primary">±10%</strong>. The
            tool always shows you the confidence band alongside your estimated
            percentile.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            Percentile Calculation
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Once your estimated net wealth is computed, the tool places you in the
            distribution using <strong className="text-text-primary">piecewise
            linear interpolation</strong> between the known wealth share
            boundaries. For example, if the bottom 50% holds 5% of total wealth
            and the middle 40% holds 35%, your position between those boundaries is
            interpolated linearly based on your estimated share. This is an
            approximation — real distributions are not perfectly linear between
            boundary points — but it provides a reasonable estimate given the
            available data.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            Billionaire Comparison
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            The &quot;How Long Would It Take?&quot; mode uses the{" "}
            <a
              href="https://www.forbes.com/real-time-billionaires/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-periwinkle hover:underline"
            >
              Forbes Real-Time Billionaires
            </a>{" "}
            list to fetch the current net worth of the wealthiest individual in
            each country.
          </p>
          <p className="text-text-secondary leading-relaxed">
            The &quot;years to earn&quot; calculation is deliberately simple: it
            divides the billionaire&apos;s net worth by your annual income with no
            adjustments for interest, compound growth, taxes, or inflation. This is
            intentional — the point is not financial planning but to viscerally
            illustrate the scale of the gap. When the answer is &quot;4 million
            years,&quot; whether it accounts for a 7% return rate is beside the
            point.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            Limitations
          </h2>
          <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-2 ml-2">
            <li>
              <strong className="text-text-primary">Top-wealth underestimation</strong> —
              Survey-based wealth data systematically underestimates the holdings of
              the ultra-rich, who are underrepresented in household surveys. WID
              partially corrects for this using tax data, but gaps remain.
            </li>
            <li>
              <strong className="text-text-primary">Self-reported income bias</strong> —
              Users enter their own income, which may not reflect total compensation
              (bonuses, equity, unrealized gains).
            </li>
            <li>
              <strong className="text-text-primary">Country-specific caveats</strong> —
              Data quality varies by country. Some nations have detailed tax-based
              wealth data; others rely on survey estimates with wider margins.
            </li>
            <li>
              <strong className="text-text-primary">Model approximation</strong> —
              The 18-factor income-to-wealth model is a statistical approximation,
              not personalized financial advice. Individual circumstances can diverge
              significantly from population averages.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            Data Freshness
          </h2>
          <p className="text-text-secondary leading-relaxed">
            All data is bundled at build time and served statically — no external
            API calls are made when you use the tool. Datasets are updated
            periodically as new releases become available from WID.world, OECD,
            SWIID, and Forbes. The build date at the bottom of the page indicates
            when the data was last refreshed.
          </p>
        </section>

        <nav className="flex gap-6 text-sm" aria-label="Related pages">
          <Link href="/" className="text-accent-periwinkle hover:underline">
            Back to calculator
          </Link>
          <Link href="/about" className="text-accent-periwinkle hover:underline">
            About
          </Link>
        </nav>
      </article>
    </main>
  );
}
