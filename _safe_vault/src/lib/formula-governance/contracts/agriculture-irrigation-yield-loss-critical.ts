/**
 * P59 — Agriculture irrigation yield-loss premium-schema FormulaContract.
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
import { AGRICULTURE_IRRIGATION_YIELD_LOSS_INPUT_KEYS } from "@/lib/premium-schema/calculators/agriculture-irrigation-yield-loss-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or agronomic advice. Verify assumptions before pricing or business decisions.";

const METADATA_LAST_UPDATED = "2026-06-12";
const METADATA_VALID_UNTIL = "2027-06-12";

const WARNING_THRESHOLD = 3000;
const CRITICAL_THRESHOLD = 8000;

const REQUIRED_INPUTS = ["waterDeficitMm", "expectedYieldTons", "irrigationCostPerHa", "cropValuePerTon", "waterStressFactor"];

const OUTPUTS = [
  "yieldGapTonPerHa",
  "lostYieldTon",
  "yieldLossRevenue",
  "irrigationCost",
  "totalExposure",
  "exposurePerHa",
  "yieldLossPct",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const AgricultureIrrigationYieldLossCalculatorContract: FormulaContract =
  buildAssuredCriticalContract({
    toolId: "premium-schema.agriculture-irrigation-yield-loss",
    toolName: "Irrigation Yield Loss Calculator",
    slug: "agriculture-irrigation-yield-loss",
    purpose:
      "Quantify monetary exposure when irrigation spend and yield shortfall are not reviewed together for a cultivated area.",
    userDecision:
      "What is the combined monetary exposure from yield gap and irrigation cost for this field season?",
    decisionImpact: "financial",
    requiredInputs: REQUIRED_INPUTS,
    criticalInputs: REQUIRED_INPUTS,
    outputs: ["dummy"],
    assumptions: [
      PREMIUM_SCHEMA_DISCLAIMER,
      "This tool estimates monetary exposure from irrigation-linked yield gap using a deterministic yield-gap model. It is not an agronomic recommendation engine.",
      `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
      `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
      "Units: areaHa in hectares, yields in ton/ha, pricePerTon and irrigationCost in the same currency.",
      "yieldGapTonPerHa = max(expectedYieldTonPerHa - actualYieldTonPerHa, 0).",
      "lostYieldTon = areaHa × yieldGapTonPerHa.",
      "yieldLossRevenue = lostYieldTon × pricePerTon.",
      "totalExposure = yieldLossRevenue + irrigationCost.",
      "exposurePerHa = totalExposure / areaHa.",
      "yieldLossPct = yieldGapTonPerHa / expectedYieldTonPerHa × 100.",
      `summaryLevel low when totalExposure < ${WARNING_THRESHOLD}; warning when ${WARNING_THRESHOLD} ≤ totalExposure < ${CRITICAL_THRESHOLD}; critical when totalExposure ≥ ${CRITICAL_THRESHOLD}.`,
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/agriculture-irrigation-yield-loss-validation.ts",
        "validateAgricultureIrrigationYieldLossInputs(inputs) → validation errors and warnings",
      ),
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/agriculture-irrigation-yield-loss.ts",
        "calculateAgricultureIrrigationYieldLoss(inputs) → exposure metrics and decisionVerdict",
      ),
    ],
    formulaSummary:
      "Deterministic yield-gap revenue exposure plus irrigation cost; summaryLevel uses fixed warning/critical thresholds on totalExposure.",
    missingParameterWarnings: [],
    warningPolicy: createWarningPolicy({
      acceptedAssumptions: [
        GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
        "Yield gap below expected is treated as zero loss; irrigation cost still contributes to exposure.",
        "Single-season field scope; no multi-crop or multi-field allocation.",
      ],
      modelLimitations: [
        "Not an agronomic recommendation engine or irrigation scheduling tool.",
        "Does not model soil moisture, evapotranspiration, or water deficit/over-irrigation separately.",
        "Does not provide crop-specific agronomy advice or guaranteed yield recovery.",
        "Market price and expected yield must be supplied by the user.",
      ],
      futureExtensions: [
        "Season-stage irrigation cost allocation and crop-type presets.",
        "Optional water-deficit vs over-irrigation diagnostic flags.",
      ],
    }),
    validationRules: [
      { id: "area-positive", description: "areaHa must be greater than zero.", kind: "edge" },
      {
        id: "expected-yield-positive",
        description: "expectedYieldTonPerHa must be greater than zero.",
        kind: "edge",
      },
      {
        id: "actual-yield-non-negative",
        description: "actualYieldTonPerHa must be greater than or equal to zero.",
        kind: "edge",
      },
      { id: "price-positive", description: "pricePerTon must be greater than zero.", kind: "edge" },
      {
        id: "irrigation-non-negative",
        description: "irrigationCost must be greater than or equal to zero.",
        kind: "edge",
      },
      {
        id: "finite-inputs",
        description: "All inputs must be finite numbers; missing or NaN inputs fail validation.",
        kind: "edge",
      },
    ],
    scenarioSpecs: [
      { id: "normal-field", description: "Normal case: moderate yield gap with irrigation cost." },
      {
        id: "zero-yield-gap",
        description: "Actual yield meets or exceeds expected; yield loss revenue is zero.",
      },
      { id: "absurd-zero-area", description: "Zero areaHa fails validation." },
      {
        id: "directional-yield-gap",
        description: "Larger yield gap must not decrease yieldLossRevenue.",
      },
      {
        id: "threshold-warning",
        description: `totalExposure between ${WARNING_THRESHOLD} and ${CRITICAL_THRESHOLD} maps to warning summaryLevel.`,
      },
      {
        id: "threshold-critical",
        description: `totalExposure at or above ${CRITICAL_THRESHOLD} maps to critical summaryLevel.`,
      },
    ],
    monotonicityRules: [
      {
        id: "area-up-exposure",
        description: "Higher areaHa must not decrease totalExposure when yield gap is positive.",
        inputKey: "areaHa",
        direction: "increase_should_increase",
        outputKey: "totalExposure",
      },
      {
        id: "irrigation-up-exposure",
        description: "Higher irrigationCost must not decrease totalExposure.",
        inputKey: "irrigationCost",
        direction: "increase_should_increase",
        outputKey: "totalExposure",
      },
    ],
    decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
    mustNotClaim: [
      ...STANDARD_MUST_NOT_CLAIM,
      "Guaranteed yield recovery",
      "Optimal irrigation schedule",
      "Agronomic recommendation",
    ],
  });

export const AGRICULTURE_IRRIGATION_YIELD_LOSS_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] =
  [AgricultureIrrigationYieldLossCalculatorContract];
