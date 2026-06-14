export type FuelCostCalculatorInputs = {
  distanceKm: number;
  tripCount: number;
  vehicleLoadCapacity: number;
  loadFactorPercent: number;
  fuelConsumptionPer100Km: number;
  fuelOrEnergyUnitCost: number;
};

export type FuelCostCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const FUEL_COST_CALCULATOR_INPUT_KEYS: readonly (keyof FuelCostCalculatorInputs)[] = [
  "distanceKm",
  "tripCount",
  "vehicleLoadCapacity",
  "loadFactorPercent",
  "fuelConsumptionPer100Km",
  "fuelOrEnergyUnitCost",
];

const INPUT_LABELS: Record<keyof FuelCostCalculatorInputs, string> = {
  distanceKm: "distanceKm",
  tripCount: "tripCount",
  vehicleLoadCapacity: "vehicleLoadCapacity",
  loadFactorPercent: "loadFactorPercent",
  fuelConsumptionPer100Km: "fuelConsumptionPer100Km",
  fuelOrEnergyUnitCost: "fuelOrEnergyUnitCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: FuelCostCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of FUEL_COST_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.distanceKm < 0 || inputs.distanceKm > 100000) {
    errors.push("distanceKm must be between 0 and 100000.");
  }

  if (inputs.tripCount < 1 || inputs.tripCount > 10000) {
    errors.push("tripCount must be between 1 and 10000.");
  }

  if (inputs.tripCount <= 0) {
    errors.push("tripCount must be greater than zero.");
  }

  if (inputs.vehicleLoadCapacity < 1 || inputs.vehicleLoadCapacity > 100000) {
    errors.push("vehicleLoadCapacity must be between 1 and 100000.");
  }

  if (inputs.vehicleLoadCapacity <= 0) {
    errors.push("vehicleLoadCapacity must be greater than zero.");
  }

  if (inputs.loadFactorPercent < 0 || inputs.loadFactorPercent > 100) {
    errors.push("loadFactorPercent must be between 0 and 100.");
  }

  if (inputs.loadFactorPercent <= 0) {
    errors.push("loadFactorPercent must be greater than zero.");
  }

  if (inputs.fuelConsumptionPer100Km < 0 || inputs.fuelConsumptionPer100Km > 100) {
    errors.push("fuelConsumptionPer100Km must be between 0 and 100.");
  }

  if (inputs.fuelOrEnergyUnitCost < 0 || inputs.fuelOrEnergyUnitCost > 100) {
    errors.push("fuelOrEnergyUnitCost must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: FuelCostCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateFuelCostCalculatorInputs(inputs: FuelCostCalculatorInputs): FuelCostCalculatorValidationResult {
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
