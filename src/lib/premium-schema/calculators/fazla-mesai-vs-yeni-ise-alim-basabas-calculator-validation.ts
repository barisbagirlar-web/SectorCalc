export type FazlaMesaiVsYeniIseAlimBasabasCalculatorInputs = {
  overtimeHoursPerMonth: number;
  overtimeRatePerHour: number;
  overtimePremiumPercent: number;
  recruitmentCostPerHire: number;
  trainingCostPerHire: number;
  newHireMonthlySalary: number;
};

export type FazlaMesaiVsYeniIseAlimBasabasCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const FAZLA_MESAI_VS_YENI_ISE_ALIM_BASABAS_CALCULATOR_INPUT_KEYS: readonly (keyof FazlaMesaiVsYeniIseAlimBasabasCalculatorInputs)[] = [
  "overtimeHoursPerMonth",
  "overtimeRatePerHour",
  "overtimePremiumPercent",
  "recruitmentCostPerHire",
  "trainingCostPerHire",
  "newHireMonthlySalary",
];

const INPUT_LABELS: Record<keyof FazlaMesaiVsYeniIseAlimBasabasCalculatorInputs, string> = {
  overtimeHoursPerMonth: "overtimeHoursPerMonth",
  overtimeRatePerHour: "overtimeRatePerHour",
  overtimePremiumPercent: "overtimePremiumPercent",
  recruitmentCostPerHire: "recruitmentCostPerHire",
  trainingCostPerHire: "trainingCostPerHire",
  newHireMonthlySalary: "newHireMonthlySalary",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: FazlaMesaiVsYeniIseAlimBasabasCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of FAZLA_MESAI_VS_YENI_ISE_ALIM_BASABAS_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.overtimeHoursPerMonth < 0 || inputs.overtimeHoursPerMonth > 720) {
    errors.push("overtimeHoursPerMonth must be between 0 and 720.");
  }

  if (inputs.overtimeRatePerHour < 0 || inputs.overtimeRatePerHour > 1000) {
    errors.push("overtimeRatePerHour must be between 0 and 1000.");
  }

  if (inputs.overtimePremiumPercent < 0 || inputs.overtimePremiumPercent > 100) {
    errors.push("overtimePremiumPercent must be between 0 and 100.");
  }

  if (inputs.recruitmentCostPerHire < 0 || inputs.recruitmentCostPerHire > 100000) {
    errors.push("recruitmentCostPerHire must be between 0 and 100000.");
  }

  if (inputs.trainingCostPerHire < 0 || inputs.trainingCostPerHire > 100000) {
    errors.push("trainingCostPerHire must be between 0 and 100000.");
  }

  if (inputs.newHireMonthlySalary < 0 || inputs.newHireMonthlySalary > 100000) {
    errors.push("newHireMonthlySalary must be between 0 and 100000.");
  }

  return errors;
}

function collectWarnings(inputs: FazlaMesaiVsYeniIseAlimBasabasCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateFazlaMesaiVsYeniIseAlimBasabasCalculatorInputs(inputs: FazlaMesaiVsYeniIseAlimBasabasCalculatorInputs): FazlaMesaiVsYeniIseAlimBasabasCalculatorValidationResult {
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
