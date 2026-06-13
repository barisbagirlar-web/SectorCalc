export type EmployeeTotalCostCalculatorInputs = {
  grossSalary: number;
  employerRatePercent: number;
  monthlyBenefits: number;
};

export type EmployeeTotalCostCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const EMPLOYEE_TOTAL_COST_CALCULATOR_INPUT_KEYS: readonly (keyof EmployeeTotalCostCalculatorInputs)[] = [
  "grossSalary",
  "employerRatePercent",
  "monthlyBenefits",
];

const INPUT_LABELS: Record<keyof EmployeeTotalCostCalculatorInputs, string> = {
  grossSalary: "grossSalary",
  employerRatePercent: "employerRatePercent",
  monthlyBenefits: "monthlyBenefits",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: EmployeeTotalCostCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of EMPLOYEE_TOTAL_COST_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.grossSalary < 0) {
    errors.push("grossSalary must be greater than or equal to zero.");
  }

  if (inputs.employerRatePercent < 0 || inputs.employerRatePercent > 100) {
    errors.push("employerRatePercent must be between 0 and 100.");
  }

  if (inputs.monthlyBenefits < 0) {
    errors.push("monthlyBenefits must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: EmployeeTotalCostCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateEmployeeTotalCostCalculatorInputs(inputs: EmployeeTotalCostCalculatorInputs): EmployeeTotalCostCalculatorValidationResult {
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
