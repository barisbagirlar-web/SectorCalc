import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { absoluteImageUrl, absoluteLocalizedUrl } from "@/lib/semantic/site-url";
import { pickLocaleText } from "@/lib/semantic/semantic-locale-utils";
import type { SemanticToolContract } from "@/lib/semantic/tool-semantic-types";

export function buildSoftwareApplicationSchema(
  tool: SemanticToolContract,
  locale: string,
): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: pickLocaleText(tool.title, locale),
    description: pickLocaleText(tool.description, locale),
    url: absoluteLocalizedUrl(locale, tool.urlPath),
    applicationCategory: "CalculatorApplication",
    operatingSystem: "Web",
    image: tool.imagePath ? absoluteImageUrl(tool.imagePath) : absoluteImageUrl("/img/brand/sectorcalc-logo.png"),
    provider: {
      "@type": "Organization",
      name: "SectorCalc",
    },
  }) as JsonLdRecord;
}

export function buildHomeSoftwareApplicationSchema(locale: string): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SectorCalc",
    url: absoluteLocalizedUrl(locale, "/"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Sector calculators for production, industry and business decisions.",
    image: absoluteImageUrl("/img/brand/sectorcalc-logo.png"),
  }) as JsonLdRecord;
}
