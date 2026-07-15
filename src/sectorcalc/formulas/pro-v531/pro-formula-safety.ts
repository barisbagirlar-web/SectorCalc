import "server-only";

import type { ProFormulaResult, ProFormulaStatus } from "./pro-formula-contract";

const EPSILON = 1e-12;

export interface FormulaValidationState {
  errors: string[];
  warnings: string[];
}

export function createValidationState(): FormulaValidationState {
  return { errors: [], warnings: [] };
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function requireFiniteInputs(
  inputs: Record<string, number>,
  keys: readonly string[],
  state: FormulaValidationState,
): Record<string, number> {
  const values: Record<string, number> = {};
  for (const key of keys) {
    const value = inputs[key];
    if (!isFiniteNumber(value)) {
      state.errors.push(`Missing or non-finite required input: ${key}.`);
      continue;
    }
    values[key] = value;
  }

  const expected = new Set(keys);
  const unexpected = Object.keys(inputs).filter((key) => !expected.has(key));
  if (unexpected.length > 0) {
    state.errors.push(`Unexpected normalized inputs: ${unexpected.sort().join(", ")}.`);
  }

  return values;
}

export function requirePositive(
  value: number,
  label: string,
  state: FormulaValidationState,
): void {
  if (!isFiniteNumber(value) || value <= 0) {
    state.errors.push(`${label} must be greater than zero.`);
  }
}

export function requireNonNegative(
  value: number,
  label: string,
  state: FormulaValidationState,
): void {
  if (!isFiniteNumber(value) || value < 0) {
    state.errors.push(`${label} must not be negative.`);
  }
}

export function requireRange(
  value: number,
  min: number,
  max: number,
  label: string,
  state: FormulaValidationState,
  options: { minInclusive?: boolean; maxInclusive?: boolean } = {},
): void {
  const minInclusive = options.minInclusive ?? true;
  const maxInclusive = options.maxInclusive ?? true;
  const below = minInclusive ? value < min : value <= min;
  const above = maxInclusive ? value > max : value >= max;
  if (!isFiniteNumber(value) || below || above) {
    const left = minInclusive ? "[" : "(";
    const right = maxInclusive ? "]" : ")";
    state.errors.push(`${label} must be within ${left}${min}, ${max}${right}.`);
  }
}

export function requireInteger(
  value: number,
  min: number,
  max: number,
  label: string,
  state: FormulaValidationState,
): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    state.errors.push(`${label} must be an integer between ${min} and ${max}.`);
  }
}

export function divideOrError(
  numerator: number,
  denominator: number,
  label: string,
  state: FormulaValidationState,
): number {
  if (!isFiniteNumber(numerator) || !isFiniteNumber(denominator)) {
    state.errors.push(`${label} received a non-finite operand.`);
    return Number.NaN;
  }
  if (Math.abs(denominator) <= EPSILON) {
    state.errors.push(`${label} denominator must not be zero.`);
    return Number.NaN;
  }
  return numerator / denominator;
}

export function roundDisplay(value: number, decimals: number): number {
  if (!isFiniteNumber(value)) return value;
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function assertFiniteOutputs(
  outputs: Record<string, number>,
  outputKeys: readonly string[],
  state: FormulaValidationState,
): void {
  const actualKeys = Object.keys(outputs).sort();
  const expectedKeys = [...outputKeys].sort();
  if (
    actualKeys.length !== expectedKeys.length ||
    actualKeys.some((key, index) => key !== expectedKeys[index])
  ) {
    state.errors.push(
      `Output key mismatch. Expected=[${expectedKeys.join(", ")}], Actual=[${actualKeys.join(", ")}].`,
    );
  }

  for (const key of outputKeys) {
    if (!isFiniteNumber(outputs[key])) {
      state.errors.push(`Output ${key} is non-finite.`);
    }
  }
}

export function blockedResult(
  outputKeys: readonly string[],
  reasons: readonly string[],
): ProFormulaResult {
  return {
    status: "BLOCKED",
    // A blocked calculation has no valid numeric result. Returning zero-filled
    // outputs creates plausible-looking business values and can leak into report
    // adapters. Keep the declared namespace for diagnostics, but expose no
    // output values until every input and formula invariant passes.
    outputs: {},
    warnings: [...reasons],
    outputKeys: [...outputKeys],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export function finalizeResult(args: {
  outputs: Record<string, number>;
  outputKeys: readonly string[];
  state: FormulaValidationState;
  status?: ProFormulaStatus;
}): ProFormulaResult {
  assertFiniteOutputs(args.outputs, args.outputKeys, args.state);
  if (args.state.errors.length > 0) {
    return blockedResult(args.outputKeys, args.state.errors);
  }

  return {
    status: args.status ?? (args.state.warnings.length > 0 ? "REVIEW" : "OK"),
    outputs: args.outputs,
    warnings: [...args.state.warnings],
    outputKeys: [...args.outputKeys],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export function integrityWarningIsBlocking(message: string): boolean {
  const normalized = message.toLowerCase();
  return [
    "missing or non-finite",
    "missing:",
    "using 0",
    "corrected to zero",
    "non-finite output",
    "division by zero",
    "denominator must not be zero",
    "invalid input",
  ].some((fragment) => normalized.includes(fragment));
}
