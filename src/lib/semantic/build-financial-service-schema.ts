import { siteUrl } from "@/config/site";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { buildLocalizedUrl } from "@/lib/seo/sitemap-manifest";
import { isSupportedLocale, type SupportedLocale } from "@/lib/i18n/locale-routing";

export function buildFinancialServiceSchema(locale: string): JsonLdRecord {
  const normalizedLocale: SupportedLocale = isSupportedLocale(locale) ? locale : "en";
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "SectorCalc Decision Tools",
    url: buildLocalizedUrl("/premium-tools", normalizedLocale, siteUrl),
    description:
      "Sector-specific calculators and decision-support analyzers for pricing, margin, operations, and loss exposure.",
    areaServed: "Worldwide",
    provider: {
      "@id": `${siteUrl}/#organization`,
    },
  }) as JsonLdRecord;
}
