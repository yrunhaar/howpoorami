import MapContent from "@/components/MapContent";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata = {
  title: "World map of wealth distribution",
  description:
    "Interactive choropleth showing the top 1% wealth share, median wealth, and mean wealth for every country with WID.world data. Click a country for the full breakdown.",
  alternates: { canonical: "https://howpoorami.org/map" },
  openGraph: {
    title: "World map of wealth distribution",
    description: "Choropleth: top 1% wealth share by country, sourced from WID.world.",
    url: "https://howpoorami.org/map",
  },
};

export default function MapPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[{ name: "Home", path: "/" }, { name: "Map", path: "/map" }]}
      />
      <MapContent />
    </>
  );
}
