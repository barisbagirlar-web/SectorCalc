export type WeldingBidRiskAnalyzerInputs = {
  materialCost: number;
  laborHours: number;
  laborRate: number;
  gasConsumableCost: number;
  fitUpHours: number;
  reworkRiskPercent: number;
  targetMargin: number;
};

export type WeldingBidRiskAnalyzerValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const WELDING_BID_RISK_ANALYZER_INPUT_KEYS: readonly (keyof WeldingBidRiskAnalyzerInputs)[] = [
  "materialCost",
  "laborHours",
  "laborRate",
  "gasConsumableCost",
  "fitUpHours",
  "reworkRiskPercent",
  "targetMargin",
];

const INPUT_LABELS: Record<keyof WeldingBidRiskAnalyzerInputs, string> = {
  materialCost: "materialCost",
  laborHours: "laborHours",
  laborRate: "laborRate",
  gasConsumableCost: "gasConsumableCost",
  fitUpHours: "fitUpHours",
  reworkRiskPercent: "reworkRiskPercent",
  targetMargin: "targetMargin",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: WeldingBidRiskAnalyzerInputs): string[] {
  const errors: string[] = [];
  for (const key of WELDING_BID_RISK_ANALYZER_INPUT_KEYS) {
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

function collectWarnings(inputs: WeldingBidRiskAnalyzerInputs): string[] {
  const warnings: string[] = [];
  return warnings;
}

export function validateWeldingBidRiskAnalyzerInputs(inputs: WeldingBidRiskAnalyzerInputs): WeldingBidRiskAnalyzerValidationResult {
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
