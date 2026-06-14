export type EnergyEfficiencyReportInputs = {
  currentKwh: number;
  targetKwh: number;
  energyRate: number;
  peakKwh: number;
  peakRate: number;
  demandCharge: number;
  plannedBudget: number;
};

export type EnergyEfficiencyReportValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ENERGY_EFFICIENCY_REPORT_INPUT_KEYS: readonly (keyof EnergyEfficiencyReportInputs)[] = [
  "currentKwh",
  "targetKwh",
  "energyRate",
  "peakKwh",
  "peakRate",
  "demandCharge",
  "plannedBudget",
];

const INPUT_LABELS: Record<keyof EnergyEfficiencyReportInputs, string> = {
  currentKwh: "currentKwh",
  targetKwh: "targetKwh",
  energyRate: "energyRate",
  peakKwh: "peakKwh",
  peakRate: "peakRate",
  demandCharge: "demandCharge",
  plannedBudget: "plannedBudget",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: EnergyEfficiencyReportInputs): string[] {
  const errors: string[] = [];

  for (const key of ENERGY_EFFICIENCY_REPORT_INPUT_KEYS) {
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

  if (inputs.currentKwh < 0) {
    errors.push("currentKwh must be greater than or equal to zero.");
  }

  if (inputs.targetKwh < 0) {
    errors.push("targetKwh must be greater than or equal to zero.");
  }

  if (inputs.energyRate < 0) {
    errors.push("energyRate must be greater than or equal to zero.");
  }

  if (inputs.peakKwh < 0) {
    errors.push("peakKwh must be greater than or equal to zero.");
  }

  if (inputs.peakRate < 0) {
    errors.push("peakRate must be greater than or equal to zero.");
  }

  if (inputs.demandCharge < 0) {
    errors.push("demandCharge must be greater than or equal to zero.");
  }

  if (inputs.plannedBudget < 0) {
    errors.push("plannedBudget must be greater than or equal to zero.");
  }

  if (inputs.plannedBudget <= 0) {
    errors.push("plannedBudget must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: EnergyEfficiencyReportInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateEnergyEfficiencyReportInputs(inputs: EnergyEfficiencyReportInputs): EnergyEfficiencyReportValidationResult {
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
