export type HafriyatVeDolguDengesiOptimizasyonCalculatorInputs = {
  cutVolume: number;
  fillVolume: number;
  swellPercent: number;
  shrinkPercent: number;
  cutUnitCost: number;
  fillUnitCost: number;
};

export type HafriyatVeDolguDengesiOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const HAFRIYAT_VE_DOLGU_DENGESI_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof HafriyatVeDolguDengesiOptimizasyonCalculatorInputs)[] = [
  "cutVolume",
  "fillVolume",
  "swellPercent",
  "shrinkPercent",
  "cutUnitCost",
  "fillUnitCost",
];

const INPUT_LABELS: Record<keyof HafriyatVeDolguDengesiOptimizasyonCalculatorInputs, string> = {
  cutVolume: "cutVolume",
  fillVolume: "fillVolume",
  swellPercent: "swellPercent",
  shrinkPercent: "shrinkPercent",
  cutUnitCost: "cutUnitCost",
  fillUnitCost: "fillUnitCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: HafriyatVeDolguDengesiOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of HAFRIYAT_VE_DOLGU_DENGESI_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.cutVolume < 0 || inputs.cutVolume > 10000000) {
    errors.push("cutVolume must be between 0 and 10000000.");
  }

  if (inputs.cutVolume <= 0) {
    errors.push("cutVolume must be greater than zero.");
  }

  if (inputs.fillVolume < 0 || inputs.fillVolume > 10000000) {
    errors.push("fillVolume must be between 0 and 10000000.");
  }

  if (inputs.fillVolume <= 0) {
    errors.push("fillVolume must be greater than zero.");
  }

  if (inputs.swellPercent < 0 || inputs.swellPercent > 100) {
    errors.push("swellPercent must be between 0 and 100.");
  }

  if (inputs.shrinkPercent < 0 || inputs.shrinkPercent > 100) {
    errors.push("shrinkPercent must be between 0 and 100.");
  }

  if (inputs.cutUnitCost < 0 || inputs.cutUnitCost > 1000) {
    errors.push("cutUnitCost must be between 0 and 1000.");
  }

  if (inputs.fillUnitCost < 0 || inputs.fillUnitCost > 1000) {
    errors.push("fillUnitCost must be between 0 and 1000.");
  }

  return errors;
}

function collectWarnings(inputs: HafriyatVeDolguDengesiOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateHafriyatVeDolguDengesiOptimizasyonCalculatorInputs(inputs: HafriyatVeDolguDengesiOptimizasyonCalculatorInputs): HafriyatVeDolguDengesiOptimizasyonCalculatorValidationResult {
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
