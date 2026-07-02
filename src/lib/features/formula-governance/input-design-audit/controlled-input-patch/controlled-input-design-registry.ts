/**
 * Controlled input design patch registry - Phase 5H-F batches.
 * Metadata-only; production calculator and UI unchanged.
 */

import type { ControlledInputDesignPatch } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-patch-types";

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

export const THIRD_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS = [
  "panel-shop-margin-verdict",
  "plumbing-job-margin-verdict",
  "print-job-cost-check",
] as const;

export const FOURTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS = [
  "repair-time-vs-price-check",
  "sheet-metal-quote-risk-tool",
  "signage-bid-safe-price-tool",
] as const;

export const FIFTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS = [
  "welding-bid-risk-analyzer",
  "landscaping-contract-profit-tool",
  "lawn-care-cost-check",
] as const;

export const ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS = [
  ...FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  ...SECOND_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  ...THIRD_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  ...FOURTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  ...FIFTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
] as const;

export type FirstControlledInputDesignPatchSlug =
  (typeof FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS)[number];

export type SecondControlledInputDesignPatchSlug =
  (typeof SECOND_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS)[number];

export type ThirdControlledInputDesignPatchSlug =
  (typeof THIRD_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS)[number];

export type FourthControlledInputDesignPatchSlug =
  (typeof FOURTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS)[number];

export type FifthControlledInputDesignPatchSlug =
  (typeof FIFTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS)[number];

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
    "Revenue-free alternate path uses machine/material ratio risk bands - not merged into this free-traffic input shape.",
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
    "Optional failedPrintRate and supportMaterialCost are governance placeholders - not wired to production free-traffic calculator yet.",
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
    "Advanced risk inputs are governance-only - calcAutoShop hidden multipliers unchanged in Phase 5H-F.",
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
    "laborRate optional for future cost translation - not used in current free risk band calculation.",
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
    "Optional hardwareCost and finishCost are governance placeholders - calculateCarpentryFreeResult hour logic unchanged.",
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
    "Panel complexity and conduit derating not modeled on free path - advanced inputs are governance placeholders only.",
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
    "Optional permitCost and inspectionHours are governance-only - not wired to free-sector calculator in Phase 5H-F-2.",
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
    "calcHvac hidden multipliers unchanged - patch documents input taxonomy only.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Advanced load-calculation inputs are governance placeholders - calcHvac production logic unchanged in Phase 5H-F-2.",
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
    "calcMillwork hidden multipliers unchanged - patch documents required/optional/advanced split only.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Optional hardwareCost and fieldMeasureAllowance are governance-only - calcMillwork production logic unchanged.",
  ],
  blockers: [],
};

const PANEL_SHOP_MARGIN_VERDICT_PATCH: ControlledInputDesignPatch = {
  slug: "panel-shop-margin-verdict",
  patchType: "input_design_only",
  requiredInputs: [
    "materialCost",
    "laborHours",
    "laborRate",
    "testingHours",
    "inspectionRiskPercent",
    "targetMargin",
  ],
  optionalInputs: ["permitRevisionReserve", "conduitFillComplexity", "supplierLeadTime"],
  advancedInputs: [
    "panelComplexity",
    "wiringDensity",
    "ahjRevisionRisk",
    "necDeratingFactor",
  ],
  derivedInputs: ["minimumSafePrice", "baseCost", "p90Cost", "quoteVerdict"],
  defaultAssumptions: [
    "Permit revision reserve defaults to 4% of material cost when permitRevisionReserve optional override is not provided.",
    "Testing labor billed at laborRate; base = material + shop labor + testing labor + permit reserve.",
    "Inspection risk applied via inspectionRiskPercent multiplier on burdened base cost.",
    "Panel complexity, NEC derating and AHJ revision cycles excluded unless advanced inputs are modeled.",
  ],
  userBurdenNotes: [
    "Premium panel bid keeps six production-aligned required inputs; conduit and supplier lead time optional for smart-form phase.",
    "minimumSafePrice is governance margin floor target; integrates with electrical-labor-estimator free funnel metadata.",
  ],
  professionalDepthNotes: [
    "Advanced panel complexity and wiring density inputs prepare code-aware panel and circuit complexity model.",
    "calcElectrical hidden multipliers unchanged - patch documents input taxonomy only.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Optional permitRevisionReserve is governance-only - calcElectrical production logic unchanged in Phase 5H-F-3.",
  ],
  blockers: [],
};

