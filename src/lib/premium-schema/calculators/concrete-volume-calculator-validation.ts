export type ConcreteVolumeCalculatorInputs = {
  length: number;
  width: number;
  height: number;
  wasteRate: number;
  compactionFactor: number;
  unitCost: number;
};

export type ConcreteVolumeCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CONCRETE_VOLUME_CALCULATOR_INPUT_KEYS: readonly (keyof ConcreteVolumeCalculatorInputs)[] = [
  "length",
  "width",
  "height",
  "wasteRate",
  "compactionFactor",
  "unitCost",
];

const INPUT_LABELS: Record<keyof ConcreteVolumeCalculatorInputs, string> = {
  length: "length",
  width: "width",
  height: "height",
  wasteRate: "wasteRate",
  compactionFactor: "compactionFactor",
  unitCost: "unitCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ConcreteVolumeCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of CONCRETE_VOLUME_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.length < 0.01 || inputs.length > 1000) {
    errors.push("length must be between 0.01 and 1000.");
  }

  if (inputs.length <= 0) {
    errors.push("length must be greater than zero.");
  }

  if (inputs.width < 0.01 || inputs.width > 1000) {
    errors.push("width must be between 0.01 and 1000.");
  }

  if (inputs.width <= 0) {
    errors.push("width must be greater than zero.");
  }

  if (inputs.height < 0.01 || inputs.height > 100) {
    errors.push("height must be between 0.01 and 100.");
  }

  if (inputs.height <= 0) {
    errors.push("height must be greater than zero.");
  }

  if (inputs.wasteRate < 0 || inputs.wasteRate > 100) {
    errors.push("wasteRate must be between 0 and 100.");
  }

  if (inputs.compactionFactor < 0.8 || inputs.compactionFactor > 1.2) {
    errors.push("compactionFactor must be between 0.8 and 1.2.");
  }

  if (inputs.compactionFactor <= 0) {
    errors.push("compactionFactor must be greater than zero.");
  }

  if (inputs.unitCost < 0 || inputs.unitCost > 10000) {
    errors.push("unitCost must be between 0 and 10000.");
  }

  return errors;
}

function collectWarnings(inputs: ConcreteVolumeCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateConcreteVolumeCalculatorInputs(inputs: ConcreteVolumeCalculatorInputs): ConcreteVolumeCalculatorValidationResult {
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
