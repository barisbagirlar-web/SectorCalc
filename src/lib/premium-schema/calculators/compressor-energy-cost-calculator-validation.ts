export type CompressorEnergyCostCalculatorInputs = {
  powerKw: number;
  runtimeHours: number;
  tariffPerKwh: number;
  efficiencyPercent: number;
  lossPercent: number;
  operatingDays: number;
};

export type CompressorEnergyCostCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const COMPRESSOR_ENERGY_COST_CALCULATOR_INPUT_KEYS: readonly (keyof CompressorEnergyCostCalculatorInputs)[] = [
  "powerKw",
  "runtimeHours",
  "tariffPerKwh",
  "efficiencyPercent",
  "lossPercent",
  "operatingDays",
];

const INPUT_LABELS: Record<keyof CompressorEnergyCostCalculatorInputs, string> = {
  powerKw: "powerKw",
  runtimeHours: "runtimeHours",
  tariffPerKwh: "tariffPerKwh",
  efficiencyPercent: "efficiencyPercent",
  lossPercent: "lossPercent",
  operatingDays: "operatingDays",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CompressorEnergyCostCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of COMPRESSOR_ENERGY_COST_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.powerKw < 0.1 || inputs.powerKw > 10000) {
    errors.push("powerKw must be between 0.1 and 10000.");
  }

  if (inputs.powerKw <= 0) {
    errors.push("powerKw must be greater than zero.");
  }

  if (inputs.runtimeHours < 0 || inputs.runtimeHours > 24) {
    errors.push("runtimeHours must be between 0 and 24.");
  }

  if (inputs.tariffPerKwh < 0 || inputs.tariffPerKwh > 10) {
    errors.push("tariffPerKwh must be between 0 and 10.");
  }

  if (inputs.efficiencyPercent < 0 || inputs.efficiencyPercent > 100) {
    errors.push("efficiencyPercent must be between 0 and 100.");
  }

  if (inputs.efficiencyPercent <= 0) {
    errors.push("efficiencyPercent must be greater than zero.");
  }

  if (inputs.lossPercent < 0 || inputs.lossPercent > 100) {
    errors.push("lossPercent must be between 0 and 100.");
  }

  if (inputs.operatingDays < 1 || inputs.operatingDays > 365) {
    errors.push("operatingDays must be between 1 and 365.");
  }

  if (inputs.operatingDays <= 0) {
    errors.push("operatingDays must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: CompressorEnergyCostCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCompressorEnergyCostCalculatorInputs(inputs: CompressorEnergyCostCalculatorInputs): CompressorEnergyCostCalculatorValidationResult {
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
