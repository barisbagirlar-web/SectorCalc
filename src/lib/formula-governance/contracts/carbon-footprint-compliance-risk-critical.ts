/**
 * P64 — Carbon Footprint Compliance Risk Calculator premium-schema FormulaContract (factory generated).
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
import { CARBON_FOOTPRINT_COMPLIANCE_RISK_INPUT_KEYS } from "@/lib/premium-schema/calculators/carbon-footprint-compliance-risk-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = ["dummy"];
const OUTPUTS = [
  "carbonExposure",
  "totalEmissions",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const CarbonFootprintComplianceRiskCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.carbon-footprint-compliance-risk",
  toolName: "Carbon Footprint Compliance Risk Calculator",
  slug: "carbon-footprint-compliance-risk",
  purpose: "Exporters and manufacturers can underestimate carbon exposure when energy, fuel and carbon price assumptions are not connected.",
  userDecision: "What is the deterministic carbonExposure exposure for this input profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: ["dummy"],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool provides deterministic cost/risk/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.",
    "Metadata lastUpdated: 2026-06-13.",
    "Metadata validUntil: 2027-06-13.",
    "totalEmissions via carbon.total_emissions pipeline step.",
    "carbonExposure via carbon.cbam_exposure pipeline step.",
    "summaryLevel uses carbonExposure thresholds warning 5000 / critical 20000 (higher_is_bad).",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/carbon-footprint-compliance-risk-validation.ts",
      "validateCarbonFootprintComplianceRiskInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/carbon-footprint-compliance-risk.ts",
      "calculateCarbonFootprintComplianceRisk(inputs) → exposure metrics and decisionVerdict",
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

export const CARBON_FOOTPRINT_COMPLIANCE_RISK_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  CarbonFootprintComplianceRiskCalculatorContract,
];
