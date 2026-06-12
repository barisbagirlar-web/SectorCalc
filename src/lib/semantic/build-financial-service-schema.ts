import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { isFinanceLikeTool } from "@/lib/ai/is-finance-like-tool";
import { absoluteLocalizedUrl, SITE_URL } from "@/lib/semantic/site-url";
import { pickLocaleText } from "@/lib/semantic/semantic-locale-utils";
import type { SemanticToolContract } from "@/lib/semantic/tool-semantic-types";

export function shouldUseFinancialService(tool: SemanticToolContract): boolean {
  return isFinanceLikeTool({
    slug: tool.toolSlug,
    title: pickLocaleText(tool.title, "en"),
    description: pickLocaleText(tool.description, "en"),
    categorySlug: tool.category,
  });
}

export function buildFinancialServiceSchema(
  tool: SemanticToolContract,
  locale: string,
): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: pickLocaleText(tool.title, locale),
    description: pickLocaleText(tool.description, locale),
    url: absoluteLocalizedUrl(locale, tool.urlPath),
    provider: {
      "@type": "Organization",
      name: "SectorCalc",
      url: SITE_URL,
    },
    areaServed: "Global",
    serviceType: "Financial calculation and decision support",
  }) as JsonLdRecord;
}

export function buildPlatformFinancialServiceSchema(locale: string): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "SectorCalc financial calculators",
    description:
      "Sector-specific pricing, margin, personnel, and decision-support calculators.",
    url: absoluteLocalizedUrl(locale, "/premium-tools"),
    provider: {
      "@type": "Organization",
      name: "SectorCalc",
      url: SITE_URL,
    },
    areaServed: "Global",
    serviceType: "Financial calculation and decision support",
  }) as JsonLdRecord;
}

/** @deprecated Use buildPlatformFinancialServiceSchema or buildFinancialServiceSchema(tool) */
export function buildFinancialServiceSchemaLegacy(locale: string): JsonLdRecord {
  return buildPlatformFinancialServiceSchema(locale);
}
