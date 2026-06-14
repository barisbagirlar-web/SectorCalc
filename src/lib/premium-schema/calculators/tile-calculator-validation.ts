export type TileCalculatorInputs = {
  length: number;
  width: number;
  wasteRate: number;
  tileCoveragePerUnit: number;
  unitTileCost: number;
  laborCost: number;
};

export type TileCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TILE_CALCULATOR_INPUT_KEYS: readonly (keyof TileCalculatorInputs)[] = [
  "length",
  "width",
  "wasteRate",
  "tileCoveragePerUnit",
  "unitTileCost",
  "laborCost",
];

const INPUT_LABELS: Record<keyof TileCalculatorInputs, string> = {
  length: "length",
  width: "width",
  wasteRate: "wasteRate",
  tileCoveragePerUnit: "tileCoveragePerUnit",
  unitTileCost: "unitTileCost",
  laborCost: "laborCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: TileCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of TILE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.length < 0.01 || inputs.length > 100) {
    errors.push("length must be between 0.01 and 100.");
  }

  if (inputs.length <= 0) {
    errors.push("length must be greater than zero.");
  }

  if (inputs.width < 0.01 || inputs.width > 100) {
    errors.push("width must be between 0.01 and 100.");
  }

  if (inputs.width <= 0) {
    errors.push("width must be greater than zero.");
  }

  if (inputs.wasteRate < 0 || inputs.wasteRate > 100) {
    errors.push("wasteRate must be between 0 and 100.");
  }

  if (inputs.tileCoveragePerUnit < 0.01 || inputs.tileCoveragePerUnit > 10) {
    errors.push("tileCoveragePerUnit must be between 0.01 and 10.");
  }

  if (inputs.tileCoveragePerUnit <= 0) {
    errors.push("tileCoveragePerUnit must be greater than zero.");
  }

  if (inputs.unitTileCost < 0 || inputs.unitTileCost > 1000) {
    errors.push("unitTileCost must be between 0 and 1000.");
  }

  if (inputs.laborCost < 0 || inputs.laborCost > 100000) {
    errors.push("laborCost must be between 0 and 100000.");
  }

  return errors;
}

function collectWarnings(inputs: TileCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateTileCalculatorInputs(inputs: TileCalculatorInputs): TileCalculatorValidationResult {
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
