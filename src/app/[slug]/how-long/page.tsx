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
import { SITE_URL } from "@/lib/seo";
import CompareClient from "@/components/CompareClient";

interface LocaleHowLongPageProps {
  readonly params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ slug: locale }));
}

export async function generateMetadata({
  params,
}: LocaleHowLongPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isLocaleCode(slug) || slug === "en") return {};
  const locale = getLocale(slug);
  const t = getDictionary(locale.code);
  const url = `${SITE_URL}${localePath(locale.code, "/how-long")}`;

  return {
    title: t.meta.compareTitle,
    description: t.meta.compareDescription,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(SITE_URL, "/how-long"),
    },
    openGraph: {
      type: "website",
      title: t.meta.compareTitle,
      description: t.meta.compareDescription,
      siteName: t.meta.siteName,
      locale: locale.bcp47.replace("-", "_"),
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.compareTitle,
      description: t.meta.compareDescription,
    },
  };
}

export default async function LocaleHowLongPage({
  params,
}: LocaleHowLongPageProps) {
  const { slug } = await params;
  if (!isLocaleCode(slug) || slug === "en") notFound();
  // Locale prop forwarded; CompareClient uses LanguageProvider which derives
  // locale from the URL pathname.
  void (slug as LocaleCode);
  return (
    <Suspense>
      <CompareClient />
    </Suspense>
  );
}
