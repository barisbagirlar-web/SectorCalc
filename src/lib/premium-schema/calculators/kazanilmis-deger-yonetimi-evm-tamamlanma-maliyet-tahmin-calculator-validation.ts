export type KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs = {
  budgetAtCompletion: number;
  plannedValue: number;
  earnedValue: number;
  actualCost: number;
};

export type KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KAZANILMIS_DEGER_YONETIMI_EVM_TAMAMLANMA_MALIYET_TAHMIN_CALCULATOR_INPUT_KEYS: readonly (keyof KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs)[] = [
  "budgetAtCompletion",
  "plannedValue",
  "earnedValue",
  "actualCost",
];

const INPUT_LABELS: Record<keyof KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs, string> = {
  budgetAtCompletion: "budgetAtCompletion",
  plannedValue: "plannedValue",
  earnedValue: "earnedValue",
  actualCost: "actualCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of KAZANILMIS_DEGER_YONETIMI_EVM_TAMAMLANMA_MALIYET_TAHMIN_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.budgetAtCompletion < 0.01 || inputs.budgetAtCompletion > 1000000000) {
    errors.push("budgetAtCompletion must be between 0.01 and 1000000000.");
  }

  if (inputs.budgetAtCompletion <= 0) {
    errors.push("budgetAtCompletion must be greater than zero.");
  }

  if (inputs.plannedValue < 0 || inputs.plannedValue > 1000000000) {
    errors.push("plannedValue must be between 0 and 1000000000.");
  }

  if (inputs.earnedValue < 0 || inputs.earnedValue > 1000000000) {
    errors.push("earnedValue must be between 0 and 1000000000.");
  }

  if (inputs.actualCost < 0.01 || inputs.actualCost > 1000000000) {
    errors.push("actualCost must be between 0.01 and 1000000000.");
  }

  if (inputs.actualCost <= 0) {
    errors.push("actualCost must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs(inputs: KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputs): KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorValidationResult {
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
