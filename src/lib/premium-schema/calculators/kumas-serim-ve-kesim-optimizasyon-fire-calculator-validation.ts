export type KumasSerimVeKesimOptimizasyonFireCalculatorInputs = {
  productionQuantity: number;
  unitMaterialCost: number;
  scrapRatePercent: number;
  unitReworkCost: number;
  reworkRatePercent: number;
  waitingHours: number;
};

export type KumasSerimVeKesimOptimizasyonFireCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KUMAS_SERIM_VE_KESIM_OPTIMIZASYON_FIRE_CALCULATOR_INPUT_KEYS: readonly (keyof KumasSerimVeKesimOptimizasyonFireCalculatorInputs)[] = [
  "productionQuantity",
  "unitMaterialCost",
  "scrapRatePercent",
  "unitReworkCost",
  "reworkRatePercent",
  "waitingHours",
];

const INPUT_LABELS: Record<keyof KumasSerimVeKesimOptimizasyonFireCalculatorInputs, string> = {
  productionQuantity: "productionQuantity",
  unitMaterialCost: "unitMaterialCost",
  scrapRatePercent: "scrapRatePercent",
  unitReworkCost: "unitReworkCost",
  reworkRatePercent: "reworkRatePercent",
  waitingHours: "waitingHours",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KumasSerimVeKesimOptimizasyonFireCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of KUMAS_SERIM_VE_KESIM_OPTIMIZASYON_FIRE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.unitReworkCost < 0 || inputs.unitReworkCost > 100000) {
    errors.push("unitReworkCost must be between 0 and 100000.");
  }

  if (inputs.reworkRatePercent < 0 || inputs.reworkRatePercent > 100) {
    errors.push("reworkRatePercent must be between 0 and 100.");
  }

  if (inputs.waitingHours < 0 || inputs.waitingHours > 10000) {
    errors.push("waitingHours must be between 0 and 10000.");
  }

  return errors;
}

function collectWarnings(inputs: KumasSerimVeKesimOptimizasyonFireCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKumasSerimVeKesimOptimizasyonFireCalculatorInputs(inputs: KumasSerimVeKesimOptimizasyonFireCalculatorInputs): KumasSerimVeKesimOptimizasyonFireCalculatorValidationResult {
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
