export type PaintCoverageCalculatorInputs = {
  totalArea: number;
  dryFilmThicknessMicrons: number;
  volumeSolidsPercent: number;
  applicationEfficiencyPercent: number;
  unitCostPerLiter: number;
  wastePercent: number;
};

export type PaintCoverageCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PAINT_COVERAGE_CALCULATOR_INPUT_KEYS: readonly (keyof PaintCoverageCalculatorInputs)[] = [
  "totalArea",
  "dryFilmThicknessMicrons",
  "volumeSolidsPercent",
  "applicationEfficiencyPercent",
  "unitCostPerLiter",
  "wastePercent",
];

const INPUT_LABELS: Record<keyof PaintCoverageCalculatorInputs, string> = {
  totalArea: "totalArea",
  dryFilmThicknessMicrons: "dryFilmThicknessMicrons",
  volumeSolidsPercent: "volumeSolidsPercent",
  applicationEfficiencyPercent: "applicationEfficiencyPercent",
  unitCostPerLiter: "unitCostPerLiter",
  wastePercent: "wastePercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: PaintCoverageCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of PAINT_COVERAGE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.totalArea < 0.01 || inputs.totalArea > 1000000) {
    errors.push("totalArea must be between 0.01 and 1000000.");
  }

  if (inputs.totalArea <= 0) {
    errors.push("totalArea must be greater than zero.");
  }

  if (inputs.dryFilmThicknessMicrons < 1 || inputs.dryFilmThicknessMicrons > 1000) {
    errors.push("dryFilmThicknessMicrons must be between 1 and 1000.");
  }

  if (inputs.dryFilmThicknessMicrons <= 0) {
    errors.push("dryFilmThicknessMicrons must be greater than zero.");
  }

  if (inputs.volumeSolidsPercent < 0 || inputs.volumeSolidsPercent > 100) {
    errors.push("volumeSolidsPercent must be between 0 and 100.");
  }

  if (inputs.volumeSolidsPercent <= 0) {
    errors.push("volumeSolidsPercent must be greater than zero.");
  }

  if (inputs.applicationEfficiencyPercent < 0 || inputs.applicationEfficiencyPercent > 100) {
    errors.push("applicationEfficiencyPercent must be between 0 and 100.");
  }

  if (inputs.applicationEfficiencyPercent <= 0) {
    errors.push("applicationEfficiencyPercent must be greater than zero.");
  }

  if (inputs.unitCostPerLiter < 0 || inputs.unitCostPerLiter > 10000) {
    errors.push("unitCostPerLiter must be between 0 and 10000.");
  }

  if (inputs.wastePercent < 0 || inputs.wastePercent > 100) {
    errors.push("wastePercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: PaintCoverageCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validatePaintCoverageCalculatorInputs(inputs: PaintCoverageCalculatorInputs): PaintCoverageCalculatorValidationResult {
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
