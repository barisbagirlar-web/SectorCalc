export type CropYieldLossAnalyzerInputs = {
  areaHa: number;
  expectedYieldTonPerHa: number;
  actualYieldTonPerHa: number;
  pricePerTon: number;
  irrigationCost: number;
};

export type CropYieldLossAnalyzerValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CROP_YIELD_LOSS_ANALYZER_INPUT_KEYS: readonly (keyof CropYieldLossAnalyzerInputs)[] = [
  "areaHa",
  "expectedYieldTonPerHa",
  "actualYieldTonPerHa",
  "pricePerTon",
  "irrigationCost",
];

const INPUT_LABELS: Record<keyof CropYieldLossAnalyzerInputs, string> = {
  areaHa: "areaHa",
  expectedYieldTonPerHa: "expectedYieldTonPerHa",
  actualYieldTonPerHa: "actualYieldTonPerHa",
  pricePerTon: "pricePerTon",
  irrigationCost: "irrigationCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CropYieldLossAnalyzerInputs): string[] {
  const errors: string[] = [];

  for (const key of CROP_YIELD_LOSS_ANALYZER_INPUT_KEYS) {
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

  if (inputs.areaHa < 0) {
    errors.push("areaHa must be greater than or equal to zero.");
  }

  if (inputs.expectedYieldTonPerHa < 0) {
    errors.push("expectedYieldTonPerHa must be greater than or equal to zero.");
  }

  if (inputs.actualYieldTonPerHa < 0) {
    errors.push("actualYieldTonPerHa must be greater than or equal to zero.");
  }

  if (inputs.pricePerTon < 0) {
    errors.push("pricePerTon must be greater than or equal to zero.");
  }

  if (inputs.irrigationCost < 0) {
    errors.push("irrigationCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: CropYieldLossAnalyzerInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCropYieldLossAnalyzerInputs(inputs: CropYieldLossAnalyzerInputs): CropYieldLossAnalyzerValidationResult {
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
