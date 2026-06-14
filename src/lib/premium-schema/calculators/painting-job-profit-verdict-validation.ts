export type PaintingJobProfitVerdictInputs = {
  jobRevenue: number;
  paintMaterialCost: number;
  coverageDriftPercent: number;
  prepReworkHours: number;
  laborRate: number;
  scaffoldCost: number;
};

export type PaintingJobProfitVerdictValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PAINTING_JOB_PROFIT_VERDICT_INPUT_KEYS: readonly (keyof PaintingJobProfitVerdictInputs)[] = [
  "jobRevenue",
  "paintMaterialCost",
  "coverageDriftPercent",
  "prepReworkHours",
  "laborRate",
  "scaffoldCost",
];

const INPUT_LABELS: Record<keyof PaintingJobProfitVerdictInputs, string> = {
  jobRevenue: "jobRevenue",
  paintMaterialCost: "paintMaterialCost",
  coverageDriftPercent: "coverageDriftPercent",
  prepReworkHours: "prepReworkHours",
  laborRate: "laborRate",
  scaffoldCost: "scaffoldCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: PaintingJobProfitVerdictInputs): string[] {
  const errors: string[] = [];

  for (const key of PAINTING_JOB_PROFIT_VERDICT_INPUT_KEYS) {
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

  if (inputs.jobRevenue < 0) {
    errors.push("jobRevenue must be greater than or equal to zero.");
  }

  if (inputs.jobRevenue <= 0) {
    errors.push("jobRevenue must be greater than zero.");
  }

  if (inputs.paintMaterialCost < 0) {
    errors.push("paintMaterialCost must be greater than or equal to zero.");
  }

  if (inputs.coverageDriftPercent < 0 || inputs.coverageDriftPercent > 100) {
    errors.push("coverageDriftPercent must be between 0 and 100.");
  }

  if (inputs.prepReworkHours < 0) {
    errors.push("prepReworkHours must be greater than or equal to zero.");
  }

  if (inputs.laborRate < 0) {
    errors.push("laborRate must be greater than or equal to zero.");
  }

  if (inputs.scaffoldCost < 0) {
    errors.push("scaffoldCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: PaintingJobProfitVerdictInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validatePaintingJobProfitVerdictInputs(inputs: PaintingJobProfitVerdictInputs): PaintingJobProfitVerdictValidationResult {
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
