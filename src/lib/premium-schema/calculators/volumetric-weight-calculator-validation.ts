export type VolumetricWeightCalculatorInputs = {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  actualWeightKg: number;
  volumetricDivisor: number;
  ratePerKg: number;
};

export type VolumetricWeightCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const VOLUMETRIC_WEIGHT_CALCULATOR_INPUT_KEYS: readonly (keyof VolumetricWeightCalculatorInputs)[] = [
  "lengthCm",
  "widthCm",
  "heightCm",
  "actualWeightKg",
  "volumetricDivisor",
  "ratePerKg",
];

const INPUT_LABELS: Record<keyof VolumetricWeightCalculatorInputs, string> = {
  lengthCm: "lengthCm",
  widthCm: "widthCm",
  heightCm: "heightCm",
  actualWeightKg: "actualWeightKg",
  volumetricDivisor: "volumetricDivisor",
  ratePerKg: "ratePerKg",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: VolumetricWeightCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of VOLUMETRIC_WEIGHT_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.lengthCm < 0.1 || inputs.lengthCm > 10000) {
    errors.push("lengthCm must be between 0.1 and 10000.");
  }

  if (inputs.lengthCm <= 0) {
    errors.push("lengthCm must be greater than zero.");
  }

  if (inputs.widthCm < 0.1 || inputs.widthCm > 10000) {
    errors.push("widthCm must be between 0.1 and 10000.");
  }

  if (inputs.widthCm <= 0) {
    errors.push("widthCm must be greater than zero.");
  }

  if (inputs.heightCm < 0.1 || inputs.heightCm > 10000) {
    errors.push("heightCm must be between 0.1 and 10000.");
  }

  if (inputs.heightCm <= 0) {
    errors.push("heightCm must be greater than zero.");
  }

  if (inputs.actualWeightKg < 0.001 || inputs.actualWeightKg > 100000) {
    errors.push("actualWeightKg must be between 0.001 and 100000.");
  }

  if (inputs.actualWeightKg <= 0) {
    errors.push("actualWeightKg must be greater than zero.");
  }

  if (inputs.volumetricDivisor < 1 || inputs.volumetricDivisor > 10000) {
    errors.push("volumetricDivisor must be between 1 and 10000.");
  }

  if (inputs.volumetricDivisor <= 0) {
    errors.push("volumetricDivisor must be greater than zero.");
  }

  if (inputs.ratePerKg < 0 || inputs.ratePerKg > 1000) {
    errors.push("ratePerKg must be between 0 and 1000.");
  }

  return errors;
}

function collectWarnings(inputs: VolumetricWeightCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateVolumetricWeightCalculatorInputs(inputs: VolumetricWeightCalculatorInputs): VolumetricWeightCalculatorValidationResult {
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
