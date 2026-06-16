import { ORGANIZATION_TRUST } from "@/config/organization-trust";
import { buildOrganizationJsonLd } from "@/lib/seo/schema-mesh";
import { buildPlatformFinancialServiceSchema } from "@/lib/semantic/build-financial-service-schema";
import { buildHomeSoftwareApplicationSchema } from "@/lib/semantic/build-software-application-schema";
import { absoluteLocalizedUrl, absoluteUrl, SITE_URL } from "@/lib/semantic/site-url";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";

export function buildWebsiteSchema(locale: string): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "SectorCalc",
    url: absoluteLocalizedUrl(locale, "/"),
    description:
      locale === "tr"
        ? ORGANIZATION_TRUST.description.tr
        : ORGANIZATION_TRUST.description.en,
    inLanguage: locale,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    sameAs: ORGANIZATION_TRUST.sameAs,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteLocalizedUrl(locale, "/free-tools?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  }) as JsonLdRecord;
}

export function buildHomeOfferCatalogSchema(locale: string): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "SectorCalc calculator catalog",
    url: absoluteLocalizedUrl(locale, "/calculator-library"),
    itemListElement: [
      {
        "@type": "Offer",
        name: "Free calculators",
        url: absoluteLocalizedUrl(locale, "/free-tools"),
      },
      {
        "@type": "Offer",
        name: "Premium analyzers",
        url: absoluteLocalizedUrl(locale, "/premium-tools"),
      },
      {
        "@type": "Offer",
        name: "Developer showcase",
        url: absoluteLocalizedUrl(locale, "/developer-showcase"),
      },
      {
        "@type": "Offer",
        name: "LLM index",
        url: absoluteUrl("/llms.txt"),
      },
      {
        "@type": "Offer",
        name: "Sitemap",
        url: absoluteUrl("/sitemap.xml"),
      },
    ],
  }) as JsonLdRecord;
}

export function buildHomeJsonLd(locale: string): readonly JsonLdRecord[] {
  return [
    buildWebsiteSchema(locale),
    buildOrganizationJsonLd(locale),
    buildHomeSoftwareApplicationSchema(locale),
    buildHomeOfferCatalogSchema(locale),
    buildPlatformFinancialServiceSchema(locale),
  ];
}
