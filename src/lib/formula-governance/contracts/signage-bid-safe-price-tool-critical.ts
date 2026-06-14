/**
 * P64 — Signage Bid Safe Price Tool premium-schema FormulaContract (factory generated).
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
import { SIGNAGE_BID_SAFE_PRICE_TOOL_INPUT_KEYS } from "@/lib/premium-schema/calculators/signage-bid-safe-price-tool-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...SIGNAGE_BID_SAFE_PRICE_TOOL_INPUT_KEYS];
const OUTPUTS = [
  "totalExposure",
  "reprintCost",
  "revisionCost",
  "marginPressure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const SignageBidSafePriceToolCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.signage-bid-safe-price-tool",
  toolName: "Signage Bid Safe Price Tool",
  slug: "signage-bid-safe-price-tool",
  purpose: "Find minimum safe signage price with design, install, ink, RIP/proofing and reprint risk included.",
  userDecision: "What is the deterministic marginPressure exposure for this input profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: [...OUTPUTS],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool provides deterministic cost/risk/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.",
    "Metadata lastUpdated: 2026-06-13.",
    "Metadata validUntil: 2027-06-13.",
    "reprintCost via loss.waste_exposure pipeline step.",
    "revisionCost via time.rework_cost pipeline step.",
    "totalExposure via cost.total_exposure pipeline step.",
    "marginPressure via cost.margin_pressure pipeline step.",
    "summaryLevel uses marginPressure thresholds warning 5 / critical 12 (higher_is_bad).",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/signage-bid-safe-price-tool-validation.ts",
      "validateSignageBidSafePriceToolInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/signage-bid-safe-price-tool.ts",
      "calculateSignageBidSafePriceTool(inputs) → exposure metrics and decisionVerdict",
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

export const SIGNAGE_BID_SAFE_PRICE_TOOL_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  SignageBidSafePriceToolCalculatorContract,
];
