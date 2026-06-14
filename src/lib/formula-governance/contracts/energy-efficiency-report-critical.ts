/**
 * P64 — Energy Peak & Efficiency Loss Report premium-schema FormulaContract (factory generated).
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
import { ENERGY_EFFICIENCY_REPORT_INPUT_KEYS } from "@/lib/premium-schema/calculators/energy-efficiency-report-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...ENERGY_EFFICIENCY_REPORT_INPUT_KEYS];
const OUTPUTS = [
  "kwhVariancePercent",
  "excessKwhCost",
  "peakCost",
  "totalExposure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const EnergyEfficiencyReportCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.energy-efficiency-report",
  toolName: "Energy Peak & Efficiency Loss Report",
  slug: "energy-efficiency-report",
  purpose: "Peak demand, excess kWh and tariff drift inflate bills beyond the visible meter reading.",
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
    "kwhVariancePercent via benchmark.variance_percent pipeline step.",
    "excessKwhCost via energy.excess_kwh_cost pipeline step.",
    "peakCost via energy.peak_demand_cost pipeline step.",
    "totalEnergyCost via energy.total_energy_cost pipeline step.",
    "totalExposure via loss.total_exposure pipeline step.",
    "summaryLevel uses kwhVariancePercent thresholds warning 10 / critical 20 (higher_is_bad).",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/energy-efficiency-report-validation.ts",
      "validateEnergyEfficiencyReportInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/energy-efficiency-report.ts",
      "calculateEnergyEfficiencyReport(inputs) → exposure metrics and decisionVerdict",
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

export const ENERGY_EFFICIENCY_REPORT_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  EnergyEfficiencyReportCalculatorContract,
];
