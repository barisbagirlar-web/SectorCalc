/**
 * P64 — Value Stream Map VSM Calculator premium-schema FormulaContract (factory generated).
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
import { VALUE_STREAM_MAP_VSM_CALCULATOR_INPUT_KEYS } from "@/lib/premium-schema/calculators/value-stream-map-vsm-calculator-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...VALUE_STREAM_MAP_VSM_CALCULATOR_INPUT_KEYS];
const OUTPUTS = [
  "totalLeadMinutes",
  "valueAddedPercent",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const ValueStreamMapVsmCalculatorCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.value-stream-map-vsm-calculator",
  toolName: "Value Stream Map VSM Calculator",
  slug: "value-stream-map-vsm-calculator",
  purpose: "Lead time hides in queues and transport while teams only track processing time.",
  userDecision: "What is the deterministic totalLeadMinutes exposure for this input profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: [...OUTPUTS],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool provides deterministic cost/risk/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.",
    "Metadata lastUpdated: 2026-06-13.",
    "Metadata validUntil: 2027-06-13.",
    "totalLeadMinutes via time.vsm_total_lead_time pipeline step.",
    "valueAddedPercent via benchmark.value_added_percent pipeline step.",
    "summaryLevel uses totalLeadMinutes thresholds.",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/value-stream-map-vsm-calculator-validation.ts",
      "validateValueStreamMapVsmCalculatorInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/value-stream-map-vsm-calculator.ts",
      "calculateValueStreamMapVsmCalculator(inputs) → exposure metrics and decisionVerdict",
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

export const VALUE_STREAM_MAP_VSM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  ValueStreamMapVsmCalculatorCalculatorContract,
];
