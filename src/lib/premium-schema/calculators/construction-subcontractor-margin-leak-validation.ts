export type ConstructionSubcontractorMarginLeakInputs = {
  contractValue: number;
  plannedSubcontractorCost: number;
  actualSubcontractorCost: number;
  delayCost: number;
  materialVariance: number;
};

export type ConstructionSubcontractorMarginLeakValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CONSTRUCTION_SUBCONTRACTOR_MARGIN_LEAK_INPUT_KEYS: readonly (keyof ConstructionSubcontractorMarginLeakInputs)[] =
  [
    "contractValue",
    "plannedSubcontractorCost",
    "actualSubcontractorCost",
    "delayCost",
    "materialVariance",
  ];

const INPUT_LABELS: Record<keyof ConstructionSubcontractorMarginLeakInputs, string> = {
  contractValue: "contractValue",
  plannedSubcontractorCost: "plannedSubcontractorCost",
  actualSubcontractorCost: "actualSubcontractorCost",
  delayCost: "delayCost",
  materialVariance: "materialVariance",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ConstructionSubcontractorMarginLeakInputs): string[] {
  const errors: string[] = [];

  for (const key of CONSTRUCTION_SUBCONTRACTOR_MARGIN_LEAK_INPUT_KEYS) {
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

function collectWarnings(inputs: ConstructionSubcontractorMarginLeakInputs): string[] {
  const warnings: string[] = [];
  const subcontractorVariance = Math.max(
    inputs.actualSubcontractorCost - inputs.plannedSubcontractorCost,
    0,
  );
  const totalExposure = subcontractorVariance + inputs.delayCost + inputs.materialVariance;
  const marginPressure = (totalExposure / inputs.contractValue) * 100;

  if (marginPressure >= 3) {
    warnings.push(
      "Subcontractor leak is pressuring project margin — audit change orders and delay claims.",
    );
  }

  if (inputs.actualSubcontractorCost > inputs.plannedSubcontractorCost * 1.1) {
    warnings.push(
      "Actual subcontractor cost exceeds planned cost by more than ten percent. Confirm change order scope.",
    );
  }

  if (inputs.delayCost > 0 && subcontractorVariance === 0) {
    warnings.push(
      "Delay cost is present without subcontractor variance. Confirm delay attribution to subcontracted scope.",
    );
  }

  return warnings;
}

export function validateConstructionSubcontractorMarginLeakInputs(
  inputs: ConstructionSubcontractorMarginLeakInputs,
): ConstructionSubcontractorMarginLeakValidationResult {
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
