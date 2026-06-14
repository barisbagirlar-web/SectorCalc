export type CabinetCostEstimatorInputs = {
  productionQuantity: number;
  unitMaterialCost: number;
  scrapRatePercent: number;
  machineHourlyRate: number;
  machineTimeMinutes: number;
  laborHourlyRate: number;
};

export type CabinetCostEstimatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CABINET_COST_ESTIMATOR_INPUT_KEYS: readonly (keyof CabinetCostEstimatorInputs)[] = [
  "productionQuantity",
  "unitMaterialCost",
  "scrapRatePercent",
  "machineHourlyRate",
  "machineTimeMinutes",
  "laborHourlyRate",
];

const INPUT_LABELS: Record<keyof CabinetCostEstimatorInputs, string> = {
  productionQuantity: "productionQuantity",
  unitMaterialCost: "unitMaterialCost",
  scrapRatePercent: "scrapRatePercent",
  machineHourlyRate: "machineHourlyRate",
  machineTimeMinutes: "machineTimeMinutes",
  laborHourlyRate: "laborHourlyRate",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CabinetCostEstimatorInputs): string[] {
  const errors: string[] = [];

  for (const key of CABINET_COST_ESTIMATOR_INPUT_KEYS) {
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

  if (inputs.productionQuantity < 1 || inputs.productionQuantity > 1000000) {
    errors.push("productionQuantity must be between 1 and 1000000.");
  }

  if (inputs.productionQuantity <= 0) {
    errors.push("productionQuantity must be greater than zero.");
  }

  if (inputs.unitMaterialCost < 0 || inputs.unitMaterialCost > 100000) {
    errors.push("unitMaterialCost must be between 0 and 100000.");
  }

  if (inputs.scrapRatePercent < 0 || inputs.scrapRatePercent > 100) {
    errors.push("scrapRatePercent must be between 0 and 100.");
  }

  if (inputs.machineHourlyRate < 0 || inputs.machineHourlyRate > 1000) {
    errors.push("machineHourlyRate must be between 0 and 1000.");
  }

  if (inputs.machineTimeMinutes < 0 || inputs.machineTimeMinutes > 1440) {
    errors.push("machineTimeMinutes must be between 0 and 1440.");
  }

  if (inputs.laborHourlyRate < 0 || inputs.laborHourlyRate > 500) {
    errors.push("laborHourlyRate must be between 0 and 500.");
  }

  return errors;
}

function collectWarnings(inputs: CabinetCostEstimatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCabinetCostEstimatorInputs(inputs: CabinetCostEstimatorInputs): CabinetCostEstimatorValidationResult {
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
