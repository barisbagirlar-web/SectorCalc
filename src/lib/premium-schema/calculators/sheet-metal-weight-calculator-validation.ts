export type SheetMetalWeightCalculatorInputs = {
  materialThickness: number;
  materialWidth: number;
  materialLength: number;
  materialDensity: number;
  quantity: number;
};

export type SheetMetalWeightCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SHEET_METAL_WEIGHT_CALCULATOR_INPUT_KEYS: readonly (keyof SheetMetalWeightCalculatorInputs)[] = [
  "materialThickness",
  "materialWidth",
  "materialLength",
  "materialDensity",
  "quantity",
];

const INPUT_LABELS: Record<keyof SheetMetalWeightCalculatorInputs, string> = {
  materialThickness: "materialThickness",
  materialWidth: "materialWidth",
  materialLength: "materialLength",
  materialDensity: "materialDensity",
  quantity: "quantity",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SheetMetalWeightCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of SHEET_METAL_WEIGHT_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.materialThickness < 0.1 || inputs.materialThickness > 100) {
    errors.push("materialThickness must be between 0.1 and 100.");
  }

  if (inputs.materialThickness <= 0) {
    errors.push("materialThickness must be greater than zero.");
  }

  if (inputs.materialWidth < 1 || inputs.materialWidth > 5000) {
    errors.push("materialWidth must be between 1 and 5000.");
  }

  if (inputs.materialWidth <= 0) {
    errors.push("materialWidth must be greater than zero.");
  }

  if (inputs.materialLength < 1 || inputs.materialLength > 12000) {
    errors.push("materialLength must be between 1 and 12000.");
  }

  if (inputs.materialLength <= 0) {
    errors.push("materialLength must be greater than zero.");
  }

  if (inputs.materialDensity < 100 || inputs.materialDensity > 20000) {
    errors.push("materialDensity must be between 100 and 20000.");
  }

  if (inputs.materialDensity <= 0) {
    errors.push("materialDensity must be greater than zero.");
  }

  if (inputs.quantity < 1 || inputs.quantity > 100000) {
    errors.push("quantity must be between 1 and 100000.");
  }

  if (inputs.quantity <= 0) {
    errors.push("quantity must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: SheetMetalWeightCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSheetMetalWeightCalculatorInputs(inputs: SheetMetalWeightCalculatorInputs): SheetMetalWeightCalculatorValidationResult {
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
