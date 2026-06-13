export type SheetMetalScrapRiskInputs = {
  materialCost: number;
  scrapRate: number;
  targetScrapRate: number;
  reworkHours: number;
  laborRate: number;
  finishingCost: number;
};

export type SheetMetalScrapRiskValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SHEET_METAL_SCRAP_RISK_INPUT_KEYS: readonly (keyof SheetMetalScrapRiskInputs)[] = [
  "materialCost",
  "scrapRate",
  "targetScrapRate",
  "reworkHours",
  "laborRate",
  "finishingCost",
];

const INPUT_LABELS: Record<keyof SheetMetalScrapRiskInputs, string> = {
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

function collectInputErrors(inputs: SheetMetalScrapRiskInputs): string[] {
  const errors: string[] = [];

  for (const key of SHEET_METAL_SCRAP_RISK_INPUT_KEYS) {
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

function collectWarnings(inputs: SheetMetalScrapRiskInputs): string[] {
  const warnings: string[] = [];

  if (inputs.scrapRate >= 5) {
    warnings.push(
      "Scrap rate is above target — nesting or bend tolerance may be eroding quote margin.",
    );
  }

  if (inputs.reworkHours >= 8) {
    warnings.push("Rework hours are elevated — verify setup and bend sequence assumptions.");
  }

  if (inputs.scrapRate >= 10) {
    warnings.push(
      "Critical scrap band — reprice material and rework before accepting similar fabrication.",
    );
  }

  return warnings;
}

export function validateSheetMetalScrapRiskInputs(
  inputs: SheetMetalScrapRiskInputs,
): SheetMetalScrapRiskValidationResult {
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
