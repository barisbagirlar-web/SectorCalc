export type SoforOperatorGunlukYevmiyeMaliyetiInputs = {
  dailyWage: number;
  overtimeRatePercent: number;
  overtimeHours: number;
  standardHours: number;
  socialSecurityRatePercent: number;
  mealAllowance: number;
};

export type SoforOperatorGunlukYevmiyeMaliyetiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SOFOR_OPERATOR_GUNLUK_YEVMIYE_MALIYETI_INPUT_KEYS: readonly (keyof SoforOperatorGunlukYevmiyeMaliyetiInputs)[] = [
  "dailyWage",
  "overtimeRatePercent",
  "overtimeHours",
  "standardHours",
  "socialSecurityRatePercent",
  "mealAllowance",
];

const INPUT_LABELS: Record<keyof SoforOperatorGunlukYevmiyeMaliyetiInputs, string> = {
  dailyWage: "dailyWage",
  overtimeRatePercent: "overtimeRatePercent",
  overtimeHours: "overtimeHours",
  standardHours: "standardHours",
  socialSecurityRatePercent: "socialSecurityRatePercent",
  mealAllowance: "mealAllowance",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SoforOperatorGunlukYevmiyeMaliyetiInputs): string[] {
  const errors: string[] = [];

  for (const key of SOFOR_OPERATOR_GUNLUK_YEVMIYE_MALIYETI_INPUT_KEYS) {
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

  if (inputs.dailyWage < 0 || inputs.dailyWage > 10000) {
    errors.push("dailyWage must be between 0 and 10000.");
  }

  if (inputs.overtimeRatePercent < 0 || inputs.overtimeRatePercent > 100) {
    errors.push("overtimeRatePercent must be between 0 and 100.");
  }

  if (inputs.overtimeHours < 0 || inputs.overtimeHours > 12) {
    errors.push("overtimeHours must be between 0 and 12.");
  }

  if (inputs.standardHours < 1 || inputs.standardHours > 24) {
    errors.push("standardHours must be between 1 and 24.");
  }

  if (inputs.standardHours <= 0) {
    errors.push("standardHours must be greater than zero.");
  }

  if (inputs.socialSecurityRatePercent < 0 || inputs.socialSecurityRatePercent > 100) {
    errors.push("socialSecurityRatePercent must be between 0 and 100.");
  }

  if (inputs.mealAllowance < 0 || inputs.mealAllowance > 100) {
    errors.push("mealAllowance must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: SoforOperatorGunlukYevmiyeMaliyetiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSoforOperatorGunlukYevmiyeMaliyetiInputs(inputs: SoforOperatorGunlukYevmiyeMaliyetiInputs): SoforOperatorGunlukYevmiyeMaliyetiValidationResult {
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
