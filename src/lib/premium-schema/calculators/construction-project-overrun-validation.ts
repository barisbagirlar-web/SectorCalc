export type ConstructionProjectOverrunInputs = {
  dailySiteCost: number;
  delayDays: number;
  laborBudget: number;
  laborOverrunPercent: number;
  materialBudget: number;
  materialOverrunPercent: number;
};

export type ConstructionProjectOverrunValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CONSTRUCTION_PROJECT_OVERRUN_INPUT_KEYS: readonly (keyof ConstructionProjectOverrunInputs)[] =
  [
    "dailySiteCost",
    "delayDays",
    "laborBudget",
    "laborOverrunPercent",
    "materialBudget",
    "materialOverrunPercent",
  ];

const INPUT_LABELS: Record<keyof ConstructionProjectOverrunInputs, string> = {
  dailySiteCost: "dailySiteCost",
  delayDays: "delayDays",
  laborBudget: "laborBudget",
  laborOverrunPercent: "laborOverrunPercent",
  materialBudget: "materialBudget",
  materialOverrunPercent: "materialOverrunPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ConstructionProjectOverrunInputs): string[] {
  const errors: string[] = [];

  for (const key of CONSTRUCTION_PROJECT_OVERRUN_INPUT_KEYS) {
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

  if (inputs.dailySiteCost < 0) {
    errors.push("dailySiteCost must be greater than or equal to zero.");
  }
  if (inputs.delayDays < 0) {
    errors.push("delayDays must be greater than or equal to zero.");
  }
  if (inputs.laborBudget < 0) {
    errors.push("laborBudget must be greater than or equal to zero.");
  }
  if (inputs.laborOverrunPercent < 0 || inputs.laborOverrunPercent > 100) {
    errors.push("laborOverrunPercent must be between 0 and 100.");
  }
  if (inputs.materialBudget < 0) {
    errors.push("materialBudget must be greater than or equal to zero.");
  }
  if (inputs.materialOverrunPercent < 0 || inputs.materialOverrunPercent > 100) {
    errors.push("materialOverrunPercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: ConstructionProjectOverrunInputs): string[] {
  const warnings: string[] = [];

  if (inputs.delayDays >= 3) {
    warnings.push(
      "Schedule slip is building — delay cost may erase contingency before closeout.",
    );
  }

  if (inputs.laborOverrunPercent >= 5) {
    warnings.push(
      "Labor drift is above typical band — verify crew productivity assumptions.",
    );
  }

  if (inputs.materialOverrunPercent >= 4) {
    warnings.push(
      "Material variance is elevated — check lead times and substitution risk.",
    );
  }

  return warnings;
}

export function validateConstructionProjectOverrunInputs(
  inputs: ConstructionProjectOverrunInputs,
): ConstructionProjectOverrunValidationResult {
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
