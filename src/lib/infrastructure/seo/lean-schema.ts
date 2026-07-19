/**
 * Lean-Calc Schema.org Architecture — v2.1 (2026-compliant)
 *
 * §15.3 Compliance: HowTo rich results deprecated in 2026.
 * Page type: SoftwareApplication + WebPage + BreadcrumbList.
 *
 * Unified @graph JSON-LD for each lean calculation page.
 * Educational content (steps) is preserved under CreativeWork/hasPart,
 * but the deprecated HowTo rich result type is NOT used.
 *
 * Lean.org citation is preserved as SoftwareApplication.citation.
 */

import type { LeanCalcEntry } from "@/lib/features/tools/lean-calc-registry";
import { SITE_URL } from "@/lib/features/semantic/site-url";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";

export interface LeanCalcSchemaInput {
  entry: LeanCalcEntry;
}

/**
 * Build the unified SoftwareApplication + WebPage @graph JSON-LD
 * for a specific lean calculation page.
 *
 * §15.4 Page-role matrisi (Tool/SaaS):
 *   Zorunlu: SoftwareApplication, WebPage, Breadcrumb
 */
export function buildLeanCalcGraph(input: LeanCalcSchemaInput): JsonLdRecord {
  const { entry } = input;
  const canonicalUrl = `${SITE_URL}${entry.path}`;

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      // === SOFTWARE APPLICATION: Primary tool signal ===
      {
        "@type": "SoftwareApplication",
        "@id": `${canonicalUrl}/#app`,
        name: `SectorCalc ${entry.metric.name} Engine for Lean Manufacturing`,
        url: canonicalUrl,
        applicationCategory: "BusinessApplication,EngineeringApplication",
        operatingSystem: "Web, Mobile",
        inLanguage: "en",
        description: entry.description,
        about: {
          "@type": "Thing",
          name: entry.metric.name,
          description: entry.metric.description,
        },
        citation: {
          "@type": "CreativeWork",
          name: "Lean Thinking & Practice Principles",
          url: "https://www.lean.org/",
        },
        potentialAction: {
          "@type": "CalculateAction",
          name: `Calculate ${entry.metric.name}`,
          description: `Deterministic ${entry.metric.name} calculation based on lean manufacturing methodology. Formula: ${entry.metric.formula}.`,
        },
        knowsAbout: [
          "Lean Manufacturing",
          "Continuous Improvement",
          "Operational Excellence",
          "PDCA",
          "Gemba",
          "Muda Reduction",
        ],
      },
      // === WEBPAGE: Page identity ===
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: entry.title,
        inLanguage: "en",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          name: "SectorCalc",
          url: SITE_URL,
        },
        about: {
          "@type": "Thing",
          name: `${entry.concept.name} | Lean Manufacturing`,
          sameAs: "https://www.lean.org/lexicon-terms/lean-manufacturing/",
        },
        hasPart: [
          {
            "@type": "CreativeWork",
            name: `Step 1: Gather Gemba Data`,
            description: `Collect actual ${entry.metric.name.toLowerCase()} inputs from the shop floor. ${entry.concept.description}`,
          },
          {
            "@type": "CreativeWork",
            name: `Step 2: Execute Calculation`,
            description: `Enter values into the SectorCalc ${entry.metric.name} structured input tool for immediate deterministic results. Formula: ${entry.metric.formula}.`,
          },
          {
            "@type": "CreativeWork",
            name: `Step 3: Act on Results`,
            description: "Compare result to target. If below target, initiate an A3 Problem Solving report. If above, standardize and update the Gemba control plan.",
          },
        ],
      },
      // === BREADCRUMB: Hierarchy signal ===
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "SectorCalc",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Lean Manufacturing",
            item: `${SITE_URL}/lean`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: entry.concept.name,
            item: `${SITE_URL}/lean/${entry.concept.slug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: entry.metric.name,
            item: canonicalUrl,
          },
        ],
      },
    ],
  }) as JsonLdRecord;
}
