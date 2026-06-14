export type FazlaMesaiUcretiHesaplamaInputs = {
  monthlySalary: number;
  weeklyHours: number;
  overtimeHours: number;
  overtimeMultiplier: number;
};

export type FazlaMesaiUcretiHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const FAZLA_MESAI_UCRETI_HESAPLAMA_INPUT_KEYS: readonly (keyof FazlaMesaiUcretiHesaplamaInputs)[] = [
  "monthlySalary",
  "weeklyHours",
  "overtimeHours",
  "overtimeMultiplier",
];

const INPUT_LABELS: Record<keyof FazlaMesaiUcretiHesaplamaInputs, string> = {
  monthlySalary: "monthlySalary",
  weeklyHours: "weeklyHours",
  overtimeHours: "overtimeHours",
  overtimeMultiplier: "overtimeMultiplier",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: FazlaMesaiUcretiHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of FAZLA_MESAI_UCRETI_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.monthlySalary < 0 || inputs.monthlySalary > 1000000) {
    errors.push("monthlySalary must be between 0 and 1000000.");
  }

  if (inputs.weeklyHours < 1 || inputs.weeklyHours > 168) {
    errors.push("weeklyHours must be between 1 and 168.");
  }

  if (inputs.weeklyHours <= 0) {
    errors.push("weeklyHours must be greater than zero.");
  }

  if (inputs.overtimeHours < 0 || inputs.overtimeHours > 1000) {
    errors.push("overtimeHours must be between 0 and 1000.");
  }

  if (inputs.overtimeMultiplier < 1 || inputs.overtimeMultiplier > 3) {
    errors.push("overtimeMultiplier must be between 1 and 3.");
  }

  if (inputs.overtimeMultiplier <= 0) {
    errors.push("overtimeMultiplier must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: FazlaMesaiUcretiHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateFazlaMesaiUcretiHesaplamaInputs(inputs: FazlaMesaiUcretiHesaplamaInputs): FazlaMesaiUcretiHesaplamaValidationResult {
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
