export type TripBudgetOptimizerInputs = {
  plannedDistanceKm: number;
  actualDistanceKm: number;
  fuelCostPerKm: number;
  idleHours: number;
  hourlyCost: number;
};

export type TripBudgetOptimizerValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TRIP_BUDGET_OPTIMIZER_INPUT_KEYS: readonly (keyof TripBudgetOptimizerInputs)[] = [
  "plannedDistanceKm",
  "actualDistanceKm",
  "fuelCostPerKm",
  "idleHours",
  "hourlyCost",
];

const INPUT_LABELS: Record<keyof TripBudgetOptimizerInputs, string> = {
  plannedDistanceKm: "plannedDistanceKm",
  actualDistanceKm: "actualDistanceKm",
  fuelCostPerKm: "fuelCostPerKm",
  idleHours: "idleHours",
  hourlyCost: "hourlyCost",
};

const summaryRule = {
  fieldId: "idleHours",
  warning: 3,
  critical: 8,
  direction: "higher_is_bad",
} as const;

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: TripBudgetOptimizerInputs): string[] {
  const errors: string[] = [];

  for (const key of TRIP_BUDGET_OPTIMIZER_INPUT_KEYS) {
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

  if (inputs.plannedDistanceKm < 0) {
    errors.push("plannedDistanceKm must be greater than or equal to zero.");
  }

  if (inputs.actualDistanceKm < 0) {
    errors.push("actualDistanceKm must be greater than or equal to zero.");
  }

  if (inputs.fuelCostPerKm < 0) {
    errors.push("fuelCostPerKm must be greater than or equal to zero.");
  }

  if (inputs.idleHours < 0) {
    errors.push("idleHours must be greater than or equal to zero.");
  }

  if (inputs.hourlyCost < 0) {
    errors.push("hourlyCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: TripBudgetOptimizerInputs): string[] {
  const warnings: string[] = [];

  if (inputs.idleHours >= summaryRule.warning) {
    warnings.push("Idle hours are above plan — route sequencing or loading windows may need adjustment.");
  }

  return warnings;
}

export function validateTripBudgetOptimizerInputs(inputs: TripBudgetOptimizerInputs): TripBudgetOptimizerValidationResult {
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
