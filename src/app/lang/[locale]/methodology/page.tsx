import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  NON_DEFAULT_LOCALES,
  getDictionary,
  getLocale,
  isLocaleCode,
} from "@/lib/i18n";
import { buildHreflangAlternates, localePath } from "@/lib/i18n/urls";
import { getMethodologyContent } from "@/lib/i18n/content/methodology";
import { SITE_URL } from "@/lib/seo";
import MethodologyContent from "@/components/MethodologyContent";

interface LocaleMethodologyPageProps {
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleMethodologyPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocaleCode(localeParam)) return {};
  const locale = getLocale(localeParam);
  const t = getDictionary(locale.code);
  const url = `${SITE_URL}${localePath(locale.code, "/methodology")}`;

  return {
    title: t.meta.methodologyTitle,
    description: t.meta.methodologyDescription,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(SITE_URL, "/methodology"),
    },
    openGraph: {
      type: "website",
      title: t.meta.methodologyTitle,
      description: t.meta.methodologyDescription,
      siteName: t.meta.siteName,
      locale: locale.bcp47.replace("-", "_"),
      url,
    },
  };
}

export default async function LocaleMethodologyPage({
  params,
}: LocaleMethodologyPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocaleCode(localeParam) || localeParam === "en") notFound();
  return (
    <MethodologyContent
      content={getMethodologyContent(localeParam)}
      locale={localeParam}
    />
  );
}
