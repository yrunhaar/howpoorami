import { notFound } from "next/navigation";
import MapContent from "@/components/MapContent";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { isLocaleCode, NON_DEFAULT_LOCALES } from "@/lib/i18n";
import { localePath } from "@/lib/i18n/urls";

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default async function LocaleMap({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isLocaleCode(slug)) notFound();
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: localePath(slug, "/") },
          { name: "Map", path: localePath(slug, "/map") },
        ]}
      />
      <MapContent />
    </>
  );
}
