export type PlumbingJobMarginVerdictInputs = {
  partsCost: number;
  laborHours: number;
  laborRate: number;
  fixtureCount: number;
  materialRunCost: number;
  callbackRiskPercent: number;
  targetMargin: number;
};

export type PlumbingJobMarginVerdictValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PLUMBING_JOB_MARGIN_VERDICT_INPUT_KEYS: readonly (keyof PlumbingJobMarginVerdictInputs)[] = [
  "partsCost",
  "laborHours",
  "laborRate",
  "fixtureCount",
  "materialRunCost",
  "callbackRiskPercent",
  "targetMargin",
];

const INPUT_LABELS: Record<keyof PlumbingJobMarginVerdictInputs, string> = {
  partsCost: "partsCost",
  laborHours: "laborHours",
  laborRate: "laborRate",
  fixtureCount: "fixtureCount",
  materialRunCost: "materialRunCost",
  callbackRiskPercent: "callbackRiskPercent",
  targetMargin: "targetMargin",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: PlumbingJobMarginVerdictInputs): string[] {
  const errors: string[] = [];
  for (const key of PLUMBING_JOB_MARGIN_VERDICT_INPUT_KEYS) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(`${INPUT_LABELS[key]} is required.`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(`${INPUT_LABELS[key]} must be a finite number.`);
    }
  }
  return errors;
}

function collectWarnings(inputs: PlumbingJobMarginVerdictInputs): string[] {
  const warnings: string[] = [];
  return warnings;
}

export function validatePlumbingJobMarginVerdictInputs(inputs: PlumbingJobMarginVerdictInputs): PlumbingJobMarginVerdictValidationResult {
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
