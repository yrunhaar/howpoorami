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
import ReportContent from "@/components/ReportContent";

interface LocaleReportPageProps {
  readonly params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ slug: locale }));
}

export async function generateMetadata({
  params,
}: LocaleReportPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isLocaleCode(slug) || slug === "en") return {};
  const locale = getLocale(slug);
  const t = getDictionary(locale.code);
  const url = `${SITE_URL}${localePath(locale.code, "/report")}`;

  return {
    title: t.meta.reportTitle,
    description: t.meta.reportDescription,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(SITE_URL, "/report"),
    },
    openGraph: {
      type: "website",
      title: t.meta.reportTitle,
      description: t.meta.reportDescription,
      siteName: t.meta.siteName,
      locale: locale.bcp47.replace("-", "_"),
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.reportTitle,
      description: t.meta.reportDescription,
    },
  };
}

export default async function LocaleReportPage({
  params,
}: LocaleReportPageProps) {
  const { slug } = await params;
  if (!isLocaleCode(slug) || slug === "en") notFound();
  return <ReportContent />;
}
