export type AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs = {
  lotSize: number;
  aqlLevel: number;
  inspectionCostPerUnit: number;
  defectCostPerUnit: number;
  unitCost: number;
};

export type AqlKabulOrneklemesiRiskVeMaliyetCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const AQL_KABUL_ORNEKLEMESI_RISK_VE_MALIYET_CALCULATOR_INPUT_KEYS: readonly (keyof AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs)[] = [
  "lotSize",
  "aqlLevel",
  "inspectionCostPerUnit",
  "defectCostPerUnit",
  "unitCost",
];

const INPUT_LABELS: Record<keyof AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs, string> = {
  lotSize: "lotSize",
  aqlLevel: "aqlLevel",
  inspectionCostPerUnit: "inspectionCostPerUnit",
  defectCostPerUnit: "defectCostPerUnit",
  unitCost: "unitCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of AQL_KABUL_ORNEKLEMESI_RISK_VE_MALIYET_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.lotSize < 1 || inputs.lotSize > 1000000) {
    errors.push("lotSize must be between 1 and 1000000.");
  }

  if (inputs.lotSize <= 0) {
    errors.push("lotSize must be greater than zero.");
  }

  if (inputs.aqlLevel < 0 || inputs.aqlLevel > 100) {
    errors.push("aqlLevel must be between 0 and 100.");
  }

  if (inputs.inspectionCostPerUnit < 0 || inputs.inspectionCostPerUnit > 1000) {
    errors.push("inspectionCostPerUnit must be between 0 and 1000.");
  }

  if (inputs.defectCostPerUnit < 0 || inputs.defectCostPerUnit > 100000) {
    errors.push("defectCostPerUnit must be between 0 and 100000.");
  }

  if (inputs.unitCost < 0.01 || inputs.unitCost > 100000) {
    errors.push("unitCost must be between 0.01 and 100000.");
  }

  if (inputs.unitCost <= 0) {
    errors.push("unitCost must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateAqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs(inputs: AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs): AqlKabulOrneklemesiRiskVeMaliyetCalculatorValidationResult {
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
