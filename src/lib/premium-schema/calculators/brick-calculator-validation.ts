export type BrickCalculatorInputs = {
  wallLength: number;
  wallHeight: number;
  wallThickness: number;
  brickLength: number;
  brickHeight: number;
  brickThickness: number;
};

export type BrickCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const BRICK_CALCULATOR_INPUT_KEYS: readonly (keyof BrickCalculatorInputs)[] = [
  "wallLength",
  "wallHeight",
  "wallThickness",
  "brickLength",
  "brickHeight",
  "brickThickness",
];

const INPUT_LABELS: Record<keyof BrickCalculatorInputs, string> = {
  wallLength: "wallLength",
  wallHeight: "wallHeight",
  wallThickness: "wallThickness",
  brickLength: "brickLength",
  brickHeight: "brickHeight",
  brickThickness: "brickThickness",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: BrickCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of BRICK_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.wallLength < 0.01 || inputs.wallLength > 1000) {
    errors.push("wallLength must be between 0.01 and 1000.");
  }

  if (inputs.wallLength <= 0) {
    errors.push("wallLength must be greater than zero.");
  }

  if (inputs.wallHeight < 0.01 || inputs.wallHeight > 100) {
    errors.push("wallHeight must be between 0.01 and 100.");
  }

  if (inputs.wallHeight <= 0) {
    errors.push("wallHeight must be greater than zero.");
  }

  if (inputs.wallThickness < 0.01 || inputs.wallThickness > 5) {
    errors.push("wallThickness must be between 0.01 and 5.");
  }

  if (inputs.wallThickness <= 0) {
    errors.push("wallThickness must be greater than zero.");
  }

  if (inputs.brickLength < 0.01 || inputs.brickLength > 1) {
    errors.push("brickLength must be between 0.01 and 1.");
  }

  if (inputs.brickLength <= 0) {
    errors.push("brickLength must be greater than zero.");
  }

  if (inputs.brickHeight < 0.01 || inputs.brickHeight > 1) {
    errors.push("brickHeight must be between 0.01 and 1.");
  }

  if (inputs.brickHeight <= 0) {
    errors.push("brickHeight must be greater than zero.");
  }

  if (inputs.brickThickness < 0.01 || inputs.brickThickness > 1) {
    errors.push("brickThickness must be between 0.01 and 1.");
  }

  if (inputs.brickThickness <= 0) {
    errors.push("brickThickness must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: BrickCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateBrickCalculatorInputs(inputs: BrickCalculatorInputs): BrickCalculatorValidationResult {
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
