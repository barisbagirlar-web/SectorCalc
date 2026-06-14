export type TaguchiKaliteKayipFonksiyonuCalculatorInputs = {
  targetValue: number;
  actualValue: number;
  lossCoefficientK: number;
  productionQuantity: number;
  unitCost: number;
};

export type TaguchiKaliteKayipFonksiyonuCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TAGUCHI_KALITE_KAYIP_FONKSIYONU_CALCULATOR_INPUT_KEYS: readonly (keyof TaguchiKaliteKayipFonksiyonuCalculatorInputs)[] = [
  "targetValue",
  "actualValue",
  "lossCoefficientK",
  "productionQuantity",
  "unitCost",
];

const INPUT_LABELS: Record<keyof TaguchiKaliteKayipFonksiyonuCalculatorInputs, string> = {
  targetValue: "targetValue",
  actualValue: "actualValue",
  lossCoefficientK: "lossCoefficientK",
  productionQuantity: "productionQuantity",
  unitCost: "unitCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: TaguchiKaliteKayipFonksiyonuCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of TAGUCHI_KALITE_KAYIP_FONKSIYONU_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.targetValue < 0 || inputs.targetValue > 1000000) {
    errors.push("targetValue must be between 0 and 1000000.");
  }

  if (inputs.actualValue < 0 || inputs.actualValue > 1000000) {
    errors.push("actualValue must be between 0 and 1000000.");
  }

  if (inputs.lossCoefficientK < 0 || inputs.lossCoefficientK > 1000000) {
    errors.push("lossCoefficientK must be between 0 and 1000000.");
  }

  if (inputs.productionQuantity < 1 || inputs.productionQuantity > 1000000) {
    errors.push("productionQuantity must be between 1 and 1000000.");
  }

  if (inputs.productionQuantity <= 0) {
    errors.push("productionQuantity must be greater than zero.");
  }

  if (inputs.unitCost < 0.01 || inputs.unitCost > 100000) {
    errors.push("unitCost must be between 0.01 and 100000.");
  }

  if (inputs.unitCost <= 0) {
    errors.push("unitCost must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: TaguchiKaliteKayipFonksiyonuCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateTaguchiKaliteKayipFonksiyonuCalculatorInputs(inputs: TaguchiKaliteKayipFonksiyonuCalculatorInputs): TaguchiKaliteKayipFonksiyonuCalculatorValidationResult {
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
