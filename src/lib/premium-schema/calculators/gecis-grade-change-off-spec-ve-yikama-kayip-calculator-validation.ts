export type GecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs = {
  productionQuantity: number;
  unitMaterialCost: number;
  offSpecRatePercent: number;
  washLossRatePercent: number;
};

export type GecisGradeChangeOffSpecVeYikamaKayipCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const GECIS_GRADE_CHANGE_OFF_SPEC_VE_YIKAMA_KAYIP_CALCULATOR_INPUT_KEYS: readonly (keyof GecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs)[] = [
  "productionQuantity",
  "unitMaterialCost",
  "offSpecRatePercent",
  "washLossRatePercent",
];

const INPUT_LABELS: Record<keyof GecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs, string> = {
  productionQuantity: "productionQuantity",
  unitMaterialCost: "unitMaterialCost",
  offSpecRatePercent: "offSpecRatePercent",
  washLossRatePercent: "washLossRatePercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: GecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of GECIS_GRADE_CHANGE_OFF_SPEC_VE_YIKAMA_KAYIP_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.productionQuantity < 1 || inputs.productionQuantity > 1000000) {
    errors.push("productionQuantity must be between 1 and 1000000.");
  }

  if (inputs.productionQuantity <= 0) {
    errors.push("productionQuantity must be greater than zero.");
  }

  if (inputs.unitMaterialCost < 0.01 || inputs.unitMaterialCost > 100000) {
    errors.push("unitMaterialCost must be between 0.01 and 100000.");
  }

  if (inputs.unitMaterialCost <= 0) {
    errors.push("unitMaterialCost must be greater than zero.");
  }

  if (inputs.offSpecRatePercent < 0 || inputs.offSpecRatePercent > 100) {
    errors.push("offSpecRatePercent must be between 0 and 100.");
  }

  if (inputs.washLossRatePercent < 0 || inputs.washLossRatePercent > 100) {
    errors.push("washLossRatePercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: GecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateGecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs(inputs: GecisGradeChangeOffSpecVeYikamaKayipCalculatorInputs): GecisGradeChangeOffSpecVeYikamaKayipCalculatorValidationResult {
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
