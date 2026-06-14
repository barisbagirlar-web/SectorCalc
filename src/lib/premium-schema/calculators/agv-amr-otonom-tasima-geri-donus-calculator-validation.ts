export type AgvAmrOtonomTasimaGeriDonusCalculatorInputs = {
  manualLaborCostPerHour: number;
  manualHoursPerDay: number;
  workingDaysPerYear: number;
  agvAmrUnitCost: number;
  numberOfVehicles: number;
  maintenanceFactor: number;
};

export type AgvAmrOtonomTasimaGeriDonusCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const AGV_AMR_OTONOM_TASIMA_GERI_DONUS_CALCULATOR_INPUT_KEYS: readonly (keyof AgvAmrOtonomTasimaGeriDonusCalculatorInputs)[] = [
  "manualLaborCostPerHour",
  "manualHoursPerDay",
  "workingDaysPerYear",
  "agvAmrUnitCost",
  "numberOfVehicles",
  "maintenanceFactor",
];

const INPUT_LABELS: Record<keyof AgvAmrOtonomTasimaGeriDonusCalculatorInputs, string> = {
  manualLaborCostPerHour: "manualLaborCostPerHour",
  manualHoursPerDay: "manualHoursPerDay",
  workingDaysPerYear: "workingDaysPerYear",
  agvAmrUnitCost: "agvAmrUnitCost",
  numberOfVehicles: "numberOfVehicles",
  maintenanceFactor: "maintenanceFactor",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: AgvAmrOtonomTasimaGeriDonusCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of AGV_AMR_OTONOM_TASIMA_GERI_DONUS_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.manualLaborCostPerHour < 0 || inputs.manualLaborCostPerHour > 1000) {
    errors.push("manualLaborCostPerHour must be between 0 and 1000.");
  }

  if (inputs.manualHoursPerDay < 0 || inputs.manualHoursPerDay > 24) {
    errors.push("manualHoursPerDay must be between 0 and 24.");
  }

  if (inputs.workingDaysPerYear < 1 || inputs.workingDaysPerYear > 365) {
    errors.push("workingDaysPerYear must be between 1 and 365.");
  }

  if (inputs.workingDaysPerYear <= 0) {
    errors.push("workingDaysPerYear must be greater than zero.");
  }

  if (inputs.agvAmrUnitCost < 0 || inputs.agvAmrUnitCost > 1000000) {
    errors.push("agvAmrUnitCost must be between 0 and 1000000.");
  }

  if (inputs.numberOfVehicles < 1 || inputs.numberOfVehicles > 1000) {
    errors.push("numberOfVehicles must be between 1 and 1000.");
  }

  if (inputs.numberOfVehicles <= 0) {
    errors.push("numberOfVehicles must be greater than zero.");
  }

  if (inputs.maintenanceFactor < 0 || inputs.maintenanceFactor > 100) {
    errors.push("maintenanceFactor must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: AgvAmrOtonomTasimaGeriDonusCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateAgvAmrOtonomTasimaGeriDonusCalculatorInputs(inputs: AgvAmrOtonomTasimaGeriDonusCalculatorInputs): AgvAmrOtonomTasimaGeriDonusCalculatorValidationResult {
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
