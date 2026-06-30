/**
 * P62 — Painting rework and coverage risk premium-schema FormulaContract.
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
import { PAINTING_REWORK_COVERAGE_RISK_INPUT_KEYS } from "@/lib/features/premium-schema/calculators/painting-rework-coverage-risk-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or coating specification advice. Verify assumptions before quoting or job acceptance.";

const METADATA_LAST_UPDATED = "2026-06-13";
const METADATA_VALID_UNTIL = "2027-06-13";

const MARGIN_PRESSURE_WARNING_THRESHOLD = 5;
const MARGIN_PRESSURE_CRITICAL_THRESHOLD = 12;

const REQUIRED_INPUTS = ["dummy"];

const OUTPUTS = [
  "coverageDriftCost",
  "prepReworkCost",
  "totalExposure",
  "marginPressure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const PaintingReworkCoverageRiskCalculatorContract: FormulaContract =
  buildAssuredCriticalContract({
    toolId: "premium-schema.painting-rework-coverage-risk",
    toolName: "Painting Rework and Coverage Risk Calculator",
    slug: "painting-rework-coverage-risk",
    purpose:
      "Quantify coverage drift, prep rework and scaffold exposure as margin pressure on painting job revenue.",
    userDecision:
      "What is total painting rework exposure and margin pressure for this job profile?",
    decisionImpact: "financial",
    requiredInputs: REQUIRED_INPUTS,
    criticalInputs: REQUIRED_INPUTS,
    outputs: ["dummy"],
    assumptions: [
      PREMIUM_SCHEMA_DISCLAIMER,
      "This tool estimates painting rework exposure from user-supplied material, labor and scaffold inputs.",
      `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
      `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
      "coverageDriftCost = paintMaterialCost × coverageDriftPercent ÷ 100.",
      "prepReworkCost = prepReworkHours × laborRate.",
      "totalExposure = coverageDriftCost + prepReworkCost + scaffoldCost.",
      "marginPressure = totalExposure ÷ jobRevenue × 100.",
      `summaryLevel low when marginPressure < ${MARGIN_PRESSURE_WARNING_THRESHOLD}; warning when ${MARGIN_PRESSURE_WARNING_THRESHOLD} ≤ marginPressure < ${MARGIN_PRESSURE_CRITICAL_THRESHOLD}; critical when marginPressure ≥ ${MARGIN_PRESSURE_CRITICAL_THRESHOLD}.`,
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/painting-rework-coverage-risk-validation.ts",
        "validatePaintingReworkCoverageRiskInputs(inputs) → validation errors and warnings",
      ),
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/painting-rework-coverage-risk.ts",
        "calculatePaintingReworkCoverageRisk(inputs) → rework metrics and decisionVerdict",
      ),
    ],
    formulaSummary:
      "Deterministic coverage drift, prep rework and scaffold exposure with margin pressure percent; summaryLevel follows schema marginPressure thresholds.",
    missingParameterWarnings: [],
    warningPolicy: createWarningPolicy({
      acceptedAssumptions: [
        GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
        "Job revenue and cost inputs align to the same painting contract scope.",
        "Coverage drift percent supplied from spread rate variance versus estimate.",
      ],
      modelLimitations: [
        "Not a coating specification or surface preparation certification tool.",
        "Does not model weather delays, multi-coat systems or warranty callbacks.",
        "Does not guarantee job profit or square-meter quote accuracy.",
      ],
      futureExtensions: [
        "Square-meter spread rate bands and multi-coat material stacks.",
        "Weather delay and touch-up callback exposure.",
      ],
    }),
    validationRules: [
      {
        id: "job-revenue-positive",
        description: "jobRevenue must be greater than zero.",
        kind: "edge",
      },
      {
        id: "coverage-drift-range",
        description: "coverageDriftPercent must be between 0 and 100.",
        kind: "edge",
      },
      {
        id: "non-negative-costs",
        description: "Material, labor and scaffold inputs must be non-negative.",
        kind: "edge",
      },
      {
        id: "finite-inputs",
        description: "All inputs must be finite numbers; missing or NaN inputs fail validation.",
        kind: "edge",
      },
    ],
    scenarioSpecs: [
      { id: "normal-prep", description: "Moderate prep rework with low margin pressure." },
      { id: "warning-pressure", description: "Margin pressure between warning and critical thresholds." },
      { id: "critical-pressure", description: "Margin pressure at or above critical threshold." },
    ],
    monotonicityRules: [
      {
        id: "drift-up-cost",
        description: "Higher coverageDriftPercent must not decrease coverageDriftCost when material cost is positive.",
        inputKey: "coverageDriftPercent",
        direction: "increase_should_increase",
        outputKey: "coverageDriftCost",
      },
      {
        id: "prep-up-cost",
        description: "Higher prepReworkHours must not decrease prepReworkCost when labor rate is positive.",
        inputKey: "prepReworkHours",
        direction: "increase_should_increase",
        outputKey: "prepReworkCost",
      },
    ],
    decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
    mustNotClaim: [
      ...STANDARD_MUST_NOT_CLAIM,
      "Coating specification approval",
      "Guaranteed job profit",
      "Surface preparation certification",
    ],
  });

export const PAINTING_REWORK_COVERAGE_RISK_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] =
  [PaintingReworkCoverageRiskCalculatorContract];
