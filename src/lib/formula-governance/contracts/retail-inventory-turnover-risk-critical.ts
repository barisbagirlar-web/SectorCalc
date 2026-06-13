/**
 * P64 — Retail Inventory Turnover Risk Calculator premium-schema FormulaContract (factory generated).
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
import { RETAIL_INVENTORY_TURNOVER_RISK_INPUT_KEYS } from "@/lib/premium-schema/calculators/retail-inventory-turnover-risk-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...RETAIL_INVENTORY_TURNOVER_RISK_INPUT_KEYS];
const OUTPUTS = [
  "totalExposure",
  "turnover",
  "carryingCost",
  "markdownExposure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const RetailInventoryTurnoverRiskCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.retail-inventory-turnover-risk",
  toolName: "Retail Inventory Turnover Risk Calculator",
  slug: "retail-inventory-turnover-risk",
  purpose: "Retailers lose cash when slow inventory, markdowns and carrying cost are not measured together.",
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
    "turnover via retail.inventory_turnover pipeline step.",
    "carryingCost via cost.percent_of_amount pipeline step.",
    "markdownExposure via cost.percent_of_amount pipeline step.",
    "totalExposure via cost.total2 pipeline step.",
    "summaryLevel uses totalExposure thresholds.",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/retail-inventory-turnover-risk-validation.ts",
      "validateRetailInventoryTurnoverRiskInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/retail-inventory-turnover-risk.ts",
      "calculateRetailInventoryTurnoverRisk(inputs) → exposure metrics and decisionVerdict",
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

export const RETAIL_INVENTORY_TURNOVER_RISK_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  RetailInventoryTurnoverRiskCalculatorContract,
];
