export type PlumbingLeakCallbackCostInputs = {
  jobRevenue: number;
  callbackVisits: number;
  visitCost: number;
  materialRunCost: number;
  warrantyReservePercent: number;
};

export type PlumbingLeakCallbackCostValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PLUMBING_LEAK_CALLBACK_COST_INPUT_KEYS: readonly (keyof PlumbingLeakCallbackCostInputs)[] = [
  "jobRevenue",
  "callbackVisits",
  "visitCost",
  "materialRunCost",
  "warrantyReservePercent",
];

const INPUT_LABELS: Record<keyof PlumbingLeakCallbackCostInputs, string> = {
  jobRevenue: "jobRevenue",
  callbackVisits: "callbackVisits",
  visitCost: "visitCost",
  materialRunCost: "materialRunCost",
  warrantyReservePercent: "warrantyReservePercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: PlumbingLeakCallbackCostInputs): string[] {
  const errors: string[] = [];

  for (const key of PLUMBING_LEAK_CALLBACK_COST_INPUT_KEYS) {
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

function collectWarnings(inputs: PlumbingLeakCallbackCostInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validatePlumbingLeakCallbackCostInputs(inputs: PlumbingLeakCallbackCostInputs): PlumbingLeakCallbackCostValidationResult {
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