const PLUMBING_JOB_MARGIN_VERDICT_PATCH: ControlledInputDesignPatch = {
  slug: "plumbing-job-margin-verdict",
  patchType: "input_design_only",
  requiredInputs: [
    "partsCost",
    "laborHours",
    "laborRate",
    "fixtureCount",
    "materialRunCost",
    "callbackRiskPercent",
    "targetMargin",
  ],
  optionalInputs: ["emergencyPremium", "permitFees", "accessDifficulty"],
  advancedInputs: [
    "concealedDamageRisk",
    "waterDamageLiability",
    "partsAvailabilityRisk",
    "callbackProbability",
  ],
  derivedInputs: ["minimumSafePrice", "baseCost", "p90Cost", "quoteVerdict"],
  defaultAssumptions: [
    "Fixture allowance defaults to $25 per fixture when not itemized separately.",
    "Access buffer defaults to 15% and permit buffer to 10% of labor on premium base path.",
    "Callback risk applied via callbackRiskPercent on burdened base including parts, labor and material runs.",
    "Concealed damage, emergency premium and water damage liability loaded via hidden multipliers unless advanced inputs are set.",
  ],
  userBurdenNotes: [
    "Premium plumbing verdict keeps seven production-aligned required inputs; emergency and permit fees optional for smart-form phase.",
    "minimumSafePrice is governance primary margin target; quoteVerdict is narrative verdict output.",
  ],
  professionalDepthNotes: [
    "Advanced concealed damage and parts availability inputs prepare risk-adjusted plumbing bid floor model.",
    "calcPlumbing hidden multipliers unchanged - patch documents required/optional/advanced split only.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Advanced water damage and concealed damage inputs are governance placeholders - calcPlumbing unchanged.",
  ],
  blockers: [],
};

const PRINT_JOB_COST_CHECK_PATCH: ControlledInputDesignPatch = {
  slug: "print-job-cost-check",
  patchType: "input_design_only",
  requiredInputs: ["materialCost", "designHours", "laborRate"],
  optionalInputs: ["setupTime", "spoilageRate", "inkCoverage", "installLaborHours"],
  advancedInputs: [
    "colorCalibrationRisk",
    "finishingComplexity",
    "reprintRisk",
    "pressDowntime",
  ],
  derivedInputs: ["designCost", "designMaterialRatio", "recommendedPrice", "riskLevel"],
  defaultAssumptions: [
    "Design cost = designHours × laborRate; SGIA-style design/material ratio thresholds on free tier.",
    "Spoilage, color calibration and setup time excluded on free path unless optional inputs are provided.",
    "Install labor and press downtime not modeled on free tier - optional installLaborHours for smart-form handoff.",
    "HIGH risk when designMaterialRatio ≥ 1.2; recommendedPrice metadata alias equals designCost.",
  ],
  userBurdenNotes: [
    "Free quick-check exposes three production-aligned inputs; spoilage and setup remain optional until smart-form phase.",
    "riskLevel is narrative-only; designCost is primary numeric print job cost target.",
  ],
  professionalDepthNotes: [
    "Advanced color calibration, finishing complexity and reprint risk inputs prepare press-specific spoilage model.",
    "calculatePrintingFreeResult production logic unchanged - patch documents governance input taxonomy only.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Optional spoilageRate and pressDowntime are governance-only - free-sector print calculator unchanged.",
  ],
  blockers: [],
};

