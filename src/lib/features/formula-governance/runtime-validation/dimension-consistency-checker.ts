/**
 * Dimension consistency checker - cross-variable unit compatibility.
 */

import type { CalculationOntology } from "@/lib/features/formula-governance/calculation-ontology/ontology-types";
import type { CalculationValues } from "@/lib/features/formula-governance/runtime-validation/invariant-types";
import { allowsSignedCurrencyOutput } from "@/lib/features/formula-governance/runtime-validation/signed-currency-outputs";

const RATE_EXPECTED_NUMERATOR: Record<string, string> = {
  "USD/hour": "currency",
};

export function checkDimensionConsistency(
  ontology: CalculationOntology,
  values: CalculationValues,
): readonly string[] {
  const errors: string[] = [];

  for (const variable of ontology.variables) {
    if (!(variable.id in values)) {
      continue;
    }
    const value = values[variable.id];
    if (!Number.isFinite(value)) {
      errors.push(`${variable.id} has non-finite value for dimension check.`);
      continue;
    }

    if (variable.dimension === "percent" && (value < 0 || value > 100)) {
      errors.push(`${variable.id} percent dimension out of range.`);
    }

    if (
      variable.dimension === "currency" &&
      value < 0 &&
      !allowsSignedCurrencyOutput(variable.id)
    ) {
      errors.push(`${variable.id} currency dimension cannot be negative.`);
    }

    const expectedNumerator = RATE_EXPECTED_NUMERATOR[variable.unit];
    if (variable.dimension === "rate" && expectedNumerator && expectedNumerator !== "currency") {
      errors.push(`${variable.id} rate unit "${variable.unit}" has unsupported dimension pairing.`);
    }
  }

  const marginKeys = ontology.variables
    .filter((variable) => variable.dimension === "percent" && variable.id.toLowerCase().includes("margin"))
    .map((variable) => variable.id);

  for (const key of marginKeys) {
    if (key in values && values[key] >= 100) {
      errors.push(`${key} margin percent must stay below 100 for price denominator safety.`);
    }
  }

  return errors;
}
