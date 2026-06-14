/**
 * P64 — Return Profit Erosion Tool premium-schema FormulaContract (factory generated).
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
import { RETURN_PROFIT_EROSION_TOOL_INPUT_KEYS } from "@/lib/premium-schema/calculators/return-profit-erosion-tool-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...RETURN_PROFIT_EROSION_TOOL_INPUT_KEYS];
const OUTPUTS = [
  "totalCloudCost",
  "apiCallCost",
  "revenuePressure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const ReturnProfitErosionToolCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.return-profit-erosion-tool",
  toolName: "Return Profit Erosion Tool",
  slug: "return-profit-erosion-tool",
  purpose: "Measure net profit after returns, shipping, payment fees and ad cost per sale.",
  userDecision: "What is the deterministic totalCloudCost exposure for this input profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: [...OUTPUTS],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool provides deterministic cost/risk/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.",
    "Metadata lastUpdated: 2026-06-13.",
    "Metadata validUntil: 2027-06-13.",
    "apiCallCost via cloud.api_call_cost pipeline step.",
    "totalCloudCost via cost.total_exposure pipeline step.",
    "revenuePressure via cost.margin_pressure pipeline step.",
    "summaryLevel uses revenuePressure thresholds warning 15 / critical 30 (higher_is_bad).",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/return-profit-erosion-tool-validation.ts",
      "validateReturnProfitErosionToolInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/return-profit-erosion-tool.ts",
      "calculateReturnProfitErosionTool(inputs) → exposure metrics and decisionVerdict",
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

export const RETURN_PROFIT_EROSION_TOOL_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  ReturnProfitErosionToolCalculatorContract,
];
