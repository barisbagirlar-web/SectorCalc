import { SITE } from "@/config/site";
import { buildLocalizedUrl } from "@/lib/infrastructure/seo/sitemap-manifest";
import { resolveSmartModuleLabel } from "@/lib/os/registry/smart-modules";
import type { SectorEntry } from "@/lib/os/registry/sectors";

export interface SchemaMeshProps {
  sector: SectorEntry;
  sectorKey: string;
  locale?: string;
  priceUsd?: string;
}

export function SchemaMesh({ sector, sectorKey, locale = "en", priceUsd = "19" }: SchemaMeshProps) {
  const pageUrl = buildLocalizedUrl(
    `/audit/${sectorKey}`,
    "en",
    SITE.url,
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `SectorCalc — ${sector.name}`,
    url: pageUrl,
    applicationCategory: "IndustrialIntelligence",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: priceUsd,
      priceCurrency: "USD",
    },
    description: `Professional operational audit and intelligence for ${sector.name}.`,
    provider: {
      "@type": "Organization",
      name: "SectorCalc OS",
      url: SITE.url,
    },
    isPartOf: {
      "@type": "WebApplication",
      name: SITE.siteName,
      url: SITE.url,
    },
    hasPart: sector.features.map((featureId) => {
      const label = resolveSmartModuleLabel(featureId);
      return {
        "@type": "WebApplication",
        name: label,
        description: `Advanced ${label} module for ${sector.name}`,
        applicationCategory: "IndustrialIntelligenceModule",
      };
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
