/**
 * P64 — Fire System Flow and Hydrant Calculator premium-schema FormulaContract (factory generated).
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
import { FIRE_SYSTEM_FLOW_HYDRANT_CALCULATOR_INPUT_KEYS } from "@/lib/features/premium-schema/calculators/fire-system-flow-hydrant-calculator-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = ["dummy"];
const OUTPUTS = [
  "flowDemandLpm",
  "hydrantCount",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const FireSystemFlowHydrantCalculatorCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.fire-system-flow-hydrant-calculator",
  toolName: "Fire System Flow and Hydrant Calculator",
  slug: "fire-system-flow-hydrant-calculator",
  purpose: "Fire protection bids miss flow demand before hydrant and pipe sizing.",
  userDecision: "What is the deterministic flowDemandLpm exposure for this input profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: ["dummy"],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool provides deterministic cost/risk/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.",
    "Metadata lastUpdated: 2026-06-13.",
    "Metadata validUntil: 2027-06-13.",
    "flowDemandLpm via measurement.fire_flow_demand pipeline step.",
    "hydrantCount via measurement.hydrant_count pipeline step.",
    "summaryLevel uses flowDemandLpm thresholds.",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/fire-system-flow-hydrant-calculator-validation.ts",
      "validateFireSystemFlowHydrantCalculatorInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/fire-system-flow-hydrant-calculator.ts",
      "calculateFireSystemFlowHydrantCalculator(inputs) → exposure metrics and decisionVerdict",
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

export const FIRE_SYSTEM_FLOW_HYDRANT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  FireSystemFlowHydrantCalculatorCalculatorContract,
];
