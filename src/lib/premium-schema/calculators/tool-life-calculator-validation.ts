export type ToolLifeCalculatorInputs = {
  toolPurchasePrice: number;
  expectedToolLifeUnits: number;
  materialHardnessFactor: number;
  cuttingSpeedFactor: number;
  toolChangeTimeHours: number;
  laborRatePerHour: number;
};

export type ToolLifeCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TOOL_LIFE_CALCULATOR_INPUT_KEYS: readonly (keyof ToolLifeCalculatorInputs)[] = [
  "toolPurchasePrice",
  "expectedToolLifeUnits",
  "materialHardnessFactor",
  "cuttingSpeedFactor",
  "toolChangeTimeHours",
  "laborRatePerHour",
];

const INPUT_LABELS: Record<keyof ToolLifeCalculatorInputs, string> = {
  toolPurchasePrice: "toolPurchasePrice",
  expectedToolLifeUnits: "expectedToolLifeUnits",
  materialHardnessFactor: "materialHardnessFactor",
  cuttingSpeedFactor: "cuttingSpeedFactor",
  toolChangeTimeHours: "toolChangeTimeHours",
  laborRatePerHour: "laborRatePerHour",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ToolLifeCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of TOOL_LIFE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.toolPurchasePrice < 0 || inputs.toolPurchasePrice > 100000) {
    errors.push("toolPurchasePrice must be between 0 and 100000.");
  }

  if (inputs.expectedToolLifeUnits < 1 || inputs.expectedToolLifeUnits > 1000000) {
    errors.push("expectedToolLifeUnits must be between 1 and 1000000.");
  }

  if (inputs.expectedToolLifeUnits <= 0) {
    errors.push("expectedToolLifeUnits must be greater than zero.");
  }

  if (inputs.materialHardnessFactor < 0.5 || inputs.materialHardnessFactor > 3) {
    errors.push("materialHardnessFactor must be between 0.5 and 3.");
  }

  if (inputs.materialHardnessFactor <= 0) {
    errors.push("materialHardnessFactor must be greater than zero.");
  }

  if (inputs.cuttingSpeedFactor < 0.5 || inputs.cuttingSpeedFactor > 2) {
    errors.push("cuttingSpeedFactor must be between 0.5 and 2.");
  }

  if (inputs.cuttingSpeedFactor <= 0) {
    errors.push("cuttingSpeedFactor must be greater than zero.");
  }

  if (inputs.toolChangeTimeHours < 0 || inputs.toolChangeTimeHours > 8) {
    errors.push("toolChangeTimeHours must be between 0 and 8.");
  }

  if (inputs.laborRatePerHour < 0 || inputs.laborRatePerHour > 500) {
    errors.push("laborRatePerHour must be between 0 and 500.");
  }

  return errors;
}

function collectWarnings(inputs: ToolLifeCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateToolLifeCalculatorInputs(inputs: ToolLifeCalculatorInputs): ToolLifeCalculatorValidationResult {
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
