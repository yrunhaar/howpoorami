import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — How Poor Am I?",
  description:
    "Frequently asked questions about How Poor Am I? — data accuracy, methodology, privacy, and how wealth inequality is measured.",
  alternates: {
    canonical: "https://howpoorami.org/faq",
  },
  openGraph: {
    title: "FAQ — How Poor Am I?",
    description:
      "Frequently asked questions about How Poor Am I? — data accuracy, methodology, privacy, and how wealth inequality is measured.",
  },
};

interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "What is How Poor Am I?",
    answer:
      "How Poor Am I? is a free, open-source tool that shows where you stand in your country's wealth distribution. Enter your income or net wealth and instantly see your percentile, how your wealth compares to the national median, and how long it would take you to match the richest person in your country.",
  },
  {
    question: "How is my wealth percentile calculated?",
    answer:
      "Your percentile is calculated using piecewise linear interpolation on wealth distribution data from WID.world (World Inequality Database). The data provides wealth shares for specific percentile groups (bottom 50%, middle 40%, top 10%, top 1%, etc.), and we interpolate between these points to estimate where your net wealth falls within the distribution.",
  },
  {
    question: "What counts as net wealth?",
    answer:
      "Net wealth is your total assets minus your total debts. Assets include property, investments, savings, pensions, and any other valuables. Debts include mortgages, student loans, car loans, credit card debt, and any other liabilities. The resulting figure — positive or negative — is what determines your position in the wealth distribution.",
  },
  {
    question: "Is my data stored or sent anywhere?",
    answer:
      "No. Everything runs entirely in your browser. Your income, wealth, and personal details are never sent to any server. There are no cookies, no tracking scripts, and no analytics. The app works fully offline once loaded.",
  },
  {
    question: "How accurate is the income-to-wealth estimate?",
    answer:
      "It is an approximation. When you enter your income instead of net wealth directly, the tool uses up to 18 factors — including age, homeownership, savings rate, and debt — to estimate your likely net wealth. A range is shown to reflect the inherent uncertainty. For the most accurate result, enter your net wealth directly.",
  },
  {
    question: "Where does the data come from?",
    answer:
      "Wealth distribution data comes from WID.world (World Inequality Database), maintained by economists including Thomas Piketty. Economic indicators come from the OECD. Gini coefficients are sourced from the SWIID (Standardized World Income Inequality Database). Billionaire net worth figures come from the Forbes Real-Time Billionaires list.",
  },
  {
    question: "Why does the bottom 50% own so little?",
    answer:
      "Wealth is far more concentrated than income. The bottom 50% in most countries holds between 1% and 5% of total wealth. This happens because wealth accumulates over time through asset appreciation (property, stocks), inheritance, and compound returns — mechanisms that disproportionately benefit those who already have capital. Meanwhile, many people carry debts that offset or exceed their assets, leaving them with zero or negative net wealth.",
  },
  {
    question: "How is the billionaire comparison calculated?",
    answer:
      "It is a simple division: the billionaire's net worth divided by your annual income gives the number of years it would take you to earn the equivalent amount (before taxes, with no spending). The result is then expressed in relatable units — years, lifetimes, or historical eras — to make the scale of the gap tangible.",
  },
  {
    question: "Can wealth inequality be reduced?",
    answer:
      "Economists and policymakers have proposed a range of approaches, including progressive taxation on income and capital gains, inheritance and estate taxes, universal basic assets or savings programs, broader access to education and homeownership, and stronger labor protections. Each approach has trade-offs, and outcomes depend heavily on implementation. This tool does not advocate for any specific policy — it aims to make the data visible so people can form their own views.",
  },
  {
    question: "Is this financial advice?",
    answer:
      "No. How Poor Am I? is an educational tool designed to visualize wealth inequality data. It does not provide financial, tax, or investment advice. For personal financial decisions, consult a qualified financial advisor.",
  },
  {
    question: "How often is the data updated?",
    answer:
      "The data is bundled into the application at build time and updated periodically as new datasets become available from WID.world, OECD, SWIID, and Forbes. Because the underlying research databases are typically updated annually, the data reflects the most recent available year for each country.",
  },
  {
    question: "Is How Poor Am I? open source?",
    answer:
      "Yes. The entire codebase is open source under the MIT License. You can inspect the data processing pipeline, suggest improvements, report bugs, or run your own instance. The repository is available on GitHub at github.com/yrunhaar/howpoorami.",
  },
] as const;

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

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildFaqJsonLd(FAQ_ITEMS) }}
      />

      <main className="bg-bg-primary text-text-primary min-h-screen pt-20 pb-16 px-4">
        <article className="max-w-3xl mx-auto">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>

          <p className="text-text-secondary text-lg leading-relaxed mb-10">
            Everything you need to know about how the tool works, where the data
            comes from, and what it means.
          </p>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
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
            <Link href="/" className="text-accent-periwinkle hover:underline">
              Back to calculator
            </Link>
            <Link
              href="/about"
              className="text-accent-periwinkle hover:underline"
            >
              About
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
    </>
  );
}
