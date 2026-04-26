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
import { getMethodologyContent } from "@/lib/i18n/content/methodology";
import { SITE_URL } from "@/lib/seo";
import MethodologyContent from "@/components/MethodologyContent";

interface LocaleMethodologyPageProps {
  readonly params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ slug: locale }));
}

export async function generateMetadata({
  params,
}: LocaleMethodologyPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isLocaleCode(slug) || slug === "en") return {};
  const locale = getLocale(slug);
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
    twitter: {
      card: "summary_large_image",
      title: t.meta.methodologyTitle,
      description: t.meta.methodologyDescription,
    },
  };
}

export default async function LocaleMethodologyPage({
  params,
}: LocaleMethodologyPageProps) {
  const { slug } = await params;
  if (!isLocaleCode(slug) || slug === "en") notFound();
  return (
    <MethodologyContent
      content={getMethodologyContent(slug)}
      locale={slug as LocaleCode}
    />
  );
}
