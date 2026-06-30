/**
 * P62 — Construction subcontractor margin leak premium-schema FormulaContract.
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
import { CONSTRUCTION_SUBCONTRACTOR_MARGIN_LEAK_INPUT_KEYS } from "@/lib/features/premium-schema/calculators/construction-subcontractor-margin-leak-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or contract advice. Verify assumptions before subcontractor or bidding decisions.";

const METADATA_LAST_UPDATED = "2026-06-13";
const METADATA_VALID_UNTIL = "2027-06-13";

const MARGIN_PRESSURE_WARNING_THRESHOLD = 3;
const MARGIN_PRESSURE_CRITICAL_THRESHOLD = 7;

const REQUIRED_INPUTS = ["dummy"];

const OUTPUTS = [
  "subcontractorVariance",
  "totalExposure",
  "marginPressure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const ConstructionSubcontractorMarginLeakCalculatorContract: FormulaContract =
  buildAssuredCriticalContract({
    toolId: "premium-schema.construction-subcontractor-margin-leak",
    toolName: "Subcontractor Margin Leak Calculator",
    slug: "construction-subcontractor-margin-leak",
    purpose:
      "Quantify subcontractor variance, delay and material leak exposure as margin pressure on contract value.",
    userDecision:
      "What is total subcontractor leak exposure and margin pressure for this contract profile?",
    decisionImpact: "financial",
    requiredInputs: REQUIRED_INPUTS,
    criticalInputs: REQUIRED_INPUTS,
    outputs: ["dummy"],
    assumptions: [
      PREMIUM_SCHEMA_DISCLAIMER,
      "This tool estimates subcontractor margin leak from user-supplied contract value, sub cost and variance inputs.",
      `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
      `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
      "subcontractorVariance = max(actualSubcontractorCost − plannedSubcontractorCost, 0).",
      "totalExposure = subcontractorVariance + delayCost + materialVariance.",
      "marginPressure = totalExposure ÷ contractValue × 100.",
      `summaryLevel low when marginPressure < ${MARGIN_PRESSURE_WARNING_THRESHOLD}; warning when ${MARGIN_PRESSURE_WARNING_THRESHOLD} ≤ marginPressure < ${MARGIN_PRESSURE_CRITICAL_THRESHOLD}; critical when marginPressure ≥ ${MARGIN_PRESSURE_CRITICAL_THRESHOLD}.`,
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/construction-subcontractor-margin-leak-validation.ts",
        "validateConstructionSubcontractorMarginLeakInputs(inputs) → validation errors and warnings",
      ),
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/construction-subcontractor-margin-leak.ts",
        "calculateConstructionSubcontractorMarginLeak(inputs) → margin leak metrics and decisionVerdict",
      ),
    ],
    formulaSummary:
      "Deterministic subcontractor variance, delay and material leak stack with margin pressure percent; summaryLevel follows schema marginPressure thresholds.",
    missingParameterWarnings: [],
    warningPolicy: createWarningPolicy({
      acceptedAssumptions: [
        GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
        "Contract value and subcontractor costs align to the same project scope.",
        "Variance uses max(actual − planned, 0) without credit for under-run.",
      ],
      modelLimitations: [
        "Not a change-order adjudication or lien risk engine.",
        "Does not model retainage, bonding or liquidated damages.",
        "Does not guarantee subcontractor recovery or repricing outcomes.",
      ],
      futureExtensions: [
        "Trade-level variance attribution and delay claim linkage.",
        "Retainage and bonding cost bands.",
      ],
    }),
    validationRules: [
      {
        id: "contract-value-positive",
        description: "contractValue must be greater than zero.",
        kind: "edge",
      },
      {
        id: "non-negative-costs",
        description: "Subcontractor, delay and material inputs must be non-negative.",
        kind: "edge",
      },
      {
        id: "finite-inputs",
        description: "All inputs must be finite numbers; missing or NaN inputs fail validation.",
        kind: "edge",
      },
    ],
    scenarioSpecs: [
      { id: "normal-variance", description: "Minimal subcontractor variance with low margin pressure." },
      { id: "warning-pressure", description: "Margin pressure between warning and critical thresholds." },
      { id: "critical-pressure", description: "Margin pressure at or above critical threshold." },
    ],
    monotonicityRules: [
      {
        id: "actual-up-variance",
        description: "Higher actualSubcontractorCost must not decrease subcontractorVariance.",
        inputKey: "actualSubcontractorCost",
        direction: "increase_should_increase",
        outputKey: "subcontractorVariance",
      },
      {
        id: "delay-up-exposure",
        description: "Higher delayCost must not decrease totalExposure.",
        inputKey: "delayCost",
        direction: "increase_should_increase",
        outputKey: "totalExposure",
      },
    ],
    decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
    mustNotClaim: [
      ...STANDARD_MUST_NOT_CLAIM,
      "Contract approval",
      "Guaranteed margin recovery",
      "Subcontractor liability verdict",
    ],
  });

export const CONSTRUCTION_SUBCONTRACTOR_MARGIN_LEAK_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] =
  [ConstructionSubcontractorMarginLeakCalculatorContract];
