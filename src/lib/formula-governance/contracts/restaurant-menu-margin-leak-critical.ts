/**
 * P62 — Restaurant menu margin leak premium-schema FormulaContract.
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
import { RESTAURANT_MENU_MARGIN_LEAK_INPUT_KEYS } from "@/lib/premium-schema/calculators/restaurant-menu-margin-leak-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or restaurant operations advice. Verify assumptions before menu or channel pricing decisions.";

const METADATA_LAST_UPDATED = "2026-06-13";
const METADATA_VALID_UNTIL = "2027-06-13";

const TOTAL_MARGIN_PRESSURE_WARNING_THRESHOLD = 45;
const TOTAL_MARGIN_PRESSURE_CRITICAL_THRESHOLD = 55;

const REQUIRED_INPUTS = [...RESTAURANT_MENU_MARGIN_LEAK_INPUT_KEYS];

const OUTPUTS = [
  "foodCostPercent",
  "deliveryFeeCost",
  "wasteExposure",
  "totalMarginPressure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const RestaurantMenuMarginLeakCalculatorContract: FormulaContract =
  buildAssuredCriticalContract({
    toolId: "premium-schema.restaurant-menu-margin-leak",
    toolName: "Restaurant Menu Margin Leak Calculator",
    slug: "restaurant-menu-margin-leak",
    purpose:
      "Quantify food cost, delivery fee and waste exposure as combined margin pressure on restaurant revenue.",
    userDecision:
      "What is total menu margin pressure from ingredient cost, delivery fees and waste for this period?",
    decisionImpact: "financial",
    requiredInputs: REQUIRED_INPUTS,
    criticalInputs: REQUIRED_INPUTS,
    outputs: [...OUTPUTS],
    assumptions: [
      PREMIUM_SCHEMA_DISCLAIMER,
      "This tool estimates restaurant menu margin leak from user-supplied revenue, ingredient and delivery fee inputs.",
      `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
      `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
      "foodCostPercent = ingredientCost ÷ monthlyRevenue × 100.",
      "deliveryFeeCost = monthlyRevenue × deliveryAppFeePercent ÷ 100.",
      "wasteExposure = ingredientCost × wasteRate ÷ 100.",
      "totalMarginPressure = (ingredientCost + deliveryFeeCost + wasteExposure) ÷ monthlyRevenue × 100.",
      `summaryLevel low when totalMarginPressure < ${TOTAL_MARGIN_PRESSURE_WARNING_THRESHOLD}; warning when ${TOTAL_MARGIN_PRESSURE_WARNING_THRESHOLD} ≤ totalMarginPressure < ${TOTAL_MARGIN_PRESSURE_CRITICAL_THRESHOLD}; critical when totalMarginPressure ≥ ${TOTAL_MARGIN_PRESSURE_CRITICAL_THRESHOLD}.`,
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/restaurant-menu-margin-leak-validation.ts",
        "validateRestaurantMenuMarginLeakInputs(inputs) → validation errors and warnings",
      ),
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/restaurant-menu-margin-leak.ts",
        "calculateRestaurantMenuMarginLeak(inputs) → menu margin metrics and decisionVerdict",
      ),
    ],
    formulaSummary:
      "Deterministic food cost, delivery fee and waste stack with total margin pressure percent; summaryLevel follows schema totalMarginPressure thresholds.",
    missingParameterWarnings: [],
    warningPolicy: createWarningPolicy({
      acceptedAssumptions: [
        GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
        "Revenue and ingredient cost align to the same menu period.",
        "Target food cost percent is contextual — not recalculated in this analyzer.",
      ],
      modelLimitations: [
        "Not a POS integration or inventory forecasting engine.",
        "Does not model labor cost, rent or marketing spend.",
        "Does not guarantee menu profit or delivery channel recovery.",
      ],
      futureExtensions: [
        "Channel-level fee attribution and menu item yield bands.",
        "Labor and rent stack for full P&L margin pressure.",
      ],
    }),
    validationRules: [
      {
        id: "monthly-revenue-positive",
        description: "monthlyRevenue must be greater than zero.",
        kind: "edge",
      },
      {
        id: "percent-range",
        description: "deliveryAppFeePercent, wasteRate and targetFoodCostPercent must be between 0 and 100.",
        kind: "edge",
      },
      {
        id: "non-negative-costs",
        description: "ingredientCost must be non-negative.",
        kind: "edge",
      },
      {
        id: "finite-inputs",
        description: "All inputs must be finite numbers; missing or NaN inputs fail validation.",
        kind: "edge",
      },
    ],
    scenarioSpecs: [
      { id: "normal-menu", description: "Moderate food cost with low combined margin pressure." },
      { id: "warning-pressure", description: "Total margin pressure between warning and critical thresholds." },
      { id: "critical-pressure", description: "Total margin pressure at or above critical threshold." },
    ],
    monotonicityRules: [
      {
        id: "fee-up-pressure",
        description: "Higher deliveryAppFeePercent must not decrease deliveryFeeCost when revenue is positive.",
        inputKey: "deliveryAppFeePercent",
        direction: "increase_should_increase",
        outputKey: "deliveryFeeCost",
      },
      {
        id: "waste-up-exposure",
        description: "Higher wasteRate must not decrease wasteExposure when ingredient cost is positive.",
        inputKey: "wasteRate",
        direction: "increase_should_increase",
        outputKey: "wasteExposure",
      },
    ],
    decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
    mustNotClaim: [
      ...STANDARD_MUST_NOT_CLAIM,
      "Menu engineering certification",
      "Guaranteed channel profit",
      "POS forecast accuracy",
    ],
  });

export const RESTAURANT_MENU_MARGIN_LEAK_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] =
  [RestaurantMenuMarginLeakCalculatorContract];
