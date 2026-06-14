export type FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs = {
  productionQuantity: number;
  unitMaterialCost: number;
  scrapRatePercent: number;
  reworkRatePercent: number;
  unitReworkCost: number;
  waitingHours: number;
};

export type FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const FILAMENT_RECINE_TOZ_MALIYET_VE_FIRE_KARSILASTIRMA_CALCULATOR_INPUT_KEYS: readonly (keyof FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs)[] = [
  "productionQuantity",
  "unitMaterialCost",
  "scrapRatePercent",
  "reworkRatePercent",
  "unitReworkCost",
  "waitingHours",
];

const INPUT_LABELS: Record<keyof FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs, string> = {
  productionQuantity: "productionQuantity",
  unitMaterialCost: "unitMaterialCost",
  scrapRatePercent: "scrapRatePercent",
  reworkRatePercent: "reworkRatePercent",
  unitReworkCost: "unitReworkCost",
  waitingHours: "waitingHours",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of FILAMENT_RECINE_TOZ_MALIYET_VE_FIRE_KARSILASTIRMA_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.reworkRatePercent < 0 || inputs.reworkRatePercent > 100) {
    errors.push("reworkRatePercent must be between 0 and 100.");
  }

  if (inputs.unitReworkCost < 0 || inputs.unitReworkCost > 100000) {
    errors.push("unitReworkCost must be between 0 and 100000.");
  }

  if (inputs.waitingHours < 0 || inputs.waitingHours > 10000) {
    errors.push("waitingHours must be between 0 and 10000.");
  }

  return errors;
}

function collectWarnings(inputs: FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs(inputs: FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs): FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorValidationResult {
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
