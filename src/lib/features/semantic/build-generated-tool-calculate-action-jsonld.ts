import type { GeneratedToolSchema } from "@/lib/features/generated-tools/types";
import { absoluteLocalizedUrl, absoluteUrl } from "@/lib/features/semantic/site-url";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";
import { resolveGeneratedI18nText } from "@/lib/features/generated-tools/resolve-i18n-text";

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
    additionalType: "https://sectorcalc.com/semantic/CalculateAction",
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
      name: resolveGeneratedI18nText(param.label_i18n, input.locale, param.label),
      description: resolveGeneratedI18nText(param.businessContext_i18n, input.locale, param.businessContext),
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
