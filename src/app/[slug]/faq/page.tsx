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
import { getFaqContent } from "@/lib/i18n/content/faq";
import { SITE_URL } from "@/lib/seo";
import FaqContent from "@/components/FaqContent";

interface LocaleFaqPageProps {
  readonly params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ slug: locale }));
}

export async function generateMetadata({
  params,
}: LocaleFaqPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isLocaleCode(slug) || slug === "en") return {};
  const locale = getLocale(slug);
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
  const { slug } = await params;
  if (!isLocaleCode(slug) || slug === "en") notFound();
  return (
    <FaqContent content={getFaqContent(slug)} locale={slug as LocaleCode} />
  );
}
