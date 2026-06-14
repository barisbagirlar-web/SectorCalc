export type JeneratorKapasitesiSecimHesaplamaInputs = {
  totalConnectedLoad: number;
  demandFactor: number;
  expansionMarginPercent: number;
  powerFactor: number;
  generatorEfficiency: number;
};

export type JeneratorKapasitesiSecimHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const JENERATOR_KAPASITESI_SECIM_HESAPLAMA_INPUT_KEYS: readonly (keyof JeneratorKapasitesiSecimHesaplamaInputs)[] = [
  "totalConnectedLoad",
  "demandFactor",
  "expansionMarginPercent",
  "powerFactor",
  "generatorEfficiency",
];

const INPUT_LABELS: Record<keyof JeneratorKapasitesiSecimHesaplamaInputs, string> = {
  totalConnectedLoad: "totalConnectedLoad",
  demandFactor: "demandFactor",
  expansionMarginPercent: "expansionMarginPercent",
  powerFactor: "powerFactor",
  generatorEfficiency: "generatorEfficiency",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: JeneratorKapasitesiSecimHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of JENERATOR_KAPASITESI_SECIM_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.totalConnectedLoad < 0.1 || inputs.totalConnectedLoad > 100000) {
    errors.push("totalConnectedLoad must be between 0.1 and 100000.");
  }

  if (inputs.totalConnectedLoad <= 0) {
    errors.push("totalConnectedLoad must be greater than zero.");
  }

  if (inputs.demandFactor < 0.1 || inputs.demandFactor > 1) {
    errors.push("demandFactor must be between 0.1 and 1.");
  }

  if (inputs.demandFactor <= 0) {
    errors.push("demandFactor must be greater than zero.");
  }

  if (inputs.expansionMarginPercent < 0 || inputs.expansionMarginPercent > 100) {
    errors.push("expansionMarginPercent must be between 0 and 100.");
  }

  if (inputs.powerFactor < 0.5 || inputs.powerFactor > 1) {
    errors.push("powerFactor must be between 0.5 and 1.");
  }

  if (inputs.powerFactor <= 0) {
    errors.push("powerFactor must be greater than zero.");
  }

  if (inputs.generatorEfficiency < 0.7 || inputs.generatorEfficiency > 1) {
    errors.push("generatorEfficiency must be between 0.7 and 1.");
  }

  if (inputs.generatorEfficiency <= 0) {
    errors.push("generatorEfficiency must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: JeneratorKapasitesiSecimHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateJeneratorKapasitesiSecimHesaplamaInputs(inputs: JeneratorKapasitesiSecimHesaplamaInputs): JeneratorKapasitesiSecimHesaplamaValidationResult {
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