const REPAIR_TIME_VS_PRICE_CHECK_PATCH: ControlledInputDesignPatch = {
  slug: "repair-time-vs-price-check",
  patchType: "input_design_only",
  requiredInputs: ["quotedPrice", "repairHours", "partsCost"],
  optionalInputs: ["shopRate", "diagnosticHours", "warrantyComebackRate", "bayUtilization"],
  advancedInputs: [
    "technicianEfficiency",
    "partsAvailabilityRisk",
    "bookTimeVariance",
    "comebackProbability",
  ],
  derivedInputs: ["burdenedCost", "bookHoursDelta", "recommendedPrice", "riskLevel"],
  defaultAssumptions: [
    "Default shop rate $80/hr when shopRate optional override is not provided.",
    "Diagnostic allowance defaults to 0.75 hr added to burdened cost on free-tier path.",
    "visibleCost = repairHours × shopRate + partsCost; burdenedCost = visibleCost + diagnostic allowance.",
    "Mitchell brake-pad reference used for bookHoursDelta; warranty comeback excluded on free tier unless optional inputs are set.",
  ],
  userBurdenNotes: [
    "Free quick-check exposes three production-aligned inputs; shop rate and diagnostic hours defaulted until smart-form phase.",
    "recommendedPrice metadata alias equals burdenedCost; riskLevel is narrative underpricing signal.",
  ],
  professionalDepthNotes: [
    "Advanced technician efficiency and comeback probability inputs prepare auto-shop margin leak detector handoff.",
    "calculateRepairTimeResult production logic unchanged - patch documents governance input taxonomy only.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Optional shopRate and diagnosticHours are governance-only - free-sector auto repair calculator unchanged.",
  ],
  blockers: [],
};

const SHEET_METAL_QUOTE_RISK_TOOL_PATCH: ControlledInputDesignPatch = {
  slug: "sheet-metal-quote-risk-tool",
  patchType: "input_design_only",
  requiredInputs: [
    "programmingTime",
    "setupTime",
    "cutTime",
    "bendCount",
    "laborRate",
    "materialCost",
    "scrapRatePercent",
    "finishingCost",
    "targetMargin",
  ],
  optionalInputs: ["assistGasCost", "pierceCount", "nestingEfficiency", "rushOrderPremium"],
  advancedInputs: [
    "materialGradeRisk",
    "programmingComplexity",
    "nestScrapVolatility",
    "setupAmortization",
  ],
  derivedInputs: ["minimumSafePrice", "baseCost", "p90Cost", "quoteVerdict"],
  defaultAssumptions: [
    "Bend allowance defaults to 2 minutes per bend when not itemized separately.",
    "Scrap rate minimum 8% on material; scrapRatePercent entered by operator may exceed baseline.",
    "Labor minutes = programmingTime + setupTime + cutTime + bendCount × 2; base includes finishing cost.",
    "Nesting efficiency, assist gas and pierce count excluded unless optional/advanced inputs are modeled.",
  ],
  userBurdenNotes: [
    "Premium sheet metal quote keeps nine production-aligned required inputs; rush and nesting optional for smart-form phase.",
    "minimumSafePrice is governance margin floor target; integrates with laser-cutting-time-check free funnel metadata.",
  ],
  professionalDepthNotes: [
    "Advanced nesting scrap volatility and programming complexity inputs prepare nesting-aware quote model.",
    "calcSheetMetal hidden multipliers unchanged - patch documents required/optional/advanced split only.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Optional nestingEfficiency and assistGasCost are governance placeholders - calcSheetMetal unchanged.",
  ],
  blockers: [],
};

