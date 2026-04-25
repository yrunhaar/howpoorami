import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCountrySeo, resolveCountryCode, SITE_URL } from "@/lib/seo";
import { buildHreflangAlternates } from "@/lib/i18n/urls";
import HomeClient from "@/components/HomeClient";

interface CountryPageProps {
  readonly params: Promise<{ country: string }>;
}

export function generateStaticParams() {
  return getAllCountrySeo().map((c) => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: CountryPageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const code = resolveCountryCode(slug);
  if (!code) return {};

  const { name } = await import("@/data/countries-extended").then((m) => m.ALL_COUNTRY_MAP[code]);
  const url = `${SITE_URL}/${slug}`;

  return {
    title: `How Poor Am I in ${name}? — Wealth Distribution & Inequality`,
    description: `See where you stand in ${name}'s wealth distribution. Compare your income and net worth to the top 1%, top 10%, and bottom 50%. Interactive charts with data from WID.world and OECD.`,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(SITE_URL, `/${slug}`),
    },
    openGraph: {
      type: "website",
      title: `How Poor Am I in ${name}?`,
      description: `Enter your income and discover where you really stand in ${name}'s wealth distribution. Interactive inequality data powered by WID.world.`,
      url,
      siteName: "How Poor Am I?",
      locale: "en_US",
      images: [{ url: "https://howpoorami.org/og-image.png", width: 1200, height: 630, alt: `Wealth distribution in ${name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `How Poor Am I in ${name}?`,
      description: `Wealth inequality visualized for ${name}. See where your income ranks.`,
      images: [{ url: "https://howpoorami.org/og-image.png", width: 1200, height: 630, alt: `Wealth distribution in ${name}` }],
    },
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
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
        name,
        item: `${SITE_URL}/${slug}`,
      },
    ],
  };

  return (
    <>
      <HomeClient initialCountry={code} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
