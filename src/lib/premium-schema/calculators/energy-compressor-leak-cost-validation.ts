export type EnergyCompressorLeakCostInputs = {
  compressorKw: number;
  leakPercent: number;
  operatingHours: number;
  energyRate: number;
};

export type EnergyCompressorLeakCostValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ENERGY_COMPRESSOR_LEAK_COST_INPUT_KEYS: readonly (keyof EnergyCompressorLeakCostInputs)[] =
  ["compressorKw", "leakPercent", "operatingHours", "energyRate"];

const INPUT_LABELS: Record<keyof EnergyCompressorLeakCostInputs, string> = {
  compressorKw: "compressorKw",
  leakPercent: "leakPercent",
  operatingHours: "operatingHours",
  energyRate: "energyRate",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: EnergyCompressorLeakCostInputs): string[] {
  const errors: string[] = [];

  for (const key of ENERGY_COMPRESSOR_LEAK_COST_INPUT_KEYS) {
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

  if (inputs.compressorKw < 0) {
    errors.push("compressorKw must be greater than or equal to zero.");
  }
  if (inputs.leakPercent < 0 || inputs.leakPercent > 100) {
    errors.push("leakPercent must be between 0 and 100.");
  }
  if (inputs.operatingHours < 0) {
    errors.push("operatingHours must be greater than or equal to zero.");
  }
  if (inputs.energyRate < 0) {
    errors.push("energyRate must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: EnergyCompressorLeakCostInputs): string[] {
  const warnings: string[] = [];

  if (inputs.leakPercent >= 8) {
    warnings.push(
      "Leak percent is above typical industrial band. Schedule ultrasonic audit and valve inspection.",
    );
  }

  if (inputs.compressorKw === 0 && inputs.leakPercent > 0) {
    warnings.push(
      "Compressor power is zero while leak percent is positive. Leak kWh and cost will remain zero until power is supplied.",
    );
  }

  const leakKwh =
    inputs.compressorKw * inputs.operatingHours * (inputs.leakPercent / 100);
  const monthlyLeakCost = leakKwh * inputs.energyRate;

  if (monthlyLeakCost >= 500) {
    warnings.push(
      "Monthly leak cost is material. Prioritize fitting, hose and valve repairs on the compressed air network.",
    );
  }

  return warnings;
}

export function validateEnergyCompressorLeakCostInputs(
  inputs: EnergyCompressorLeakCostInputs,
): EnergyCompressorLeakCostValidationResult {
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