const SIGNAGE_BID_SAFE_PRICE_TOOL_PATCH: ControlledInputDesignPatch = {
  slug: "signage-bid-safe-price-tool",
  patchType: "input_design_only",
  requiredInputs: [
    "materialCost",
    "inkCost",
    "designHours",
    "laborRate",
    "installHours",
    "reprintRiskPercent",
    "targetMargin",
  ],
  optionalInputs: ["substrateType", "electricalHookupCost", "permitFees", "colorCalibrationCost"],
  advancedInputs: [
    "installAccessRisk",
    "wideFormatSpoilage",
    "finishingComplexity",
    "reworkProbability",
  ],
  derivedInputs: ["minimumSafePrice", "baseCost", "p90Cost", "quoteVerdict"],
  defaultAssumptions: [
    "RIP/proofing reserve defaults to 4% of base when not overridden.",
    "Design and install labor billed at flat laborRate; base = material + ink + labor + RIP reserve.",
    "Reprint risk applied via reprintRiskPercent multiplier on burdened base cost.",
    "Substrate type, install access and color calibration excluded unless optional/advanced inputs are set.",
  ],
  userBurdenNotes: [
    "Premium signage bid keeps seven production-aligned required inputs; permit and electrical hookup optional for smart-form phase.",
    "minimumSafePrice is governance margin floor target; integrates with print-job-cost-check free funnel metadata.",
  ],
  professionalDepthNotes: [
    "Advanced wide-format spoilage and install access inputs prepare press-specific finishing complexity model.",
    "calcSignage hidden multipliers unchanged - patch documents input taxonomy only.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Advanced finishing complexity inputs are governance-only - calcSignage production logic unchanged.",
  ],
  blockers: [],
};

const WELDING_BID_RISK_ANALYZER_PATCH: ControlledInputDesignPatch = {
  slug: "welding-bid-risk-analyzer",
  patchType: "input_design_only",
  requiredInputs: [
    "materialCost",
    "laborHours",
    "laborRate",
    "gasConsumableCost",
    "fitUpHours",
    "reworkRiskPercent",
    "targetMargin",
  ],
  optionalInputs: ["ndtInspectionCost", "positionFactor", "shopOverheadPercent", "heatTreatmentCost"],
  advancedInputs: [
    "weldProcedureComplexity",
    "outOfPositionFactor",
    "defectProbability",
    "certificationTraceRisk",
  ],
  derivedInputs: ["minimumSafePrice", "p90Cost", "quoteVerdict", "suggestedAction"],
  defaultAssumptions: [
    "Base cost includes material, weld labor, fit-up premium, gas/consumables and rework buffer.",
    "Fit-up hours billed at premium labor rate; rework applied via reworkRiskPercent multiplier.",
    "Overhead position factor and NDT inspection loaded via hidden multipliers unless optional overrides are set.",
    "quoteVerdict and suggestedAction are narrative outputs; minimumSafePrice is numeric governance target.",
  ],
  userBurdenNotes: [
    "Premium welding bid keeps seven production-aligned required inputs; NDT and position factor optional for smart-form phase.",
    "minimumSafePrice is governance margin floor target; integrates with welding-cost-estimator free funnel metadata.",
  ],
  professionalDepthNotes: [
    "Advanced weld procedure and certification trace inputs prepare risk-adjusted bid floor and WPS-aware cost model.",
    "calcWelding hidden multipliers unchanged - patch documents input taxonomy only.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Optional ndtInspectionCost and positionFactor are governance-only - calcWelding production logic unchanged.",
  ],
  blockers: [],
};

const LANDSCAPING_CONTRACT_PROFIT_TOOL_PATCH: ControlledInputDesignPatch = {
  slug: "landscaping-contract-profit-tool",
  patchType: "input_design_only",
  requiredInputs: [
    "crewHoursPerVisit",
    "laborRate",
    "fuelCostPerVisit",
    "supplyCostPerMonth",
    "visitsPerMonth",
    "equipmentWearCost",
    "targetMargin",
  ],
  optionalInputs: ["travelTimePerVisit", "supervisionOverhead", "seasonalityFactor", "irrigationCost"],
  advancedInputs: [
    "routeDensityRisk",
    "weatherDelayProbability",
    "crewUtilization",
    "specialtyServiceLoad",
  ],
  derivedInputs: ["minimumSafePrice", "baseCost", "p90Cost", "quoteVerdict"],
  defaultAssumptions: [
    "Monthly direct = crewHours×laborRate×visits + fuel×visits + supplies + equipment wear.",
    "Equipment depreciation defaults to 8% of monthly labor when not overridden.",
    "Flat visits per month; seasonality and route density excluded unless optional/advanced inputs are set.",
    "Irrigation, fertilization and specialty services not itemized on base path.",
  ],
  userBurdenNotes: [
    "Premium landscaping contract keeps seven production-aligned required inputs; travel and seasonality optional for smart-form phase.",
    "minimumSafePrice is governance monthly contract floor target; integrates with lawn-care-cost-check free funnel metadata.",
  ],
  professionalDepthNotes: [
    "Advanced route density and weather delay inputs prepare recurring route profitability and seasonality model.",
    "calcLandscaping hidden multipliers unchanged - patch documents required/optional/advanced split only.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Optional seasonalityFactor and routeDensityRisk are governance placeholders - calcLandscaping unchanged.",
  ],
  blockers: [],
};

