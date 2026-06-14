/**
 * P64 — Roofing Contract Margin Guard premium-schema FormulaContract (factory generated).
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
import { ROOFING_CONTRACT_MARGIN_GUARD_INPUT_KEYS } from "@/lib/premium-schema/calculators/roofing-contract-margin-guard-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...ROOFING_CONTRACT_MARGIN_GUARD_INPUT_KEYS];
const OUTPUTS = [
  "totalExposure",
  "subcontractorVariance",
  "marginPressure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const RoofingContractMarginGuardCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.roofing-contract-margin-guard",
  toolName: "Roofing Contract Margin Guard",
  slug: "roofing-contract-margin-guard",
  purpose: "Find minimum roofing bid with tear-off, dump fees, warranty reserve and weather delay risk included.",
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
    "subcontractorVariance via cost.variance pipeline step.",
    "totalExposure via cost.total_exposure pipeline step.",
    "marginPressure via cost.margin_pressure pipeline step.",
    "summaryLevel uses marginPressure thresholds warning 3 / critical 7 (higher_is_bad).",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/roofing-contract-margin-guard-validation.ts",
      "validateRoofingContractMarginGuardInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/roofing-contract-margin-guard.ts",
      "calculateRoofingContractMarginGuard(inputs) → exposure metrics and decisionVerdict",
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

export const ROOFING_CONTRACT_MARGIN_GUARD_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  RoofingContractMarginGuardCalculatorContract,
];
