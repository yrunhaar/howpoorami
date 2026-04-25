import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  NON_DEFAULT_LOCALES,
  getDictionary,
  getLocale,
  isLocaleCode,
} from "@/lib/i18n";
import { buildHreflangAlternates, localePath } from "@/lib/i18n/urls";
import { getAboutContent } from "@/lib/i18n/content/about";
import { SITE_URL } from "@/lib/seo";
import AboutContent from "@/components/AboutContent";

interface LocaleAboutPageProps {
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleAboutPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocaleCode(localeParam)) return {};
  const locale = getLocale(localeParam);
  const t = getDictionary(locale.code);
  const url = `${SITE_URL}${localePath(locale.code, "/about")}`;

  return {
    title: t.meta.aboutTitle,
    description: t.meta.aboutDescription,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(SITE_URL, "/about"),
    },
    openGraph: {
      type: "website",
      title: t.meta.aboutTitle,
      description: t.meta.aboutDescription,
      siteName: t.meta.siteName,
      locale: locale.bcp47.replace("-", "_"),
      url,
    },
  };
}

export default async function LocaleAboutPage({
  params,
}: LocaleAboutPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocaleCode(localeParam) || localeParam === "en") notFound();
  return (
    <AboutContent
      content={getAboutContent(localeParam)}
      locale={localeParam}
    />
  );
}