const LAWN_CARE_COST_CHECK_PATCH: ControlledInputDesignPatch = {
  slug: "lawn-care-cost-check",
  patchType: "input_design_only",
  requiredInputs: ["crewHoursPerVisit", "visitsPerMonth", "laborRate"],
  optionalInputs: ["fuelCostPerVisit", "equipmentWearCost", "routeTravelMinutes", "seasonalityFactor"],
  advancedInputs: [
    "routeDensityRisk",
    "crewProductivity",
    "weatherDelayRisk",
    "equipmentUtilization",
  ],
  derivedInputs: ["monthlyCrewHours", "recommendedPrice", "riskLevel"],
  defaultAssumptions: [
    "monthlyCrewHours = crewHoursPerVisit × visitsPerMonth; NALP-style route benchmarks for risk bands.",
    "laborRate collected but not applied in free-tier risk signal - hour load is primary exposure metric.",
    "Fuel, equipment wear and travel between sites excluded on free path unless optional inputs are provided.",
    "HIGH risk when monthly load ≥ 40 hr/month; MEDIUM when ≥ 20 hr/month.",
  ],
  userBurdenNotes: [
    "Free quick-check exposes three production-aligned inputs; fuel and equipment wear optional for smart-form phase.",
    "recommendedPrice metadata alias equals monthlyCrewHours hour semantics; riskLevel is narrative underpricing signal.",
  ],
  professionalDepthNotes: [
    "Advanced route density and crew productivity inputs prepare landscaping contract profit tool handoff.",
    "calculateLandscapingFreeResult production logic unchanged - patch documents governance input taxonomy only.",
  ],
  nextGate: "smart_form_architecture",
  productionImpact: "none",
  uiImpact: "future_smart_form_required",
  oracleImpact: "none",
  warnings: [
    "Optional fuelCostPerVisit and equipmentWearCost are governance-only - free-sector landscaping calculator unchanged.",
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
  "panel-shop-margin-verdict": PANEL_SHOP_MARGIN_VERDICT_PATCH,
  "plumbing-job-margin-verdict": PLUMBING_JOB_MARGIN_VERDICT_PATCH,
  "print-job-cost-check": PRINT_JOB_COST_CHECK_PATCH,
  "repair-time-vs-price-check": REPAIR_TIME_VS_PRICE_CHECK_PATCH,
  "sheet-metal-quote-risk-tool": SHEET_METAL_QUOTE_RISK_TOOL_PATCH,
  "signage-bid-safe-price-tool": SIGNAGE_BID_SAFE_PRICE_TOOL_PATCH,
  "welding-bid-risk-analyzer": WELDING_BID_RISK_ANALYZER_PATCH,
  "landscaping-contract-profit-tool": LANDSCAPING_CONTRACT_PROFIT_TOOL_PATCH,
  "lawn-care-cost-check": LAWN_CARE_COST_CHECK_PATCH,
};

export function getControlledInputDesignPatch(
  slug: string,
): ControlledInputDesignPatch | undefined {
  return CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY[
    slug as ControlledInputDesignPatchSlug
  ];
}
