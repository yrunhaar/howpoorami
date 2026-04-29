import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { buildHreflangAlternates } from "@/lib/i18n/urls";
import { getFaqContent } from "@/lib/i18n/content/faq";
import { SITE_URL } from "@/lib/seo";
import FaqContent from "@/components/FaqContent";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const t = getDictionary("en");

export const metadata: Metadata = {
  title: t.meta.faqTitle,
  description: t.meta.faqDescription,
  alternates: {
    canonical: `${SITE_URL}/faq`,
    languages: buildHreflangAlternates(SITE_URL, "/faq"),
  },
  openGraph: {
    title: t.meta.faqTitle,
    description: t.meta.faqDescription,
  },
};

export default function FaqPage() {
  return (
    <>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]} />
      <FaqContent content={getFaqContent("en")} locale="en" />
    </>
  );
}
