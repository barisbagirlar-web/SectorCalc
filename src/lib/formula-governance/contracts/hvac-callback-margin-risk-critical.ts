/**
 * P62 — HVAC callback margin risk premium-schema FormulaContract.
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
import { HVAC_CALLBACK_MARGIN_RISK_INPUT_KEYS } from "@/lib/premium-schema/calculators/hvac-callback-margin-risk-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or mechanical design advice. Verify assumptions before HVAC bidding or commissioning decisions.";

const METADATA_LAST_UPDATED = "2026-06-13";
const METADATA_VALID_UNTIL = "2027-06-13";

const MARGIN_PRESSURE_WARNING_THRESHOLD = 5;
const MARGIN_PRESSURE_CRITICAL_THRESHOLD = 10;

const REQUIRED_INPUTS = ["dummy"];

const OUTPUTS = [
  "commissioningCost",
  "callbackRiskCost",
  "totalExposure",
  "marginPressure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const HvacCallbackMarginRiskCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.hvac-callback-margin-risk",
  toolName: "HVAC Callback Margin Risk Calculator",
  slug: "hvac-callback-margin-risk",
  purpose:
    "Quantify ductwork variance, commissioning cost and callback risk as margin pressure on HVAC project revenue.",
  userDecision:
    "What is total HVAC callback exposure and margin pressure for this project profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: ["dummy"],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool estimates HVAC callback margin risk from user-supplied revenue, duct variance and commissioning inputs.",
    `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
    `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
    "commissioningCost = commissioningHours × laborRate.",
    "callbackRiskCost = projectRevenue × callbackRiskPercent ÷ 100.",
    "totalExposure = ductworkVariance + commissioningCost + callbackRiskCost.",
    "marginPressure = totalExposure ÷ projectRevenue × 100.",
    `summaryLevel low when marginPressure < ${MARGIN_PRESSURE_WARNING_THRESHOLD}; warning when ${MARGIN_PRESSURE_WARNING_THRESHOLD} ≤ marginPressure < ${MARGIN_PRESSURE_CRITICAL_THRESHOLD}; critical when marginPressure ≥ ${MARGIN_PRESSURE_CRITICAL_THRESHOLD}.`,
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/hvac-callback-margin-risk-validation.ts",
      "validateHvacCallbackMarginRiskInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/hvac-callback-margin-risk.ts",
      "calculateHvacCallbackMarginRisk(inputs) → callback metrics and decisionVerdict",
    ),
  ],
  formulaSummary:
    "Deterministic duct variance, commissioning and callback risk stack with margin pressure percent; summaryLevel follows schema marginPressure thresholds.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "Project revenue and cost inputs align to the same HVAC contract scope.",
      "Callback risk percent supplied from historical similar-project band.",
    ],
    modelLimitations: [
      "Not a load calculation or mechanical design certification tool.",
      "Does not model warranty callbacks, refrigerant drift or seasonal demand.",
      "Does not guarantee project profit or commissioning schedule accuracy.",
    ],
    futureExtensions: [
      "Trade-level duct variance and commissioning hour bands.",
      "Warranty callback linkage and seasonal demand curves.",
    ],
  }),
  validationRules: [
    {
      id: "project-revenue-positive",
      description: "projectRevenue must be greater than zero.",
      kind: "edge",
    },
    {
      id: "callback-risk-range",
      description: "callbackRiskPercent must be between 0 and 100.",
      kind: "edge",
    },
    {
      id: "non-negative-costs",
      description: "Duct, commissioning and labor inputs must be non-negative.",
      kind: "edge",
    },
    {
      id: "finite-inputs",
      description: "All inputs must be finite numbers; missing or NaN inputs fail validation.",
      kind: "edge",
    },
  ],
  scenarioSpecs: [
    { id: "normal-callback", description: "Moderate duct variance with low margin pressure." },
    { id: "warning-pressure", description: "Margin pressure between warning and critical thresholds." },
    { id: "critical-pressure", description: "Margin pressure at or above critical threshold." },
  ],
  monotonicityRules: [
    {
      id: "duct-up-exposure",
      description: "Higher ductworkVariance must not decrease totalExposure.",
      inputKey: "ductworkVariance",
      direction: "increase_should_increase",
      outputKey: "totalExposure",
    },
    {
      id: "callback-up-cost",
      description: "Higher callbackRiskPercent must not decrease callbackRiskCost when revenue is positive.",
      inputKey: "callbackRiskPercent",
      direction: "increase_should_increase",
      outputKey: "callbackRiskCost",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [
    ...STANDARD_MUST_NOT_CLAIM,
    "Mechanical design approval",
    "Guaranteed project profit",
    "Commissioning certification",
  ],
});

export const HVAC_CALLBACK_MARGIN_RISK_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  HvacCallbackMarginRiskCalculatorContract,
];
