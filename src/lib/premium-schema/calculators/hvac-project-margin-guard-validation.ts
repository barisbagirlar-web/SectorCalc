export type HvacProjectMarginGuardInputs = {
  projectRevenue: number;
  ductworkVariance: number;
  commissioningHours: number;
  laborRate: number;
  callbackRiskPercent: number;
};

export type HvacProjectMarginGuardValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const HVAC_PROJECT_MARGIN_GUARD_INPUT_KEYS: readonly (keyof HvacProjectMarginGuardInputs)[] = [
  "projectRevenue",
  "ductworkVariance",
  "commissioningHours",
  "laborRate",
  "callbackRiskPercent",
];

const INPUT_LABELS: Record<keyof HvacProjectMarginGuardInputs, string> = {
  projectRevenue: "projectRevenue",
  ductworkVariance: "ductworkVariance",
  commissioningHours: "commissioningHours",
  laborRate: "laborRate",
  callbackRiskPercent: "callbackRiskPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: HvacProjectMarginGuardInputs): string[] {
  const errors: string[] = [];

  for (const key of HVAC_PROJECT_MARGIN_GUARD_INPUT_KEYS) {
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

  if (inputs.projectRevenue < 0) {
    errors.push("projectRevenue must be greater than or equal to zero.");
  }

  if (inputs.projectRevenue <= 0) {
    errors.push("projectRevenue must be greater than zero.");
  }

  if (inputs.ductworkVariance < 0) {
    errors.push("ductworkVariance must be greater than or equal to zero.");
  }

  if (inputs.commissioningHours < 0) {
    errors.push("commissioningHours must be greater than or equal to zero.");
  }

  if (inputs.laborRate < 0) {
    errors.push("laborRate must be greater than or equal to zero.");
  }

  if (inputs.callbackRiskPercent < 0 || inputs.callbackRiskPercent > 100) {
    errors.push("callbackRiskPercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: HvacProjectMarginGuardInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateHvacProjectMarginGuardInputs(inputs: HvacProjectMarginGuardInputs): HvacProjectMarginGuardValidationResult {
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
