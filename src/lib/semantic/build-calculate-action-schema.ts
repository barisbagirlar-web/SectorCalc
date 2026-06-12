import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { absoluteLocalizedUrl, absoluteUrl } from "@/lib/semantic/site-url";
import { pickLocaleText } from "@/lib/semantic/semantic-locale-utils";
import type { SemanticToolContract } from "@/lib/semantic/tool-semantic-types";

export function buildCalculateActionSchema(
  tool: SemanticToolContract,
  locale: string,
): JsonLdRecord {
  const title = pickLocaleText(tool.title, locale);
  const description = pickLocaleText(tool.description, locale);
  const url = absoluteLocalizedUrl(locale, tool.urlPath);

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "Action",
    additionalType: "https://www.sectorcalc.com/semantic/CalculateAction",
    identifier: `CalculateAction:${tool.toolSlug}`,
    name: `${title} — CalculateAction`,
    description,
    inLanguage: locale,
    target: {
      "@type": "EntryPoint",
      urlTemplate: url,
      actionPlatform: [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform",
      ],
    },
    object: {
      "@type": "SoftwareApplication",
      name: "SectorCalc",
      url: absoluteLocalizedUrl(locale, "/"),
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
    },
    instrument: tool.inputParameters.map((param) => ({
      "@type": "PropertyValueSpecification",
      name: pickLocaleText(param.label, locale),
      description: pickLocaleText(param.description, locale),
      unitText: param.unitText,
      valueRequired: param.required,
      valueName: param.key,
      valuePattern: param.valueType,
    })),
    result: tool.outputParameters.map((param) => ({
      "@type": "PropertyValue",
      name: pickLocaleText(param.label, locale),
      description: pickLocaleText(param.description, locale),
      unitText: param.unitText,
      valueReference: param.key,
    })),
  }) as JsonLdRecord;
}

/** @deprecated Use buildCalculateActionSchema(tool, locale) */
export function buildCalculateActionSchemaLegacy(input: {
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
    additionalType: "https://www.sectorcalc.com/semantic/CalculateAction",
    identifier: `CalculateAction:${input.toolSlug}`,
    name: `${input.name} — CalculateAction`,
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
      url: absoluteUrl(`/${input.locale}`),
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
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
  }) as JsonLdRecord;
}
