import type { GeneratedToolSchema } from "@/lib/generated-tools/types";
import { absoluteLocalizedUrl, absoluteUrl } from "@/lib/semantic/site-url";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";

export function buildGeneratedToolCalculateActionJsonLd(input: {
  readonly toolName: string;
  readonly description: string;
  readonly slug: string;
  readonly locale: string;
  readonly schema: GeneratedToolSchema;
}): JsonLdRecord {
  const pageUrl = absoluteLocalizedUrl(input.locale, `/tools/generated/${input.slug}`);
  const apiUrl = absoluteUrl(`/api-public/calculate/${input.slug}`);
  const botDocUrl = absoluteUrl(`/api-public/bot-md/${input.slug}`);

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "Action",
    additionalType: "https://www.sectorcalc.com/semantic/CalculateAction",
    identifier: `CalculateAction:${input.slug}`,
    name: `${input.toolName} — CalculateAction`,
    description: input.description || input.schema.outputs.primary,
    inLanguage: input.locale,
    target: {
      "@type": "EntryPoint",
      urlTemplate: apiUrl,
      httpMethod: "POST",
      contentType: "application/json",
      actionPlatform: [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform",
      ],
    },
    object: {
      "@type": "SoftwareApplication",
      name: "SectorCalc",
      url: absoluteLocalizedUrl(input.locale, "/"),
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
    },
    instrument: input.schema.inputs.map((param) => ({
      "@type": "PropertyValueSpecification",
      name: param.label,
      description: param.businessContext,
      unitText: param.unit,
      valueRequired: true,
      valueName: param.id,
      valuePattern: param.type,
    })),
    result: {
      "@type": "PropertyValue",
      name: input.schema.outputs.primary,
      unitText: input.schema.outputs.unit,
      valueReference: "result",
    },
    sameAs: [pageUrl, botDocUrl],
  }) as JsonLdRecord;
}
