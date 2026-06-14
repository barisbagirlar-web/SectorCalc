export type PlumbingJobMarginVerdictInputs = {
  jobRevenue: number;
  callbackVisits: number;
  visitCost: number;
  materialRunCost: number;
  warrantyReservePercent: number;
};

export type PlumbingJobMarginVerdictValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PLUMBING_JOB_MARGIN_VERDICT_INPUT_KEYS: readonly (keyof PlumbingJobMarginVerdictInputs)[] = [
  "jobRevenue",
  "callbackVisits",
  "visitCost",
  "materialRunCost",
  "warrantyReservePercent",
];

const INPUT_LABELS: Record<keyof PlumbingJobMarginVerdictInputs, string> = {
  jobRevenue: "jobRevenue",
  callbackVisits: "callbackVisits",
  visitCost: "visitCost",
  materialRunCost: "materialRunCost",
  warrantyReservePercent: "warrantyReservePercent",
};

const summaryRule = {
  fieldId: "callbackVisits",
  warning: 2,
  critical: 5,
  direction: "higher_is_bad",
} as const;

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

  if (errors.length > 0) {
    return errors;
  }

  if (inputs.jobRevenue < 0) {
    errors.push("jobRevenue must be greater than or equal to zero.");
  }

  if (inputs.jobRevenue <= 0) {
    errors.push("jobRevenue must be greater than zero.");
  }

  if (inputs.callbackVisits < 0) {
    errors.push("callbackVisits must be greater than or equal to zero.");
  }

  if (inputs.visitCost < 0) {
    errors.push("visitCost must be greater than or equal to zero.");
  }

  if (inputs.materialRunCost < 0) {
    errors.push("materialRunCost must be greater than or equal to zero.");
  }

  if (inputs.warrantyReservePercent < 0 || inputs.warrantyReservePercent > 100) {
    errors.push("warrantyReservePercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: PlumbingJobMarginVerdictInputs): string[] {
  const warnings: string[] = [];

  if (inputs.callbackVisits >= summaryRule.warning) {
    warnings.push("Callback visits are elevated — verify leak risk and warranty terms.");
  }

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
