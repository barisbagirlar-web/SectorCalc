export type LaserCuttingTimeCheckInputs = {
  cuttingLength: number;
  feedRate: number;
  pierceTime: number;
  machineEfficiency: number;
  productionQuantity: number;
  unitMaterialCost: number;
};

export type LaserCuttingTimeCheckValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const LASER_CUTTING_TIME_CHECK_INPUT_KEYS: readonly (keyof LaserCuttingTimeCheckInputs)[] = [
  "cuttingLength",
  "feedRate",
  "pierceTime",
  "machineEfficiency",
  "productionQuantity",
  "unitMaterialCost",
];

const INPUT_LABELS: Record<keyof LaserCuttingTimeCheckInputs, string> = {
  cuttingLength: "cuttingLength",
  feedRate: "feedRate",
  pierceTime: "pierceTime",
  machineEfficiency: "machineEfficiency",
  productionQuantity: "productionQuantity",
  unitMaterialCost: "unitMaterialCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: LaserCuttingTimeCheckInputs): string[] {
  const errors: string[] = [];

  for (const key of LASER_CUTTING_TIME_CHECK_INPUT_KEYS) {
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

  if (inputs.cuttingLength < 0.1 || inputs.cuttingLength > 100000) {
    errors.push("cuttingLength must be between 0.1 and 100000.");
  }

  if (inputs.cuttingLength <= 0) {
    errors.push("cuttingLength must be greater than zero.");
  }

  if (inputs.feedRate < 0.1 || inputs.feedRate > 10000) {
    errors.push("feedRate must be between 0.1 and 10000.");
  }

  if (inputs.feedRate <= 0) {
    errors.push("feedRate must be greater than zero.");
  }

  if (inputs.pierceTime < 0 || inputs.pierceTime > 60) {
    errors.push("pierceTime must be between 0 and 60.");
  }

  if (inputs.machineEfficiency < 0 || inputs.machineEfficiency > 100) {
    errors.push("machineEfficiency must be between 0 and 100.");
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

  return errors;
}

function collectWarnings(inputs: LaserCuttingTimeCheckInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateLaserCuttingTimeCheckInputs(inputs: LaserCuttingTimeCheckInputs): LaserCuttingTimeCheckValidationResult {
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
