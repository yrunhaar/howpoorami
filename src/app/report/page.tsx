import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { buildHreflangAlternates } from "@/lib/i18n/urls";
import { SITE_URL } from "@/lib/seo";
import ReportContent from "@/components/ReportContent";

const t = getDictionary("en");

export const metadata: Metadata = {
  title: t.meta.reportTitle,
  description: t.meta.reportDescription,
  alternates: {
    canonical: `${SITE_URL}/report`,
    languages: buildHreflangAlternates(SITE_URL, "/report"),
  },
  openGraph: {
    type: "website",
    title: t.meta.reportTitle,
    description: t.meta.reportDescription,
    url: `${SITE_URL}/report`,
  },
  twitter: {
    card: "summary_large_image",
    title: t.meta.reportTitle,
    description: t.meta.reportDescription,
  },
};

export default function ReportPage() {
  return <ReportContent />;
}
