export type QualityCostPafCalculatorInputs = {
  preventionCost: number;
  appraisalCost: number;
  failureCost: number;
  revenue: number;
};

export type QualityCostPafCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const QUALITY_COST_PAF_CALCULATOR_INPUT_KEYS: readonly (keyof QualityCostPafCalculatorInputs)[] = [
  "preventionCost",
  "appraisalCost",
  "failureCost",
  "revenue",
];

const INPUT_LABELS: Record<keyof QualityCostPafCalculatorInputs, string> = {
  preventionCost: "preventionCost",
  appraisalCost: "appraisalCost",
  failureCost: "failureCost",
  revenue: "revenue",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: QualityCostPafCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of QUALITY_COST_PAF_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.preventionCost < 0) {
    errors.push("preventionCost must be greater than or equal to zero.");
  }

  if (inputs.appraisalCost < 0) {
    errors.push("appraisalCost must be greater than or equal to zero.");
  }

  if (inputs.failureCost < 0) {
    errors.push("failureCost must be greater than or equal to zero.");
  }

  if (inputs.revenue < 0) {
    errors.push("revenue must be greater than or equal to zero.");
  }

  if (inputs.revenue <= 0) {
    errors.push("revenue must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: QualityCostPafCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateQualityCostPafCalculatorInputs(inputs: QualityCostPafCalculatorInputs): QualityCostPafCalculatorValidationResult {
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
