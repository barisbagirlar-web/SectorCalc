import { ORGANIZATION_TRUST } from "@/config/organization-trust";
import { TOOL_REFERENCE_CREATOR } from "@/config/tool-reference-creator";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";
import { absoluteLocalizedUrl, SITE_URL } from "@/lib/semantic/site-url";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { translateCalculatorPhrase } from "@/lib/i18n/calculator-phrase-translate";

export function buildGeneratedToolProductJsonLd(input: {
  readonly toolName: string;
  readonly description: string;
  readonly slug: string;
  readonly locale: string;
  readonly schema: GeneratedToolSchema;
}): JsonLdRecord {
  const pageUrl = absoluteLocalizedUrl(input.locale, `/tools/generated/${input.slug}`);
  const isFree = input.schema.premiumRequired !== true;

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${pageUrl}#product`,
    name: input.toolName,
    description: input.description || input.schema.outputs.primary,
    url: pageUrl,
    brand: { "@id": `${SITE_URL}/#organization` },
    manufacturer: {
      "@type": "Organization",
      name: ORGANIZATION_TRUST.displayName,
      "@id": `${SITE_URL}/#organization`,
      location: {
        "@type": "Place",
        name: `${ORGANIZATION_TRUST.address.addressLocality}, Turkey`,
      },
    },
    offers: {
      "@type": "Offer",
      price: isFree ? "0.00" : undefined,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: pageUrl,
    },
    review: {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: TOOL_REFERENCE_CREATOR.name,
        url: TOOL_REFERENCE_CREATOR.profileUrl,
        affiliation: TOOL_REFERENCE_CREATOR.affiliation,
      },
      reviewBody:
        translateCalculatorPhrase(
          "Industrial calculation methodology reviewed for formula transparency and sector applicability.",
          input.locale,
        ),
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  }) as JsonLdRecord;
}
