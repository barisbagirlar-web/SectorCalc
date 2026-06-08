/**
 * Controlled input design patch registry — Phase 5H-F batches.
 * Metadata-only; production calculator and UI unchanged.
 */

import type { ControlledInputDesignPatch } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-patch-types";

export const FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS = [
  "3d-print-cost-check",
  "auto-shop-margin-leak-detector",
  "cabinet-cost-estimator",
] as const;

export const SECOND_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS = [
  "electrical-labor-estimator",
  "hvac-project-margin-guard",
  "millwork-bid-risk-analyzer",
] as const;

export const ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS = [
  ...FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  ...SECOND_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
] as const;

export type FirstControlledInputDesignPatchSlug =
  (typeof FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS)[number];

export type SecondControlledInputDesignPatchSlug =
  (typeof SECOND_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS)[number];

export type ControlledInputDesignPatchSlug =
  (typeof ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS)[number];

const THREE_D_PRINT_COST_CHECK_PATCH: ControlledInputDesignPatch = {
  slug: "3d-print-cost-check",
  patchType: "input_design_only",
  requiredInputs: ["materialCost", "printHours", "machineRate", "postProcessHours", "laborRate"],
  optionalInputs: ["failedPrintRate", "supportMaterialCost", "energyCost", "setupTime"],
  advancedInputs: [
    "calibrationRisk",
    "batchUtilization",
    "postProcessingComplexity",
    "materialWastePercent",
  ],
  derivedInputs: ["estimatedCost", "machineTimeCost", "recommendedPrice", "riskLevel"],
  defaultAssumptions: [
    "Failed print rate defaults to 0 on free-traffic path; support material and energy are not itemized unless optional inputs are provided.",
    "Post-process cost is derived from postProcessHours × laborRate when postProcessCost lump sum is not entered.",
    "Machine time cost = printHours × machineRate; estimatedCost = materialCost + machineTimeCost + post-process labor.",
    "Support material waste and calibration downtime excluded on free tier unless advanced inputs are modeled.",
  ],
  userBurdenNotes: [
    "Free tier exposes five production-aligned required inputs; optional fail-rate and support inputs stay hidden until smart-form phase.",
    "Revenue-free alternate path uses machine/material ratio risk bands — not merged into this free-traffic input shape.",
  ],
  professionalDepthNotes: [
    "Advanced calibration, batch utilization and post-processing complexity inputs documented for 3d-print-job-margin-tool handoff.",
    "Derived estimatedCost remains the governance oracle target; recommendedPrice is metadata alias only.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Optional failedPrintRate and supportMaterialCost are governance placeholders — not wired to production free-traffic calculator yet.",
  ],
  blockers: [],
};

const AUTO_SHOP_MARGIN_LEAK_DETECTOR_PATCH: ControlledInputDesignPatch = {
  slug: "auto-shop-margin-leak-detector",
  patchType: "input_design_only",
  requiredInputs: [
    "quotedPrice",
    "diagnosticHours",
    "repairHours",
    "laborRate",
    "partsCost",
    "comebackRiskPercent",
    "partsMarkupPercent",
  ],
  optionalInputs: ["warrantyComebackRate", "bayUtilization", "shopSuppliesPercent", "oemGapPercent"],
  advancedInputs: [
    "comebackProbability",
    "technicianEfficiency",
    "customerApprovalDelay",
    "partsAvailabilityRisk",
  ],
  derivedInputs: [
    "trueJobProfit",
    "marginLeak",
    "riskAdjustedCost",
    "baseCost",
    "recommendedPrice",
    "quoteVerdict",
  ],
  defaultAssumptions: [
    "quotedPrice is the billed/charged repair price entered by the shop (production field: quotedPrice).",
    "Shop supplies default to 5% of diagnostic+repair labor on the premium base path.",
    "OEM/aftermarket parts gap defaults to 12% of partsCost when not overridden.",
    "Comeback risk applied via comebackRiskPercent multiplier on burdened base cost; warranty comeback rate aliases the same exposure for smart-form UX.",
    "Diagnostic time defaults to diagnosticHours; unbilled diagnostic erodes profit through labor burden only.",
  ],
  userBurdenNotes: [
    "Premium decision layer keeps seven required inputs visible; shop supplies and OEM gap remain defaulted until optional overrides are exposed.",
    "marginLeak governance alias documents negative trueJobProfit exposure without changing production output keys.",
  ],
  professionalDepthNotes: [
    "Advanced comeback probability, technician efficiency and parts availability risk inputs prepare warranty comeback model extension.",
    "trueJobProfit remains primary numeric margin target; recommendedPrice metadata alias equals trueJobProfit.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Advanced risk inputs are governance-only — calcAutoShop hidden multipliers unchanged in Phase 5H-F.",
  ],
  blockers: [],
};

