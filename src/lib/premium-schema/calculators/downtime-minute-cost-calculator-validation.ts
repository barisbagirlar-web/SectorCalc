export type DowntimeMinuteCostCalculatorInputs = {
  downtimeMinutes: number;
  hourlyRate: number;
  outputUnitsPerHour: number;
  contributionPerUnit: number;
};

export type DowntimeMinuteCostCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const DOWNTIME_MINUTE_COST_CALCULATOR_INPUT_KEYS: readonly (keyof DowntimeMinuteCostCalculatorInputs)[] = [
  "downtimeMinutes",
  "hourlyRate",
  "outputUnitsPerHour",
  "contributionPerUnit",
];

const INPUT_LABELS: Record<keyof DowntimeMinuteCostCalculatorInputs, string> = {
  downtimeMinutes: "downtimeMinutes",
  hourlyRate: "hourlyRate",
  outputUnitsPerHour: "outputUnitsPerHour",
  contributionPerUnit: "contributionPerUnit",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: DowntimeMinuteCostCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of DOWNTIME_MINUTE_COST_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.downtimeMinutes < 0) {
    errors.push("downtimeMinutes must be greater than or equal to zero.");
  }

  if (inputs.hourlyRate < 0 || inputs.hourlyRate > 100) {
    errors.push("hourlyRate must be between 0 and 100.");
  }

  if (inputs.outputUnitsPerHour < 0) {
    errors.push("outputUnitsPerHour must be greater than or equal to zero.");
  }

  if (inputs.outputUnitsPerHour <= 0) {
    errors.push("outputUnitsPerHour must be greater than zero.");
  }

  if (inputs.contributionPerUnit < 0) {
    errors.push("contributionPerUnit must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: DowntimeMinuteCostCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateDowntimeMinuteCostCalculatorInputs(inputs: DowntimeMinuteCostCalculatorInputs): DowntimeMinuteCostCalculatorValidationResult {
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
