export type KesmeParametreleriTakimOmruOptimizasyonCalculatorInputs = {
  cuttingSpeed: number;
  toolLifeConstantC: number;
  toolLifeExponentN: number;
  toolChangeCost: number;
  machineHourlyRate: number;
  productionRate: number;
};

export type KesmeParametreleriTakimOmruOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KESME_PARAMETRELERI_TAKIM_OMRU_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof KesmeParametreleriTakimOmruOptimizasyonCalculatorInputs)[] = [
  "cuttingSpeed",
  "toolLifeConstantC",
  "toolLifeExponentN",
  "toolChangeCost",
  "machineHourlyRate",
  "productionRate",
];

const INPUT_LABELS: Record<keyof KesmeParametreleriTakimOmruOptimizasyonCalculatorInputs, string> = {
  cuttingSpeed: "cuttingSpeed",
  toolLifeConstantC: "toolLifeConstantC",
  toolLifeExponentN: "toolLifeExponentN",
  toolChangeCost: "toolChangeCost",
  machineHourlyRate: "machineHourlyRate",
  productionRate: "productionRate",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KesmeParametreleriTakimOmruOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of KESME_PARAMETRELERI_TAKIM_OMRU_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.cuttingSpeed < 0.1 || inputs.cuttingSpeed > 1000) {
    errors.push("cuttingSpeed must be between 0.1 and 1000.");
  }

  if (inputs.cuttingSpeed <= 0) {
    errors.push("cuttingSpeed must be greater than zero.");
  }

  if (inputs.toolLifeConstantC < 1 || inputs.toolLifeConstantC > 10000) {
    errors.push("toolLifeConstantC must be between 1 and 10000.");
  }

  if (inputs.toolLifeConstantC <= 0) {
    errors.push("toolLifeConstantC must be greater than zero.");
  }

  if (inputs.toolLifeExponentN < 0.01 || inputs.toolLifeExponentN > 1) {
    errors.push("toolLifeExponentN must be between 0.01 and 1.");
  }

  if (inputs.toolLifeExponentN <= 0) {
    errors.push("toolLifeExponentN must be greater than zero.");
  }

  if (inputs.toolChangeCost < 0 || inputs.toolChangeCost > 10000) {
    errors.push("toolChangeCost must be between 0 and 10000.");
  }

  if (inputs.machineHourlyRate < 0 || inputs.machineHourlyRate > 10000) {
    errors.push("machineHourlyRate must be between 0 and 10000.");
  }

  if (inputs.productionRate < 0.1 || inputs.productionRate > 10000) {
    errors.push("productionRate must be between 0.1 and 10000.");
  }

  if (inputs.productionRate <= 0) {
    errors.push("productionRate must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: KesmeParametreleriTakimOmruOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKesmeParametreleriTakimOmruOptimizasyonCalculatorInputs(inputs: KesmeParametreleriTakimOmruOptimizasyonCalculatorInputs): KesmeParametreleriTakimOmruOptimizasyonCalculatorValidationResult {
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
