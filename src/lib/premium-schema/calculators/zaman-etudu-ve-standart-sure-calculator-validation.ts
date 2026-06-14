export type ZamanEtuduVeStandartSureCalculatorInputs = {
  observedTimeMinutes: number;
  performanceRatingPercent: number;
  allowancePercent: number;
  batchQuantity: number;
  actualTimeMinutes: number;
};

export type ZamanEtuduVeStandartSureCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ZAMAN_ETUDU_VE_STANDART_SURE_CALCULATOR_INPUT_KEYS: readonly (keyof ZamanEtuduVeStandartSureCalculatorInputs)[] = [
  "observedTimeMinutes",
  "performanceRatingPercent",
  "allowancePercent",
  "batchQuantity",
  "actualTimeMinutes",
];

const INPUT_LABELS: Record<keyof ZamanEtuduVeStandartSureCalculatorInputs, string> = {
  observedTimeMinutes: "observedTimeMinutes",
  performanceRatingPercent: "performanceRatingPercent",
  allowancePercent: "allowancePercent",
  batchQuantity: "batchQuantity",
  actualTimeMinutes: "actualTimeMinutes",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ZamanEtuduVeStandartSureCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of ZAMAN_ETUDU_VE_STANDART_SURE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.observedTimeMinutes < 0.01 || inputs.observedTimeMinutes > 1440) {
    errors.push("observedTimeMinutes must be between 0.01 and 1440.");
  }

  if (inputs.observedTimeMinutes <= 0) {
    errors.push("observedTimeMinutes must be greater than zero.");
  }

  if (inputs.performanceRatingPercent < 0 || inputs.performanceRatingPercent > 100) {
    errors.push("performanceRatingPercent must be between 0 and 100.");
  }

  if (inputs.performanceRatingPercent <= 0) {
    errors.push("performanceRatingPercent must be greater than zero.");
  }

  if (inputs.allowancePercent < 0 || inputs.allowancePercent > 100) {
    errors.push("allowancePercent must be between 0 and 100.");
  }

  if (inputs.batchQuantity < 1 || inputs.batchQuantity > 1000000) {
    errors.push("batchQuantity must be between 1 and 1000000.");
  }

  if (inputs.batchQuantity <= 0) {
    errors.push("batchQuantity must be greater than zero.");
  }

  if (inputs.actualTimeMinutes < 0.01 || inputs.actualTimeMinutes > 1000000) {
    errors.push("actualTimeMinutes must be between 0.01 and 1000000.");
  }

  if (inputs.actualTimeMinutes <= 0) {
    errors.push("actualTimeMinutes must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: ZamanEtuduVeStandartSureCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateZamanEtuduVeStandartSureCalculatorInputs(inputs: ZamanEtuduVeStandartSureCalculatorInputs): ZamanEtuduVeStandartSureCalculatorValidationResult {
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
