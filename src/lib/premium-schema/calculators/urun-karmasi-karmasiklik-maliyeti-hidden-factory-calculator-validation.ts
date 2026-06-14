export type UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs = {
  productionQuantity: number;
  unitMaterialCost: number;
  scrapRatePercent: number;
  unitLaborCost: number;
  unitOverheadBurden: number;
  baseOverheadRate: number;
};

export type UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const URUN_KARMASI_KARMASIKLIK_MALIYETI_HIDDEN_FACTORY_CALCULATOR_INPUT_KEYS: readonly (keyof UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs)[] = [
  "productionQuantity",
  "unitMaterialCost",
  "scrapRatePercent",
  "unitLaborCost",
  "unitOverheadBurden",
  "baseOverheadRate",
];

const INPUT_LABELS: Record<keyof UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs, string> = {
  productionQuantity: "productionQuantity",
  unitMaterialCost: "unitMaterialCost",
  scrapRatePercent: "scrapRatePercent",
  unitLaborCost: "unitLaborCost",
  unitOverheadBurden: "unitOverheadBurden",
  baseOverheadRate: "baseOverheadRate",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of URUN_KARMASI_KARMASIKLIK_MALIYETI_HIDDEN_FACTORY_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.unitLaborCost < 0 || inputs.unitLaborCost > 100000) {
    errors.push("unitLaborCost must be between 0 and 100000.");
  }

  if (inputs.unitOverheadBurden < 0 || inputs.unitOverheadBurden > 100000) {
    errors.push("unitOverheadBurden must be between 0 and 100000.");
  }

  if (inputs.baseOverheadRate < 0 || inputs.baseOverheadRate > 1000) {
    errors.push("baseOverheadRate must be between 0 and 1000.");
  }

  if (inputs.baseOverheadRate <= 0) {
    errors.push("baseOverheadRate must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs(inputs: UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs): UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorValidationResult {
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
