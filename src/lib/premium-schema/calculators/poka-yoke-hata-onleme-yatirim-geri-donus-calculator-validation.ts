export type PokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs = {
  productionVolume: number;
  defectRateBefore: number;
  defectRateAfter: number;
  unitCostOfDefect: number;
  investmentCost: number;
  usefulLifeYears: number;
};

export type PokaYokeHataOnlemeYatirimGeriDonusCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const POKA_YOKE_HATA_ONLEME_YATIRIM_GERI_DONUS_CALCULATOR_INPUT_KEYS: readonly (keyof PokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs)[] = [
  "productionVolume",
  "defectRateBefore",
  "defectRateAfter",
  "unitCostOfDefect",
  "investmentCost",
  "usefulLifeYears",
];

const INPUT_LABELS: Record<keyof PokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs, string> = {
  productionVolume: "productionVolume",
  defectRateBefore: "defectRateBefore",
  defectRateAfter: "defectRateAfter",
  unitCostOfDefect: "unitCostOfDefect",
  investmentCost: "investmentCost",
  usefulLifeYears: "usefulLifeYears",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: PokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of POKA_YOKE_HATA_ONLEME_YATIRIM_GERI_DONUS_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.productionVolume < 1 || inputs.productionVolume > 100000000) {
    errors.push("productionVolume must be between 1 and 100000000.");
  }

  if (inputs.productionVolume <= 0) {
    errors.push("productionVolume must be greater than zero.");
  }

  if (inputs.defectRateBefore < 0 || inputs.defectRateBefore > 100) {
    errors.push("defectRateBefore must be between 0 and 100.");
  }

  if (inputs.defectRateAfter < 0 || inputs.defectRateAfter > 100) {
    errors.push("defectRateAfter must be between 0 and 100.");
  }

  if (inputs.unitCostOfDefect < 0 || inputs.unitCostOfDefect > 100000) {
    errors.push("unitCostOfDefect must be between 0 and 100000.");
  }

  if (inputs.investmentCost < 0 || inputs.investmentCost > 10000000) {
    errors.push("investmentCost must be between 0 and 10000000.");
  }

  if (inputs.usefulLifeYears < 1 || inputs.usefulLifeYears > 50) {
    errors.push("usefulLifeYears must be between 1 and 50.");
  }

  if (inputs.usefulLifeYears <= 0) {
    errors.push("usefulLifeYears must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: PokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validatePokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs(inputs: PokaYokeHataOnlemeYatirimGeriDonusCalculatorInputs): PokaYokeHataOnlemeYatirimGeriDonusCalculatorValidationResult {
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
