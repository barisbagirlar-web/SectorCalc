export type KaizenKazancTakipVeOnceliklendirmeCalculatorInputs = {
  currentCostPerUnit: number;
  improvedCostPerUnit: number;
  annualProductionVolume: number;
  setupCost: number;
  trainingCost: number;
  downtimeCost: number;
};

export type KaizenKazancTakipVeOnceliklendirmeCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KAIZEN_KAZANC_TAKIP_VE_ONCELIKLENDIRME_CALCULATOR_INPUT_KEYS: readonly (keyof KaizenKazancTakipVeOnceliklendirmeCalculatorInputs)[] = [
  "currentCostPerUnit",
  "improvedCostPerUnit",
  "annualProductionVolume",
  "setupCost",
  "trainingCost",
  "downtimeCost",
];

const INPUT_LABELS: Record<keyof KaizenKazancTakipVeOnceliklendirmeCalculatorInputs, string> = {
  currentCostPerUnit: "currentCostPerUnit",
  improvedCostPerUnit: "improvedCostPerUnit",
  annualProductionVolume: "annualProductionVolume",
  setupCost: "setupCost",
  trainingCost: "trainingCost",
  downtimeCost: "downtimeCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KaizenKazancTakipVeOnceliklendirmeCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of KAIZEN_KAZANC_TAKIP_VE_ONCELIKLENDIRME_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.currentCostPerUnit < 0.01 || inputs.currentCostPerUnit > 100000) {
    errors.push("currentCostPerUnit must be between 0.01 and 100000.");
  }

  if (inputs.currentCostPerUnit <= 0) {
    errors.push("currentCostPerUnit must be greater than zero.");
  }

  if (inputs.improvedCostPerUnit < 0 || inputs.improvedCostPerUnit > 100000) {
    errors.push("improvedCostPerUnit must be between 0 and 100000.");
  }

  if (inputs.annualProductionVolume < 1 || inputs.annualProductionVolume > 100000000) {
    errors.push("annualProductionVolume must be between 1 and 100000000.");
  }

  if (inputs.annualProductionVolume <= 0) {
    errors.push("annualProductionVolume must be greater than zero.");
  }

  if (inputs.setupCost < 0 || inputs.setupCost > 1000000) {
    errors.push("setupCost must be between 0 and 1000000.");
  }

  if (inputs.trainingCost < 0 || inputs.trainingCost > 1000000) {
    errors.push("trainingCost must be between 0 and 1000000.");
  }

  if (inputs.downtimeCost < 0 || inputs.downtimeCost > 1000000) {
    errors.push("downtimeCost must be between 0 and 1000000.");
  }

  return errors;
}

function collectWarnings(inputs: KaizenKazancTakipVeOnceliklendirmeCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKaizenKazancTakipVeOnceliklendirmeCalculatorInputs(inputs: KaizenKazancTakipVeOnceliklendirmeCalculatorInputs): KaizenKazancTakipVeOnceliklendirmeCalculatorValidationResult {
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
