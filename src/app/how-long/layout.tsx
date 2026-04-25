import type { Metadata } from "next";
import { buildHreflangAlternates } from "@/lib/i18n/urls";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How Long Would It Take? — Compare Your Income to Billionaires",
  description:
    "Enter your salary and see how many years, lifetimes, or Roman Empires it would take to match the wealthiest person in your country. The answer will shock you.",
  keywords: [
    "billionaire comparison",
    "income comparison",
    "how long to be a billionaire",
    "wealth comparison calculator",
    "Elon Musk wealth",
    "billionaire wealth calculator",
    "income vs billionaire",
    "years to billionaire",
  ],
  openGraph: {
    title: "How Long Would It Take to Match a Billionaire?",
    description:
      "At your salary, it would take millions of years. Enter your income and see for yourself.",
  },
  alternates: {
    canonical: `${SITE_URL}/how-long`,
    languages: buildHreflangAlternates(SITE_URL, "/how-long"),
  },
};

export default function HowLongLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
