/**
 * Lean-Calc Schema.org Hybrid Architecture — INV-14
 *
 * Generates a @graph combining HowTo (educational) + SoftwareApplication (tool)
 * for every lean calculator page. This dual schema signals Google to treat the
 * page as both a guided procedure AND an interactive tool — maximizing AI Overview
 * eligibility for "How to calculate X for Lean Y" queries.
 *
 * The citation to lean.org creates a semantic bridge that anchors SectorCalc.come
 * in the Lean Manufacturing Knowledge Graph, inheriting lean.org's topical authority.
 */

import type { LeanCalcEntry } from "@/lib/features/tools/lean-calc-registry";
import { SITE_URL } from "@/lib/features/semantic/site-url";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";

export interface LeanCalcSchemaInput {
  entry: LeanCalcEntry;
}

/**
 * Build the unified HowTo + SoftwareApplication @graph JSON-LD
 * for a specific lean calculation page.
 */
export function buildLeanCalcGraph(input: LeanCalcSchemaInput): JsonLdRecord {
  const { entry } = input;
  const canonicalUrl = `${SITE_URL}${entry.path}`;

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      // === HOW-TO: Educational/guide signal ===
      {
        "@type": "HowTo",
        name: `How to calculate ${entry.metric.name} for ${entry.concept.name}`,
        description: entry.description,
        about: {
          "@type": "Thing",
          name: entry.metric.name,
          description: entry.metric.description,
        },
        educationalLevel: "Professional",
        learningResourceType: "How-to guide",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Gather Gemba Data",
            text: `Collect actual ${entry.metric.name.toLowerCase()} inputs from the shop floor. ${entry.concept.description}`,
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Execute Calculation",
            text: `Enter values into the SectorCalc ${entry.metric.name} structured input tool below for immediate deterministic results. Formula: ${entry.metric.formula}.`,
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Act on Results",
            text: `Compare result to target. If below target, initiate an A3 Problem Solving report. If above, standardize and update the Gemba control plan.`,
          },
        ],
        tool: {
          "@type": "SoftwareApplication",
          "@id": `${canonicalUrl}/#app`,
          name: `SectorCalc ${entry.metric.name} Engine for Lean Manufacturing`,
          applicationCategory: "BusinessApplication",
          inLanguage: "en",
          operatingSystem: "Web, Mobile",
          description: entry.description,
          citation: {
            "@type": "CreativeWork",
            name: "Lean Thinking & Practice Principles",
            url: "https://www.lean.org/",
          },
          potentialAction: {
            "@type": "CalculateAction",
            name: `Calculate ${entry.metric.name}`,
            description: `Deterministic ${entry.metric.name} calculation based on lean manufacturing methodology.`,
          },
        },
      },
      // === SOFTWARE APPLICATION: Tool/interactive signal ===
      {
        "@type": "WebApplication",
        "@id": `${canonicalUrl}/#lean-app`,
        name: entry.title,
        url: canonicalUrl,
        inLanguage: "en",
        applicationCategory: "BusinessApplication,EngineeringApplication",
        operatingSystem: "Web, Mobile",
        description: entry.description,
        about: {
          "@type": "Thing",
          name: `${entry.concept.name} | Lean Manufacturing`,
          sameAs: "https://www.lean.org/lexicon-terms/lean-manufacturing/",
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
    ],
  }) as JsonLdRecord;
}
