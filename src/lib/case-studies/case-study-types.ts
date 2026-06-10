/**
 * Representative sector case study types — synthetic scenarios only.
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

export type CaseStudyEntry = {
  readonly slug: string;
  readonly sector: CaseStudySector;
  readonly sectorLabel: string;
  readonly title: string;
  readonly scenarioKind: CaseStudyScenarioKind;
  readonly problem: string;
  readonly toolSlug: string;
  readonly toolTitle: string;
  readonly inputSummary: readonly string[];
  readonly calculationLogic: string;
  readonly lossType: CaseStudyLossType;
  readonly lossTypeLabel: string;
  readonly suggestedAction: string;
  readonly expectedImpact: string;
  readonly assumptions: readonly string[];
  readonly disclaimer: string;
};

export const CASE_STUDY_REPRESENTATIVE_LABEL =
  "Representative scenario — modeled exposure, not a verified customer outcome.";

export const CASE_STUDY_DISCLAIMER =
  "This case study illustrates how SectorCalc tools structure inputs and surface loss types. It is not financial, legal, or engineering advice. Estimated impact ranges are illustrative only.";
