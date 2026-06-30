export type HvacProjectMarginGuardInputs = {
  equipmentCost: number;
  ductworkCost: number;
  laborHours: number;
  laborRate: number;
  commissioningCost: number;
  callbackRiskPercent: number;
  targetMargin: number;
};

export type HvacProjectMarginGuardValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const HVAC_PROJECT_MARGIN_GUARD_INPUT_KEYS: readonly (keyof HvacProjectMarginGuardInputs)[] = [
  "equipmentCost",
  "ductworkCost",
  "laborHours",
  "laborRate",
  "commissioningCost",
  "callbackRiskPercent",
  "targetMargin",
];

const INPUT_LABELS: Record<keyof HvacProjectMarginGuardInputs, string> = {
  equipmentCost: "equipmentCost",
  ductworkCost: "ductworkCost",
  laborHours: "laborHours",
  laborRate: "laborRate",
  commissioningCost: "commissioningCost",
  callbackRiskPercent: "callbackRiskPercent",
  targetMargin: "targetMargin",
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
