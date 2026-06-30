import {
  TOOL_REFERENCE_CREATOR,
  toolReferenceCreatorJsonLdId,
} from "@/config/tool-reference-creator";
import type { GeneratedToolSchema } from "@/lib/features/generated-tools/types";
import { absoluteLocalizedUrl } from "@/lib/features/semantic/site-url";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";

const TOOL_PAGE_PUBLISHED = "2026-06-16";

export function buildGeneratedToolWebPageJsonLd(input: {
  readonly toolName: string;
  readonly description: string;
  readonly slug: string;
  readonly locale: string;
  readonly schema: GeneratedToolSchema;
}): JsonLdRecord {
  const pageUrl = absoluteLocalizedUrl(input.locale, `/tools/generated/${input.slug}`);
  const dateModified = input.schema.lastUpdated ?? new Date().toISOString().split("T")[0];

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.toolName,
    description: input.description || input.schema.outputs.primary,
    url: pageUrl,
    inLanguage: input.locale,
    author: {
      "@type": "Person",
      "@id": toolReferenceCreatorJsonLdId(),
      name: TOOL_REFERENCE_CREATOR.name,
      url: TOOL_REFERENCE_CREATOR.profileUrl,
      affiliation: TOOL_REFERENCE_CREATOR.affiliation,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".tool-description", ".result-value"],
    },
    datePublished: TOOL_PAGE_PUBLISHED,
    dateModified,
  }) as JsonLdRecord;
}
