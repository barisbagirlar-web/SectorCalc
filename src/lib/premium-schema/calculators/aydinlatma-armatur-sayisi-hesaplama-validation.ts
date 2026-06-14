export type AydinlatmaArmaturSayisiHesaplamaInputs = {
  illuminanceTarget: number;
  area: number;
  lampLumens: number;
  numberLampsPerFixture: number;
  lightLossFactor: number;
  utilizationFactor: number;
};

export type AydinlatmaArmaturSayisiHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const AYDINLATMA_ARMATUR_SAYISI_HESAPLAMA_INPUT_KEYS: readonly (keyof AydinlatmaArmaturSayisiHesaplamaInputs)[] = [
  "illuminanceTarget",
  "area",
  "lampLumens",
  "numberLampsPerFixture",
  "lightLossFactor",
  "utilizationFactor",
];

const INPUT_LABELS: Record<keyof AydinlatmaArmaturSayisiHesaplamaInputs, string> = {
  illuminanceTarget: "illuminanceTarget",
  area: "area",
  lampLumens: "lampLumens",
  numberLampsPerFixture: "numberLampsPerFixture",
  lightLossFactor: "lightLossFactor",
  utilizationFactor: "utilizationFactor",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: AydinlatmaArmaturSayisiHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of AYDINLATMA_ARMATUR_SAYISI_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.illuminanceTarget < 50 || inputs.illuminanceTarget > 2000) {
    errors.push("illuminanceTarget must be between 50 and 2000.");
  }

  if (inputs.illuminanceTarget <= 0) {
    errors.push("illuminanceTarget must be greater than zero.");
  }

  if (inputs.area < 1 || inputs.area > 10000) {
    errors.push("area must be between 1 and 10000.");
  }

  if (inputs.area <= 0) {
    errors.push("area must be greater than zero.");
  }

  if (inputs.lampLumens < 100 || inputs.lampLumens > 10000) {
    errors.push("lampLumens must be between 100 and 10000.");
  }

  if (inputs.lampLumens <= 0) {
    errors.push("lampLumens must be greater than zero.");
  }

  if (inputs.numberLampsPerFixture < 1 || inputs.numberLampsPerFixture > 10) {
    errors.push("numberLampsPerFixture must be between 1 and 10.");
  }

  if (inputs.numberLampsPerFixture <= 0) {
    errors.push("numberLampsPerFixture must be greater than zero.");
  }

  if (inputs.lightLossFactor < 0.5 || inputs.lightLossFactor > 1) {
    errors.push("lightLossFactor must be between 0.5 and 1.");
  }

  if (inputs.lightLossFactor <= 0) {
    errors.push("lightLossFactor must be greater than zero.");
  }

  if (inputs.utilizationFactor < 0.3 || inputs.utilizationFactor > 1) {
    errors.push("utilizationFactor must be between 0.3 and 1.");
  }

  if (inputs.utilizationFactor <= 0) {
    errors.push("utilizationFactor must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: AydinlatmaArmaturSayisiHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateAydinlatmaArmaturSayisiHesaplamaInputs(inputs: AydinlatmaArmaturSayisiHesaplamaInputs): AydinlatmaArmaturSayisiHesaplamaValidationResult {
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