const CABINET_COST_ESTIMATOR_PATCH: ControlledInputDesignPatch = {
  slug: "cabinet-cost-estimator",
  patchType: "input_design_only",
  requiredInputs: ["sheetMaterialCost", "laborHours", "installHours"],
  optionalInputs: ["hardwareCost", "finishCost", "wastePercent", "laborRate"],
  advancedInputs: [
    "fieldMeasurementRisk",
    "finishGrade",
    "customHardwareComplexity",
    "reworkProbability",
  ],
  derivedInputs: ["totalHours", "wasteAdjustedHours", "recommendedPrice", "riskLevel"],
  defaultAssumptions: [
    "WWPA 12% waste factor applied to shop+install hours when wastePercent optional override is not provided.",
    "sheetMaterialCost is collected for funnel context; free-tier risk signal uses hour load (totalHours / wasteAdjustedHours) only.",
    "Install complexity defaults to standard residential cabinet run; finish grade and hardware variation excluded unless advanced inputs are set.",
    "hardwareCost and finishCost optional inputs prepare millwork bid risk analyzer handoff without changing free production math.",
  ],
  userBurdenNotes: [
    "Free quick-check exposes three production-aligned hour and material inputs; hardware/finish remain optional for smart-form phase.",
    "laborRate optional for future cost translation — not used in current free risk band calculation.",
  ],
  professionalDepthNotes: [
    "Advanced field measurement, finish grade and custom hardware complexity inputs documented for cut-list aware cost model.",
    "wasteAdjustedHours is governance primary target; recommendedPrice metadata alias equals wasteAdjustedHours hour semantics.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Optional hardwareCost and finishCost are governance placeholders — calculateCarpentryFreeResult hour logic unchanged.",
  ],
  blockers: [],
};

const ELECTRICAL_LABOR_ESTIMATOR_PATCH: ControlledInputDesignPatch = {
  slug: "electrical-labor-estimator",
  patchType: "input_design_only",
  requiredInputs: ["materialCost", "laborHours", "laborRate"],
  optionalInputs: ["permitCost", "inspectionHours", "panelComplexity", "conduitLength"],
  advancedInputs: [
    "codeJurisdictionRisk",
    "accessConstraint",
    "deratingFactor",
    "reworkProbability",
  ],
  derivedInputs: ["laborCost", "laborMaterialRatio", "recommendedPrice", "riskLevel"],
  defaultAssumptions: [
    "Labor cost = laborHours × laborRate; material cost entered as job snapshot.",
    "NEC estimating band (~40–65% commercial) used for labor/material ratio risk bands on free tier.",
    "Permit, inspection and testing hours excluded unless optional inputs are provided.",
    "Panel complexity and conduit derating not modeled on free path — advanced inputs are governance placeholders only.",
  ],
  userBurdenNotes: [
    "Free quick-check exposes three production-aligned inputs; permit and inspection optional for smart-form phase.",
    "recommendedPrice metadata alias equals laborCost; riskLevel remains narrative-only on free tier.",
  ],
  professionalDepthNotes: [
    "Advanced code jurisdiction and access constraint inputs prepare panel shop margin verdict handoff.",
    "laborMaterialRatio derived for NEC band comparison; production calculateElectricalFreeResult unchanged.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Optional permitCost and inspectionHours are governance-only — not wired to free-sector calculator in Phase 5H-F-2.",
  ],
  blockers: [],
};

