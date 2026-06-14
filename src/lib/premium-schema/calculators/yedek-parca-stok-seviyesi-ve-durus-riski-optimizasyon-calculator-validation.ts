export type YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs = {
  averageInventoryValue: number;
  inventoryUnits: number;
  unitCost: number;
  holdingCostRatePercent: number;
  obsolescenceRatePercent: number;
  excessUnits: number;
};

export type YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const YEDEK_PARCA_STOK_SEVIYESI_VE_DURUS_RISKI_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs)[] = [
  "averageInventoryValue",
  "inventoryUnits",
  "unitCost",
  "holdingCostRatePercent",
  "obsolescenceRatePercent",
  "excessUnits",
];

const INPUT_LABELS: Record<keyof YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs, string> = {
  averageInventoryValue: "averageInventoryValue",
  inventoryUnits: "inventoryUnits",
  unitCost: "unitCost",
  holdingCostRatePercent: "holdingCostRatePercent",
  obsolescenceRatePercent: "obsolescenceRatePercent",
  excessUnits: "excessUnits",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of YEDEK_PARCA_STOK_SEVIYESI_VE_DURUS_RISKI_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.averageInventoryValue < 0 || inputs.averageInventoryValue > 1000000000) {
    errors.push("averageInventoryValue must be between 0 and 1000000000.");
  }

  if (inputs.inventoryUnits < 0 || inputs.inventoryUnits > 100000000) {
    errors.push("inventoryUnits must be between 0 and 100000000.");
  }

  if (inputs.inventoryUnits <= 0) {
    errors.push("inventoryUnits must be greater than zero.");
  }

  if (inputs.unitCost < 0 || inputs.unitCost > 100000) {
    errors.push("unitCost must be between 0 and 100000.");
  }

  if (inputs.holdingCostRatePercent < 0 || inputs.holdingCostRatePercent > 100) {
    errors.push("holdingCostRatePercent must be between 0 and 100.");
  }

  if (inputs.obsolescenceRatePercent < 0 || inputs.obsolescenceRatePercent > 100) {
    errors.push("obsolescenceRatePercent must be between 0 and 100.");
  }

  if (inputs.excessUnits < 0 || inputs.excessUnits > 100000000) {
    errors.push("excessUnits must be between 0 and 100000000.");
  }

  if (inputs.excessUnits <= 0) {
    errors.push("excessUnits must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs(inputs: YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputs): YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorValidationResult {
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
