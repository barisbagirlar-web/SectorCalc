import { organizationDescriptionForLocale, ORGANIZATION_TRUST } from "@/config/organization-trust";
import { buildOrganizationJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import { buildHomeSoftwareApplicationSchema } from "@/lib/features/semantic/build-software-application-schema";
import { absoluteLocalizedUrl, SITE_URL } from "@/lib/features/semantic/site-url";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";

export function buildWebsiteSchema(locale: string): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "SectorCalc",
    url: absoluteLocalizedUrl(locale, "/"),
    description: "SectorCalc helps engineers, technicians, production teams, workshops and managers calculate cost, risk, downtime, FMEA RPN, OEE, quotes, energy loss and engineering diagnostics with review-ready decision reports.",
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

export function buildBreadcrumbJsonLd(locale: string): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteLocalizedUrl(locale, "/"),
      },
    ],
  }) as JsonLdRecord;
}

export function buildItemListJsonLd(locale: string): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/#itemlist`,
    name: "SectorCalc core product paths",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Free Tools",
        url: absoluteLocalizedUrl(locale, "/free-tools"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pro Tools",
        url: absoluteLocalizedUrl(locale, "/pro-tools"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Engineering Diagnostics",
        url: absoluteLocalizedUrl(locale, "/engineering-diagnostics"),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Case Studies",
        url: absoluteLocalizedUrl(locale, "/case-studies"),
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "FMEA RPN Calculator",
        url: absoluteLocalizedUrl(locale, "/calculators/fmea-rpn"),
      },
    ],
  }) as JsonLdRecord;
}

export function buildHomeJsonLd(locale: string): readonly JsonLdRecord[] {
  return [
    buildWebsiteSchema(locale),
    buildOrganizationJsonLd(locale),
    buildHomeSoftwareApplicationSchema(locale),
    buildBreadcrumbJsonLd(locale),
    buildItemListJsonLd(locale),
  ];
}
