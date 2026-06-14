export type PrefabrikKonteynerOfisMMaliyetiInputs = {
  productionQuantity: number;
  unitMaterialCost: number;
  scrapRatePercent: number;
  unitLaborCost: number;
  fixedOverhead: number;
};

export type PrefabrikKonteynerOfisMMaliyetiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PREFABRIK_KONTEYNER_OFIS_M_MALIYETI_INPUT_KEYS: readonly (keyof PrefabrikKonteynerOfisMMaliyetiInputs)[] = [
  "productionQuantity",
  "unitMaterialCost",
  "scrapRatePercent",
  "unitLaborCost",
  "fixedOverhead",
];

const INPUT_LABELS: Record<keyof PrefabrikKonteynerOfisMMaliyetiInputs, string> = {
  productionQuantity: "productionQuantity",
  unitMaterialCost: "unitMaterialCost",
  scrapRatePercent: "scrapRatePercent",
  unitLaborCost: "unitLaborCost",
  fixedOverhead: "fixedOverhead",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: PrefabrikKonteynerOfisMMaliyetiInputs): string[] {
  const errors: string[] = [];

  for (const key of PREFABRIK_KONTEYNER_OFIS_M_MALIYETI_INPUT_KEYS) {
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

  if (inputs.unitMaterialCost < 0 || inputs.unitMaterialCost > 100000) {
    errors.push("unitMaterialCost must be between 0 and 100000.");
  }

  if (inputs.scrapRatePercent < 0 || inputs.scrapRatePercent > 100) {
    errors.push("scrapRatePercent must be between 0 and 100.");
  }

  if (inputs.unitLaborCost < 0 || inputs.unitLaborCost > 1000) {
    errors.push("unitLaborCost must be between 0 and 1000.");
  }

  if (inputs.fixedOverhead < 0 || inputs.fixedOverhead > 1000000) {
    errors.push("fixedOverhead must be between 0 and 1000000.");
  }

  return errors;
}

function collectWarnings(inputs: PrefabrikKonteynerOfisMMaliyetiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validatePrefabrikKonteynerOfisMMaliyetiInputs(inputs: PrefabrikKonteynerOfisMMaliyetiInputs): PrefabrikKonteynerOfisMMaliyetiValidationResult {
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
