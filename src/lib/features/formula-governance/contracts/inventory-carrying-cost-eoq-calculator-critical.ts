/**
 * P64 — Inventory Carrying Cost and EOQ Calculator premium-schema FormulaContract (factory generated).
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
import { INVENTORY_CARRYING_COST_EOQ_CALCULATOR_INPUT_KEYS } from "@/lib/features/premium-schema/calculators/inventory-carrying-cost-eoq-calculator-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = ["dummy"];
const OUTPUTS = [
  "eoqUnits",
  "annualCarryingCost",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const InventoryCarryingCostEoqCalculatorCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.inventory-carrying-cost-eoq-calculator",
  toolName: "Inventory Carrying Cost and EOQ Calculator",
  slug: "inventory-carrying-cost-eoq-calculator",
  purpose: "Inventory cost is underestimated when only warehouse rent is counted.",
  userDecision: "What is the deterministic eoqUnits exposure for this input profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: ["dummy"],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool provides deterministic cost/risk/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.",
    "Metadata lastUpdated: 2026-06-13.",
    "Metadata validUntil: 2027-06-13.",
    "eoqUnits via inventory.eoq_units pipeline step.",
    "annualCarryingCost via inventory.carrying_cost_annual pipeline step.",
    "summaryLevel uses eoqUnits thresholds.",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/inventory-carrying-cost-eoq-calculator-validation.ts",
      "validateInventoryCarryingCostEoqCalculatorInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/inventory-carrying-cost-eoq-calculator.ts",
      "calculateInventoryCarryingCostEoqCalculator(inputs) → exposure metrics and decisionVerdict",
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

export const INVENTORY_CARRYING_COST_EOQ_CALCULATOR_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  InventoryCarryingCostEoqCalculatorCalculatorContract,
];
