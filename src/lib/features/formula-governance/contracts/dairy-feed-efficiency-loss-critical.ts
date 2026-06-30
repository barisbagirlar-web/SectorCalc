/**
 * P62 — Dairy feed efficiency loss premium-schema FormulaContract.
 */

import type { FormulaContract } from "@/lib/features/formula-governance/types";
import {
  GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
  STANDARD_DECISION_LANGUAGE_RULE,
  STANDARD_MUST_NOT_CLAIM,
  buildAssuredCriticalContract,
  calculatorProductionAssumption,
} from "@/lib/features/formula-governance/contracts/shared";
import { createWarningPolicy } from "@/lib/features/formula-governance/warning-policy";
import { DAIRY_FEED_EFFICIENCY_LOSS_INPUT_KEYS } from "@/lib/features/premium-schema/calculators/dairy-feed-efficiency-loss-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or veterinary advice. Verify assumptions before herd or feed decisions.";

const METADATA_LAST_UPDATED = "2026-06-13";
const METADATA_VALID_UNTIL = "2027-06-13";

const MILK_YIELD_WARNING_THRESHOLD = 22;
const MILK_YIELD_CRITICAL_THRESHOLD = 18;

const REQUIRED_INPUTS = ["dummy"];

const OUTPUTS = [
  "feedCost",
  "milkRevenueGap",
  "totalExposure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const DairyFeedEfficiencyLossCalculatorContract: FormulaContract =
  buildAssuredCriticalContract({
    toolId: "premium-schema.dairy-feed-efficiency-loss",
    toolName: "Dairy Feed Efficiency Loss Calculator",
    slug: "dairy-feed-efficiency-loss",
    purpose:
      "Quantify feed spend and milk revenue gap when herd yield falls below target relative to feed cost.",
    userDecision:
      "What is total feed efficiency exposure from feed cost and unrealized milk revenue for this herd profile?",
    decisionImpact: "financial",
    requiredInputs: REQUIRED_INPUTS,
    criticalInputs: REQUIRED_INPUTS,
    outputs: ["dummy"],
    assumptions: [
      PREMIUM_SCHEMA_DISCLAIMER,
      "This tool estimates feed efficiency exposure from user-supplied herd size, feed cost and yield inputs.",
      `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
      `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
      "feedCost = cows × feedCostPerCowPerDay × days.",
      "milkRevenueGap = cows × max(target − actual yield, 0) × milkPricePerLiter × days.",
      "totalExposure = feedCost + milkRevenueGap.",
      `summaryLevel low when milkLitersPerCowPerDay > ${MILK_YIELD_WARNING_THRESHOLD}; warning when ${MILK_YIELD_CRITICAL_THRESHOLD} < milkLitersPerCowPerDay ≤ ${MILK_YIELD_WARNING_THRESHOLD}; critical when milkLitersPerCowPerDay ≤ ${MILK_YIELD_CRITICAL_THRESHOLD}.`,
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/dairy-feed-efficiency-loss-validation.ts",
        "validateDairyFeedEfficiencyLossInputs(inputs) → validation errors and warnings",
      ),
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/dairy-feed-efficiency-loss.ts",
        "calculateDairyFeedEfficiencyLoss(inputs) → feed efficiency metrics and decisionVerdict",
      ),
    ],
    formulaSummary:
      "Deterministic feed cost and milk revenue gap stack; summaryLevel follows schema milkLitersPerCowPerDay lower-is-bad thresholds.",
    missingParameterWarnings: [],
    warningPolicy: createWarningPolicy({
      acceptedAssumptions: [
        GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
        "Feed cost and milk price align to the same calculation period.",
        "Target yield supplied from best-period or benchmark band.",
      ],
      modelLimitations: [
        "Not a nutrition formulation or veterinary diagnosis tool.",
        "Does not model component pricing, milk solids, or seasonal pasture shifts.",
        "Does not guarantee margin recovery or herd health outcomes.",
      ],
      futureExtensions: [
        "Milk solids and component pricing bands.",
        "Seasonal pasture versus purchased feed split.",
      ],
    }),
    validationRules: [
      {
        id: "cows-min",
        description: "cows must be greater than or equal to 1.",
        kind: "edge",
      },
      {
        id: "days-min",
        description: "days must be greater than or equal to 1.",
        kind: "edge",
      },
      {
        id: "non-negative-rates",
        description: "Feed, yield and milk price inputs must be non-negative.",
        kind: "edge",
      },
      {
        id: "finite-inputs",
        description: "All inputs must be finite numbers; missing or NaN inputs fail validation.",
        kind: "edge",
      },
    ],
    scenarioSpecs: [
      { id: "normal-yield", description: "Yield above warning band with typical feed cost." },
      { id: "warning-yield", description: "Yield between warning and critical thresholds." },
      { id: "critical-yield", description: "Yield at or below critical threshold." },
    ],
    monotonicityRules: [
      {
        id: "feed-rate-up-cost",
        description: "Higher feedCostPerCowPerDay must not decrease feedCost.",
        inputKey: "feedCostPerCowPerDay",
        direction: "increase_should_increase",
        outputKey: "feedCost",
      },
      {
        id: "yield-down-gap",
        description: "Lower milkLitersPerCowPerDay must not decrease milkRevenueGap when target is higher.",
        inputKey: "milkLitersPerCowPerDay",
        direction: "increase_should_decrease",
        outputKey: "milkRevenueGap",
      },
    ],
    decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
    mustNotClaim: [
      ...STANDARD_MUST_NOT_CLAIM,
      "Veterinary diagnosis",
      "Guaranteed milk yield",
      "Nutrition certification",
    ],
  });

export const DAIRY_FEED_EFFICIENCY_LOSS_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  DairyFeedEfficiencyLossCalculatorContract,
];
