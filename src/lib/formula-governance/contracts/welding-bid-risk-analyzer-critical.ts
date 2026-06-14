/**
 * P64 — Welding Bid Risk Analyzer premium-schema FormulaContract (factory generated).
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
import { WELDING_BID_RISK_ANALYZER_INPUT_KEYS } from "@/lib/premium-schema/calculators/welding-bid-risk-analyzer-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...WELDING_BID_RISK_ANALYZER_INPUT_KEYS];
const OUTPUTS = [
  "totalExposure",
  "toolCostPerPart",
  "toolChangeDowntimeCost",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const WeldingBidRiskAnalyzerCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.welding-bid-risk-analyzer",
  toolName: "Welding Bid Risk Analyzer",
  slug: "welding-bid-risk-analyzer",
  purpose: "Find minimum safe welding bid with fit-up time, rework risk and consumables included.",
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
    "toolCostPerPart via cost.unit_cost pipeline step.",
    "toolChangeDowntimeCost via time.setup_loss pipeline step.",
    "totalExposure via cost.total_exposure pipeline step.",
    "summaryLevel uses toolCostPerPart thresholds warning 0.5 / critical 1.5 (higher_is_bad).",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/welding-bid-risk-analyzer-validation.ts",
      "validateWeldingBidRiskAnalyzerInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/welding-bid-risk-analyzer.ts",
      "calculateWeldingBidRiskAnalyzer(inputs) → exposure metrics and decisionVerdict",
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

export const WELDING_BID_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  WeldingBidRiskAnalyzerCalculatorContract,
];
