/**
 * P61 — Cloud API cost overrun premium-schema FormulaContract.
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
import { CLOUD_API_COST_OVERRUN_INPUT_KEYS } from "@/lib/premium-schema/calculators/cloud-api-cost-overrun-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or cloud billing advice. Verify assumptions before pricing or capacity decisions.";

const METADATA_LAST_UPDATED = "2026-06-13";
const METADATA_VALID_UNTIL = "2027-06-13";

const REVENUE_PRESSURE_WARNING_THRESHOLD = 15;
const REVENUE_PRESSURE_CRITICAL_THRESHOLD = 30;

const REQUIRED_INPUTS = [...CLOUD_API_COST_OVERRUN_INPUT_KEYS];

const OUTPUTS = [
  "apiCallCost",
  "totalCloudCost",
  "revenuePressure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const CloudApiCostOverrunCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.cloud-api-cost-overrun",
  toolName: "Cloud API Cost Overrun Calculator",
  slug: "cloud-api-cost-overrun",
  purpose:
    "Quantify cloud stack spend and revenue pressure when API, compute and storage costs outpace product revenue.",
  userDecision:
    "What is total cloud cost and revenue pressure for this API volume and infrastructure spend?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: [...OUTPUTS],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool estimates cloud spend pressure from user-supplied call volume, rates and fixed stack costs.",
    `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
    `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
    "apiCallCost = monthlyApiCalls ÷ 1000 × costPerThousandCalls.",
    "totalCloudCost = apiCallCost + computeCost + storageCost.",
    "revenuePressure = totalCloudCost ÷ monthlyRevenue × 100.",
    `summaryLevel low when revenuePressure < ${REVENUE_PRESSURE_WARNING_THRESHOLD}; warning when ${REVENUE_PRESSURE_WARNING_THRESHOLD} ≤ revenuePressure < ${REVENUE_PRESSURE_CRITICAL_THRESHOLD}; critical when revenuePressure ≥ ${REVENUE_PRESSURE_CRITICAL_THRESHOLD}.`,
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/cloud-api-cost-overrun-validation.ts",
      "validateCloudApiCostOverrunInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/cloud-api-cost-overrun.ts",
      "calculateCloudApiCostOverrun(inputs) → cloud cost stack and decisionVerdict",
    ),
  ],
  formulaSummary:
    "Deterministic API, compute and storage cost stack with revenue pressure percent; summaryLevel follows schema revenuePressure thresholds.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "Monthly revenue and cloud costs are aligned to the same billing period.",
      "Blended per-thousand API rate supplied by the user.",
    ],
    modelLimitations: [
      "Not a cloud invoice reconciler or reserved-capacity optimizer.",
      "Does not model tiered pricing, credits, or egress burst bands.",
      "Does not guarantee margin recovery or pricing recommendations.",
    ],
    futureExtensions: [
      "Tiered API pricing bands and reserved-instance offsets.",
      "Token-based LLM cost line items.",
    ],
  }),
  validationRules: [
    {
      id: "revenue-positive",
      description: "monthlyRevenue must be greater than zero.",
      kind: "edge",
    },
    {
      id: "non-negative-costs",
      description: "API, compute and storage inputs must be non-negative.",
      kind: "edge",
    },
    {
      id: "finite-inputs",
      description: "All inputs must be finite numbers; missing or NaN inputs fail validation.",
      kind: "edge",
    },
  ],
  scenarioSpecs: [
    { id: "normal-stack", description: "Moderate API volume with balanced stack costs." },
    { id: "warning-pressure", description: "Revenue pressure between warning and critical thresholds." },
    { id: "critical-pressure", description: "Revenue pressure at or above critical threshold." },
  ],
  monotonicityRules: [
    {
      id: "calls-up-cost",
      description: "Higher monthlyApiCalls must not decrease apiCallCost when rate is positive.",
      inputKey: "monthlyApiCalls",
      direction: "increase_should_increase",
      outputKey: "apiCallCost",
    },
    {
      id: "compute-up-total",
      description: "Higher computeCost must not decrease totalCloudCost.",
      inputKey: "computeCost",
      direction: "increase_should_increase",
      outputKey: "totalCloudCost",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [
    ...STANDARD_MUST_NOT_CLAIM,
    "Guaranteed cloud savings",
    "Billing invoice accuracy",
    "Pricing recommendation",
  ],
});

export const CLOUD_API_COST_OVERRUN_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  CloudApiCostOverrunCalculatorContract,
];
