export type FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs = {
  currentPrice: number;
  currentQuantity: number;
  priceElasticity: number;
  newPrice: number;
  directMaterialCost: number;
  directLaborCost: number;
};

export type FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const FIYAT_ARTISI_VE_TALEP_ESNEKLIGI_KARLILIK_SIMULASYON_CALCULATOR_INPUT_KEYS: readonly (keyof FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs)[] = [
  "currentPrice",
  "currentQuantity",
  "priceElasticity",
  "newPrice",
  "directMaterialCost",
  "directLaborCost",
];

const INPUT_LABELS: Record<keyof FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs, string> = {
  currentPrice: "currentPrice",
  currentQuantity: "currentQuantity",
  priceElasticity: "priceElasticity",
  newPrice: "newPrice",
  directMaterialCost: "directMaterialCost",
  directLaborCost: "directLaborCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of FIYAT_ARTISI_VE_TALEP_ESNEKLIGI_KARLILIK_SIMULASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.currentPrice < 0.01 || inputs.currentPrice > 1000000) {
    errors.push("currentPrice must be between 0.01 and 1000000.");
  }

  if (inputs.currentPrice <= 0) {
    errors.push("currentPrice must be greater than zero.");
  }

  if (inputs.currentQuantity < 1 || inputs.currentQuantity > 100000000) {
    errors.push("currentQuantity must be between 1 and 100000000.");
  }

  if (inputs.currentQuantity <= 0) {
    errors.push("currentQuantity must be greater than zero.");
  }

  if (inputs.priceElasticity < -10 || inputs.priceElasticity > 0) {
    errors.push("priceElasticity must be between -10 and 0.");
  }

  if (inputs.newPrice < 0.01 || inputs.newPrice > 1000000) {
    errors.push("newPrice must be between 0.01 and 1000000.");
  }

  if (inputs.newPrice <= 0) {
    errors.push("newPrice must be greater than zero.");
  }

  if (inputs.directMaterialCost < 0 || inputs.directMaterialCost > 100000) {
    errors.push("directMaterialCost must be between 0 and 100000.");
  }

  if (inputs.directLaborCost < 0 || inputs.directLaborCost > 100000) {
    errors.push("directLaborCost must be between 0 and 100000.");
  }

  return errors;
}

function collectWarnings(inputs: FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateFiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs(inputs: FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorInputs): FiyatArtisiVeTalepEsnekligiKarlilikSimulasyonCalculatorValidationResult {
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
