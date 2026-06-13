export type BreakEvenSafetyMarginCalculatorInputs = {
  fixedCost: number;
  unitPrice: number;
  variableCostPerUnit: number;
  currentVolume: number;
};

export type BreakEvenSafetyMarginCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const BREAK_EVEN_SAFETY_MARGIN_CALCULATOR_INPUT_KEYS: readonly (keyof BreakEvenSafetyMarginCalculatorInputs)[] = [
  "fixedCost",
  "unitPrice",
  "variableCostPerUnit",
  "currentVolume",
];

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: BreakEvenSafetyMarginCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of BREAK_EVEN_SAFETY_MARGIN_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.fixedCost < 0) {
    errors.push("fixedCost must be greater than or equal to zero.");
  }

  if (inputs.unitPrice <= 0) {
    errors.push("unitPrice must be greater than zero.");
  }

  if (inputs.variableCostPerUnit < 0) {
    errors.push("variableCostPerUnit must be greater than or equal to zero.");
  }

  if (inputs.variableCostPerUnit >= inputs.unitPrice) {
    errors.push("variableCostPerUnit must be less than unitPrice for a finite break-even.");
  }

  if (inputs.currentVolume < 0) {
    errors.push("currentVolume must be greater than or equal to zero.");
  }

  return errors;
}

export function validateBreakEvenSafetyMarginCalculatorInputs(
  inputs: BreakEvenSafetyMarginCalculatorInputs,
): BreakEvenSafetyMarginCalculatorValidationResult {
  const errors = collectInputErrors(inputs);
  if (errors.length > 0) {
    return { ok: false, errors, warnings: [] };
  }

  const warnings: string[] = [];
  const contribution = inputs.unitPrice - inputs.variableCostPerUnit;
  if (contribution / inputs.unitPrice < 0.15) {
    warnings.push("Contribution margin is thin — small volume shifts move break-even sharply.");
  }

  return { ok: true, errors: [], warnings };
}
