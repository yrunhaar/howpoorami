import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  isLocaleCode,
  getDictionary,
  getLocale,
  NON_DEFAULT_LOCALES,
  type LocaleCode,
} from "@/lib/i18n";
import { buildHreflangAlternates, localePath } from "@/lib/i18n/urls";
import { getAllCountrySeo, resolveCountryCode, SITE_URL } from "@/lib/seo";
import HomeClient from "@/components/HomeClient";

interface SlugPageProps {
  readonly params: Promise<{ slug: string }>;
}

/**
 * Single dispatcher for every top-level dynamic segment. Resolves either to:
 *   - a non-default locale home (e.g. `/es`, `/de`, `/zh-cn`), or
 *   - an English country page (e.g. `/us`, `/gb`, `/nl`, `/jp`).
 *
 * For codes that overlap (de/fr/it/es/pt are both ISO country codes AND
 * locale codes), the locale interpretation wins. The English page for
 * those countries is reachable inside the dispatcher via the locale-prefixed
 * route (e.g. you visit `/us` for English US — but `/de` is German home;
 * Germany-as-English would only be linked via the locale prefix `/en/de`,
 * which we don't generate since English is at root).
 */
export function generateStaticParams() {
  // Country slugs at root: skip those that overlap with non-default locale codes.
  const localeSet = new Set<string>(NON_DEFAULT_LOCALES);
  const countrySlugs = getAllCountrySeo()
    .filter((c) => !localeSet.has(c.slug))
    .map((c) => ({ slug: c.slug }));

  // Locale slugs at root.
  const localeSlugs = NON_DEFAULT_LOCALES.map((l) => ({ slug: l }));

  return [...countrySlugs, ...localeSlugs];
}

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Locale precedence
  if (isLocaleCode(slug) && slug !== "en") {
    const locale = getLocale(slug);
    const t = getDictionary(locale.code);
    const url = `${SITE_URL}${localePath(locale.code, "/")}`;
    return {
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
      alternates: {
        canonical: url,
        languages: buildHreflangAlternates(SITE_URL, "/"),
      },
      openGraph: {
        type: "website",
        title: t.meta.homeOgTitle,
        description: t.meta.homeOgDescription,
        siteName: t.meta.siteName,
        locale: locale.bcp47.replace("-", "_"),
        url,
        images: [
          {
            url: `${SITE_URL}/og-image.png`,
            width: 1200,
            height: 630,
            alt: t.meta.homeOgTitle,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: t.meta.homeOgTitle,
        description: t.meta.homeOgDescription,
        images: [`${SITE_URL}/og-image.png`],
      },
    };
  }

  // Country page
  const code = resolveCountryCode(slug);
  if (!code) return {};
  const { name } = await import("@/data/countries-extended").then(
    (m) => m.ALL_COUNTRY_MAP[code],
  );
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
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `Wealth distribution in ${name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `How Poor Am I in ${name}?`,
      description: `Wealth inequality visualized for ${name}. See where your income ranks.`,
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `Wealth distribution in ${name}`,
        },
      ],
    },
  };
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;

  // Locale precedence
  if (isLocaleCode(slug) && slug !== "en") {
    return <HomeClient initialLocale={slug as LocaleCode} />;
  }

  // Country page
  const code = resolveCountryCode(slug);
  if (!code) notFound();

  const { name } = await import("@/data/countries-extended").then(
    (m) => m.ALL_COUNTRY_MAP[code],
  );

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
