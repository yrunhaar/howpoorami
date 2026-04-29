import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { buildHreflangAlternates } from "@/lib/i18n/urls";
import { getMethodologyContent } from "@/lib/i18n/content/methodology";
import { SITE_URL } from "@/lib/seo";
import MethodologyContent from "@/components/MethodologyContent";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const t = getDictionary("en");

export const metadata: Metadata = {
  title: t.meta.methodologyTitle,
  description: t.meta.methodologyDescription,
  alternates: {
    canonical: `${SITE_URL}/methodology`,
    languages: buildHreflangAlternates(SITE_URL, "/methodology"),
  },
  openGraph: {
    title: t.meta.methodologyTitle,
    description: t.meta.methodologyDescription,
  },
};

export default function MethodologyPage() {
  return (
    <>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Methodology", path: "/methodology" }]} />
      (
    <MethodologyContent content={getMethodologyContent("en")} locale="en" />
  )
    </>
  );
}
