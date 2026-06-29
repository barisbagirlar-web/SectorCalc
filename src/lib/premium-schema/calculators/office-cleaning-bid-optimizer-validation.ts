export type OfficeCleaningBidOptimizerInputs = {
  areaSize: number;
  laborRate: number;
  hoursPerVisit: number;
  supplyCost: number;
  visitFrequency: number;
  targetMargin: number;
};

export type OfficeCleaningBidOptimizerValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const OFFICE_CLEANING_BID_OPTIMIZER_INPUT_KEYS: readonly (keyof OfficeCleaningBidOptimizerInputs)[] = [
  "areaSize",
  "laborRate",
  "hoursPerVisit",
  "supplyCost",
  "visitFrequency",
  "targetMargin",
];

const INPUT_LABELS: Record<keyof OfficeCleaningBidOptimizerInputs, string> = {
  areaSize: "areaSize",
  laborRate: "laborRate",
  hoursPerVisit: "hoursPerVisit",
  supplyCost: "supplyCost",
  visitFrequency: "visitFrequency",
  targetMargin: "targetMargin",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: OfficeCleaningBidOptimizerInputs): string[] {
  const errors: string[] = [];
  for (const key of OFFICE_CLEANING_BID_OPTIMIZER_INPUT_KEYS) {
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

function collectWarnings(inputs: OfficeCleaningBidOptimizerInputs): string[] {
  const warnings: string[] = [];
  return warnings;
}

export function validateOfficeCleaningBidOptimizerInputs(inputs: OfficeCleaningBidOptimizerInputs): OfficeCleaningBidOptimizerValidationResult {
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
