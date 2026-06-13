/**
 * P64 — Belt Pulley Speed and Length Calculator premium-schema FormulaContract (factory generated).
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
import { BELT_PULLEY_SPEED_LENGTH_CALCULATOR_INPUT_KEYS } from "@/lib/premium-schema/calculators/belt-pulley-speed-length-calculator-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...BELT_PULLEY_SPEED_LENGTH_CALCULATOR_INPUT_KEYS];
const OUTPUTS = [
  "drivenRpm",
  "beltSpeedMpm",
  "beltLengthMm",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const BeltPulleySpeedLengthCalculatorCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.belt-pulley-speed-length-calculator",
  toolName: "Belt Pulley Speed and Length Calculator",
  slug: "belt-pulley-speed-length-calculator",
  purpose: "Drive changes are sized from memory instead of documented speed and belt length.",
  userDecision: "What is the deterministic drivenRpm exposure for this input profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: [...OUTPUTS],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool provides deterministic cost/risk/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.",
    "Metadata lastUpdated: 2026-06-13.",
    "Metadata validUntil: 2027-06-13.",
    "drivenRpm via measurement.pulley_driven_rpm pipeline step.",
    "beltSpeedMpm via measurement.belt_speed_mpm pipeline step.",
    "beltLengthMm via measurement.open_belt_length_mm pipeline step.",
    "summaryLevel uses drivenRpm thresholds.",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/belt-pulley-speed-length-calculator-validation.ts",
      "validateBeltPulleySpeedLengthCalculatorInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/belt-pulley-speed-length-calculator.ts",
      "calculateBeltPulleySpeedLengthCalculator(inputs) → exposure metrics and decisionVerdict",
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

export const BELT_PULLEY_SPEED_LENGTH_CALCULATOR_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  BeltPulleySpeedLengthCalculatorCalculatorContract,
];
