export type KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs = {
  availableHours: number;
  utilizationRate: number;
  efficiencyRate: number;
  demandQuantity: number;
  bottleneckTimePerUnit: number;
  sellingPrice: number;
};

export type KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KAPASITE_PLANLAMA_VE_DARBOGAZ_YATIRIM_ONCELIKLENDIRME_CALCULATOR_INPUT_KEYS: readonly (keyof KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs)[] = [
  "availableHours",
  "utilizationRate",
  "efficiencyRate",
  "demandQuantity",
  "bottleneckTimePerUnit",
  "sellingPrice",
];

const INPUT_LABELS: Record<keyof KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs, string> = {
  availableHours: "availableHours",
  utilizationRate: "utilizationRate",
  efficiencyRate: "efficiencyRate",
  demandQuantity: "demandQuantity",
  bottleneckTimePerUnit: "bottleneckTimePerUnit",
  sellingPrice: "sellingPrice",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of KAPASITE_PLANLAMA_VE_DARBOGAZ_YATIRIM_ONCELIKLENDIRME_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.availableHours < 1 || inputs.availableHours > 8760) {
    errors.push("availableHours must be between 1 and 8760.");
  }

  if (inputs.availableHours <= 0) {
    errors.push("availableHours must be greater than zero.");
  }

  if (inputs.utilizationRate < 0 || inputs.utilizationRate > 100) {
    errors.push("utilizationRate must be between 0 and 100.");
  }

  if (inputs.efficiencyRate < 0 || inputs.efficiencyRate > 100) {
    errors.push("efficiencyRate must be between 0 and 100.");
  }

  if (inputs.demandQuantity < 1 || inputs.demandQuantity > 1000000) {
    errors.push("demandQuantity must be between 1 and 1000000.");
  }

  if (inputs.demandQuantity <= 0) {
    errors.push("demandQuantity must be greater than zero.");
  }

  if (inputs.bottleneckTimePerUnit < 0.001 || inputs.bottleneckTimePerUnit > 100) {
    errors.push("bottleneckTimePerUnit must be between 0.001 and 100.");
  }

  if (inputs.bottleneckTimePerUnit <= 0) {
    errors.push("bottleneckTimePerUnit must be greater than zero.");
  }

  if (inputs.sellingPrice < 0 || inputs.sellingPrice > 100000) {
    errors.push("sellingPrice must be between 0 and 100000.");
  }

  return errors;
}

function collectWarnings(inputs: KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs(inputs: KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputs): KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorValidationResult {
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
