export type PaketlemeMalzemesiStrecKoliSarfiyatiInputs = {
  productionQuantity: number;
  lengthPerUnit: number;
  widthPerUnit: number;
  layers: number;
  coveragePerKg: number;
  unitMaterialCost: number;
};

export type PaketlemeMalzemesiStrecKoliSarfiyatiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PAKETLEME_MALZEMESI_STREC_KOLI_SARFIYATI_INPUT_KEYS: readonly (keyof PaketlemeMalzemesiStrecKoliSarfiyatiInputs)[] = [
  "productionQuantity",
  "lengthPerUnit",
  "widthPerUnit",
  "layers",
  "coveragePerKg",
  "unitMaterialCost",
];

const INPUT_LABELS: Record<keyof PaketlemeMalzemesiStrecKoliSarfiyatiInputs, string> = {
  productionQuantity: "productionQuantity",
  lengthPerUnit: "lengthPerUnit",
  widthPerUnit: "widthPerUnit",
  layers: "layers",
  coveragePerKg: "coveragePerKg",
  unitMaterialCost: "unitMaterialCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: PaketlemeMalzemesiStrecKoliSarfiyatiInputs): string[] {
  const errors: string[] = [];

  for (const key of PAKETLEME_MALZEMESI_STREC_KOLI_SARFIYATI_INPUT_KEYS) {
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

  if (inputs.productionQuantity < 1 || inputs.productionQuantity > 1000000) {
    errors.push("productionQuantity must be between 1 and 1000000.");
  }

  if (inputs.productionQuantity <= 0) {
    errors.push("productionQuantity must be greater than zero.");
  }

  if (inputs.lengthPerUnit < 0.01 || inputs.lengthPerUnit > 100) {
    errors.push("lengthPerUnit must be between 0.01 and 100.");
  }

  if (inputs.lengthPerUnit <= 0) {
    errors.push("lengthPerUnit must be greater than zero.");
  }

  if (inputs.widthPerUnit < 0.01 || inputs.widthPerUnit > 100) {
    errors.push("widthPerUnit must be between 0.01 and 100.");
  }

  if (inputs.widthPerUnit <= 0) {
    errors.push("widthPerUnit must be greater than zero.");
  }

  if (inputs.layers < 1 || inputs.layers > 10) {
    errors.push("layers must be between 1 and 10.");
  }

  if (inputs.layers <= 0) {
    errors.push("layers must be greater than zero.");
  }

  if (inputs.coveragePerKg < 0.1 || inputs.coveragePerKg > 100) {
    errors.push("coveragePerKg must be between 0.1 and 100.");
  }

  if (inputs.coveragePerKg <= 0) {
    errors.push("coveragePerKg must be greater than zero.");
  }

  if (inputs.unitMaterialCost < 0 || inputs.unitMaterialCost > 1000) {
    errors.push("unitMaterialCost must be between 0 and 1000.");
  }

  return errors;
}

function collectWarnings(inputs: PaketlemeMalzemesiStrecKoliSarfiyatiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validatePaketlemeMalzemesiStrecKoliSarfiyatiInputs(inputs: PaketlemeMalzemesiStrecKoliSarfiyatiInputs): PaketlemeMalzemesiStrecKoliSarfiyatiValidationResult {
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
