export type SheetMetalQuoteRiskToolInputs = {
  materialCost: number;
  scrapRate: number;
  targetScrapRate: number;
  reworkHours: number;
  laborRate: number;
  finishingCost: number;
};

export type SheetMetalQuoteRiskToolValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SHEET_METAL_QUOTE_RISK_TOOL_INPUT_KEYS: readonly (keyof SheetMetalQuoteRiskToolInputs)[] = [
  "materialCost",
  "scrapRate",
  "targetScrapRate",
  "reworkHours",
  "laborRate",
  "finishingCost",
];

const INPUT_LABELS: Record<keyof SheetMetalQuoteRiskToolInputs, string> = {
  materialCost: "materialCost",
  scrapRate: "scrapRate",
  targetScrapRate: "targetScrapRate",
  reworkHours: "reworkHours",
  laborRate: "laborRate",
  finishingCost: "finishingCost",
};

const summaryRule = {
  fieldId: "scrapRate",
  warning: 5,
  critical: 10,
  direction: "higher_is_bad",
} as const;

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

  if (errors.length > 0) {
    return errors;
  }

  if (inputs.materialCost < 0) {
    errors.push("materialCost must be greater than or equal to zero.");
  }

  if (inputs.scrapRate < 0 || inputs.scrapRate > 100) {
    errors.push("scrapRate must be between 0 and 100.");
  }

  if (inputs.targetScrapRate < 0 || inputs.targetScrapRate > 100) {
    errors.push("targetScrapRate must be between 0 and 100.");
  }

  if (inputs.reworkHours < 0) {
    errors.push("reworkHours must be greater than or equal to zero.");
  }

  if (inputs.laborRate < 0) {
    errors.push("laborRate must be greater than or equal to zero.");
  }

  if (inputs.finishingCost < 0) {
    errors.push("finishingCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: SheetMetalQuoteRiskToolInputs): string[] {
  const warnings: string[] = [];

  if (inputs.scrapRate >= summaryRule.warning) {
    warnings.push("Scrap rate is above target — nesting or bend tolerance may be eroding quote margin.");
  }

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
