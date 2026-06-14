export type OfficeCleaningBidOptimizerInputs = {
  monthlyRent: number;
  totalSqm: number;
  unusedSpacePercent: number;
  handlingOverrunHours: number;
  hourlyCost: number;
};

export type OfficeCleaningBidOptimizerValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const OFFICE_CLEANING_BID_OPTIMIZER_INPUT_KEYS: readonly (keyof OfficeCleaningBidOptimizerInputs)[] = [
  "monthlyRent",
  "totalSqm",
  "unusedSpacePercent",
  "handlingOverrunHours",
  "hourlyCost",
];

const INPUT_LABELS: Record<keyof OfficeCleaningBidOptimizerInputs, string> = {
  monthlyRent: "monthlyRent",
  totalSqm: "totalSqm",
  unusedSpacePercent: "unusedSpacePercent",
  handlingOverrunHours: "handlingOverrunHours",
  hourlyCost: "hourlyCost",
};

const summaryRule = {
  fieldId: "unusedSpacePercent",
  warning: 10,
  critical: 20,
  direction: "higher_is_bad",
} as const;

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

  if (errors.length > 0) {
    return errors;
  }

  if (inputs.monthlyRent < 0) {
    errors.push("monthlyRent must be greater than or equal to zero.");
  }

  if (inputs.totalSqm < 0) {
    errors.push("totalSqm must be greater than or equal to zero.");
  }

  if (inputs.totalSqm <= 0) {
    errors.push("totalSqm must be greater than zero.");
  }

  if (inputs.unusedSpacePercent < 0 || inputs.unusedSpacePercent > 100) {
    errors.push("unusedSpacePercent must be between 0 and 100.");
  }

  if (inputs.handlingOverrunHours < 0) {
    errors.push("handlingOverrunHours must be greater than or equal to zero.");
  }

  if (inputs.hourlyCost < 0) {
    errors.push("hourlyCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: OfficeCleaningBidOptimizerInputs): string[] {
  const warnings: string[] = [];

  if (inputs.unusedSpacePercent >= summaryRule.warning) {
    warnings.push("Unused space is above typical band — rent leak is building.");
  }

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
