import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  NON_DEFAULT_LOCALES,
  getDictionary,
  getLocale,
  isLocaleCode,
  type LocaleCode,
} from "@/lib/i18n";
import { buildHreflangAlternates, localePath } from "@/lib/i18n/urls";
import { interpolate } from "@/lib/i18n/dictionary";
import { localizedCountryName } from "@/lib/i18n/country-names";
import { getAllCountrySeo, resolveCountryCode, SITE_URL } from "@/lib/seo";
import HomeClient from "@/components/HomeClient";

interface LocaleCountryPageProps {
  readonly params: Promise<{ slug: string; child: string }>;
}

/**
 * Locale + country combination: `/{locale}/{country}` for non-default
 * locales (e.g. `/de/us`, `/zh-cn/jp`). Static-path siblings under
 * `[slug]` (about, faq, methodology, how-long, compare-countries) take
 * precedence; this catch-all handles country slugs only.
 */
export function generateStaticParams() {
  const countries = getAllCountrySeo();
  return NON_DEFAULT_LOCALES.flatMap((locale) =>
    countries.map((c) => ({ slug: locale, child: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: LocaleCountryPageProps): Promise<Metadata> {
  const { slug, child } = await params;
  if (!isLocaleCode(slug) || slug === "en") return {};
  const code = resolveCountryCode(child);
  if (!code) return {};

  const locale = getLocale(slug);
  const t = getDictionary(locale.code);
  const { name: englishName } = await import(
    "@/data/countries-extended"
  ).then((m) => m.ALL_COUNTRY_MAP[code]);
  const name = localizedCountryName(code, locale.code, englishName);
  const defaultPath = `/${child}`;
  const url = `${SITE_URL}${localePath(locale.code, defaultPath)}`;

  return {
    title: interpolate(t.meta.countryTitleTemplate, { country: name }),
    description: interpolate(t.meta.countryDescriptionTemplate, { country: name }),
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(SITE_URL, defaultPath),
    },
    openGraph: {
      type: "website",
      title: interpolate(t.meta.countryOgTitleTemplate, { country: name }),
      description: interpolate(t.meta.countryOgDescriptionTemplate, { country: name }),
      siteName: t.meta.siteName,
      locale: locale.bcp47.replace("-", "_"),
      url,
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: interpolate(t.meta.countryOgTitleTemplate, { country: name }),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: interpolate(t.meta.countryOgTitleTemplate, { country: name }),
      description: interpolate(t.meta.countryOgDescriptionTemplate, { country: name }),
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export default async function LocaleCountryPage({
  params,
}: LocaleCountryPageProps) {
  const { slug, child } = await params;
  if (!isLocaleCode(slug) || slug === "en") notFound();
  const code = resolveCountryCode(child);
  if (!code) notFound();
  return <HomeClient initialLocale={slug as LocaleCode} initialCountry={code} />;
}
