export type WarehouseSpaceCostLeakInputs = {
  monthlyRent: number;
  totalSqm: number;
  unusedSpacePercent: number;
  handlingOverrunHours: number;
  hourlyCost: number;
};

export type WarehouseSpaceCostLeakValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const WAREHOUSE_SPACE_COST_LEAK_INPUT_KEYS: readonly (keyof WarehouseSpaceCostLeakInputs)[] =
  [
    "monthlyRent",
    "totalSqm",
    "unusedSpacePercent",
    "handlingOverrunHours",
    "hourlyCost",
  ];

const INPUT_LABELS: Record<keyof WarehouseSpaceCostLeakInputs, string> = {
  monthlyRent: "monthlyRent",
  totalSqm: "totalSqm",
  unusedSpacePercent: "unusedSpacePercent",
  handlingOverrunHours: "handlingOverrunHours",
  hourlyCost: "hourlyCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: WarehouseSpaceCostLeakInputs): string[] {
  const errors: string[] = [];

  for (const key of WAREHOUSE_SPACE_COST_LEAK_INPUT_KEYS) {
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

  if (inputs.monthlyRent < 0) {
    errors.push("monthlyRent must be greater than or equal to zero.");
  }
  if (inputs.totalSqm < 1) {
    errors.push("totalSqm must be greater than or equal to 1.");
  }
  if (inputs.unusedSpacePercent < 0 || inputs.unusedSpacePercent > 100) {
    errors.push("unusedSpacePercent must be between 0 and 100.");
  }
  if (inputs.handlingOverrunHours < 0) {
    errors.push("handlingOverrunHours must be greater than or equal to zero.");
  }
  if (inputs.hourlyCost < 0) {
    errors.push("hourlyCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: WarehouseSpaceCostLeakInputs): string[] {
  const warnings: string[] = [];

  if (inputs.unusedSpacePercent >= 10) {
    warnings.push("Unused space is above typical band — rent leak is building.");
  }

  if (inputs.handlingOverrunHours >= 40 && inputs.hourlyCost > 0) {
    warnings.push(
      "Handling overrun hours are elevated. Confirm pallet flow and pick path assumptions.",
    );
  }

  if (inputs.totalSqm > 0 && inputs.unusedSpacePercent >= 15) {
    warnings.push(
      "Dead space exceeds fifteen percent of floor area. Review slotting before adding capacity.",
    );
  }

  return warnings;
}

export function validateWarehouseSpaceCostLeakInputs(
  inputs: WarehouseSpaceCostLeakInputs,
): WarehouseSpaceCostLeakValidationResult {
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
