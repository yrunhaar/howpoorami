import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCountrySeo, resolveCountryCode, SITE_URL } from "@/lib/seo";
import { RICHEST_BY_COUNTRY } from "@/data/billionaires";
import CompareClient from "@/components/CompareClient";

interface CompareCountryPageProps {
  readonly params: Promise<{ country: string }>;
}

export function generateStaticParams() {
  return getAllCountrySeo().map((c) => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: CompareCountryPageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const code = resolveCountryCode(slug);
  if (!code) return {};

  const { name } = await import("@/data/countries-extended").then((m) => m.ALL_COUNTRY_MAP[code]);
  const richest = RICHEST_BY_COUNTRY[code];
  const url = `${SITE_URL}/compare/${slug}`;

  const richestDesc = richest
    ? ` Compare your salary to ${richest.name} (${(richest.netWorth / 1e9).toFixed(1)}B).`
    : "";

  return {
    title: `How Long to Match the Richest in ${name}? — Billionaire Comparison`,
    description: `How many years would it take you to earn as much as the richest person in ${name}?${richestDesc} Enter your salary and find out.`,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `How Long to Match the Richest in ${name}?`,
      description: `Enter your income and see how many years it would take to match the wealthiest person in ${name}.${richestDesc}`,
      url,
      siteName: "How Poor Am I?",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `How Long to Match the Richest in ${name}?`,
      description: `Billionaire wealth comparison for ${name}. How many lifetimes would you need?`,
    },
  };
}

export default async function CompareCountryPage({ params }: CompareCountryPageProps) {
  const { country: slug } = await params;
  const code = resolveCountryCode(slug);
  if (!code) notFound();

  const { name } = await import("@/data/countries-extended").then((m) => m.ALL_COUNTRY_MAP[code]);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "How Long?",
        item: `${SITE_URL}/compare`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
        item: `${SITE_URL}/compare/${slug}`,
      },
    ],
  };

  return (
    <>
      <CompareClient initialCountry={code} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
