export type KosebentLamaAgirlikHesaplamaInputs = {
  leg1: number;
  leg2: number;
  thickness: number;
  length: number;
  tolerancePercent: number;
};

export type KosebentLamaAgirlikHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KOSEBENT_LAMA_AGIRLIK_HESAPLAMA_INPUT_KEYS: readonly (keyof KosebentLamaAgirlikHesaplamaInputs)[] = [
  "leg1",
  "leg2",
  "thickness",
  "length",
  "tolerancePercent",
];

const INPUT_LABELS: Record<keyof KosebentLamaAgirlikHesaplamaInputs, string> = {
  leg1: "leg1",
  leg2: "leg2",
  thickness: "thickness",
  length: "length",
  tolerancePercent: "tolerancePercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KosebentLamaAgirlikHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of KOSEBENT_LAMA_AGIRLIK_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.leg1 < 1 || inputs.leg1 > 500) {
    errors.push("leg1 must be between 1 and 500.");
  }

  if (inputs.leg1 <= 0) {
    errors.push("leg1 must be greater than zero.");
  }

  if (inputs.leg2 < 1 || inputs.leg2 > 500) {
    errors.push("leg2 must be between 1 and 500.");
  }

  if (inputs.leg2 <= 0) {
    errors.push("leg2 must be greater than zero.");
  }

  if (inputs.thickness < 1 || inputs.thickness > 50) {
    errors.push("thickness must be between 1 and 50.");
  }

  if (inputs.thickness <= 0) {
    errors.push("thickness must be greater than zero.");
  }

  if (inputs.length < 0.1 || inputs.length > 100) {
    errors.push("length must be between 0.1 and 100.");
  }

  if (inputs.length <= 0) {
    errors.push("length must be greater than zero.");
  }

  if (inputs.tolerancePercent < 0 || inputs.tolerancePercent > 100) {
    errors.push("tolerancePercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: KosebentLamaAgirlikHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKosebentLamaAgirlikHesaplamaInputs(inputs: KosebentLamaAgirlikHesaplamaInputs): KosebentLamaAgirlikHesaplamaValidationResult {
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
