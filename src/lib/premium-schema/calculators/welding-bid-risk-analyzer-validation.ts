export type WeldingBidRiskAnalyzerInputs = {
  monthlyToolCost: number;
  partsProduced: number;
  toolChangeMinutes: number;
  changesPerMonth: number;
  hourlyCost: number;
  coolantCost: number;
};

export type WeldingBidRiskAnalyzerValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const WELDING_BID_RISK_ANALYZER_INPUT_KEYS: readonly (keyof WeldingBidRiskAnalyzerInputs)[] = [
  "monthlyToolCost",
  "partsProduced",
  "toolChangeMinutes",
  "changesPerMonth",
  "hourlyCost",
  "coolantCost",
];

const INPUT_LABELS: Record<keyof WeldingBidRiskAnalyzerInputs, string> = {
  monthlyToolCost: "monthlyToolCost",
  partsProduced: "partsProduced",
  toolChangeMinutes: "toolChangeMinutes",
  changesPerMonth: "changesPerMonth",
  hourlyCost: "hourlyCost",
  coolantCost: "coolantCost",
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

  if (errors.length > 0) {
    return errors;
  }

  if (inputs.monthlyToolCost < 0) {
    errors.push("monthlyToolCost must be greater than or equal to zero.");
  }

  if (inputs.partsProduced < 0) {
    errors.push("partsProduced must be greater than or equal to zero.");
  }

  if (inputs.partsProduced <= 0) {
    errors.push("partsProduced must be greater than zero.");
  }

  if (inputs.toolChangeMinutes < 0) {
    errors.push("toolChangeMinutes must be greater than or equal to zero.");
  }

  if (inputs.changesPerMonth < 0) {
    errors.push("changesPerMonth must be greater than or equal to zero.");
  }

  if (inputs.hourlyCost < 0) {
    errors.push("hourlyCost must be greater than or equal to zero.");
  }

  if (inputs.coolantCost < 0) {
    errors.push("coolantCost must be greater than or equal to zero.");
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
