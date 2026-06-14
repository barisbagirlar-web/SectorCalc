export type IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs = {
  dailyRentalRate: number;
  totalRentalDays: number;
  setupCostPerCycle: number;
  numberOfCycles: number;
  maintenanceCostPerDay: number;
  totalDemand: number;
};

export type IskeleVeKalipKullanimSuresiOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ISKELE_VE_KALIP_KULLANIM_SURESI_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs)[] = [
  "dailyRentalRate",
  "totalRentalDays",
  "setupCostPerCycle",
  "numberOfCycles",
  "maintenanceCostPerDay",
  "totalDemand",
];

const INPUT_LABELS: Record<keyof IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs, string> = {
  dailyRentalRate: "dailyRentalRate",
  totalRentalDays: "totalRentalDays",
  setupCostPerCycle: "setupCostPerCycle",
  numberOfCycles: "numberOfCycles",
  maintenanceCostPerDay: "maintenanceCostPerDay",
  totalDemand: "totalDemand",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of ISKELE_VE_KALIP_KULLANIM_SURESI_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.dailyRentalRate < 0.01 || inputs.dailyRentalRate > 10000) {
    errors.push("dailyRentalRate must be between 0.01 and 10000.");
  }

  if (inputs.dailyRentalRate <= 0) {
    errors.push("dailyRentalRate must be greater than zero.");
  }

  if (inputs.totalRentalDays < 1 || inputs.totalRentalDays > 3650) {
    errors.push("totalRentalDays must be between 1 and 3650.");
  }

  if (inputs.totalRentalDays <= 0) {
    errors.push("totalRentalDays must be greater than zero.");
  }

  if (inputs.setupCostPerCycle < 0 || inputs.setupCostPerCycle > 100000) {
    errors.push("setupCostPerCycle must be between 0 and 100000.");
  }

  if (inputs.numberOfCycles < 1 || inputs.numberOfCycles > 100) {
    errors.push("numberOfCycles must be between 1 and 100.");
  }

  if (inputs.numberOfCycles <= 0) {
    errors.push("numberOfCycles must be greater than zero.");
  }

  if (inputs.maintenanceCostPerDay < 0 || inputs.maintenanceCostPerDay > 1000) {
    errors.push("maintenanceCostPerDay must be between 0 and 1000.");
  }

  if (inputs.totalDemand < 1 || inputs.totalDemand > 1000000) {
    errors.push("totalDemand must be between 1 and 1000000.");
  }

  if (inputs.totalDemand <= 0) {
    errors.push("totalDemand must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateIskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs(inputs: IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputs): IskeleVeKalipKullanimSuresiOptimizasyonCalculatorValidationResult {
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
