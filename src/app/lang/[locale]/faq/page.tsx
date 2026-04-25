import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  NON_DEFAULT_LOCALES,
  getDictionary,
  getLocale,
  isLocaleCode,
} from "@/lib/i18n";
import { buildHreflangAlternates, localePath } from "@/lib/i18n/urls";
import { getFaqContent } from "@/lib/i18n/content/faq";
import { SITE_URL } from "@/lib/seo";
import FaqContent from "@/components/FaqContent";

interface LocaleFaqPageProps {
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleFaqPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocaleCode(localeParam)) return {};
  const locale = getLocale(localeParam);
  const t = getDictionary(locale.code);
  const url = `${SITE_URL}${localePath(locale.code, "/faq")}`;

  return {
    title: t.meta.faqTitle,
    description: t.meta.faqDescription,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(SITE_URL, "/faq"),
    },
    openGraph: {
      type: "website",
      title: t.meta.faqTitle,
      description: t.meta.faqDescription,
      siteName: t.meta.siteName,
      locale: locale.bcp47.replace("-", "_"),
      url,
    },
  };
}

export default async function LocaleFaqPage({ params }: LocaleFaqPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocaleCode(localeParam) || localeParam === "en") notFound();
  return (
    <FaqContent content={getFaqContent(localeParam)} locale={localeParam} />
  );
}
