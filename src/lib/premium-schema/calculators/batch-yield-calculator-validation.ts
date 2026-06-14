export type BatchYieldCalculatorInputs = {
  inputQuantity: number;
  outputQuantity: number;
  yieldPercent: number;
  rawMaterialCost: number;
  laborCost: number;
  processingCost: number;
};

export type BatchYieldCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const BATCH_YIELD_CALCULATOR_INPUT_KEYS: readonly (keyof BatchYieldCalculatorInputs)[] = [
  "inputQuantity",
  "outputQuantity",
  "yieldPercent",
  "rawMaterialCost",
  "laborCost",
  "processingCost",
];

const INPUT_LABELS: Record<keyof BatchYieldCalculatorInputs, string> = {
  inputQuantity: "inputQuantity",
  outputQuantity: "outputQuantity",
  yieldPercent: "yieldPercent",
  rawMaterialCost: "rawMaterialCost",
  laborCost: "laborCost",
  processingCost: "processingCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: BatchYieldCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of BATCH_YIELD_CALCULATOR_INPUT_KEYS) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(`${INPUT_LABELS[key]} is required.`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(`${INPUT_LABELS[key]} must be a finite number.`);
    }
  }

  if (errors.length > 0) {
    return errors;
  }

  if (inputs.inputQuantity < 0 || inputs.inputQuantity > 1000000) {
    errors.push("inputQuantity must be between 0 and 1000000.");
  }

  if (inputs.inputQuantity <= 0) {
    errors.push("inputQuantity must be greater than zero.");
  }

  if (inputs.outputQuantity < 0 || inputs.outputQuantity > 1000000) {
    errors.push("outputQuantity must be between 0 and 1000000.");
  }

  if (inputs.outputQuantity <= 0) {
    errors.push("outputQuantity must be greater than zero.");
  }

  if (inputs.yieldPercent < 0 || inputs.yieldPercent > 100) {
    errors.push("yieldPercent must be between 0 and 100.");
  }

  if (inputs.yieldPercent <= 0) {
    errors.push("yieldPercent must be greater than zero.");
  }

  if (inputs.rawMaterialCost < 0 || inputs.rawMaterialCost > 100000) {
    errors.push("rawMaterialCost must be between 0 and 100000.");
  }

  if (inputs.laborCost < 0 || inputs.laborCost > 100000) {
    errors.push("laborCost must be between 0 and 100000.");
  }

  if (inputs.processingCost < 0 || inputs.processingCost > 100000) {
    errors.push("processingCost must be between 0 and 100000.");
  }

  return errors;
}

function collectWarnings(inputs: BatchYieldCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateBatchYieldCalculatorInputs(inputs: BatchYieldCalculatorInputs): BatchYieldCalculatorValidationResult {
  const errors = collectInputErrors(inputs);
  if (errors.length > 0) {
    return { ok: false, errors, warnings: [] };
  }

  return {
    ok: true,
    errors: [],
    warnings: collectWarnings(inputs),
  };
}
