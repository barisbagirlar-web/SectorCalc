import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";

export function buildCalculateActionSchema(input: {
  readonly url: string;
  readonly name: string;
  readonly description: string;
  readonly locale: string;
  readonly toolSlug: string;
  readonly inputParameters: ReadonlyArray<{
    readonly name: string;
    readonly description: string;
    readonly unitText?: string;
    readonly required?: boolean;
  }>;
  readonly outputParameters: ReadonlyArray<{
    readonly name: string;
    readonly description: string;
    readonly unitText?: string;
  }>;
}): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "Action",
    name: input.name,
    description: input.description,
    inLanguage: input.locale,
    target: {
      "@type": "EntryPoint",
      urlTemplate: input.url,
      actionPlatform: [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform",
      ],
    },
    object: {
      "@type": "SoftwareApplication",
      name: "SectorCalc",
      applicationCategory: "BusinessApplication",
    },
    instrument: input.inputParameters.map((param) => ({
      "@type": "PropertyValueSpecification",
      name: param.name,
      description: param.description,
      unitText: param.unitText,
      valueRequired: param.required ?? false,
    })),
    result: input.outputParameters.map((param) => ({
      "@type": "PropertyValue",
      name: param.name,
      description: param.description,
      unitText: param.unitText,
    })),
    identifier: input.toolSlug,
  }) as JsonLdRecord;
}
