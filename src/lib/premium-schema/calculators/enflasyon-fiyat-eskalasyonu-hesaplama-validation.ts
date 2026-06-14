export type EnflasyonFiyatEskalasyonuHesaplamaInputs = {
  basePrice: number;
  baseIndex: number;
  currentIndex: number;
};

export type EnflasyonFiyatEskalasyonuHesaplamaValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ENFLASYON_FIYAT_ESKALASYONU_HESAPLAMA_INPUT_KEYS: readonly (keyof EnflasyonFiyatEskalasyonuHesaplamaInputs)[] = [
  "basePrice",
  "baseIndex",
  "currentIndex",
];

const INPUT_LABELS: Record<keyof EnflasyonFiyatEskalasyonuHesaplamaInputs, string> = {
  basePrice: "basePrice",
  baseIndex: "baseIndex",
  currentIndex: "currentIndex",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: EnflasyonFiyatEskalasyonuHesaplamaInputs): string[] {
  const errors: string[] = [];

  for (const key of ENFLASYON_FIYAT_ESKALASYONU_HESAPLAMA_INPUT_KEYS) {
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

  if (inputs.basePrice < 0 || inputs.basePrice > 1000000000) {
    errors.push("basePrice must be between 0 and 1000000000.");
  }

  if (inputs.basePrice <= 0) {
    errors.push("basePrice must be greater than zero.");
  }

  if (inputs.baseIndex < 0.01 || inputs.baseIndex > 100000) {
    errors.push("baseIndex must be between 0.01 and 100000.");
  }

  if (inputs.baseIndex <= 0) {
    errors.push("baseIndex must be greater than zero.");
  }

  if (inputs.currentIndex < 0.01 || inputs.currentIndex > 100000) {
    errors.push("currentIndex must be between 0.01 and 100000.");
  }

  if (inputs.currentIndex <= 0) {
    errors.push("currentIndex must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: EnflasyonFiyatEskalasyonuHesaplamaInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateEnflasyonFiyatEskalasyonuHesaplamaInputs(inputs: EnflasyonFiyatEskalasyonuHesaplamaInputs): EnflasyonFiyatEskalasyonuHesaplamaValidationResult {
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
