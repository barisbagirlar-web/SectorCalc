/**
 * P64 — Plumbing Leak Callback Cost Calculator premium-schema FormulaContract (factory generated).
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
import { PLUMBING_LEAK_CALLBACK_COST_INPUT_KEYS } from "@/lib/premium-schema/calculators/plumbing-leak-callback-cost-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...PLUMBING_LEAK_CALLBACK_COST_INPUT_KEYS];
const OUTPUTS = [
  "totalExposure",
  "callbackCost",
  "warrantyReserve",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const PlumbingLeakCallbackCostCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.plumbing-leak-callback-cost",
  toolName: "Plumbing Leak Callback Cost Calculator",
  slug: "plumbing-leak-callback-cost",
  purpose: "Plumbing jobs lose margin when leak callback, material runs and warranty visits are not priced.",
  userDecision: "What is the deterministic totalExposure exposure for this input profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: [...OUTPUTS],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool provides deterministic cost/risk/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.",
    "Metadata lastUpdated: 2026-06-13.",
    "Metadata validUntil: 2027-06-13.",
    "callbackCost via cost.count_cost pipeline step.",
    "warrantyReserve via cost.percent_of_amount pipeline step.",
    "totalExposure via cost.total_exposure pipeline step.",
    "summaryLevel uses totalExposure thresholds.",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/plumbing-leak-callback-cost-validation.ts",
      "validatePlumbingLeakCallbackCostInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/plumbing-leak-callback-cost.ts",
      "calculatePlumbingLeakCallbackCost(inputs) → exposure metrics and decisionVerdict",
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

export const PLUMBING_LEAK_CALLBACK_COST_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  PlumbingLeakCallbackCostCalculatorContract,
];
