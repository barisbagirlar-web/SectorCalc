export type MachineHourRateCalculatorInputs = {
  machineCost: number;
  salvageValue: number;
  usefulLifeYears: number;
  maintenanceCostPerYear: number;
  powerConsumptionKW: number;
  powerCostPerKWH: number;
};

export type MachineHourRateCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const MACHINE_HOUR_RATE_CALCULATOR_INPUT_KEYS: readonly (keyof MachineHourRateCalculatorInputs)[] = [
  "machineCost",
  "salvageValue",
  "usefulLifeYears",
  "maintenanceCostPerYear",
  "powerConsumptionKW",
  "powerCostPerKWH",
];

const INPUT_LABELS: Record<keyof MachineHourRateCalculatorInputs, string> = {
  machineCost: "machineCost",
  salvageValue: "salvageValue",
  usefulLifeYears: "usefulLifeYears",
  maintenanceCostPerYear: "maintenanceCostPerYear",
  powerConsumptionKW: "powerConsumptionKW",
  powerCostPerKWH: "powerCostPerKWH",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: MachineHourRateCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of MACHINE_HOUR_RATE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.machineCost < 0 || inputs.machineCost > 10000000) {
    errors.push("machineCost must be between 0 and 10000000.");
  }

  if (inputs.salvageValue < 0 || inputs.salvageValue > 10000000) {
    errors.push("salvageValue must be between 0 and 10000000.");
  }

  if (inputs.usefulLifeYears < 1 || inputs.usefulLifeYears > 50) {
    errors.push("usefulLifeYears must be between 1 and 50.");
  }

  if (inputs.usefulLifeYears <= 0) {
    errors.push("usefulLifeYears must be greater than zero.");
  }

  if (inputs.maintenanceCostPerYear < 0 || inputs.maintenanceCostPerYear > 1000000) {
    errors.push("maintenanceCostPerYear must be between 0 and 1000000.");
  }

  if (inputs.powerConsumptionKW < 0 || inputs.powerConsumptionKW > 10000) {
    errors.push("powerConsumptionKW must be between 0 and 10000.");
  }

  if (inputs.powerCostPerKWH < 0 || inputs.powerCostPerKWH > 10) {
    errors.push("powerCostPerKWH must be between 0 and 10.");
  }

  return errors;
}

function collectWarnings(inputs: MachineHourRateCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateMachineHourRateCalculatorInputs(inputs: MachineHourRateCalculatorInputs): MachineHourRateCalculatorValidationResult {
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
