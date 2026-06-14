export type WaterOptimizationVerdictInputs = {
  averageInventory: number;
  annualCOGS: number;
  carryingCostPercent: number;
  markdownPercent: number;
};

export type WaterOptimizationVerdictValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const WATER_OPTIMIZATION_VERDICT_INPUT_KEYS: readonly (keyof WaterOptimizationVerdictInputs)[] = [
  "averageInventory",
  "annualCOGS",
  "carryingCostPercent",
  "markdownPercent",
];

const INPUT_LABELS: Record<keyof WaterOptimizationVerdictInputs, string> = {
  averageInventory: "averageInventory",
  annualCOGS: "annualCOGS",
  carryingCostPercent: "carryingCostPercent",
  markdownPercent: "markdownPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: WaterOptimizationVerdictInputs): string[] {
  const errors: string[] = [];

  for (const key of WATER_OPTIMIZATION_VERDICT_INPUT_KEYS) {
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

  if (inputs.averageInventory < 0) {
    errors.push("averageInventory must be greater than or equal to zero.");
  }

  if (inputs.annualCOGS < 0) {
    errors.push("annualCOGS must be greater than or equal to zero.");
  }

  if (inputs.carryingCostPercent < 0 || inputs.carryingCostPercent > 100) {
    errors.push("carryingCostPercent must be between 0 and 100.");
  }

  if (inputs.markdownPercent < 0 || inputs.markdownPercent > 100) {
    errors.push("markdownPercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: WaterOptimizationVerdictInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateWaterOptimizationVerdictInputs(inputs: WaterOptimizationVerdictInputs): WaterOptimizationVerdictValidationResult {
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
