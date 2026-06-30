import {
  KVKK_READINESS_NOTE,
  STANDARD_REFERENCE_DISCLAIMER,
  type StandardReferenceEntry,
} from "@/lib/content/methodology/standard-reference-types";

export const STANDARD_REFERENCE_REGISTRY: readonly StandardReferenceEntry[] = [
  {
    id: "rsmeans-change-order-waste",
    standardName: "RSMeans-style field waste factors (industry guideline)",
    jurisdiction: "US construction practice",
    sourceType: "industry_guideline",
    referenceNote:
      "Project cost free tool maps deadline pressure to waste percent bands similar to RSMeans-style field waste guidance.",
    confidenceLevel: "informational",
    lastReviewedAt: "2026-06-01",
    disclaimer: STANDARD_REFERENCE_DISCLAIMER,
    toolSlugs: ["project-cost-calculator"],
  },
  {
    id: "ashrae-hvac-load-context",
    standardName: "ASHRAE load estimation context (not full load calc)",
    jurisdiction: "HVAC industry",
    sourceType: "industry_guideline",
    referenceNote:
      "HVAC tools use simplified tonnage and margin buffers — not a substitute for Manual J or licensed load calculations.",
    confidenceLevel: "low",
    lastReviewedAt: "2026-06-01",
    disclaimer: STANDARD_REFERENCE_DISCLAIMER,
    toolSlugs: ["hvac-tonnage-rule-check", "hvac-project-margin-guard"],
  },
  {
    id: "smacna-sheet-metal-context",
    standardName: "SMACNA / fab shop labor minute heuristics",
    sourceType: "industry_guideline",
    referenceNote: "Sheet metal quote tools use programming, setup, and bend-minute heuristics common in fab shops.",
    confidenceLevel: "informational",
    lastReviewedAt: "2026-06-01",
    disclaimer: STANDARD_REFERENCE_DISCLAIMER,
    toolSlugs: ["sheet-metal-quote-risk-tool"],
  },
  {
    id: "governance-formula-contract",
    standardName: "SectorCalc FormulaContract governance",
    sourceType: "internal_governance",
    referenceNote: "Each governed tool documents required inputs, assumptions, and validation rules in FormulaContract registry.",
    confidenceLevel: "high",
    lastReviewedAt: "2026-06-09",
    disclaimer: STANDARD_REFERENCE_DISCLAIMER,
    categoryKeys: ["governed_tools"],
  },
  {
    id: "kvkk-readiness",
    standardName: "Privacy & data minimization readiness",
    jurisdiction: "TR / EU-oriented",
    sourceType: "internal_governance",
    referenceNote: KVKK_READINESS_NOTE,
    confidenceLevel: "informational",
    lastReviewedAt: "2026-06-09",
    disclaimer: STANDARD_REFERENCE_DISCLAIMER,
    categoryKeys: ["privacy"],
  },
];

export function getStandardReferenceById(id: string): StandardReferenceEntry | undefined {
  return STANDARD_REFERENCE_REGISTRY.find((entry) => entry.id === id);
}

export function listReferencesForTool(toolSlug: string): readonly StandardReferenceEntry[] {
  return STANDARD_REFERENCE_REGISTRY.filter(
    (entry) => entry.toolSlugs?.includes(toolSlug) ?? false,
  );
}

export function listReferencesForCategory(categoryKey: string): readonly StandardReferenceEntry[] {
  return STANDARD_REFERENCE_REGISTRY.filter(
    (entry) => entry.categoryKeys?.includes(categoryKey) ?? false,
  );
}

export function resolveReferencesForTool(toolSlug: string): readonly StandardReferenceEntry[] {
  const direct = listReferencesForTool(toolSlug);
  if (direct.length > 0) {
    return direct;
  }
  return [STANDARD_REFERENCE_REGISTRY.find((e) => e.id === "governance-formula-contract")!].filter(
    Boolean,
  );
}
