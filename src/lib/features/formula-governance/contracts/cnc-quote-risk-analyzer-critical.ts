/**
 * P64 — CNC Audit Engine premium-schema FormulaContract (factory generated).
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
import { CNC_QUOTE_RISK_ANALYZER_INPUT_KEYS } from "@/lib/features/premium-schema/calculators/cnc-quote-risk-analyzer-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...CNC_QUOTE_RISK_ANALYZER_INPUT_KEYS];
const OUTPUTS = [
  "oeeScore",
  "availabilityLossCost",
  "scrapCost",
  "totalExposure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const CncQuoteRiskAnalyzerCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.cnc-quote-risk-analyzer",
  toolName: "CNC Audit Engine",
  slug: "cnc-quote-risk-analyzer",
  purpose: "Estimate minimum safe price and quote risk verdict for CNC jobs using setup, cycle, tooling, material and machine rate inputs.",
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
    "availabilityLossCost via oee.availability_loss_cost pipeline step.",
    "scrapCost via loss.scrap_cost pipeline step.",
    "timeLossCost via loss.time_cost pipeline step.",
    "oeeScore via oee.basic pipeline step.",
    "combinedOperatingCost via loss.combined_operating pipeline step.",
    "totalExposure via loss.total_exposure pipeline step.",
    "summaryLevel uses oeeScore thresholds warning 65 / critical 50 (lower_is_bad).",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/cnc-quote-risk-analyzer-validation.ts",
      "validateCncQuoteRiskAnalyzerInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/cnc-quote-risk-analyzer.ts",
      "calculateCncQuoteRiskAnalyzer(inputs) → exposure metrics and decisionVerdict",
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

export const CNC_QUOTE_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  CncQuoteRiskAnalyzerCalculatorContract,
];
