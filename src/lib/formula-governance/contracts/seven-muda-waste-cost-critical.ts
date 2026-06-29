/**
 * P54-REV5 — 7 Muda engineering FormulaContract.
 */

import type { FormulaContract } from "@/lib/formula-governance/types";
import {
  GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
  STANDARD_DECISION_LANGUAGE_RULE,
  STANDARD_MUST_NOT_CLAIM,
  buildAssuredCriticalContract,
  calculatorProductionAssumption,
} from "@/lib/formula-governance/contracts/shared";
import { createWarningPolicy } from "@/lib/formula-governance/warning-policy";
import { SEVEN_MUDA_ENGINEERING_INPUT_KEYS } from "@/lib/premium-schema/calculators/seven-muda-waste-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or engineering advice. Verify assumptions before bid, pricing or business decisions.";

const METADATA_LAST_UPDATED = "2026-06-12";
const METADATA_VALID_UNTIL = "2027-06-12";

const ENGINEERING_CRITICAL_INPUTS = [
  "analysisPeriodDays",
  "workingDaysPerYear",
  "productionUnitsInPeriod",
  "currencyCode",
  "unitVariableCost",
  "unitSellingPrice",
  "grossMarginPct",
  "waitingOpportunityMode",
  "dataConfidencePct",
  "implementationDifficultyScore",
] as const;

const ENGINEERING_OUTPUTS = [
  "overproductionCost",
  "waitingCost",
  "transportCost",
  "inventoryCost",
  "motionCost",
  "overprocessingCost",
  "defectCost",
  "totalWasteCost",
  "annualizedWasteCost",
  "wasteCostPerUnit",
  "periodRevenue",
  "periodGrossMarginValue",
  "wasteToRevenueRatioPct",
  "wasteToGrossMarginRatioPct",
  "highestWasteCategory",
  "highestWasteCost",
  "wasteBreakdown",
  "recommendedActionOrder",
  "riskAdjustedPriorityScore",
  "confidenceLevel",
  "doubleCountWarnings",
  "recoveryScenarios",
  "decisionVerdict",
  "minimumSafePrice",
  "recommendedPrice",
  "p90Exposure",
] as const;

