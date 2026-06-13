/**
 * P64 — Energy Savings Package Calculator premium-schema FormulaContract (factory generated).
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
import { ENERGY_SAVINGS_PACKAGE_CALCULATOR_INPUT_KEYS } from "@/lib/premium-schema/calculators/energy-savings-package-calculator-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...ENERGY_SAVINGS_PACKAGE_CALCULATOR_INPUT_KEYS];
const OUTPUTS = [
  "annualSavingsCost",
  "monthlySavingsCost",
  "paybackYears",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const EnergySavingsPackageCalculatorCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.energy-savings-package-calculator",
  toolName: "Energy Savings Package Calculator",
  slug: "energy-savings-package-calculator",
  purpose: "Efficiency projects move forward without a documented savings and payback baseline.",
  userDecision: "What is the deterministic annualSavingsCost exposure for this input profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: [...OUTPUTS],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool provides deterministic cost/risk/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.",
    "Metadata lastUpdated: 2026-06-13.",
    "Metadata validUntil: 2027-06-13.",
    "monthlyKwhSavings via energy.monthly_kwh_savings pipeline step.",
    "monthlySavingsCost via energy.kwh_cost pipeline step.",
    "annualSavingsCost via cost.annualize pipeline step.",
    "paybackYears via finance.payback_years pipeline step.",
    "summaryLevel uses annualSavingsCost thresholds.",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/energy-savings-package-calculator-validation.ts",
      "validateEnergySavingsPackageCalculatorInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/energy-savings-package-calculator.ts",
      "calculateEnergySavingsPackageCalculator(inputs) → exposure metrics and decisionVerdict",
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

export const ENERGY_SAVINGS_PACKAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  EnergySavingsPackageCalculatorCalculatorContract,
];
