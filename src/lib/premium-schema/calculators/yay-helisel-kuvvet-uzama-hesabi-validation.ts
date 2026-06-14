export type YayHeliselKuvvetUzamaHesabiInputs = {
  shearModulus: number;
  wireDiameter: number;
  meanCoilDiameter: number;
  activeCoils: number;
  deflection: number;
  yieldShearStress: number;
};

export type YayHeliselKuvvetUzamaHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const YAY_HELISEL_KUVVET_UZAMA_HESABI_INPUT_KEYS: readonly (keyof YayHeliselKuvvetUzamaHesabiInputs)[] = [
  "shearModulus",
  "wireDiameter",
  "meanCoilDiameter",
  "activeCoils",
  "deflection",
  "yieldShearStress",
];

const INPUT_LABELS: Record<keyof YayHeliselKuvvetUzamaHesabiInputs, string> = {
  shearModulus: "shearModulus",
  wireDiameter: "wireDiameter",
  meanCoilDiameter: "meanCoilDiameter",
  activeCoils: "activeCoils",
  deflection: "deflection",
  yieldShearStress: "yieldShearStress",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: YayHeliselKuvvetUzamaHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of YAY_HELISEL_KUVVET_UZAMA_HESABI_INPUT_KEYS) {
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

  if (inputs.shearModulus < 1000 || inputs.shearModulus > 100000) {
    errors.push("shearModulus must be between 1000 and 100000.");
  }

  if (inputs.shearModulus <= 0) {
    errors.push("shearModulus must be greater than zero.");
  }

  if (inputs.wireDiameter < 0.1 || inputs.wireDiameter > 100) {
    errors.push("wireDiameter must be between 0.1 and 100.");
  }

  if (inputs.wireDiameter <= 0) {
    errors.push("wireDiameter must be greater than zero.");
  }

  if (inputs.meanCoilDiameter < 1 || inputs.meanCoilDiameter > 500) {
    errors.push("meanCoilDiameter must be between 1 and 500.");
  }

  if (inputs.meanCoilDiameter <= 0) {
    errors.push("meanCoilDiameter must be greater than zero.");
  }

  if (inputs.activeCoils < 1 || inputs.activeCoils > 100) {
    errors.push("activeCoils must be between 1 and 100.");
  }

  if (inputs.activeCoils <= 0) {
    errors.push("activeCoils must be greater than zero.");
  }

  if (inputs.deflection < 0 || inputs.deflection > 1000) {
    errors.push("deflection must be between 0 and 1000.");
  }

  if (inputs.yieldShearStress < 100 || inputs.yieldShearStress > 2000) {
    errors.push("yieldShearStress must be between 100 and 2000.");
  }

  if (inputs.yieldShearStress <= 0) {
    errors.push("yieldShearStress must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: YayHeliselKuvvetUzamaHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateYayHeliselKuvvetUzamaHesabiInputs(inputs: YayHeliselKuvvetUzamaHesabiInputs): YayHeliselKuvvetUzamaHesabiValidationResult {
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
