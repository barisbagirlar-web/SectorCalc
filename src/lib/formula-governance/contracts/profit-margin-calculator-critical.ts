/**
 * P64 — Profit Margin Calculator premium-schema FormulaContract (factory generated).
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
import { PROFIT_MARGIN_CALCULATOR_INPUT_KEYS } from "@/lib/premium-schema/calculators/profit-margin-calculator-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...PROFIT_MARGIN_CALCULATOR_INPUT_KEYS];
const OUTPUTS = [
  "targetSalesPrice",
  "totalCost",
  "wasteCost",
  "minimumSafePrice",
  "grossMarginAmount",
  "grossMarginRate",
  "discountImpact",
  "decisionSummary",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const ProfitMarginCalculatorCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.profit-margin-calculator",
  toolName: "Profit Margin Calculator",
  slug: "profit-margin-calculator",
  purpose: "Compute selling margin percent and markup from unit price and cost.",
  userDecision: "What is the deterministic totalCost exposure for this input profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: [...OUTPUTS],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool provides deterministic cost/risk/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.",
    "Metadata lastUpdated: 2026-06-13.",
    "Metadata validUntil: 2027-06-13.",
    "costStack1 via cost.total_exposure pipeline step.",
    "costStack2 via cost.total_exposure pipeline step.",
    "costStack3 via cost.total_exposure pipeline step.",
    "directSubtotal via cost.sum2 pipeline step.",
    "wasteCost via cost.percent_of_amount pipeline step.",
    "totalCost via cost.sum2 pipeline step.",
    "totalExposure via cost.value pipeline step.",
    "targetSalesPrice via cost.quote_target_price pipeline step.",
    "minimumSafePrice via cost.quote_safe_floor_price pipeline step.",
    "grossMarginAmount via cost.difference pipeline step.",
    "grossMarginRate via cost.margin_rate_on_price pipeline step.",
    "decisionSummary via cost.margin_rate_on_price pipeline step.",
    "discountImpact via cost.percent_of_amount pipeline step.",
    "summaryLevel uses grossMarginRate thresholds warning 12 / critical 8 (lower_is_bad).",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/profit-margin-calculator-validation.ts",
      "validateProfitMarginCalculatorInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/profit-margin-calculator.ts",
      "calculateProfitMarginCalculator(inputs) → exposure metrics and decisionVerdict",
    ),
  ],
  formulaSummary:
    "Deterministic premium-schema pipeline outputs with factory-generated validation and calculator parity.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "User-supplied numeric inputs align to the same calculation period.",
    ],
    modelLimitations: [
      "Not a regulatory, legal, safety, or professional certification engine.",
      "Does not guarantee margin recovery or operational outcomes.",
    ],
    futureExtensions: ["Scenario stress tests and localized assumption packs."],
  }),
  validationRules: [
    {
      id: "required-numeric-inputs",
      description: "All required numeric inputs must be finite and within schema bounds.",
      kind: "edge",
    },
  ],
  scenarioSpecs: [
    { id: "default-profile", description: "Default schema smart defaults." },
    { id: "warning-band", description: "Summary metric in warning band." },
    { id: "critical-band", description: "Summary metric in critical band." },
  ],
  monotonicityRules: [],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed savings", "Guaranteed margin"],
});

export const PROFIT_MARGIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  ProfitMarginCalculatorCalculatorContract,
];
