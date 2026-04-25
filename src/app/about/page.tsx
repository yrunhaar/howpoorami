import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { buildHreflangAlternates } from "@/lib/i18n/urls";
import { getAboutContent } from "@/lib/i18n/content/about";
import { SITE_URL } from "@/lib/seo";
import AboutContent from "@/components/AboutContent";

const t = getDictionary("en");

export const metadata: Metadata = {
  title: t.meta.aboutTitle,
  description: t.meta.aboutDescription,
  alternates: {
    canonical: `${SITE_URL}/about`,
    languages: buildHreflangAlternates(SITE_URL, "/about"),
  },
  openGraph: {
    title: t.meta.aboutTitle,
    description: t.meta.aboutDescription,
  },
};

export default function AboutPage() {
  return <AboutContent content={getAboutContent("en")} locale="en" />;
}
