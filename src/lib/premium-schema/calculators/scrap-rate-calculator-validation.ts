export type ScrapRateCalculatorInputs = {
  materialCost: number;
  scrapRate: number;
  targetScrapRate: number;
  reworkHours: number;
  laborRate: number;
  finishingCost: number;
};

export type ScrapRateCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SCRAP_RATE_CALCULATOR_INPUT_KEYS: readonly (keyof ScrapRateCalculatorInputs)[] = [
  "materialCost",
  "scrapRate",
  "targetScrapRate",
  "reworkHours",
  "laborRate",
  "finishingCost",
];

const INPUT_LABELS: Record<keyof ScrapRateCalculatorInputs, string> = {
  materialCost: "materialCost",
  scrapRate: "scrapRate",
  targetScrapRate: "targetScrapRate",
  reworkHours: "reworkHours",
  laborRate: "laborRate",
  finishingCost: "finishingCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ScrapRateCalculatorInputs): string[] {
  const errors: string[] = [];
  for (const key of SCRAP_RATE_CALCULATOR_INPUT_KEYS) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(`${INPUT_LABELS[key]} is required.`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(`${INPUT_LABELS[key]} must be a finite number.`);
    }
  }
  return errors;
}

function collectWarnings(inputs: ScrapRateCalculatorInputs): string[] {
  const warnings: string[] = [];
  return warnings;
}

export function validateScrapRateCalculatorInputs(inputs: ScrapRateCalculatorInputs): ScrapRateCalculatorValidationResult {
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
