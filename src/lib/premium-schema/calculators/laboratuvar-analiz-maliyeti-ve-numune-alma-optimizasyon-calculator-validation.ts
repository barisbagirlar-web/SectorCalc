export type LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs = {
  monthlyTestDemand: number;
  fixedCostPerMonth: number;
  variableCostPerTest: number;
  currentSamplingRate: number;
  setupCostPerBatch: number;
  holdingCostPerTest: number;
};

export type LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const LABORATUVAR_ANALIZ_MALIYETI_VE_NUMUNE_ALMA_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs)[] = [
  "monthlyTestDemand",
  "fixedCostPerMonth",
  "variableCostPerTest",
  "currentSamplingRate",
  "setupCostPerBatch",
  "holdingCostPerTest",
];

const INPUT_LABELS: Record<keyof LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs, string> = {
  monthlyTestDemand: "monthlyTestDemand",
  fixedCostPerMonth: "fixedCostPerMonth",
  variableCostPerTest: "variableCostPerTest",
  currentSamplingRate: "currentSamplingRate",
  setupCostPerBatch: "setupCostPerBatch",
  holdingCostPerTest: "holdingCostPerTest",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of LABORATUVAR_ANALIZ_MALIYETI_VE_NUMUNE_ALMA_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.monthlyTestDemand < 1 || inputs.monthlyTestDemand > 100000) {
    errors.push("monthlyTestDemand must be between 1 and 100000.");
  }

  if (inputs.monthlyTestDemand <= 0) {
    errors.push("monthlyTestDemand must be greater than zero.");
  }

  if (inputs.fixedCostPerMonth < 0 || inputs.fixedCostPerMonth > 1000000) {
    errors.push("fixedCostPerMonth must be between 0 and 1000000.");
  }

  if (inputs.variableCostPerTest < 0 || inputs.variableCostPerTest > 10000) {
    errors.push("variableCostPerTest must be between 0 and 10000.");
  }

  if (inputs.currentSamplingRate < 1 || inputs.currentSamplingRate > 1000) {
    errors.push("currentSamplingRate must be between 1 and 1000.");
  }

  if (inputs.currentSamplingRate <= 0) {
    errors.push("currentSamplingRate must be greater than zero.");
  }

  if (inputs.setupCostPerBatch < 0 || inputs.setupCostPerBatch > 10000) {
    errors.push("setupCostPerBatch must be between 0 and 10000.");
  }

  if (inputs.holdingCostPerTest < 0 || inputs.holdingCostPerTest > 1000) {
    errors.push("holdingCostPerTest must be between 0 and 1000.");
  }

  return errors;
}

function collectWarnings(inputs: LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs(inputs: LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs): LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorValidationResult {
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