export const SevenMudaWasteCostCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.7-israf-muda-avcisi-parasal-karsilik-calculator",
  toolName: "7 Waste (Muda) Hunter Monetary Impact Calculator",
  slug: "7-israf-muda-avcisi-parasal-karsilik-calculator",
  purpose:
    "Operations leaders need each of the seven wastes expressed in comparable monetary terms with period context, margin ratios, and prioritized actions.",
  userDecision:
    "Which muda categories drive the largest monetary exposure in this period, and which actions should be prioritized first?",
  decisionImpact: "operational",
  requiredInputs: ["transportWaitDk", "inventoryCount", "motionWaitDk", "defectRate", "overprocessingDk", "overproductionUnit", "waitingDk", "operatorHourlyRate"],
  criticalInputs: ["dummy"],
  outputs: ["dummy"],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "Source: Lean manufacturing / 7 wastes cost model, internal operational cost estimation model.",
    `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
    `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
    "All monetary inputs must use the same currencyCode for the selected analysis period.",
    "productionUnitsInPeriod is the production volume inside the selected analysis period only.",
    "excessWriteDownCostPerUnit is per excess unit, not a lump-sum write-down total.",
    "inventoryObsolescenceValue is stock write-down outside excess-production write-down.",
    "Hourly labor and machine rates are converted to minute costs inside the engineering calculator.",
    "waitingOpportunityMode controls whether opportunity cost is excluded, entered manually, or derived from throughput.",
    "Undefined numeric inputs normalize to zero in the validation trace; invalid currencyCode fails validation.",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/seven-muda-waste-validation.ts",
      "validateSevenMudaEngineeringInputs(raw) → normalized inputs + validation issues",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/seven-muda-waste-cost.ts",
      "calculateSevenMudaEngineeringWasteCost(inputs) → totalWasteCost, decision outputs",
    ),
  ],
  formulaSummary:
    "Seven muda categories with hourly-to-minute conversion, opportunity-cost modes, annualization, margin ratios, double-count warnings, and prioritized action order.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "Direct-cost lean waste model with explicit double-count warnings for overlapping cost buckets.",
      "currencyCode must be ISO 4217 (three uppercase letters).",
    ],
    modelLimitations: [
      "This is not an actual accounting record or audit report.",
      "Does not produce safety, regulatory, or tax conclusions.",
      "Direct-cost approach; indirect opportunity costs are modeled only as limited by waitingOpportunityMode.",
      "Overlapping inventory write-down and transport damage inputs may double-count unless warnings are reviewed.",
    ],
    futureExtensions: [
      "Multi-site currency normalization and ERP actuals import.",
      "Dynamic kaizen ROI linkage per recommended action.",
    ],
  }),
  validationRules: [
    {
      id: "analysis-period-positive",
      description: "analysisPeriodDays must be greater than zero.",
      kind: "edge",
    },
    {
      id: "working-days-positive",
      description: "workingDaysPerYear must be greater than zero.",
      kind: "edge",
    },
    {
      id: "currency-required-iso4217",
      description: "currencyCode is required and must match /^[A-Z]{3}$/.",
      kind: "edge",
    },
    {
      id: "non-negative-quantities",
      description: "All numeric cost, quantity, and time inputs must be >= 0.",
      kind: "edge",
    },
    {
      id: "percentage-range",
      description: "Percentage inputs must stay within 0–100.",
      kind: "edge",
    },
    {
      id: "implementation-difficulty-range",
      description: "implementationDifficultyScore must stay within 1–5.",
      kind: "edge",
    },
    {
      id: "waiting-mode-enum",
      description: "waitingOpportunityMode must be none, manualHourly, or derivedThroughput.",
      kind: "edge",
    },
    {
      id: "oracle-total-sum",
      description: "totalWasteCost equals the sum of all seven category costs.",
      kind: "scenario",
    },
    {
      id: "hourly-minute-conversion",
      description: "Hourly labor and machine rates convert to minute costs before time multiplication.",
      kind: "dimensional",
    },
    {
      id: "double-count-warnings",
      description: "Overlapping cost buckets emit explicit doubleCountWarnings.",
      kind: "scenario",
    },
  ],
  scenarioSpecs: [
    { id: "all-zero", description: "All waste drivers zero → totalWasteCost = 0." },
    { id: "mixed-waste", description: "Mixed waste drivers produce expected category totals." },
    { id: "defects-dominant", description: "Defect cost dominates total waste exposure." },
    { id: "invalid-currency", description: "Invalid currencyCode fails validation." },
    { id: "invalid-percentage", description: "Out-of-range percentage fails validation." },
    { id: "waiting-double-count-warning", description: "Direct waiting cost plus opportunity cost emits warning." },
    { id: "derived-throughput-opportunity", description: "derivedThroughput mode uses plannedUnitsPerHour and unit gross margin." },
    { id: "write-down-per-unit", description: "excessWriteDownCostPerUnit scales per excess unit only." },
    { id: "transport-damage-trips", description: "transportDamageCost multiplies by transportTrips." },
  ],
  monotonicityRules: [
    {
      id: "excess-units-overproduction",
      description: "Higher excessUnits should not decrease overproductionCost.",
      inputKey: "excessUnits",
      direction: "increase_should_increase",
      outputKey: "totalWasteCost",
    },
    {
      id: "scrap-units-defect",
      description: "Higher scrapUnits should not decrease defectCost.",
      inputKey: "scrapUnits",
      direction: "increase_should_increase",
      outputKey: "totalWasteCost",
    },
    {
      id: "transport-trips",
      description: "Higher transportTrips should not decrease transportCost when distance and damage apply.",
      inputKey: "transportTrips",
      direction: "increase_should_increase",
      outputKey: "transportCost",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: ["dummy"],
});

export const SEVEN_MUDA_WASTE_COST_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  SevenMudaWasteCostCalculatorContract,
];
