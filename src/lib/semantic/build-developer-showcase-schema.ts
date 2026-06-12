import { siteUrl } from "@/config/site";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { buildLocalizedUrl } from "@/lib/seo/sitemap-manifest";
import { isSupportedLocale, type SupportedLocale } from "@/lib/i18n/locale-routing";

export function buildDeveloperShowcaseSchema(locale: string): JsonLdRecord {
  const normalizedLocale: SupportedLocale = isSupportedLocale(locale) ? locale : "en";
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "SectorCalc semantic reference for AI agents",
    url: buildLocalizedUrl("/developer-showcase", normalizedLocale, siteUrl),
    description:
      "Public semantic reference describing SectorCalc calculator inputs, outputs, and JSON-LD structure for AI-readable discovery.",
    author: {
      "@id": `${siteUrl}/#organization`,
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    isAccessibleForFree: true,
    about: {
      "@type": "SoftwareApplication",
      name: "SectorCalc",
      applicationCategory: "BusinessApplication",
    },
  }) as JsonLdRecord;
}
