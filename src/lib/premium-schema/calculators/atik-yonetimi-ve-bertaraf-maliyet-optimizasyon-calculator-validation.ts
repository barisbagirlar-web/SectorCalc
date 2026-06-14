export type AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs = {
  wasteVolume: number;
  disposalUnitCost: number;
  transportCostPerTon: number;
  recyclingRatePercent: number;
  recyclingRevenuePerTon: number;
  complianceCostPerTon: number;
};

export type AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ATIK_YONETIMI_VE_BERTARAF_MALIYET_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs)[] = [
  "wasteVolume",
  "disposalUnitCost",
  "transportCostPerTon",
  "recyclingRatePercent",
  "recyclingRevenuePerTon",
  "complianceCostPerTon",
];

const INPUT_LABELS: Record<keyof AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs, string> = {
  wasteVolume: "wasteVolume",
  disposalUnitCost: "disposalUnitCost",
  transportCostPerTon: "transportCostPerTon",
  recyclingRatePercent: "recyclingRatePercent",
  recyclingRevenuePerTon: "recyclingRevenuePerTon",
  complianceCostPerTon: "complianceCostPerTon",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of ATIK_YONETIMI_VE_BERTARAF_MALIYET_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.wasteVolume < 0.001 || inputs.wasteVolume > 1000000) {
    errors.push("wasteVolume must be between 0.001 and 1000000.");
  }

  if (inputs.wasteVolume <= 0) {
    errors.push("wasteVolume must be greater than zero.");
  }

  if (inputs.disposalUnitCost < 0 || inputs.disposalUnitCost > 10000) {
    errors.push("disposalUnitCost must be between 0 and 10000.");
  }

  if (inputs.transportCostPerTon < 0 || inputs.transportCostPerTon > 5000) {
    errors.push("transportCostPerTon must be between 0 and 5000.");
  }

  if (inputs.recyclingRatePercent < 0 || inputs.recyclingRatePercent > 100) {
    errors.push("recyclingRatePercent must be between 0 and 100.");
  }

  if (inputs.recyclingRevenuePerTon < 0 || inputs.recyclingRevenuePerTon > 10000) {
    errors.push("recyclingRevenuePerTon must be between 0 and 10000.");
  }

  if (inputs.recyclingRevenuePerTon <= 0) {
    errors.push("recyclingRevenuePerTon must be greater than zero.");
  }

  if (inputs.complianceCostPerTon < 0 || inputs.complianceCostPerTon > 5000) {
    errors.push("complianceCostPerTon must be between 0 and 5000.");
  }

  return errors;
}

function collectWarnings(inputs: AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs(inputs: AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputs): AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorValidationResult {
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
