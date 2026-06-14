export type OgrenmeEgrisiVePartiSureTahminCalculatorInputs = {
  firstUnitTimeHours: number;
  learningRatePercent: number;
  batchQuantity: number;
  hourlyLaborRate: number;
  unitMaterialCost: number;
  overheadRatePercent: number;
};

export type OgrenmeEgrisiVePartiSureTahminCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const OGRENME_EGRISI_VE_PARTI_SURE_TAHMIN_CALCULATOR_INPUT_KEYS: readonly (keyof OgrenmeEgrisiVePartiSureTahminCalculatorInputs)[] = [
  "firstUnitTimeHours",
  "learningRatePercent",
  "batchQuantity",
  "hourlyLaborRate",
  "unitMaterialCost",
  "overheadRatePercent",
];

const INPUT_LABELS: Record<keyof OgrenmeEgrisiVePartiSureTahminCalculatorInputs, string> = {
  firstUnitTimeHours: "firstUnitTimeHours",
  learningRatePercent: "learningRatePercent",
  batchQuantity: "batchQuantity",
  hourlyLaborRate: "hourlyLaborRate",
  unitMaterialCost: "unitMaterialCost",
  overheadRatePercent: "overheadRatePercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: OgrenmeEgrisiVePartiSureTahminCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of OGRENME_EGRISI_VE_PARTI_SURE_TAHMIN_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.firstUnitTimeHours < 0.01 || inputs.firstUnitTimeHours > 10000) {
    errors.push("firstUnitTimeHours must be between 0.01 and 10000.");
  }

  if (inputs.firstUnitTimeHours <= 0) {
    errors.push("firstUnitTimeHours must be greater than zero.");
  }

  if (inputs.learningRatePercent < 0 || inputs.learningRatePercent > 100) {
    errors.push("learningRatePercent must be between 0 and 100.");
  }

  if (inputs.learningRatePercent <= 0) {
    errors.push("learningRatePercent must be greater than zero.");
  }

  if (inputs.batchQuantity < 1 || inputs.batchQuantity > 1000000) {
    errors.push("batchQuantity must be between 1 and 1000000.");
  }

  if (inputs.batchQuantity <= 0) {
    errors.push("batchQuantity must be greater than zero.");
  }

  if (inputs.hourlyLaborRate < 0 || inputs.hourlyLaborRate > 1000) {
    errors.push("hourlyLaborRate must be between 0 and 1000.");
  }

  if (inputs.unitMaterialCost < 0 || inputs.unitMaterialCost > 100000) {
    errors.push("unitMaterialCost must be between 0 and 100000.");
  }

  if (inputs.overheadRatePercent < 0 || inputs.overheadRatePercent > 100) {
    errors.push("overheadRatePercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: OgrenmeEgrisiVePartiSureTahminCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateOgrenmeEgrisiVePartiSureTahminCalculatorInputs(inputs: OgrenmeEgrisiVePartiSureTahminCalculatorInputs): OgrenmeEgrisiVePartiSureTahminCalculatorValidationResult {
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
