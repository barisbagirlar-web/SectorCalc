/**
 * P64 — Kapasite Planlama Ve Darbogaz Yatirim Onceliklendirme premium-schema FormulaContract (factory generated).
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
import { KAPASITE_PLANLAMA_VE_DARBOGAZ_YATIRIM_ONCELIKLENDIRME_CALCULATOR_INPUT_KEYS } from "@/lib/premium-schema/calculators/kapasite-planlama-ve-darbogaz-yatirim-onceliklendirme-calculator-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...KAPASITE_PLANLAMA_VE_DARBOGAZ_YATIRIM_ONCELIKLENDIRME_CALCULATOR_INPUT_KEYS];
const OUTPUTS = [
  "totalExposure",
  "variancePercent",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict"
] as const;

export const KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.kapasite-planlama-ve-darbogaz-yatirim-onceliklendirme-calculator",
  toolName: "Kapasite Planlama Ve Darbogaz Yatirim Onceliklendirme",
  slug: "kapasite-planlama-ve-darbogaz-yatirim-onceliklendirme-calculator",
  purpose: "Quantify totalExposure exposure for Kapasite Planlama Ve Darbogaz Yatirim Onceliklendirme.",
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
    "totalExposure via cost.total_exposure pipeline step.",
    "variancePercent via benchmark.variance_percent pipeline step.",
    "summaryLevel uses totalExposure thresholds warning 1 / critical 3 (higher_is_bad).",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/kapasite-planlama-ve-darbogaz-yatirim-onceliklendirme-calculator-validation.ts",
      "validateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/kapasite-planlama-ve-darbogaz-yatirim-onceliklendirme-calculator.ts",
      "calculateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculator(inputs) → exposure metrics and decisionVerdict",
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

export const KAPASITE_PLANLAMA_VE_DARBOGAZ_YATIRIM_ONCELIKLENDIRME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorCalculatorContract,
];
