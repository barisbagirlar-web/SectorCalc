export type LogisticsFuelRouteDriftInputs = {
  plannedDistanceKm: number;
  actualDistanceKm: number;
  fuelCostPerKm: number;
  idleHours: number;
  hourlyCost: number;
};

export type LogisticsFuelRouteDriftValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const LOGISTICS_FUEL_ROUTE_DRIFT_INPUT_KEYS: readonly (keyof LogisticsFuelRouteDriftInputs)[] = [
  "plannedDistanceKm",
  "actualDistanceKm",
  "fuelCostPerKm",
  "idleHours",
  "hourlyCost",
];

const INPUT_LABELS: Record<keyof LogisticsFuelRouteDriftInputs, string> = {
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

function collectInputErrors(inputs: LogisticsFuelRouteDriftInputs): string[] {
  const errors: string[] = [];

  for (const key of LOGISTICS_FUEL_ROUTE_DRIFT_INPUT_KEYS) {
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

function collectWarnings(inputs: LogisticsFuelRouteDriftInputs): string[] {
  const warnings: string[] = [];

  if (inputs.idleHours >= summaryRule.warning) {
    warnings.push("Idle hours are above plan — route sequencing or loading windows may need adjustment.");
  }

  return warnings;
}

export function validateLogisticsFuelRouteDriftInputs(inputs: LogisticsFuelRouteDriftInputs): LogisticsFuelRouteDriftValidationResult {
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
