export type SeedRateCalculatorInputs = {
  targetPlantPopulation: number;
  germinationRate: number;
  emergenceFactor: number;
  thousandSeedWeight: number;
  fieldLossPercent: number;
};

export type SeedRateCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SEED_RATE_CALCULATOR_INPUT_KEYS: readonly (keyof SeedRateCalculatorInputs)[] = [
  "targetPlantPopulation",
  "germinationRate",
  "emergenceFactor",
  "thousandSeedWeight",
  "fieldLossPercent",
];

const INPUT_LABELS: Record<keyof SeedRateCalculatorInputs, string> = {
  targetPlantPopulation: "targetPlantPopulation",
  germinationRate: "germinationRate",
  emergenceFactor: "emergenceFactor",
  thousandSeedWeight: "thousandSeedWeight",
  fieldLossPercent: "fieldLossPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SeedRateCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of SEED_RATE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.targetPlantPopulation < 1 || inputs.targetPlantPopulation > 10000000) {
    errors.push("targetPlantPopulation must be between 1 and 10000000.");
  }

  if (inputs.targetPlantPopulation <= 0) {
    errors.push("targetPlantPopulation must be greater than zero.");
  }

  if (inputs.germinationRate < 0 || inputs.germinationRate > 100) {
    errors.push("germinationRate must be between 0 and 100.");
  }

  if (inputs.germinationRate <= 0) {
    errors.push("germinationRate must be greater than zero.");
  }

  if (inputs.emergenceFactor < 0 || inputs.emergenceFactor > 100) {
    errors.push("emergenceFactor must be between 0 and 100.");
  }

  if (inputs.emergenceFactor <= 0) {
    errors.push("emergenceFactor must be greater than zero.");
  }

  if (inputs.thousandSeedWeight < 0.1 || inputs.thousandSeedWeight > 10000) {
    errors.push("thousandSeedWeight must be between 0.1 and 10000.");
  }

  if (inputs.thousandSeedWeight <= 0) {
    errors.push("thousandSeedWeight must be greater than zero.");
  }

  if (inputs.fieldLossPercent < 0 || inputs.fieldLossPercent > 100) {
    errors.push("fieldLossPercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: SeedRateCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSeedRateCalculatorInputs(inputs: SeedRateCalculatorInputs): SeedRateCalculatorValidationResult {
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
