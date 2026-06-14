export type RouteOptimizationAnalyzerInputs = {
  distanceKm: number;
  costPerKm: number;
  emptyReturnPercent: number;
  driverHours: number;
  driverRate: number;
  tolls: number;
  quotedFreightPrice: number;
};

export type RouteOptimizationAnalyzerValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ROUTE_OPTIMIZATION_ANALYZER_INPUT_KEYS: readonly (keyof RouteOptimizationAnalyzerInputs)[] = [
  "distanceKm",
  "costPerKm",
  "emptyReturnPercent",
  "driverHours",
  "driverRate",
  "tolls",
  "quotedFreightPrice",
];

const INPUT_LABELS: Record<keyof RouteOptimizationAnalyzerInputs, string> = {
  distanceKm: "distanceKm",
  costPerKm: "costPerKm",
  emptyReturnPercent: "emptyReturnPercent",
  driverHours: "driverHours",
  driverRate: "driverRate",
  tolls: "tolls",
  quotedFreightPrice: "quotedFreightPrice",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: RouteOptimizationAnalyzerInputs): string[] {
  const errors: string[] = [];

  for (const key of ROUTE_OPTIMIZATION_ANALYZER_INPUT_KEYS) {
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

  if (inputs.distanceKm < 0) {
    errors.push("distanceKm must be greater than or equal to zero.");
  }

  if (inputs.distanceKm <= 0) {
    errors.push("distanceKm must be greater than zero.");
  }

  if (inputs.costPerKm < 0) {
    errors.push("costPerKm must be greater than or equal to zero.");
  }

  if (inputs.emptyReturnPercent < 0 || inputs.emptyReturnPercent > 100) {
    errors.push("emptyReturnPercent must be between 0 and 100.");
  }

  if (inputs.driverHours < 0) {
    errors.push("driverHours must be greater than or equal to zero.");
  }

  if (inputs.driverHours <= 0) {
    errors.push("driverHours must be greater than zero.");
  }

  if (inputs.driverRate < 0) {
    errors.push("driverRate must be greater than or equal to zero.");
  }

  if (inputs.tolls < 0) {
    errors.push("tolls must be greater than or equal to zero.");
  }

  if (inputs.quotedFreightPrice < 0) {
    errors.push("quotedFreightPrice must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: RouteOptimizationAnalyzerInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateRouteOptimizationAnalyzerInputs(inputs: RouteOptimizationAnalyzerInputs): RouteOptimizationAnalyzerValidationResult {
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
