/**
 * Representative sector case study types - synthetic scenarios only.
 * Never label as real customer names or verified savings.
 */

export type CaseStudySector =
  | "welding"
  | "cnc"
  | "hvac"
  | "plumbing-electrical"
  | "sheet-metal"
  | "cleaning"
  | "restaurant"
  | "ecommerce"
  | "construction"
  | "energy"
  | "logistics"
  | "sustainability";

export type CaseStudyLossType =
  | "material_scrap"
  | "labor_rework"
  | "schedule_delay"
  | "route_deadhead"
  | "food_waste"
  | "return_erosion"
  | "energy_demand"
  | "margin_leak"
  | "carbon_cost";

export type CaseStudyScenarioKind = "representative_scenario";

export type CaseStudyEvidenceLevel =
  | "verified-client"
  | "anonymized-real"
  | "representative-scenario";

export type CaseStudyToolRoute = "premium" | "premium-schema" | "premium-tools";

export type CaseStudyEntry = {
  readonly slug: string;
  readonly sector: CaseStudySector;
  readonly sectorLabel: string;
  readonly title: string;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly howIsItCalculated?: string;
  readonly whyItMatters?: string;
  readonly academicMethodology?: string;
  readonly scenarioKind?: CaseStudyScenarioKind;
  readonly evidenceLevel?: CaseStudyEvidenceLevel;
  readonly problem: string;
  readonly whatIsIt?: string;
  readonly toolSlug: string;
  readonly toolTitle: string;
  readonly toolRoute?: CaseStudyToolRoute;
  readonly inputSummary: readonly string[];
  readonly hiddenLoss?: string;
  readonly calculationResult: string;
  readonly calculationLogic: string;
  readonly methodologyNote?: string;
  readonly lossType: CaseStudyLossType;
  readonly lossTypeLabel: string;
  readonly suggestedAction: string;
  readonly expectedImpact?: string;
  readonly assumptions?: readonly string[];
  readonly disclaimer?: string;
};

export function getCaseStudyToolHref(entry: CaseStudyEntry): string {
  if (entry.toolRoute === "premium-schema") {
    return `/tools/premium-schema/${entry.toolSlug}`;
  }
  return `/tools/premium/${entry.toolSlug}`;
}

export const CASE_STUDY_REPRESENTATIVE_LABEL =
  "Representative scenario - modeled exposure, not a verified customer outcome.";

export const CASE_STUDY_DISCLAIMER =
  "This case study illustrates how SectorCalc tools structure inputs and surface loss types. It is not financial, legal, or engineering advice. Estimated impact ranges are illustrative only.";
