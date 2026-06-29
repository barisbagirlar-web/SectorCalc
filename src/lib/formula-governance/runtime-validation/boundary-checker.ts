/**
 * Boundary checker — numeric constraint validation on ontology variables.
 */

import type { CalculationVariable } from "@/lib/formula-governance/calculation-ontology/ontology-types";
import type { CalculationValues } from "@/lib/formula-governance/runtime-validation/invariant-types";
import { allowsSignedCurrencyOutput } from "@/lib/formula-governance/runtime-validation/signed-currency-outputs";

export function checkVariableBoundaries(
  variable: CalculationVariable,
  value: number,
): { readonly errors: readonly string[]; readonly warnings: readonly string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const constraints = variable.constraints;

  if (!Number.isFinite(value)) {
    errors.push(`${variable.id} must be a finite number.`);
    return { errors, warnings };
  }

  if (constraints?.integer && !Number.isInteger(value)) {
    errors.push(`${variable.id} must be an integer.`);
  }

  if (constraints?.nonNegative && value < 0) {
    errors.push(`${variable.id} must be non-negative.`);
  }

  if (
    variable.dimension === "currency" &&
    value < 0 &&
    !allowsSignedCurrencyOutput(variable.id)
  ) {
    errors.push(`${variable.id} currency value must be non-negative.`);
  }

  if (variable.dimension === "percent") {
    if (value < 0 || value > 100) {
      errors.push(`${variable.id} percent must be between 0 and 100.`);
    }
  }

  if (constraints?.min !== undefined && value < constraints.min) {
    errors.push(`${variable.id} must be >= ${constraints.min}.`);
  }

  if (constraints?.max !== undefined && value > constraints.max) {
    errors.push(`${variable.id} must be <= ${constraints.max}.`);
  }

  if (variable.missingRisk === "high" && value === 0 && variable.role === "input") {
    warnings.push(`${variable.id} is zero — high-risk input may understate exposure.`);
  }

  return { errors, warnings };
}

export function checkAllBoundaries(
  variables: readonly CalculationVariable[],
  values: CalculationValues,
): { readonly errors: readonly string[]; readonly warnings: readonly string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const variable of variables) {
    if (!(variable.id in values)) {
      continue;
    }
    const checked = checkVariableBoundaries(variable, values[variable.id]);
    errors.push(...checked.errors);
    warnings.push(...checked.warnings);
  }

  return { errors, warnings };
}
