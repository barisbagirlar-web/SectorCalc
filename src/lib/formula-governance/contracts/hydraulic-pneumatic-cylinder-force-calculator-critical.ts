/**
 * P64 — Hydraulic and Pneumatic Cylinder Force Calculator premium-schema FormulaContract (factory generated).
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
import { HYDRAULIC_PNEUMATIC_CYLINDER_FORCE_CALCULATOR_INPUT_KEYS } from "@/lib/premium-schema/calculators/hydraulic-pneumatic-cylinder-force-calculator-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...HYDRAULIC_PNEUMATIC_CYLINDER_FORCE_CALCULATOR_INPUT_KEYS];
const OUTPUTS = [
  "extendForceN",
  "retractForceN",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const HydraulicPneumaticCylinderForceCalculatorCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.hydraulic-pneumatic-cylinder-force-calculator",
  toolName: "Hydraulic and Pneumatic Cylinder Force Calculator",
  slug: "hydraulic-pneumatic-cylinder-force-calculator",
  purpose: "Cylinder selection often skips force checks before actuator purchase.",
  userDecision: "What is the deterministic extendForceN exposure for this input profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: [...OUTPUTS],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool provides deterministic cost/risk/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.",
    "Metadata lastUpdated: 2026-06-13.",
    "Metadata validUntil: 2027-06-13.",
    "extendForceN via measurement.cylinder_force pipeline step.",
    "retractForceN via measurement.cylinder_retract_force pipeline step.",
    "summaryLevel uses extendForceN thresholds.",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/hydraulic-pneumatic-cylinder-force-calculator-validation.ts",
      "validateHydraulicPneumaticCylinderForceCalculatorInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/hydraulic-pneumatic-cylinder-force-calculator.ts",
      "calculateHydraulicPneumaticCylinderForceCalculator(inputs) → exposure metrics and decisionVerdict",
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

export const HYDRAULIC_PNEUMATIC_CYLINDER_FORCE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  HydraulicPneumaticCylinderForceCalculatorCalculatorContract,
];
