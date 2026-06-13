export type AutoRepairPartsLaborQuoteCalculatorInputs = {
  partsCost: number;
  laborHours: number;
  laborRate: number;
  shopSuppliesPercent: number;
  targetMarginRate: number;
};

export type AutoRepairPartsLaborQuoteCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const AUTO_REPAIR_PARTS_LABOR_QUOTE_CALCULATOR_INPUT_KEYS: readonly (keyof AutoRepairPartsLaborQuoteCalculatorInputs)[] = [
  "partsCost",
  "laborHours",
  "laborRate",
  "shopSuppliesPercent",
  "targetMarginRate",
];

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: AutoRepairPartsLaborQuoteCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of AUTO_REPAIR_PARTS_LABOR_QUOTE_CALCULATOR_INPUT_KEYS) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(`${key} is required.`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(`${key} must be a finite number.`);
    }
  }

  if (errors.length > 0) {
    return errors;
  }

  if (inputs.partsCost < 0) {
    errors.push("partsCost must be greater than or equal to zero.");
  }

  if (inputs.laborHours < 0) {
    errors.push("laborHours must be greater than or equal to zero.");
  }

  if (inputs.laborRate < 0) {
    errors.push("laborRate must be greater than or equal to zero.");
  }

  if (inputs.shopSuppliesPercent < 0 || inputs.shopSuppliesPercent > 50) {
    errors.push("shopSuppliesPercent must be between 0 and 50.");
  }

  if (inputs.targetMarginRate <= 0 || inputs.targetMarginRate > 90) {
    errors.push("targetMarginRate must be between 1 and 90.");
  }

  return errors;
}

export function validateAutoRepairPartsLaborQuoteCalculatorInputs(
  inputs: AutoRepairPartsLaborQuoteCalculatorInputs,
): AutoRepairPartsLaborQuoteCalculatorValidationResult {
  const errors = collectInputErrors(inputs);
  if (errors.length > 0) {
    return { ok: false, errors, warnings: [] };
  }

  return { ok: true, errors: [], warnings: [] };
}
