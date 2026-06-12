export type AgricultureIrrigationYieldLossInputs = {
  areaHa: number;
  expectedYieldTonPerHa: number;
  actualYieldTonPerHa: number;
  pricePerTon: number;
  irrigationCost: number;
};

export type AgricultureIrrigationYieldLossValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const AGRICULTURE_IRRIGATION_YIELD_LOSS_INPUT_KEYS: readonly (keyof AgricultureIrrigationYieldLossInputs)[] =
  ["areaHa", "expectedYieldTonPerHa", "actualYieldTonPerHa", "pricePerTon", "irrigationCost"];

const INPUT_LABELS: Record<keyof AgricultureIrrigationYieldLossInputs, string> = {
  areaHa: "areaHa",
  expectedYieldTonPerHa: "expectedYieldTonPerHa",
  actualYieldTonPerHa: "actualYieldTonPerHa",
  pricePerTon: "pricePerTon",
  irrigationCost: "irrigationCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(
  inputs: AgricultureIrrigationYieldLossInputs,
): string[] {
  const errors: string[] = [];

  for (const key of AGRICULTURE_IRRIGATION_YIELD_LOSS_INPUT_KEYS) {
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

  if (inputs.areaHa <= 0) {
    errors.push("areaHa must be greater than zero.");
  }
  if (inputs.expectedYieldTonPerHa <= 0) {
    errors.push("expectedYieldTonPerHa must be greater than zero.");
  }
  if (inputs.actualYieldTonPerHa < 0) {
    errors.push("actualYieldTonPerHa must be greater than or equal to zero.");
  }
  if (inputs.pricePerTon <= 0) {
    errors.push("pricePerTon must be greater than zero.");
  }
  if (inputs.irrigationCost < 0) {
    errors.push("irrigationCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: AgricultureIrrigationYieldLossInputs): string[] {
  const warnings: string[] = [];
  const yieldGapTonPerHa = Math.max(
    inputs.expectedYieldTonPerHa - inputs.actualYieldTonPerHa,
    0,
  );
  const lostYieldTon = inputs.areaHa * yieldGapTonPerHa;
  const yieldLossRevenue = lostYieldTon * inputs.pricePerTon;
  const yieldLossPct = (yieldGapTonPerHa / inputs.expectedYieldTonPerHa) * 100;

  if (inputs.actualYieldTonPerHa > inputs.expectedYieldTonPerHa) {
    warnings.push(
      "Actual yield is above expected yield. Yield loss is treated as zero; irrigation cost may still create exposure.",
    );
  }

  if (inputs.irrigationCost > yieldLossRevenue) {
    warnings.push(
      "Irrigation cost is higher than estimated yield-loss revenue. Confirm irrigation cost scope and season period.",
    );
  }

  if (yieldLossPct > 40) {
    warnings.push(
      "Yield gap exceeds 40 percent. Confirm expected yield, actual yield and crop price assumptions.",
    );
  }

  return warnings;
}

export function validateAgricultureIrrigationYieldLossInputs(
  inputs: AgricultureIrrigationYieldLossInputs,
): AgricultureIrrigationYieldLossValidationResult {
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
