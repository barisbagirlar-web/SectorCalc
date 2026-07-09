// SectorCalc — Free Tool Decision State Resolver
// Pure logic: resolves decision state string from result + comparator values.
// No UI, no React, no side effects.

export interface DecisionStateInput {
  /** The primary calculated value */
  calculatedValue: number;
  /** The primary result label in business language */
  resultLabel?: string;
  /** Comparator input value (e.g. current shop rate, target price) */
  currentValue?: number;
  /** The comparator input label */
  currentLabel?: string;
  /** True if a positive result is expected (e.g. cost, rate) */
  positiveExpected?: boolean;
  /** True if the calculation produced valid results */
  isValid: boolean;
}

export interface DecisionStateResult {
  /** Short categorical label */
  state: string;
  /** Severity: "info" | "warning" | "danger" */
  severity: "info" | "warning" | "success";
  /** Explanation or rationale */
  reason?: string;
}

/**
 * Resolve decision state from calculation result and optional comparator.
 *
 * Generic logic:
 * - Invalid: "Input check required"
 * - Result is zero/negative where positive expected: "Review inputs"
 * - Comparator exists and current >= calculated: "Above calculated cost floor"
 * - Comparator exists and current < calculated: "Below calculated cost floor"
 * - No comparator, result is valid: "Calculated result available"
 */
export function resolveDecisionState(input: DecisionStateInput): DecisionStateResult {
  if (!input.isValid) {
    return {
      state: "Input check required",
      severity: "warning",
      reason: "Verify all input values before using this result.",
    };
  }

  const { calculatedValue, currentValue, positiveExpected } = input;

  // Result is zero/negative where positive expected
  if (positiveExpected !== false && (!Number.isFinite(calculatedValue) || calculatedValue <= 0)) {
    return {
      state: "Review inputs before using this result",
      severity: "warning",
      reason: "The calculated value is zero or negative. Check input values for errors.",
    };
  }

  // Comparator exists
  if (currentValue !== undefined && Number.isFinite(currentValue)) {
    if (currentValue >= calculatedValue) {
      return {
        state: "Above calculated cost floor",
        severity: "success",
        reason: "Current value covers the calculated requirement.",
      };
    }
    return {
      state: "Below calculated cost floor",
      severity: "warning",
      reason: "Current value is below the calculated requirement. Review costing or pricing.",
    };
  }

  // No comparator, valid result
  return {
    state: "Calculated result available",
    severity: "info",
    reason: "Use this result as a free screening output. Verify inputs before use.",
  };
}
