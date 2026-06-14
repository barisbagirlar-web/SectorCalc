/**
 * P64 — Route & Freight Loss Analyzer premium-schema FormulaContract (factory generated).
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
import { ROUTE_OPTIMIZATION_ANALYZER_INPUT_KEYS } from "@/lib/premium-schema/calculators/route-optimization-analyzer-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...ROUTE_OPTIMIZATION_ANALYZER_INPUT_KEYS];
const OUTPUTS = [
  "deadheadCost",
  "driverCost",
  "totalFreightCost",
  "totalExposure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const RouteOptimizationAnalyzerCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.route-optimization-analyzer",
  toolName: "Route & Freight Loss Analyzer",
  slug: "route-optimization-analyzer",
  purpose: "Model deadhead, tolls, driver rest risk and minimum safe freight price for logistics lanes.",
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
    "deadheadCost via route.deadhead_cost pipeline step.",
    "driverCost via loss.time_cost pipeline step.",
    "fuelCost via energy.kwh_cost pipeline step.",
    "totalFreightCost via route.total_freight_cost pipeline step.",
    "totalExposure via loss.total_exposure pipeline step.",
    "summaryLevel uses deadheadCost thresholds warning 80 / critical 150 (higher_is_bad).",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/route-optimization-analyzer-validation.ts",
      "validateRouteOptimizationAnalyzerInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/route-optimization-analyzer.ts",
      "calculateRouteOptimizationAnalyzer(inputs) → exposure metrics and decisionVerdict",
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

export const ROUTE_OPTIMIZATION_ANALYZER_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  RouteOptimizationAnalyzerCalculatorContract,
];
