/**
 * P61 — Calibration drift risk premium-schema FormulaContract.
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
import { CALIBRATION_DRIFT_RISK_INPUT_KEYS } from "@/lib/premium-schema/calculators/calibration-drift-risk-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or compliance certification advice. Verify assumptions before quality or release decisions.";

const METADATA_LAST_UPDATED = "2026-06-13";
const METADATA_VALID_UNTIL = "2027-06-13";

const TOLERANCE_WARNING_THRESHOLD = 70;
const TOLERANCE_CRITICAL_THRESHOLD = 100;

const REQUIRED_INPUTS = [...CALIBRATION_DRIFT_RISK_INPUT_KEYS];

const OUTPUTS = [
  "toleranceUsage",
  "rejectionExposure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const CalibrationDriftRiskCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.calibration-drift-risk",
  toolName: "Calibration Drift Risk Calculator",
  slug: "calibration-drift-risk",
  purpose:
    "Quantify tolerance band usage and monetary rejection exposure when measurement drift threatens batch acceptance.",
  userDecision:
    "What is the tolerance usage percent and rejection exposure for this measured value versus target?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: [...OUTPUTS],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool estimates tolerance usage and rejection exposure from user-supplied measurement and batch inputs. It is not a calibration certificate or compliance verdict.",
    `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
    `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
    "toleranceUsage = |actualValue − targetValue| ÷ tolerance × 100.",
    "rejectionExposure = batchValue × rejectionRiskPercent ÷ 100.",
    `summaryLevel low when toleranceUsage < ${TOLERANCE_WARNING_THRESHOLD}; warning when ${TOLERANCE_WARNING_THRESHOLD} ≤ toleranceUsage < ${TOLERANCE_CRITICAL_THRESHOLD}; critical when toleranceUsage ≥ ${TOLERANCE_CRITICAL_THRESHOLD}.`,
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/calibration-drift-risk-validation.ts",
      "validateCalibrationDriftRiskInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/calibration-drift-risk.ts",
      "calculateCalibrationDriftRisk(inputs) → tolerance usage, rejection exposure and decisionVerdict",
    ),
  ],
  formulaSummary:
    "Deterministic tolerance band usage percent plus batch rejection exposure; summaryLevel follows schema toleranceUsage thresholds.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "Rejection risk percent is supplied by the user and applied linearly to batch value.",
      "Single measurement point versus target; no multi-instrument stack-up in this tool.",
    ],
    modelLimitations: [
      "Not a calibration certificate, ISO audit, or compliance approval engine.",
      "Does not model Gage R&R, Cpk, or multi-feature tolerance stacks.",
      "Does not guarantee scrap rate or reject counts in production.",
    ],
    futureExtensions: [
      "Optional multi-feature tolerance stack and drift trend history.",
      "Link rejection exposure to historical scrap rate bands.",
    ],
  }),
  validationRules: [
    { id: "tolerance-positive", description: "tolerance must be greater than zero.", kind: "edge" },
    {
      id: "batch-non-negative",
      description: "batchValue must be greater than or equal to zero.",
      kind: "edge",
    },
    {
      id: "rejection-percent-range",
      description: "rejectionRiskPercent must be between 0 and 100.",
      kind: "edge",
    },
    {
      id: "finite-inputs",
      description: "All inputs must be finite numbers; missing or NaN inputs fail validation.",
      kind: "edge",
    },
  ],
  scenarioSpecs: [
    { id: "normal-drift", description: "Moderate drift within tolerance band." },
    { id: "warning-band", description: "Tolerance usage between warning and critical thresholds." },
    { id: "critical-band", description: "Tolerance usage at or above critical threshold." },
    { id: "zero-batch", description: "Zero batch value yields zero rejection exposure." },
  ],
  monotonicityRules: [
    {
      id: "batch-up-exposure",
      description: "Higher batchValue must not decrease rejectionExposure when rejection risk is positive.",
      inputKey: "batchValue",
      direction: "increase_should_increase",
      outputKey: "rejectionExposure",
    },
    {
      id: "risk-up-exposure",
      description: "Higher rejectionRiskPercent must not decrease rejectionExposure.",
      inputKey: "rejectionRiskPercent",
      direction: "increase_should_increase",
      outputKey: "rejectionExposure",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [
    ...STANDARD_MUST_NOT_CLAIM,
    "Calibration certificate",
    "Compliance approval",
    "Guaranteed reject rate",
  ],
});

export const CALIBRATION_DRIFT_RISK_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  CalibrationDriftRiskCalculatorContract,
];
