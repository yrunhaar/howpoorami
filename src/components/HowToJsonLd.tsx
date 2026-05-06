import { SITE_URL } from "@/lib/seo";

interface Step {
  readonly name: string;
  readonly text: string;
}

interface Props {
  readonly name: string;
  readonly description: string;
  readonly steps: readonly Step[];
  readonly url?: string;
}

/**
 * HowTo JSON-LD for calculator landing pages. Eligible for SERP rich
 * results on "how to calculate ___" queries.
 */
export default function HowToJsonLd({ name, description, steps, url }: Props) {
  const json = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    totalTime: "PT3M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: 0 },
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
    ...(url ? { url: `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}` } : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
