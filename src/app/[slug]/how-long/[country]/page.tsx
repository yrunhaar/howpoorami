import { Suspense } from "react";
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
import { RICHEST_BY_COUNTRY } from "@/data/billionaires";
import CompareClient from "@/components/CompareClient";

interface LocaleHowLongCountryPageProps {
  readonly params: Promise<{ slug: string; country: string }>;
}

export function generateStaticParams() {
  const countries = getAllCountrySeo();
  return NON_DEFAULT_LOCALES.flatMap((locale) =>
    countries.map((c) => ({ slug: locale, country: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: LocaleHowLongCountryPageProps): Promise<Metadata> {
  const { slug, country: countrySlug } = await params;
  if (!isLocaleCode(slug) || slug === "en") return {};
  const code = resolveCountryCode(countrySlug);
  if (!code) return {};

  const locale = getLocale(slug);
  const t = getDictionary(locale.code);
  const { name: englishName } = await import(
    "@/data/countries-extended"
  ).then((m) => m.ALL_COUNTRY_MAP[code]);
  const name = localizedCountryName(code, locale.code, englishName);
  const richest = RICHEST_BY_COUNTRY[code];
  const richestSuffix = richest
    ? ` (${richest.name}, ${(richest.netWorth / 1e9).toFixed(1)}B USD)`
    : "";
  const defaultPath = `/how-long/${countrySlug}`;
  const url = `${SITE_URL}${localePath(locale.code, defaultPath)}`;

  return {
    title: interpolate(t.meta.compareCountryTitleTemplate, { country: name }),
    description: interpolate(t.meta.compareCountryDescriptionTemplate, {
      country: name,
      richestSuffix,
    }),
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(SITE_URL, defaultPath),
    },
    openGraph: {
      type: "website",
      title: interpolate(t.meta.compareCountryTitleTemplate, { country: name }),
      description: interpolate(t.meta.compareCountryDescriptionTemplate, {
        country: name,
        richestSuffix,
      }),
      siteName: t.meta.siteName,
      locale: locale.bcp47.replace("-", "_"),
      url,
    },
  };
}

export default async function LocaleHowLongCountryPage({
  params,
}: LocaleHowLongCountryPageProps) {
  const { slug, country: countrySlug } = await params;
  if (!isLocaleCode(slug) || slug === "en") notFound();
  const code = resolveCountryCode(countrySlug);
  if (!code) notFound();
  void (slug as LocaleCode);
  return (
    <Suspense>
      <CompareClient initialCountry={code} />
    </Suspense>
  );
}
