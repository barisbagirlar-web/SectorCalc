export type CncQuoteRiskAnalyzerInputs = {
  machineRate: number;
  plannedHours: number;
  downtimeHours: number;
  materialCost: number;
  scrapRate: number;
  availability: number;
  performance: number;
  quality: number;
  quotedPrice: number;
};

export type CncQuoteRiskAnalyzerValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CNC_QUOTE_RISK_ANALYZER_INPUT_KEYS: readonly (keyof CncQuoteRiskAnalyzerInputs)[] = [
  "machineRate",
  "plannedHours",
  "downtimeHours",
  "materialCost",
  "scrapRate",
  "availability",
  "performance",
  "quality",
  "quotedPrice",
];

const INPUT_LABELS: Record<keyof CncQuoteRiskAnalyzerInputs, string> = {
  machineRate: "machineRate",
  plannedHours: "plannedHours",
  downtimeHours: "downtimeHours",
  materialCost: "materialCost",
  scrapRate: "scrapRate",
  availability: "availability",
  performance: "performance",
  quality: "quality",
  quotedPrice: "quotedPrice",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CncQuoteRiskAnalyzerInputs): string[] {
  const errors: string[] = [];

  for (const key of CNC_QUOTE_RISK_ANALYZER_INPUT_KEYS) {
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

  if (inputs.machineRate < 0) {
    errors.push("machineRate must be greater than or equal to zero.");
  }

  if (inputs.plannedHours < 0) {
    errors.push("plannedHours must be greater than or equal to zero.");
  }

  if (inputs.plannedHours <= 0) {
    errors.push("plannedHours must be greater than zero.");
  }

  if (inputs.downtimeHours < 0) {
    errors.push("downtimeHours must be greater than or equal to zero.");
  }

  if (inputs.materialCost < 0) {
    errors.push("materialCost must be greater than or equal to zero.");
  }

  if (inputs.scrapRate < 0 || inputs.scrapRate > 100) {
    errors.push("scrapRate must be between 0 and 100.");
  }

  if (inputs.availability < 0 || inputs.availability > 100) {
    errors.push("availability must be between 0 and 100.");
  }

  if (inputs.performance < 0 || inputs.performance > 100) {
    errors.push("performance must be between 0 and 100.");
  }

  if (inputs.quality < 0 || inputs.quality > 100) {
    errors.push("quality must be between 0 and 100.");
  }

  if (inputs.quotedPrice < 0) {
    errors.push("quotedPrice must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: CncQuoteRiskAnalyzerInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCncQuoteRiskAnalyzerInputs(inputs: CncQuoteRiskAnalyzerInputs): CncQuoteRiskAnalyzerValidationResult {
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
