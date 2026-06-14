export type ExcavationVolumeCalculatorInputs = {
  excavationLength: number;
  excavationWidth: number;
  excavationDepth: number;
  swellFactorPercent: number;
  compactionFactorPercent: number;
};

export type ExcavationVolumeCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const EXCAVATION_VOLUME_CALCULATOR_INPUT_KEYS: readonly (keyof ExcavationVolumeCalculatorInputs)[] = [
  "excavationLength",
  "excavationWidth",
  "excavationDepth",
  "swellFactorPercent",
  "compactionFactorPercent",
];

const INPUT_LABELS: Record<keyof ExcavationVolumeCalculatorInputs, string> = {
  excavationLength: "excavationLength",
  excavationWidth: "excavationWidth",
  excavationDepth: "excavationDepth",
  swellFactorPercent: "swellFactorPercent",
  compactionFactorPercent: "compactionFactorPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ExcavationVolumeCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of EXCAVATION_VOLUME_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.excavationLength < 0.01 || inputs.excavationLength > 1000) {
    errors.push("excavationLength must be between 0.01 and 1000.");
  }

  if (inputs.excavationLength <= 0) {
    errors.push("excavationLength must be greater than zero.");
  }

  if (inputs.excavationWidth < 0.01 || inputs.excavationWidth > 1000) {
    errors.push("excavationWidth must be between 0.01 and 1000.");
  }

  if (inputs.excavationWidth <= 0) {
    errors.push("excavationWidth must be greater than zero.");
  }

  if (inputs.excavationDepth < 0.01 || inputs.excavationDepth > 100) {
    errors.push("excavationDepth must be between 0.01 and 100.");
  }

  if (inputs.excavationDepth <= 0) {
    errors.push("excavationDepth must be greater than zero.");
  }

  if (inputs.swellFactorPercent < 0 || inputs.swellFactorPercent > 100) {
    errors.push("swellFactorPercent must be between 0 and 100.");
  }

  if (inputs.compactionFactorPercent < 0 || inputs.compactionFactorPercent > 100) {
    errors.push("compactionFactorPercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: ExcavationVolumeCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateExcavationVolumeCalculatorInputs(inputs: ExcavationVolumeCalculatorInputs): ExcavationVolumeCalculatorValidationResult {
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
