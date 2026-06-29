export type SheetMetalQuoteRiskToolInputs = {
  programmingTime: number;
  setupTime: number;
  cutTime: number;
  bendCount: number;
  laborRate: number;
  materialCost: number;
  scrapRatePercent: number;
  finishingCost: number;
  targetMargin: number;
};

export type SheetMetalQuoteRiskToolValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SHEET_METAL_QUOTE_RISK_TOOL_INPUT_KEYS: readonly (keyof SheetMetalQuoteRiskToolInputs)[] = [
  "programmingTime",
  "setupTime",
  "cutTime",
  "bendCount",
  "laborRate",
  "materialCost",
  "scrapRatePercent",
  "finishingCost",
  "targetMargin",
];

const INPUT_LABELS: Record<keyof SheetMetalQuoteRiskToolInputs, string> = {
  programmingTime: "programmingTime",
  setupTime: "setupTime",
  cutTime: "cutTime",
  bendCount: "bendCount",
  laborRate: "laborRate",
  materialCost: "materialCost",
  scrapRatePercent: "scrapRatePercent",
  finishingCost: "finishingCost",
  targetMargin: "targetMargin",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SheetMetalQuoteRiskToolInputs): string[] {
  const errors: string[] = [];
  for (const key of SHEET_METAL_QUOTE_RISK_TOOL_INPUT_KEYS) {
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

function collectWarnings(inputs: SheetMetalQuoteRiskToolInputs): string[] {
  const warnings: string[] = [];
  return warnings;
}

export function validateSheetMetalQuoteRiskToolInputs(inputs: SheetMetalQuoteRiskToolInputs): SheetMetalQuoteRiskToolValidationResult {
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
