export type DrywallCalculatorInputs = {
  wallLength: number;
  wallHeight: number;
  boardWidth: number;
  boardHeight: number;
  unitBoardCost: number;
  wasteRatePercent: number;
};

export type DrywallCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const DRYWALL_CALCULATOR_INPUT_KEYS: readonly (keyof DrywallCalculatorInputs)[] = [
  "wallLength",
  "wallHeight",
  "boardWidth",
  "boardHeight",
  "unitBoardCost",
  "wasteRatePercent",
];

const INPUT_LABELS: Record<keyof DrywallCalculatorInputs, string> = {
  wallLength: "wallLength",
  wallHeight: "wallHeight",
  boardWidth: "boardWidth",
  boardHeight: "boardHeight",
  unitBoardCost: "unitBoardCost",
  wasteRatePercent: "wasteRatePercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: DrywallCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of DRYWALL_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.wallLength < 0.1 || inputs.wallLength > 1000) {
    errors.push("wallLength must be between 0.1 and 1000.");
  }

  if (inputs.wallLength <= 0) {
    errors.push("wallLength must be greater than zero.");
  }

  if (inputs.wallHeight < 0.1 || inputs.wallHeight > 100) {
    errors.push("wallHeight must be between 0.1 and 100.");
  }

  if (inputs.wallHeight <= 0) {
    errors.push("wallHeight must be greater than zero.");
  }

  if (inputs.boardWidth < 0.1 || inputs.boardWidth > 10) {
    errors.push("boardWidth must be between 0.1 and 10.");
  }

  if (inputs.boardWidth <= 0) {
    errors.push("boardWidth must be greater than zero.");
  }

  if (inputs.boardHeight < 0.1 || inputs.boardHeight > 20) {
    errors.push("boardHeight must be between 0.1 and 20.");
  }

  if (inputs.boardHeight <= 0) {
    errors.push("boardHeight must be greater than zero.");
  }

  if (inputs.unitBoardCost < 0 || inputs.unitBoardCost > 1000) {
    errors.push("unitBoardCost must be between 0 and 1000.");
  }

  if (inputs.wasteRatePercent < 0 || inputs.wasteRatePercent > 100) {
    errors.push("wasteRatePercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: DrywallCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateDrywallCalculatorInputs(inputs: DrywallCalculatorInputs): DrywallCalculatorValidationResult {
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
