export type SalaryCostCalculatorInputs = {
  baseSalary: number;
  bonuses: number;
  socialSecurityRate: number;
  otherEmployerCosts: number;
  workingDaysPerMonth: number;
  dailyHours: number;
};

export type SalaryCostCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SALARY_COST_CALCULATOR_INPUT_KEYS: readonly (keyof SalaryCostCalculatorInputs)[] = [
  "baseSalary",
  "bonuses",
  "socialSecurityRate",
  "otherEmployerCosts",
  "workingDaysPerMonth",
  "dailyHours",
];

const INPUT_LABELS: Record<keyof SalaryCostCalculatorInputs, string> = {
  baseSalary: "baseSalary",
  bonuses: "bonuses",
  socialSecurityRate: "socialSecurityRate",
  otherEmployerCosts: "otherEmployerCosts",
  workingDaysPerMonth: "workingDaysPerMonth",
  dailyHours: "dailyHours",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SalaryCostCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of SALARY_COST_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.baseSalary < 0 || inputs.baseSalary > 1000000) {
    errors.push("baseSalary must be between 0 and 1000000.");
  }

  if (inputs.baseSalary <= 0) {
    errors.push("baseSalary must be greater than zero.");
  }

  if (inputs.bonuses < 0 || inputs.bonuses > 1000000) {
    errors.push("bonuses must be between 0 and 1000000.");
  }

  if (inputs.socialSecurityRate < 0 || inputs.socialSecurityRate > 100) {
    errors.push("socialSecurityRate must be between 0 and 100.");
  }

  if (inputs.otherEmployerCosts < 0 || inputs.otherEmployerCosts > 1000000) {
    errors.push("otherEmployerCosts must be between 0 and 1000000.");
  }

  if (inputs.workingDaysPerMonth < 1 || inputs.workingDaysPerMonth > 31) {
    errors.push("workingDaysPerMonth must be between 1 and 31.");
  }

  if (inputs.workingDaysPerMonth <= 0) {
    errors.push("workingDaysPerMonth must be greater than zero.");
  }

  if (inputs.dailyHours < 1 || inputs.dailyHours > 24) {
    errors.push("dailyHours must be between 1 and 24.");
  }

  if (inputs.dailyHours <= 0) {
    errors.push("dailyHours must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: SalaryCostCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSalaryCostCalculatorInputs(inputs: SalaryCostCalculatorInputs): SalaryCostCalculatorValidationResult {
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
