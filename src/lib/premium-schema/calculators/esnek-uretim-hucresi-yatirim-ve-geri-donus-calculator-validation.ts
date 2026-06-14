export type EsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs = {
  equipmentCost: number;
  installationCost: number;
  trainingCost: number;
  annualLaborSavings: number;
  annualScrapReductionSavings: number;
  annualThroughputIncreaseSavings: number;
};

export type EsnekUretimHucresiYatirimVeGeriDonusCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ESNEK_URETIM_HUCRESI_YATIRIM_VE_GERI_DONUS_CALCULATOR_INPUT_KEYS: readonly (keyof EsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs)[] = [
  "equipmentCost",
  "installationCost",
  "trainingCost",
  "annualLaborSavings",
  "annualScrapReductionSavings",
  "annualThroughputIncreaseSavings",
];

const INPUT_LABELS: Record<keyof EsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs, string> = {
  equipmentCost: "equipmentCost",
  installationCost: "installationCost",
  trainingCost: "trainingCost",
  annualLaborSavings: "annualLaborSavings",
  annualScrapReductionSavings: "annualScrapReductionSavings",
  annualThroughputIncreaseSavings: "annualThroughputIncreaseSavings",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: EsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of ESNEK_URETIM_HUCRESI_YATIRIM_VE_GERI_DONUS_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.equipmentCost < 0 || inputs.equipmentCost > 10000000) {
    errors.push("equipmentCost must be between 0 and 10000000.");
  }

  if (inputs.installationCost < 0 || inputs.installationCost > 2000000) {
    errors.push("installationCost must be between 0 and 2000000.");
  }

  if (inputs.trainingCost < 0 || inputs.trainingCost > 500000) {
    errors.push("trainingCost must be between 0 and 500000.");
  }

  if (inputs.annualLaborSavings < 0 || inputs.annualLaborSavings > 5000000) {
    errors.push("annualLaborSavings must be between 0 and 5000000.");
  }

  if (inputs.annualScrapReductionSavings < 0 || inputs.annualScrapReductionSavings > 500000) {
    errors.push("annualScrapReductionSavings must be between 0 and 500000.");
  }

  if (inputs.annualThroughputIncreaseSavings < 0 || inputs.annualThroughputIncreaseSavings > 500000) {
    errors.push("annualThroughputIncreaseSavings must be between 0 and 500000.");
  }

  return errors;
}

function collectWarnings(inputs: EsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateEsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs(inputs: EsnekUretimHucresiYatirimVeGeriDonusCalculatorInputs): EsnekUretimHucresiYatirimVeGeriDonusCalculatorValidationResult {
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
