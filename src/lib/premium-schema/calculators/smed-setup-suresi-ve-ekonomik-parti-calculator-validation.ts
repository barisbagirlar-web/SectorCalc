export type SmedSetupSuresiVeEkonomikPartiCalculatorInputs = {
  annualDemand: number;
  batchQuantity: number;
  setupCostPerHour: number;
  unitCost: number;
  holdingRatePercent: number;
  initialSetupTime: number;
};

export type SmedSetupSuresiVeEkonomikPartiCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SMED_SETUP_SURESI_VE_EKONOMIK_PARTI_CALCULATOR_INPUT_KEYS: readonly (keyof SmedSetupSuresiVeEkonomikPartiCalculatorInputs)[] = [
  "annualDemand",
  "batchQuantity",
  "setupCostPerHour",
  "unitCost",
  "holdingRatePercent",
  "initialSetupTime",
];

const INPUT_LABELS: Record<keyof SmedSetupSuresiVeEkonomikPartiCalculatorInputs, string> = {
  annualDemand: "annualDemand",
  batchQuantity: "batchQuantity",
  setupCostPerHour: "setupCostPerHour",
  unitCost: "unitCost",
  holdingRatePercent: "holdingRatePercent",
  initialSetupTime: "initialSetupTime",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SmedSetupSuresiVeEkonomikPartiCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of SMED_SETUP_SURESI_VE_EKONOMIK_PARTI_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.annualDemand < 1 || inputs.annualDemand > 10000000) {
    errors.push("annualDemand must be between 1 and 10000000.");
  }

  if (inputs.annualDemand <= 0) {
    errors.push("annualDemand must be greater than zero.");
  }

  if (inputs.batchQuantity < 1 || inputs.batchQuantity > 1000000) {
    errors.push("batchQuantity must be between 1 and 1000000.");
  }

  if (inputs.batchQuantity <= 0) {
    errors.push("batchQuantity must be greater than zero.");
  }

  if (inputs.setupCostPerHour < 0 || inputs.setupCostPerHour > 10000) {
    errors.push("setupCostPerHour must be between 0 and 10000.");
  }

  if (inputs.unitCost < 0.01 || inputs.unitCost > 100000) {
    errors.push("unitCost must be between 0.01 and 100000.");
  }

  if (inputs.unitCost <= 0) {
    errors.push("unitCost must be greater than zero.");
  }

  if (inputs.holdingRatePercent < 0 || inputs.holdingRatePercent > 100) {
    errors.push("holdingRatePercent must be between 0 and 100.");
  }

  if (inputs.initialSetupTime < 0.1 || inputs.initialSetupTime > 1440) {
    errors.push("initialSetupTime must be between 0.1 and 1440.");
  }

  if (inputs.initialSetupTime <= 0) {
    errors.push("initialSetupTime must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: SmedSetupSuresiVeEkonomikPartiCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSmedSetupSuresiVeEkonomikPartiCalculatorInputs(inputs: SmedSetupSuresiVeEkonomikPartiCalculatorInputs): SmedSetupSuresiVeEkonomikPartiCalculatorValidationResult {
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
