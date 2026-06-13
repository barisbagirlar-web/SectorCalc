export type CncToolWearCostInputs = {
  monthlyToolCost: number;
  partsProduced: number;
  toolChangeMinutes: number;
  changesPerMonth: number;
  hourlyCost: number;
  coolantCost: number;
};

export type CncToolWearCostValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CNC_TOOL_WEAR_COST_INPUT_KEYS: readonly (keyof CncToolWearCostInputs)[] = [
  "monthlyToolCost",
  "partsProduced",
  "toolChangeMinutes",
  "changesPerMonth",
  "hourlyCost",
  "coolantCost",
];

const INPUT_LABELS: Record<keyof CncToolWearCostInputs, string> = {
  monthlyToolCost: "monthlyToolCost",
  partsProduced: "partsProduced",
  toolChangeMinutes: "toolChangeMinutes",
  changesPerMonth: "changesPerMonth",
  hourlyCost: "hourlyCost",
  coolantCost: "coolantCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function computeToolCostPerPart(inputs: CncToolWearCostInputs): number {
  if (inputs.partsProduced <= 0) {
    return 0;
  }
  return inputs.monthlyToolCost / inputs.partsProduced;
}

function collectInputErrors(inputs: CncToolWearCostInputs): string[] {
  const errors: string[] = [];

  for (const key of CNC_TOOL_WEAR_COST_INPUT_KEYS) {
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

  if (inputs.monthlyToolCost < 0) {
    errors.push("monthlyToolCost must be greater than or equal to zero.");
  }
  if (inputs.partsProduced < 1) {
    errors.push("partsProduced must be greater than or equal to 1.");
  }
  if (inputs.toolChangeMinutes < 0) {
    errors.push("toolChangeMinutes must be greater than or equal to zero.");
  }
  if (inputs.changesPerMonth < 0) {
    errors.push("changesPerMonth must be greater than or equal to zero.");
  }
  if (inputs.hourlyCost < 0) {
    errors.push("hourlyCost must be greater than or equal to zero.");
  }
  if (inputs.coolantCost < 0) {
    errors.push("coolantCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: CncToolWearCostInputs): string[] {
  const warnings: string[] = [];
  const toolCostPerPart = computeToolCostPerPart(inputs);

  if (toolCostPerPart >= 0.5) {
    warnings.push(
      "Per-part tool cost is elevated — verify insert life and quoting allowance before accepting repeat jobs.",
    );
  }

  if (inputs.toolChangeMinutes >= 15) {
    warnings.push(
      "Tool change time is above typical band — schedule and setup buffers may be tight.",
    );
  }

  if (inputs.partsProduced === 0) {
    warnings.push(
      "Parts produced is zero. Per-part tool cost cannot be allocated until volume is supplied.",
    );
  }

  return warnings;
}

export function validateCncToolWearCostInputs(
  inputs: CncToolWearCostInputs,
): CncToolWearCostValidationResult {
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
