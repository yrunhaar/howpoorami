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
import { getAboutContent } from "@/lib/i18n/content/about";
import { SITE_URL } from "@/lib/seo";
import AboutContent from "@/components/AboutContent";

interface LocaleAboutPageProps {
  readonly params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ slug: locale }));
}

export async function generateMetadata({
  params,
}: LocaleAboutPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isLocaleCode(slug) || slug === "en") return {};
  const locale = getLocale(slug);
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
    twitter: {
      card: "summary_large_image",
      title: t.meta.aboutTitle,
      description: t.meta.aboutDescription,
    },
  };
}

export default async function LocaleAboutPage({ params }: LocaleAboutPageProps) {
  const { slug } = await params;
  if (!isLocaleCode(slug) || slug === "en") notFound();
  return (
    <AboutContent content={getAboutContent(slug)} locale={slug as LocaleCode} />
  );
}
