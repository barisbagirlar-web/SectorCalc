export type EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs = {
  numberOfEmployeesTrained: number;
  trainingCostPerEmployee: number;
  fixedTrainingCost: number;
  baselineProductivityPerEmployee: number;
  productivityImprovementPercent: number;
  numberOfMonthsProductive: number;
};

export type EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const EGITIM_YATIRIMI_VE_VERIMLILIK_ARTISI_GERI_DONUS_CALCULATOR_INPUT_KEYS: readonly (keyof EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs)[] = [
  "numberOfEmployeesTrained",
  "trainingCostPerEmployee",
  "fixedTrainingCost",
  "baselineProductivityPerEmployee",
  "productivityImprovementPercent",
  "numberOfMonthsProductive",
];

const INPUT_LABELS: Record<keyof EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs, string> = {
  numberOfEmployeesTrained: "numberOfEmployeesTrained",
  trainingCostPerEmployee: "trainingCostPerEmployee",
  fixedTrainingCost: "fixedTrainingCost",
  baselineProductivityPerEmployee: "baselineProductivityPerEmployee",
  productivityImprovementPercent: "productivityImprovementPercent",
  numberOfMonthsProductive: "numberOfMonthsProductive",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of EGITIM_YATIRIMI_VE_VERIMLILIK_ARTISI_GERI_DONUS_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.numberOfEmployeesTrained < 1 || inputs.numberOfEmployeesTrained > 100000) {
    errors.push("numberOfEmployeesTrained must be between 1 and 100000.");
  }

  if (inputs.numberOfEmployeesTrained <= 0) {
    errors.push("numberOfEmployeesTrained must be greater than zero.");
  }

  if (inputs.trainingCostPerEmployee < 0 || inputs.trainingCostPerEmployee > 100000) {
    errors.push("trainingCostPerEmployee must be between 0 and 100000.");
  }

  if (inputs.fixedTrainingCost < 0 || inputs.fixedTrainingCost > 1000000) {
    errors.push("fixedTrainingCost must be between 0 and 1000000.");
  }

  if (inputs.baselineProductivityPerEmployee < 0.001 || inputs.baselineProductivityPerEmployee > 1000000) {
    errors.push("baselineProductivityPerEmployee must be between 0.001 and 1000000.");
  }

  if (inputs.baselineProductivityPerEmployee <= 0) {
    errors.push("baselineProductivityPerEmployee must be greater than zero.");
  }

  if (inputs.productivityImprovementPercent < 0 || inputs.productivityImprovementPercent > 100) {
    errors.push("productivityImprovementPercent must be between 0 and 100.");
  }

  if (inputs.numberOfMonthsProductive < 1 || inputs.numberOfMonthsProductive > 12) {
    errors.push("numberOfMonthsProductive must be between 1 and 12.");
  }

  if (inputs.numberOfMonthsProductive <= 0) {
    errors.push("numberOfMonthsProductive must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs(inputs: EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputs): EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorValidationResult {
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
