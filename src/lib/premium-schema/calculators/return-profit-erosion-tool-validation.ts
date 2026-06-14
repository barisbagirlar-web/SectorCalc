export type ReturnProfitErosionToolInputs = {
  monthlyApiCalls: number;
  costPerThousandCalls: number;
  monthlyRevenue: number;
  computeCost: number;
  storageCost: number;
};

export type ReturnProfitErosionToolValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const RETURN_PROFIT_EROSION_TOOL_INPUT_KEYS: readonly (keyof ReturnProfitErosionToolInputs)[] = [
  "monthlyApiCalls",
  "costPerThousandCalls",
  "monthlyRevenue",
  "computeCost",
  "storageCost",
];

const INPUT_LABELS: Record<keyof ReturnProfitErosionToolInputs, string> = {
  monthlyApiCalls: "monthlyApiCalls",
  costPerThousandCalls: "costPerThousandCalls",
  monthlyRevenue: "monthlyRevenue",
  computeCost: "computeCost",
  storageCost: "storageCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ReturnProfitErosionToolInputs): string[] {
  const errors: string[] = [];

  for (const key of RETURN_PROFIT_EROSION_TOOL_INPUT_KEYS) {
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

  if (inputs.monthlyApiCalls < 0) {
    errors.push("monthlyApiCalls must be greater than or equal to zero.");
  }

  if (inputs.costPerThousandCalls < 0) {
    errors.push("costPerThousandCalls must be greater than or equal to zero.");
  }

  if (inputs.monthlyRevenue < 0) {
    errors.push("monthlyRevenue must be greater than or equal to zero.");
  }

  if (inputs.monthlyRevenue <= 0) {
    errors.push("monthlyRevenue must be greater than zero.");
  }

  if (inputs.computeCost < 0) {
    errors.push("computeCost must be greater than or equal to zero.");
  }

  if (inputs.storageCost < 0) {
    errors.push("storageCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: ReturnProfitErosionToolInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateReturnProfitErosionToolInputs(inputs: ReturnProfitErosionToolInputs): ReturnProfitErosionToolValidationResult {
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
