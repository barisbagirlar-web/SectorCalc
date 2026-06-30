/**
 * P64 — Fuel and Route Drift Calculator premium-schema FormulaContract (factory generated).
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
import { LOGISTICS_FUEL_ROUTE_DRIFT_INPUT_KEYS } from "@/lib/features/premium-schema/calculators/logistics-fuel-route-drift-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = ["dummy"];
const OUTPUTS = [
  "totalExposure",
  "distanceDriftCost",
  "idleCost",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const LogisticsFuelRouteDriftCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.logistics-fuel-route-drift",
  toolName: "Fuel and Route Drift Calculator",
  slug: "logistics-fuel-route-drift",
  purpose: "Logistics routes lose money when fuel drift, idle time and route deviation are treated as normal cost.",
  userDecision: "What is the deterministic totalExposure exposure for this input profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: ["dummy"],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool provides deterministic cost/risk/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.",
    "Metadata lastUpdated: 2026-06-13.",
    "Metadata validUntil: 2027-06-13.",
    "distanceDriftCost via route.distance_drift_cost pipeline step.",
    "idleCost via time.labor_cost pipeline step.",
    "totalExposure via cost.sum2 pipeline step.",
    "summaryLevel uses idleHours thresholds warning 3 / critical 8 (higher_is_bad).",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/logistics-fuel-route-drift-validation.ts",
      "validateLogisticsFuelRouteDriftInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/logistics-fuel-route-drift.ts",
      "calculateLogisticsFuelRouteDrift(inputs) → exposure metrics and decisionVerdict",
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

export const LOGISTICS_FUEL_ROUTE_DRIFT_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  LogisticsFuelRouteDriftCalculatorContract,
];
