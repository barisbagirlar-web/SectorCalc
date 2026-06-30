/**
 * P64 — CBAM Compliance Readiness Verdict premium-schema FormulaContract (factory generated).
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
import { CBAM_COMPLIANCE_VERDICT_INPUT_KEYS } from "@/lib/features/premium-schema/calculators/cbam-compliance-verdict-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = ["dummy"];
const OUTPUTS = [
  "financialExposure",
  "riskScore",
  "emissionGap",
  "coverageGapPct",
  "dataGapPct",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const CbamComplianceVerdictCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.cbam-compliance-verdict",
  toolName: "CBAM Compliance Readiness Verdict",
  slug: "cbam-compliance-verdict",
  purpose: "Exporters can miss CBAM data gaps until certificate coverage, declared emissions and completeness are compared.",
  userDecision: "What is the deterministic financialExposure exposure for this input profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: ["dummy"],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool provides deterministic cost/risk/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.",
    "Metadata lastUpdated: 2026-06-13.",
    "Metadata validUntil: 2027-06-13.",
    "emissionGap via carbon.emission_gap_ton pipeline step.",
    "coverageGapPct via benchmark.gap_percent pipeline step.",
    "dataGapPct via benchmark.gap_percent pipeline step.",
    "financialExposure via carbon.cbam_financial_exposure pipeline step.",
    "riskScore via risk.cbam_composite_score pipeline step.",
    "summaryLevel uses riskScore thresholds warning 20 / critical 50 (higher_is_bad).",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/cbam-compliance-verdict-validation.ts",
      "validateCbamComplianceVerdictInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/cbam-compliance-verdict.ts",
      "calculateCbamComplianceVerdict(inputs) → exposure metrics and decisionVerdict",
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

export const CBAM_COMPLIANCE_VERDICT_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  CbamComplianceVerdictCalculatorContract,
];
