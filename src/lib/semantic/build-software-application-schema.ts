import { buildToolReferenceCreatorAuthorRef } from "@/lib/semantic/build-tool-creator-jsonld";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { absoluteImageUrl, absoluteLocalizedUrl } from "@/lib/semantic/site-url";
import { pickLocaleText } from "@/lib/semantic/semantic-locale-utils";
import { organizationDescriptionForLocale } from "@/config/organization-trust";
import type { SemanticToolContract } from "@/lib/semantic/tool-semantic-types";

function buildPotentialAction(canonicalUrl: string): JsonLdRecord {
  return {
    "@type": "Action",
    name: "Calculate",
    target: {
      "@type": "EntryPoint",
      urlTemplate: canonicalUrl,
    },
  };
}

export function buildSoftwareApplicationSchema(
  tool: SemanticToolContract,
  locale: string,
): JsonLdRecord {
  const canonicalUrl = absoluteLocalizedUrl(locale, tool.urlPath);
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name: pickLocaleText(tool.title, locale),
    description: pickLocaleText(tool.description, locale),
    url: canonicalUrl,
    inLanguage: locale,
    applicationCategory: "CalculatorApplication",
    operatingSystem: "Web",
    image: tool.imagePath ? absoluteImageUrl(tool.imagePath) : absoluteImageUrl("/img/brand/sectorcalc-logo.png"),
    provider: {
      "@type": "Organization",
      name: "SectorCalc",
    },
    author: buildToolReferenceCreatorAuthorRef(),
    creator: buildToolReferenceCreatorAuthorRef(),
    potentialAction: buildPotentialAction(canonicalUrl),
  }) as JsonLdRecord;
}

export function buildHomeSoftwareApplicationSchema(locale: string): JsonLdRecord {
  const canonicalUrl = absoluteLocalizedUrl(locale, "/");
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name: "SectorCalc",
    url: canonicalUrl,
    inLanguage: locale,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: organizationDescriptionForLocale(locale),
    image: absoluteImageUrl("/img/brand/sectorcalc-logo.png"),
    potentialAction: buildPotentialAction(canonicalUrl),
  }) as JsonLdRecord;
}
