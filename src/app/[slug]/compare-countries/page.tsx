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
import { SITE_URL } from "@/lib/seo";
import CrossCountryCompare from "@/components/CrossCountryCompare";

interface LocaleCompareCountriesPageProps {
  readonly params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ slug: locale }));
}

export async function generateMetadata({
  params,
}: LocaleCompareCountriesPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isLocaleCode(slug) || slug === "en") return {};
  const locale = getLocale(slug);
  const t = getDictionary(locale.code);
  const url = `${SITE_URL}${localePath(locale.code, "/compare-countries")}`;

  return {
    title: t.meta.compareCountriesTitle,
    description: t.meta.compareCountriesDescription,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(SITE_URL, "/compare-countries"),
    },
    openGraph: {
      type: "website",
      title: t.meta.compareCountriesTitle,
      description: t.meta.compareCountriesDescription,
      siteName: t.meta.siteName,
      locale: locale.bcp47.replace("-", "_"),
      url,
    },
  };
}

export default async function LocaleCompareCountriesPage({
  params,
}: LocaleCompareCountriesPageProps) {
  const { slug } = await params;
  if (!isLocaleCode(slug) || slug === "en") notFound();
  void (slug as LocaleCode);
  return <CrossCountryCompare />;
}
