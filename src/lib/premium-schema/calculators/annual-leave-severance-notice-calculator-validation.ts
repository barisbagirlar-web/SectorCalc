export type AnnualLeaveSeveranceNoticeCalculatorInputs = {
  grossMonthlySalary: number;
  employerBurdenPercent: number;
  yearsOfService: number;
  severanceWeeksPerYear: number;
  noticeWeeks: number;
};

export type AnnualLeaveSeveranceNoticeCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ANNUAL_LEAVE_SEVERANCE_NOTICE_CALCULATOR_INPUT_KEYS: readonly (keyof AnnualLeaveSeveranceNoticeCalculatorInputs)[] = [
  "grossMonthlySalary",
  "employerBurdenPercent",
  "yearsOfService",
  "severanceWeeksPerYear",
  "noticeWeeks",
];

const INPUT_LABELS: Record<keyof AnnualLeaveSeveranceNoticeCalculatorInputs, string> = {
  grossMonthlySalary: "grossMonthlySalary",
  employerBurdenPercent: "employerBurdenPercent",
  yearsOfService: "yearsOfService",
  severanceWeeksPerYear: "severanceWeeksPerYear",
  noticeWeeks: "noticeWeeks",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: AnnualLeaveSeveranceNoticeCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of ANNUAL_LEAVE_SEVERANCE_NOTICE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.grossMonthlySalary < 0) {
    errors.push("grossMonthlySalary must be greater than or equal to zero.");
  }

  if (inputs.employerBurdenPercent < 0 || inputs.employerBurdenPercent > 100) {
    errors.push("employerBurdenPercent must be between 0 and 100.");
  }

  if (inputs.yearsOfService < 0 || inputs.yearsOfService > 40) {
    errors.push("yearsOfService must be between 0 and 40.");
  }

  if (inputs.severanceWeeksPerYear < 0 || inputs.severanceWeeksPerYear > 52) {
    errors.push("severanceWeeksPerYear must be between 0 and 52.");
  }

  if (inputs.noticeWeeks < 0 || inputs.noticeWeeks > 52) {
    errors.push("noticeWeeks must be between 0 and 52.");
  }

  return errors;
}

function collectWarnings(inputs: AnnualLeaveSeveranceNoticeCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateAnnualLeaveSeveranceNoticeCalculatorInputs(inputs: AnnualLeaveSeveranceNoticeCalculatorInputs): AnnualLeaveSeveranceNoticeCalculatorValidationResult {
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
