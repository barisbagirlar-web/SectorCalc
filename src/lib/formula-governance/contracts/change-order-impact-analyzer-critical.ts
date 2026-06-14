/**
 * P64 — Change Order Impact Analyzer premium-schema FormulaContract (factory generated).
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
import { CHANGE_ORDER_IMPACT_ANALYZER_INPUT_KEYS } from "@/lib/premium-schema/calculators/change-order-impact-analyzer-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...CHANGE_ORDER_IMPACT_ANALYZER_INPUT_KEYS];
const OUTPUTS = [
  "totalExposure",
  "delayCost",
  "laborOverrunCost",
  "materialOverrunCost",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const ChangeOrderImpactAnalyzerCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.change-order-impact-analyzer",
  toolName: "Change Order Impact Analyzer",
  slug: "change-order-impact-analyzer",
  purpose: "Measure delay, crew cost and margin impact before accepting a construction change order.",
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
    "delayCost via time.delay_cost pipeline step.",
    "laborOverrunCost via cost.overrun_cost pipeline step.",
    "materialOverrunCost via cost.overrun_cost pipeline step.",
    "totalExposure via cost.total_exposure pipeline step.",
    "summaryLevel uses delayDays thresholds warning 3 / critical 10 (higher_is_bad).",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/change-order-impact-analyzer-validation.ts",
      "validateChangeOrderImpactAnalyzerInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/change-order-impact-analyzer.ts",
      "calculateChangeOrderImpactAnalyzer(inputs) → exposure metrics and decisionVerdict",
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

export const CHANGE_ORDER_IMPACT_ANALYZER_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  ChangeOrderImpactAnalyzerCalculatorContract,
];
