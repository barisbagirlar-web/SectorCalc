/**
 * P62 — Food waste margin loss premium-schema FormulaContract.
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
import { FOOD_WASTE_MARGIN_LOSS_INPUT_KEYS } from "@/lib/premium-schema/calculators/food-waste-margin-loss-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or food safety advice. Verify assumptions before menu or purchasing decisions.";

const METADATA_LAST_UPDATED = "2026-06-13";
const METADATA_VALID_UNTIL = "2027-06-13";

const MARGIN_PRESSURE_WARNING_THRESHOLD = 1;
const MARGIN_PRESSURE_CRITICAL_THRESHOLD = 3;

const REQUIRED_INPUTS = ["dummy"];

const OUTPUTS = [
  "wasteExposure",
  "excessWasteCost",
  "marginPressure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const FoodWasteMarginLossCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.food-waste-margin-loss",
  toolName: "Food Waste Margin Loss Calculator",
  slug: "food-waste-margin-loss",
  purpose:
    "Quantify waste exposure, excess waste cost and margin pressure from ingredient spend versus revenue.",
  userDecision:
    "What is excess food waste cost and margin pressure for this monthly ingredient profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: ["dummy"],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool estimates food waste margin loss from user-supplied ingredient cost, waste rate and revenue inputs.",
    `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
    `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
    "wasteExposure = monthlyIngredientCost × wasteRate ÷ 100.",
    "excessWasteCost = monthlyIngredientCost × max(wasteRate − targetWasteRate, 0) ÷ 100.",
    "marginPressure = excessWasteCost ÷ monthlyRevenue × 100.",
    `summaryLevel low when marginPressure < ${MARGIN_PRESSURE_WARNING_THRESHOLD}; warning when ${MARGIN_PRESSURE_WARNING_THRESHOLD} ≤ marginPressure < ${MARGIN_PRESSURE_CRITICAL_THRESHOLD}; critical when marginPressure ≥ ${MARGIN_PRESSURE_CRITICAL_THRESHOLD}.`,
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/food-waste-margin-loss-validation.ts",
      "validateFoodWasteMarginLossInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/food-waste-margin-loss.ts",
      "calculateFoodWasteMarginLoss(inputs) → waste metrics and decisionVerdict",
    ),
  ],
  formulaSummary:
    "Deterministic waste exposure, excess waste cost and margin pressure percent; summaryLevel follows schema marginPressure thresholds.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "Ingredient cost and revenue align to the same operational period.",
      "Gross margin input is contextual — not recalculated in this analyzer.",
    ],
    modelLimitations: [
      "Not a HACCP or inventory forecasting engine.",
      "Does not model supplier contracts, seasonal menu shifts or labor prep variance.",
      "Does not guarantee margin recovery or repricing outcomes.",
    ],
    futureExtensions: [
      "Shift-level waste attribution and menu item yield bands.",
      "Supplier contract drift and seasonal spoilage curves.",
    ],
  }),
  validationRules: [
    {
      id: "monthly-revenue-positive",
      description: "monthlyRevenue must be greater than zero.",
      kind: "edge",
    },
    {
      id: "waste-rate-range",
      description: "wasteRate and targetWasteRate must be between 0 and 100.",
      kind: "edge",
    },
    {
      id: "non-negative-costs",
      description: "monthlyIngredientCost must be non-negative.",
      kind: "edge",
    },
    {
      id: "finite-inputs",
      description: "All inputs must be finite numbers; missing or NaN inputs fail validation.",
      kind: "edge",
    },
  ],
  scenarioSpecs: [
    { id: "normal-waste", description: "Moderate waste rate with low margin pressure." },
    { id: "warning-pressure", description: "Margin pressure between warning and critical thresholds." },
    { id: "critical-pressure", description: "Margin pressure at or above critical threshold." },
  ],
  monotonicityRules: [
    {
      id: "waste-up-exposure",
      description: "Higher wasteRate must not decrease wasteExposure when ingredient cost is positive.",
      inputKey: "wasteRate",
      direction: "increase_should_increase",
      outputKey: "wasteExposure",
    },
    {
      id: "ingredient-up-excess",
      description: "Higher monthlyIngredientCost must not decrease excessWasteCost when waste exceeds target.",
      inputKey: "monthlyIngredientCost",
      direction: "increase_should_increase",
      outputKey: "excessWasteCost",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [
    ...STANDARD_MUST_NOT_CLAIM,
    "Food safety certification",
    "Guaranteed margin recovery",
    "Inventory forecast accuracy",
  ],
});

export const FOOD_WASTE_MARGIN_LOSS_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  FoodWasteMarginLossCalculatorContract,
];
