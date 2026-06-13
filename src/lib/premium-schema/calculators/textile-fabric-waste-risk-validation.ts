export type TextileFabricWasteRiskInputs = {
  fabricCost: number;
  cuttingWastePercent: number;
  targetWastePercent: number;
  shrinkagePercent: number;
  dyeReworkCost: number;
};

export type TextileFabricWasteRiskValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TEXTILE_FABRIC_WASTE_RISK_INPUT_KEYS: readonly (keyof TextileFabricWasteRiskInputs)[] = [
  "fabricCost",
  "cuttingWastePercent",
  "targetWastePercent",
  "shrinkagePercent",
  "dyeReworkCost",
];

const INPUT_LABELS: Record<keyof TextileFabricWasteRiskInputs, string> = {
  fabricCost: "fabricCost",
  cuttingWastePercent: "cuttingWastePercent",
  targetWastePercent: "targetWastePercent",
  shrinkagePercent: "shrinkagePercent",
  dyeReworkCost: "dyeReworkCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: TextileFabricWasteRiskInputs): string[] {
  const errors: string[] = [];

  for (const key of TEXTILE_FABRIC_WASTE_RISK_INPUT_KEYS) {
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

  if (inputs.fabricCost < 0) {
    errors.push("fabricCost must be greater than or equal to zero.");
  }

  if (inputs.cuttingWastePercent < 0 || inputs.cuttingWastePercent > 100) {
    errors.push("cuttingWastePercent must be between 0 and 100.");
  }

  if (inputs.targetWastePercent < 0 || inputs.targetWastePercent > 100) {
    errors.push("targetWastePercent must be between 0 and 100.");
  }

  if (inputs.shrinkagePercent < 0 || inputs.shrinkagePercent > 100) {
    errors.push("shrinkagePercent must be between 0 and 100.");
  }

  if (inputs.dyeReworkCost < 0) {
    errors.push("dyeReworkCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: TextileFabricWasteRiskInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateTextileFabricWasteRiskInputs(inputs: TextileFabricWasteRiskInputs): TextileFabricWasteRiskValidationResult {
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
