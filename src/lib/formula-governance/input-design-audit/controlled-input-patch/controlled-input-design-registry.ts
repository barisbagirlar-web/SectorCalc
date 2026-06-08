/**
 * Controlled input design patch registry — Phase 5H-F first batch.
 * Metadata-only; production calculator and UI unchanged.
 */

import type { ControlledInputDesignPatch } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-patch-types";

export const FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS = [
  "3d-print-cost-check",
  "auto-shop-margin-leak-detector",
  "cabinet-cost-estimator",
] as const;

export type FirstControlledInputDesignPatchSlug =
  (typeof FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS)[number];

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

export const CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY: Readonly<
  Record<FirstControlledInputDesignPatchSlug, ControlledInputDesignPatch>
> = {
  "3d-print-cost-check": THREE_D_PRINT_COST_CHECK_PATCH,
  "auto-shop-margin-leak-detector": AUTO_SHOP_MARGIN_LEAK_DETECTOR_PATCH,
  "cabinet-cost-estimator": CABINET_COST_ESTIMATOR_PATCH,
};

export function getControlledInputDesignPatch(
  slug: string,
): ControlledInputDesignPatch | undefined {
  return CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY[
    slug as FirstControlledInputDesignPatchSlug
  ];
}
