export type CncQuoteRiskAnalyzerInputs = {
  setupTime: number;
  cycleTime: number;
  quantity: number;
  toolCost: number;
  materialCost: number;
  machineRate: number;
  riskMargin: number;
};

export type CncQuoteRiskAnalyzerValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CNC_QUOTE_RISK_ANALYZER_INPUT_KEYS: readonly (keyof CncQuoteRiskAnalyzerInputs)[] = [
  "setupTime",
  "cycleTime",
  "quantity",
  "toolCost",
  "materialCost",
  "machineRate",
  "riskMargin",
];

const INPUT_LABELS: Record<keyof CncQuoteRiskAnalyzerInputs, string> = {
  setupTime: "setupTime",
  cycleTime: "cycleTime",
  quantity: "quantity",
  toolCost: "toolCost",
  materialCost: "materialCost",
  machineRate: "machineRate",
  riskMargin: "riskMargin",
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
