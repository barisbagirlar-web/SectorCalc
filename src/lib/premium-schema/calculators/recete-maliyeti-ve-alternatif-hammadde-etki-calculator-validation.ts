export type ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs = {
  productionQuantity: number;
  baseMaterialPrice: number;
  scrapRate: number;
  yieldFactor: number;
  altMaterialPrice: number;
  altScrapRate: number;
};

export type ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const RECETE_MALIYETI_VE_ALTERNATIF_HAMMADDE_ETKI_CALCULATOR_INPUT_KEYS: readonly (keyof ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs)[] = [
  "productionQuantity",
  "baseMaterialPrice",
  "scrapRate",
  "yieldFactor",
  "altMaterialPrice",
  "altScrapRate",
];

const INPUT_LABELS: Record<keyof ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs, string> = {
  productionQuantity: "productionQuantity",
  baseMaterialPrice: "baseMaterialPrice",
  scrapRate: "scrapRate",
  yieldFactor: "yieldFactor",
  altMaterialPrice: "altMaterialPrice",
  altScrapRate: "altScrapRate",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of RECETE_MALIYETI_VE_ALTERNATIF_HAMMADDE_ETKI_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.baseMaterialPrice < 0.01 || inputs.baseMaterialPrice > 100000) {
    errors.push("baseMaterialPrice must be between 0.01 and 100000.");
  }

  if (inputs.baseMaterialPrice <= 0) {
    errors.push("baseMaterialPrice must be greater than zero.");
  }

  if (inputs.scrapRate < 0 || inputs.scrapRate > 100) {
    errors.push("scrapRate must be between 0 and 100.");
  }

  if (inputs.yieldFactor < 0.01 || inputs.yieldFactor > 1) {
    errors.push("yieldFactor must be between 0.01 and 1.");
  }

  if (inputs.yieldFactor <= 0) {
    errors.push("yieldFactor must be greater than zero.");
  }

  if (inputs.altMaterialPrice < 0.01 || inputs.altMaterialPrice > 100000) {
    errors.push("altMaterialPrice must be between 0.01 and 100000.");
  }

  if (inputs.altMaterialPrice <= 0) {
    errors.push("altMaterialPrice must be greater than zero.");
  }

  if (inputs.altScrapRate < 0 || inputs.altScrapRate > 100) {
    errors.push("altScrapRate must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs(inputs: ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputs): ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorValidationResult {
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
