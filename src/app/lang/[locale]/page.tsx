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
import HomeClient from "@/components/HomeClient";

interface LocaleHomePageProps {
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleHomePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocaleCode(localeParam)) return {};
  const locale = getLocale(localeParam);
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

export default async function LocaleHomePage({ params }: LocaleHomePageProps) {
  const { locale: localeParam } = await params;
  if (!isLocaleCode(localeParam) || localeParam === "en") notFound();
  return <HomeClient initialLocale={localeParam} />;
}
