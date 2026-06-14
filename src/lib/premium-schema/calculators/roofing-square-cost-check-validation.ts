export type RoofingSquareCostCheckInputs = {
  jobArea: number;
  materialCost: number;
  laborHours: number;
  laborHourlyRate: number;
  equipmentCost: number;
  travelCost: number;
};

export type RoofingSquareCostCheckValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ROOFING_SQUARE_COST_CHECK_INPUT_KEYS: readonly (keyof RoofingSquareCostCheckInputs)[] = [
  "jobArea",
  "materialCost",
  "laborHours",
  "laborHourlyRate",
  "equipmentCost",
  "travelCost",
];

const INPUT_LABELS: Record<keyof RoofingSquareCostCheckInputs, string> = {
  jobArea: "jobArea",
  materialCost: "materialCost",
  laborHours: "laborHours",
  laborHourlyRate: "laborHourlyRate",
  equipmentCost: "equipmentCost",
  travelCost: "travelCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: RoofingSquareCostCheckInputs): string[] {
  const errors: string[] = [];

  for (const key of ROOFING_SQUARE_COST_CHECK_INPUT_KEYS) {
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

  if (inputs.jobArea < 1 || inputs.jobArea > 1000000) {
    errors.push("jobArea must be between 1 and 1000000.");
  }

  if (inputs.jobArea <= 0) {
    errors.push("jobArea must be greater than zero.");
  }

  if (inputs.materialCost < 0 || inputs.materialCost > 1000000) {
    errors.push("materialCost must be between 0 and 1000000.");
  }

  if (inputs.laborHours < 0 || inputs.laborHours > 10000) {
    errors.push("laborHours must be between 0 and 10000.");
  }

  if (inputs.laborHourlyRate < 0 || inputs.laborHourlyRate > 500) {
    errors.push("laborHourlyRate must be between 0 and 500.");
  }

  if (inputs.equipmentCost < 0 || inputs.equipmentCost > 1000000) {
    errors.push("equipmentCost must be between 0 and 1000000.");
  }

  if (inputs.travelCost < 0 || inputs.travelCost > 100000) {
    errors.push("travelCost must be between 0 and 100000.");
  }

  return errors;
}

function collectWarnings(inputs: RoofingSquareCostCheckInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateRoofingSquareCostCheckInputs(inputs: RoofingSquareCostCheckInputs): RoofingSquareCostCheckValidationResult {
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
