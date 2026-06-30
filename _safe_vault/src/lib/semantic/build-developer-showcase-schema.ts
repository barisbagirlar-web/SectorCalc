import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { absoluteLocalizedUrl, SITE_URL } from "@/lib/semantic/site-url";

/**
 * Build an enhanced Developer Showcase (SoftwareSourceCode) schema.
 *
 * This is the "Geliştirici Vitrini" (Developer Showcase) schema that enables:
 * - AI agents to discover SectorCalc as a callable tool/API
 * - Google to understand the software capabilities
 * - Semantic search engines to index the platform's API surface
 * - AI crawlers to understand input/output expectations
 *
 * This schema is published at /developer-showcase and referenced from ai.txt.
 */
export function buildDeveloperShowcaseSchema(locale: string): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": ["TechArticle", "SoftwareSourceCode"],
    "@id": `${SITE_URL}/#developer-showcase`,
    headline: "SectorCalc semantic reference for AI agents and developers",
    url: absoluteLocalizedUrl(locale, "/developer-showcase"),
    description:
      "Public semantic reference describing SectorCalc calculator inputs, outputs, and JSON-LD structure for AI-readable discovery. Third-party developers and AI agents can use this reference to integrate SectorCalc calculations into their workflows.",
    author: {
      "@id": `${SITE_URL}/#organization`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    isAccessibleForFree: true,
    about: {
      "@type": "SoftwareApplication",
      name: "SectorCalc",
      applicationCategory: "BusinessApplication",
      description: "Sector-specific calculation and decision-report platform",
    },
    codeRepository: "https://github.com/sectorcalc",
    programmingLanguage: "TypeScript",
    targetPlatform: ["Web", "PWA"],
    applicationCategory: "BusinessApplication",
    softwareVersion: "2.0",
    // AI agent callable function definition
    potentialAction: {
      "@type": "Action",
      additionalType: "https://schema.org/CalculateAction",
      name: "SectorCalc CalculateAction API",
      description: "Execute sector-specific calculations via URL-based API. Each calculator is accessible at {locale}/tools/generated/{slug} with input parameters as query string.",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/{locale}/tools/generated/{slug}?{input_params}`,
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
        contentType: "application/json",
      },
      instrument: [
        {
          "@type": "PropertyValueSpecification",
          valueName: "locale",
          valueRequired: true,
          valueType: "Text",
          defaultValue: "en",
          valuePattern: "en|tr|de|fr|es|ar",
          description: "Target locale for the calculation and result display (ISO 639-1)",
        },
        {
          "@type": "PropertyValueSpecification",
          valueName: "slug",
          valueRequired: true,
          valueType: "Text",
          description: "Calculator slug from ai-tool-index.json (e.g., 'cnc-cutting-cost')",
        },
        {
          "@type": "PropertyValueSpecification",
          valueName: "input_params",
          valueRequired: false,
          valueType: "URLQueryString",
          description: "Tool-specific input parameters as query string. Each tool defines its own parameters. See ai-tool-index.json for per-tool parameter definitions.",
        },
      ],
      result: [
        {
          "@type": "PropertyValue",
          valueName: "computedValue",
          valueType: "Number",
          description: "Primary calculation result",
        },
        {
          "@type": "PropertyValue",
          valueName: "unit",
          valueType: "Text",
          description: "Unit of the computed value (e.g., USD, %, kg, kWh, hours)",
        },
        {
          "@type": "PropertyValue",
          valueName: "formulaSummary",
          valueType: "Text",
          description: "Plain-text explanation of the formula used",
        },
        {
          "@type": "PropertyValue",
          valueName: "interpretation",
          valueType: "Text",
          description: "Risk-flagged interpretation of the result (free tier) or full diagnostic report (premium tier)",
        },
      ],
    },
  }) as JsonLdRecord;
}
