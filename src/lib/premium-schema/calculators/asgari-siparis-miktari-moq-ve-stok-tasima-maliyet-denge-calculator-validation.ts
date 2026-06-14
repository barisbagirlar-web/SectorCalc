export type AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs = {
  averageInventoryValue: number;
  inventoryUnits: number;
  unitCost: number;
  holdingCostRatePercent: number;
  obsolescenceRatePercent: number;
  excessUnits: number;
};

export type AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ASGARI_SIPARIS_MIKTARI_MOQ_VE_STOK_TASIMA_MALIYET_DENGE_CALCULATOR_INPUT_KEYS: readonly (keyof AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs)[] = [
  "averageInventoryValue",
  "inventoryUnits",
  "unitCost",
  "holdingCostRatePercent",
  "obsolescenceRatePercent",
  "excessUnits",
];

const INPUT_LABELS: Record<keyof AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs, string> = {
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

function collectInputErrors(inputs: AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of ASGARI_SIPARIS_MIKTARI_MOQ_VE_STOK_TASIMA_MALIYET_DENGE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.inventoryUnits < 0 || inputs.inventoryUnits > 1000000000) {
    errors.push("inventoryUnits must be between 0 and 1000000000.");
  }

  if (inputs.inventoryUnits <= 0) {
    errors.push("inventoryUnits must be greater than zero.");
  }

  if (inputs.unitCost < 0 || inputs.unitCost > 1000000) {
    errors.push("unitCost must be between 0 and 1000000.");
  }

  if (inputs.holdingCostRatePercent < 0 || inputs.holdingCostRatePercent > 100) {
    errors.push("holdingCostRatePercent must be between 0 and 100.");
  }

  if (inputs.obsolescenceRatePercent < 0 || inputs.obsolescenceRatePercent > 100) {
    errors.push("obsolescenceRatePercent must be between 0 and 100.");
  }

  if (inputs.excessUnits < 0 || inputs.excessUnits > 1000000000) {
    errors.push("excessUnits must be between 0 and 1000000000.");
  }

  if (inputs.excessUnits <= 0) {
    errors.push("excessUnits must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs(inputs: AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs): AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorValidationResult {
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
