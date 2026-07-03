// SectorCalc SuperV4 V5.3 Engineering Reference Range Evaluator
// Evaluates whether input values fall within, below, or above engineering reference ranges.

import type {
  EngineeringReferenceRange,
  ReferenceRangeAudit,
  SourceStatus,
} from "./contract-types";

export interface RangeEvaluationResult {
  audit: ReferenceRangeAudit[];
  warnings: Array<{
    inputId: string;
    severity: "INFO" | "WARNING" | "REVIEW";
    message: string;
  }>;
}

export function evaluateReferenceRange(
  inputId: string,
  value: number,
  range: EngineeringReferenceRange | undefined,
): ReferenceRangeAudit | null {
  if (!range) return null;

  if (range.warning_behavior === "NOT_APPLICABLE") {
    return {
      input_id: inputId,
      value,
      unit: range.unit,
      range_min: range.min,
      range_max: range.max,
      range_unit: range.unit,
      status: "NOT_APPLICABLE",
      source: range.source,
      warning_message: range.not_applicable_reason || "Reference range not applicable for this input.",
    };
  }

  const status = range.min !== null && value < range.min
    ? "BELOW"
    : range.max !== null && value > range.max
      ? "ABOVE"
      : "INSIDE";

  const warningMessage = status === "INSIDE"
    ? ""
    : status === "BELOW"
      ? `Value ${value} ${range.unit} is below engineering reference range [${range.min}, ${range.max}] ${range.unit}`
      : `Value ${value} ${range.unit} exceeds engineering reference range [${range.min}, ${range.max}] ${range.unit}`;

  return {
    input_id: inputId,
    value,
    unit: range.unit,
    range_min: range.min,
    range_max: range.max,
    range_unit: range.unit,
    status,
    source: range.source,
    warning_message: warningMessage,
  };
}

export function evaluateAllReferenceRanges(
  inputs: Array<{
    id: string;
    engineering_reference_range?: EngineeringReferenceRange;
  }>,
  values: Record<string, number>,
): RangeEvaluationResult {
  const audit: ReferenceRangeAudit[] = [];
  const warnings: RangeEvaluationResult["warnings"] = [];

  for (const inp of inputs) {
    if (!inp.engineering_reference_range) continue;

    const value = values[inp.id];
    if (value === undefined || value === null) continue;

    const result = evaluateReferenceRange(inp.id, value, inp.engineering_reference_range);
    if (result) {
      audit.push(result);
      if (result.status !== "INSIDE" && result.status !== "NOT_APPLICABLE") {
        warnings.push({
          inputId: inp.id,
          severity: result.status === "ABOVE" ? "WARNING" : "REVIEW",
          message: result.warning_message,
        });
      }
    }
  }

  return { audit, warnings };
}

// Check if reference range is defined properly for every input that requires one
export function validateReferenceRangeContract(
  inputs: Array<{
    id: string;
    engineering_reference_range?: EngineeringReferenceRange;
    criticality: string;
  }>,
): string[] {
  const errors: string[] = [];

  for (const inp of inputs) {
    const range = inp.engineering_reference_range;
    if (!range) {
      // CRITICAL inputs must have a reference range or NOT_APPLICABLE
      if (inp.criticality === "CRITICAL") {
        errors.push(
          `CRITICAL input ${inp.id} is missing engineering_reference_range. Define a range or set warning_behavior=NOT_APPLICABLE with a reason.`,
        );
      }
      continue;
    }

    if (range.warning_behavior === "NOT_APPLICABLE" && !range.not_applicable_reason) {
      errors.push(
        `Input ${inp.id} has reference range NOT_APPLICABLE but no not_applicable_reason provided.`,
      );
    }
  }

  return errors;
}
