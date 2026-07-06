import {
  TOOL_UNCERTAINTY_DEFAULTS,
  CALIBRATION_MULTIPLIER,
  COVERAGE_FACTOR_K2,
  CONFIDENCE_CLASS_BOUNDARIES,
} from "../diagnostic-constants";
import type {
  MeasurementConfidenceInput,
  MeasurementConfidenceOutput,
  ConfidenceClass,
  ToleranceStatus,
  DecisionState,
} from "../diagnostic-types";

function getToolUncertainty(tool: string): number {
  return TOOL_UNCERTAINTY_DEFAULTS[tool as keyof typeof TOOL_UNCERTAINTY_DEFAULTS] ?? 0.05;
}

function getCalibrationMultiplier(status: string): number {
  return CALIBRATION_MULTIPLIER[status as keyof typeof CALIBRATION_MULTIPLIER] ?? 1.5;
}

/**
 * Compute measurement expanded uncertainty k=2.
 *
 * expanded_uncertainty_k2 = COVERAGE_FACTOR_K2 * tool_uncertainty * calibration_multiplier
 */
export function computeExpandedUncertainty(
  tool: string,
  calibrationStatus: string
): number {
  const toolUncertainty = getToolUncertainty(tool);
  const calMultiplier = getCalibrationMultiplier(calibrationStatus);
  return COVERAGE_FACTOR_K2 * toolUncertainty * calMultiplier;
}

/**
 * Determine confidence class by comparing expanded uncertainty to tolerance span.
 *
 * tolerance_span = tolerance_plus + tolerance_minus
 *
 * Rules:
 * - expanded_uncertainty_k2 <= 0.5 * tolerance_span  → HIGH
 * - expanded_uncertainty_k2 <= 1.0 * tolerance_span  → MEDIUM
 * - otherwise                                           → LOW
 */
export function determineConfidenceClass(
  expandedUncertaintyK2: number,
  tolerancePlus: number,
  toleranceMinus: number
): ConfidenceClass {
  const toleranceSpan = tolerancePlus + toleranceMinus;
  if (toleranceSpan <= 0) return "LOW";
  const ratio = expandedUncertaintyK2 / toleranceSpan;
  if (ratio <= CONFIDENCE_CLASS_BOUNDARIES.HIGH.min_ratio) return "HIGH";
  if (ratio <= CONFIDENCE_CLASS_BOUNDARIES.MEDIUM.min_ratio) return "MEDIUM";
  return "LOW";
}

/**
 * Determine tolerance status and mandatory decision floor.
 *
 * Computes distance to nearest tolerance limit. If that distance
 * is less than expanded_uncertainty_k2, the measurement is
 * "UNCERTAIN" and must force STOP_AND_INSPECT.
 */
export function determineToleranceStatus(
  measuredValue: number,
  nominalValue: number,
  tolerancePlus: number,
  toleranceMinus: number,
  expandedUncertaintyK2: number
): {
  toleranceStatus: ToleranceStatus;
  mandatoryDecisionFloor: DecisionState | null;
} {
  const upperLimit = nominalValue + tolerancePlus;
  const lowerLimit = nominalValue - toleranceMinus;

  const distanceToUpper = upperLimit - measuredValue;
  const distanceToLower = measuredValue - lowerLimit;

  let toleranceStatus: ToleranceStatus;
  let mandatoryDecisionFloor: DecisionState | null = null;

  if (measuredValue > upperLimit || measuredValue < lowerLimit) {
    toleranceStatus = "BREACH";
  } else {
    const distanceToNearestLimit = Math.min(distanceToUpper, distanceToLower);

    if (distanceToNearestLimit < expandedUncertaintyK2) {
      toleranceStatus = "UNCERTAIN";
      mandatoryDecisionFloor = "STOP_AND_INSPECT";
    } else if (distanceToNearestLimit < 2 * expandedUncertaintyK2) {
      toleranceStatus = "NEAR_LIMIT";
    } else {
      toleranceStatus = "INSIDE";
    }
  }

  return { toleranceStatus, mandatoryDecisionFloor };
}

/**
 * Full measurement confidence evaluation.
 *
 * Deterministic engine — no random values, no LLM calls.
 */
export function evaluateMeasurementConfidence(
  input: MeasurementConfidenceInput
): MeasurementConfidenceOutput {
  const expandedUncertaintyK2 = computeExpandedUncertainty(
    input.measurement_tool,
    input.calibration_status
  );

  const confidenceClass = determineConfidenceClass(
    expandedUncertaintyK2,
    input.tolerance_plus,
    input.tolerance_minus
  );

  const { toleranceStatus, mandatoryDecisionFloor } = determineToleranceStatus(
    input.measured_value,
    input.nominal_value,
    input.tolerance_plus,
    input.tolerance_minus,
    expandedUncertaintyK2
  );

  return {
    expanded_uncertainty_k2: expandedUncertaintyK2,
    confidence_class: confidenceClass,
    tolerance_status: toleranceStatus,
    mandatory_decision_floor: mandatoryDecisionFloor,
  };
}
