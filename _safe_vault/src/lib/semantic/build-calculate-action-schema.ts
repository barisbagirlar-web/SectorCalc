import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { absoluteLocalizedUrl, absoluteUrl } from "@/lib/semantic/site-url";
import { pickLocaleText } from "@/lib/semantic/semantic-locale-utils";
import type { SemanticToolContract } from "@/lib/semantic/tool-semantic-types";

/**
 * Build an enhanced CalculateAction schema for any tool.
 *
 * This schema enables:
 * - AI agents to understand tool input/output parameters
 * - Google to display rich results for calculation-type queries
 * - Semantic search engines to index calculation capabilities
 * - Featured snippet eligibility for "how to calculate X" queries
 *
 * Uses schema.org Action type with CalculateAction additionalType
 * for maximum compatibility with both Google and AI crawlers.
 */
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
    additionalType: "https://schema.org/CalculateAction",
    "@id": `https://www.sectorcalc.com/semantic/CalculateAction:${tool.toolSlug}`,
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
      contentType: "application/json",
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
    provider: {
      "@type": "Organization",
      "@id": `${absoluteUrl("/")}#organization`,
      name: "SectorCalc",
    },
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
    additionalType: "https://schema.org/CalculateAction",
    "@id": `https://www.sectorcalc.com/semantic/CalculateAction:${input.toolSlug}`,
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
