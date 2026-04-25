import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  NON_DEFAULT_LOCALES,
  getDictionary,
  getLocale,
  isLocaleCode,
} from "@/lib/i18n";
import { buildHreflangAlternates, localePath } from "@/lib/i18n/urls";
import { SITE_URL } from "@/lib/seo";
import CompareClient from "@/components/CompareClient";

interface LocaleComparePageProps {
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleComparePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocaleCode(localeParam)) return {};
  const locale = getLocale(localeParam);
  const t = getDictionary(locale.code);
  const url = `${SITE_URL}${localePath(locale.code, "/compare")}`;

  return {
    title: t.meta.compareTitle,
    description: t.meta.compareDescription,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(SITE_URL, "/compare"),
    },
    openGraph: {
      type: "website",
      title: t.meta.compareTitle,
      description: t.meta.compareDescription,
      siteName: t.meta.siteName,
      locale: locale.bcp47.replace("-", "_"),
      url,
    },
  };
}

export default async function LocaleComparePage({
  params,
}: LocaleComparePageProps) {
  const { locale: localeParam } = await params;
  if (!isLocaleCode(localeParam) || localeParam === "en") notFound();
  return (
    <Suspense>
      <CompareClient />
    </Suspense>
  );
}
