export type PaletAmbalajKeresteHesabiInputs = {
  productionQuantity: number;
  lumberVolumePerPallet: number;
  lumberPricePerUnitVolume: number;
  yieldFactor: number;
  processingCostPerPallet: number;
  fastenersCostPerPallet: number;
};

export type PaletAmbalajKeresteHesabiValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PALET_AMBALAJ_KERESTE_HESABI_INPUT_KEYS: readonly (keyof PaletAmbalajKeresteHesabiInputs)[] = [
  "productionQuantity",
  "lumberVolumePerPallet",
  "lumberPricePerUnitVolume",
  "yieldFactor",
  "processingCostPerPallet",
  "fastenersCostPerPallet",
];

const INPUT_LABELS: Record<keyof PaletAmbalajKeresteHesabiInputs, string> = {
  productionQuantity: "productionQuantity",
  lumberVolumePerPallet: "lumberVolumePerPallet",
  lumberPricePerUnitVolume: "lumberPricePerUnitVolume",
  yieldFactor: "yieldFactor",
  processingCostPerPallet: "processingCostPerPallet",
  fastenersCostPerPallet: "fastenersCostPerPallet",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: PaletAmbalajKeresteHesabiInputs): string[] {
  const errors: string[] = [];

  for (const key of PALET_AMBALAJ_KERESTE_HESABI_INPUT_KEYS) {
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

  if (inputs.lumberVolumePerPallet < 0.001 || inputs.lumberVolumePerPallet > 10) {
    errors.push("lumberVolumePerPallet must be between 0.001 and 10.");
  }

  if (inputs.lumberVolumePerPallet <= 0) {
    errors.push("lumberVolumePerPallet must be greater than zero.");
  }

  if (inputs.lumberPricePerUnitVolume < 0 || inputs.lumberPricePerUnitVolume > 10000) {
    errors.push("lumberPricePerUnitVolume must be between 0 and 10000.");
  }

  if (inputs.lumberPricePerUnitVolume <= 0) {
    errors.push("lumberPricePerUnitVolume must be greater than zero.");
  }

  if (inputs.yieldFactor < 0 || inputs.yieldFactor > 100) {
    errors.push("yieldFactor must be between 0 and 100.");
  }

  if (inputs.yieldFactor <= 0) {
    errors.push("yieldFactor must be greater than zero.");
  }

  if (inputs.processingCostPerPallet < 0 || inputs.processingCostPerPallet > 1000) {
    errors.push("processingCostPerPallet must be between 0 and 1000.");
  }

  if (inputs.fastenersCostPerPallet < 0 || inputs.fastenersCostPerPallet > 100) {
    errors.push("fastenersCostPerPallet must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: PaletAmbalajKeresteHesabiInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validatePaletAmbalajKeresteHesabiInputs(inputs: PaletAmbalajKeresteHesabiInputs): PaletAmbalajKeresteHesabiValidationResult {
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
