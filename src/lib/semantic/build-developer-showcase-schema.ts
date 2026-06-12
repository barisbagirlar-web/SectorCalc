import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { absoluteLocalizedUrl, SITE_URL } from "@/lib/semantic/site-url";

export function buildDeveloperShowcaseSchema(locale: string): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "SectorCalc semantic reference for AI agents",
    url: absoluteLocalizedUrl(locale, "/developer-showcase"),
    description:
      "Public semantic reference describing SectorCalc calculator inputs, outputs, and JSON-LD structure for AI-readable discovery.",
    author: {
      "@id": `${SITE_URL}/#organization`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    isAccessibleForFree: true,
    about: {
      "@type": "SoftwareApplication",
      name: "SectorCalc",
      applicationCategory: "BusinessApplication",
    },
  }) as JsonLdRecord;
}
