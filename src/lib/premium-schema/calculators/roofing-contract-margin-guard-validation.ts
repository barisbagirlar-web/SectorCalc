export type RoofingContractMarginGuardInputs = {
  contractValue: number;
  plannedSubcontractorCost: number;
  actualSubcontractorCost: number;
  delayCost: number;
  materialVariance: number;
};

export type RoofingContractMarginGuardValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ROOFING_CONTRACT_MARGIN_GUARD_INPUT_KEYS: readonly (keyof RoofingContractMarginGuardInputs)[] = [
  "contractValue",
  "plannedSubcontractorCost",
  "actualSubcontractorCost",
  "delayCost",
  "materialVariance",
];

const INPUT_LABELS: Record<keyof RoofingContractMarginGuardInputs, string> = {
  contractValue: "contractValue",
  plannedSubcontractorCost: "plannedSubcontractorCost",
  actualSubcontractorCost: "actualSubcontractorCost",
  delayCost: "delayCost",
  materialVariance: "materialVariance",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: RoofingContractMarginGuardInputs): string[] {
  const errors: string[] = [];

  for (const key of ROOFING_CONTRACT_MARGIN_GUARD_INPUT_KEYS) {
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

  if (inputs.contractValue < 0) {
    errors.push("contractValue must be greater than or equal to zero.");
  }

  if (inputs.contractValue <= 0) {
    errors.push("contractValue must be greater than zero.");
  }

  if (inputs.plannedSubcontractorCost < 0) {
    errors.push("plannedSubcontractorCost must be greater than or equal to zero.");
  }

  if (inputs.actualSubcontractorCost < 0) {
    errors.push("actualSubcontractorCost must be greater than or equal to zero.");
  }

  if (inputs.delayCost < 0) {
    errors.push("delayCost must be greater than or equal to zero.");
  }

  if (inputs.materialVariance < 0) {
    errors.push("materialVariance must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: RoofingContractMarginGuardInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateRoofingContractMarginGuardInputs(inputs: RoofingContractMarginGuardInputs): RoofingContractMarginGuardValidationResult {
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
