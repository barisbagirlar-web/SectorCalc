import {
  TOOL_REFERENCE_CREATOR,
  toolReferenceCreatorJsonLdId,
} from "@/config/tool-reference-creator";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";
import { absoluteImageUrl, absoluteLocalizedUrl } from "@/lib/features/semantic/site-url";

export function buildToolReferenceCreatorPersonJsonLd(): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": toolReferenceCreatorJsonLdId(),
    name: TOOL_REFERENCE_CREATOR.name,
    honorificPrefix: TOOL_REFERENCE_CREATOR.honorificPrefix,
    givenName: TOOL_REFERENCE_CREATOR.givenName,
    familyName: TOOL_REFERENCE_CREATOR.familyName,
    jobTitle: TOOL_REFERENCE_CREATOR.jobTitle,
    image: absoluteImageUrl(TOOL_REFERENCE_CREATOR.imagePath),
    url: TOOL_REFERENCE_CREATOR.profileUrl,
    sameAs: TOOL_REFERENCE_CREATOR.sameAs,
    worksFor: TOOL_REFERENCE_CREATOR.affiliation,
    knowsAbout: TOOL_REFERENCE_CREATOR.knowsAbout,
  }) as JsonLdRecord;
}

export function buildToolReferenceCreatorAuthorRef(): JsonLdRecord {
  return {
    "@type": "Person",
    "@id": toolReferenceCreatorJsonLdId(),
  };
}

export function buildToolPageCreatorJsonLd(input: {
  readonly toolName: string;
  readonly description?: string;
  readonly urlPath: string;
  readonly locale: string;
}): readonly JsonLdRecord[] {
  const canonicalUrl = absoluteLocalizedUrl(input.locale, input.urlPath);

  return [
    buildToolReferenceCreatorPersonJsonLd(),
    sanitizeJsonLd({
      "@context": "https://schema.org",
      "@type": ["SoftwareApplication", "WebApplication"],
      name: input.toolName,
      description: input.description,
      url: canonicalUrl,
      inLanguage: input.locale,
      applicationCategory: "CalculatorApplication",
      operatingSystem: "Web",
      image: absoluteImageUrl(TOOL_REFERENCE_CREATOR.imagePath),
      author: buildToolReferenceCreatorAuthorRef(),
      creator: buildToolReferenceCreatorAuthorRef(),
      provider: {
        "@type": "Organization",
        name: "SectorCalc",
      },
    }) as JsonLdRecord,
  ];
}
