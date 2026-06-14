export type BoruAgirlikHesaplamaCelikPaslanmazInputs = {
  outerDiameter: number;
  wallThickness: number;
  length: number;
  materialDensity: number;
};

export type BoruAgirlikHesaplamaCelikPaslanmazValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const BORU_AGIRLIK_HESAPLAMA_CELIK_PASLANMAZ_INPUT_KEYS: readonly (keyof BoruAgirlikHesaplamaCelikPaslanmazInputs)[] = [
  "outerDiameter",
  "wallThickness",
  "length",
  "materialDensity",
];

const INPUT_LABELS: Record<keyof BoruAgirlikHesaplamaCelikPaslanmazInputs, string> = {
  outerDiameter: "outerDiameter",
  wallThickness: "wallThickness",
  length: "length",
  materialDensity: "materialDensity",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: BoruAgirlikHesaplamaCelikPaslanmazInputs): string[] {
  const errors: string[] = [];

  for (const key of BORU_AGIRLIK_HESAPLAMA_CELIK_PASLANMAZ_INPUT_KEYS) {
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

  if (inputs.outerDiameter < 1 || inputs.outerDiameter > 5000) {
    errors.push("outerDiameter must be between 1 and 5000.");
  }

  if (inputs.outerDiameter <= 0) {
    errors.push("outerDiameter must be greater than zero.");
  }

  if (inputs.wallThickness < 0.1 || inputs.wallThickness > 500) {
    errors.push("wallThickness must be between 0.1 and 500.");
  }

  if (inputs.wallThickness <= 0) {
    errors.push("wallThickness must be greater than zero.");
  }

  if (inputs.length < 0.1 || inputs.length > 100) {
    errors.push("length must be between 0.1 and 100.");
  }

  if (inputs.length <= 0) {
    errors.push("length must be greater than zero.");
  }

  if (inputs.materialDensity < 1000 || inputs.materialDensity > 20000) {
    errors.push("materialDensity must be between 1000 and 20000.");
  }

  if (inputs.materialDensity <= 0) {
    errors.push("materialDensity must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: BoruAgirlikHesaplamaCelikPaslanmazInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateBoruAgirlikHesaplamaCelikPaslanmazInputs(inputs: BoruAgirlikHesaplamaCelikPaslanmazInputs): BoruAgirlikHesaplamaCelikPaslanmazValidationResult {
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