const HVAC_PROJECT_MARGIN_GUARD_PATCH: ControlledInputDesignPatch = {
  slug: "hvac-project-margin-guard",
  patchType: "input_design_only",
  requiredInputs: [
    "equipmentCost",
    "ductworkCost",
    "laborHours",
    "laborRate",
    "commissioningCost",
    "callbackRiskPercent",
    "targetMargin",
  ],
  optionalInputs: ["permitFees", "refrigerantCharge", "seasonalLaborPremium"],
  advancedInputs: [
    "manualJLoadVariance",
    "ductLeakageRisk",
    "latentLoadFactor",
    "lineSetLength",
  ],
  derivedInputs: ["minimumSafePrice", "baseCost", "p90Cost", "quoteVerdict"],
  defaultAssumptions: [
    "Callback risk applied as callbackRiskPercent on equipment burden; seasonal labor premium defaults to 20% of labor on premium base path.",
    "Refrigerant charge defaults to 3% of equipment cost when refrigerantCharge optional override is not provided.",
    "Commissioning cost entered explicitly; ductwork and equipment summed into base before MarginCore floor.",
    "Site survey, permit fees and full Manual J load excluded unless optional/advanced inputs are set.",
  ],
  userBurdenNotes: [
    "Premium decision layer keeps seven required inputs visible; permit and refrigerant remain defaulted until optional overrides are exposed.",
    "minimumSafePrice is governance primary margin target; quoteVerdict is narrative verdict output.",
  ],
  professionalDepthNotes: [
    "Advanced Manual J variance, duct leakage and latent load inputs prepare envelope-aware HVAC estimator extension.",
    "calcHvac hidden multipliers unchanged — patch documents input taxonomy only.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Advanced load-calculation inputs are governance placeholders — calcHvac production logic unchanged in Phase 5H-F-2.",
  ],
  blockers: [],
};

const MILLWORK_BID_RISK_ANALYZER_PATCH: ControlledInputDesignPatch = {
  slug: "millwork-bid-risk-analyzer",
  patchType: "input_design_only",
  requiredInputs: [
    "sheetMaterialCost",
    "laborHours",
    "laborRate",
    "finishingCost",
    "installHours",
    "wasteRatePercent",
    "targetMargin",
  ],
  optionalInputs: ["hardwareCost", "fieldMeasureAllowance", "humidityDelayReserve"],
  advancedInputs: [
    "fieldMeasurementRisk",
    "finishGrade",
    "customHardwareComplexity",
    "punchListRework",
  ],
  derivedInputs: ["minimumSafePrice", "baseCost", "p90Cost", "quoteVerdict"],
  defaultAssumptions: [
    "Waste rate minimum 10% on premium path; wasteRatePercent entered by operator may exceed WWPA baseline.",
    "Finishing delay reserve defaults to 10% of finishingCost when humidityDelayReserve optional override is not provided.",
    "Labor burden = (laborHours + installHours) × laborRate + finishingCost + delay reserve.",
    "Finish grade, field measurement and custom hardware variation excluded unless advanced inputs are modeled.",
  ],
  userBurdenNotes: [
    "Premium millwork bid keeps seven production-aligned required inputs; hardware and field measure optional for smart-form phase.",
    "minimumSafePrice is governance margin floor target; integrates with cabinet-cost-estimator free funnel metadata.",
  ],
  professionalDepthNotes: [
    "Advanced finish grade, field measurement and punch-list rework inputs prepare cut-list aware cost model.",
    "calcMillwork hidden multipliers unchanged — patch documents required/optional/advanced split only.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Optional hardwareCost and fieldMeasureAllowance are governance-only — calcMillwork production logic unchanged.",
  ],
  blockers: [],
};

export const CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY: Readonly<
  Record<ControlledInputDesignPatchSlug, ControlledInputDesignPatch>
> = {
  "3d-print-cost-check": THREE_D_PRINT_COST_CHECK_PATCH,
  "auto-shop-margin-leak-detector": AUTO_SHOP_MARGIN_LEAK_DETECTOR_PATCH,
  "cabinet-cost-estimator": CABINET_COST_ESTIMATOR_PATCH,
  "electrical-labor-estimator": ELECTRICAL_LABOR_ESTIMATOR_PATCH,
  "hvac-project-margin-guard": HVAC_PROJECT_MARGIN_GUARD_PATCH,
  "millwork-bid-risk-analyzer": MILLWORK_BID_RISK_ANALYZER_PATCH,
};

export function getControlledInputDesignPatch(
  slug: string,
): ControlledInputDesignPatch | undefined {
  return CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY[
    slug as ControlledInputDesignPatchSlug
  ];
}
