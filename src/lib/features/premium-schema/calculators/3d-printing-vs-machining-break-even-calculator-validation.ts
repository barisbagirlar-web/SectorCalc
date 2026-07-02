export type ThreeBPrintingVsMachiningBreakevenInputs = {
  printingSetupCost: number;
  printingUnitCost: number;
  machiningSetupCost: number;
  machiningUnitCost: number;
  analysisQuantity: number;
};

export type ThreeBPrintingVsMachiningBreakevenValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const THREE_B_PRINTING_VS_MACHINING_BREAKEVEN_INPUT_KEYS: readonly (keyof ThreeBPrintingVsMachiningBreakevenInputs)[] = [
  "printingSetupCost",
  "printingUnitCost",
  "machiningSetupCost",
  "machiningUnitCost",
  "analysisQuantity",
];

const INPUT_LABELS: Record<keyof ThreeBPrintingVsMachiningBreakevenInputs, string> = {
  printingSetupCost: "printingSetupCost",
  printingUnitCost: "printingUnitCost",
  machiningSetupCost: "machiningSetupCost",
  machiningUnitCost: "machiningUnitCost",
  analysisQuantity: "analysisQuantity",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ThreeBPrintingVsMachiningBreakevenInputs): string[] {
  const errors: string[] = [];

  for (const key of THREE_B_PRINTING_VS_MACHINING_BREAKEVEN_INPUT_KEYS) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(`${INPUT_LABELS[key]} is required.`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(`${INPUT_LABELS[key]} must be a finite number.`);
    }
  }

  if (errors.length > 0) return errors;

  if (inputs.printingSetupCost < 0) {
    errors.push("printingSetupCost must be non-negative.");
  }
  if (inputs.printingUnitCost < 0) {
    errors.push("printingUnitCost must be non-negative.");
  }
  if (inputs.machiningSetupCost < 0) {
    errors.push("machiningSetupCost must be non-negative.");
  }
  if (inputs.machiningUnitCost < 0) {
    errors.push("machiningUnitCost must be non-negative.");
  }
  if (inputs.analysisQuantity < 1) {
    errors.push("analysisQuantity must be at least 1.");
  }

  return errors;
}

function collectWarnings(inputs: ThreeBPrintingVsMachiningBreakevenInputs): string[] {
  const warnings: string[] = [];
  if (inputs.printingUnitCost >= inputs.machiningUnitCost && inputs.printingSetupCost >= inputs.machiningSetupCost) {
    warnings.push("3D printing is more expensive on both fixed and variable cost - check setup assumptions.");
  }
  return warnings;
}

export function validateThreeBPrintingVsMachiningBreakevenInputs(
  inputs: ThreeBPrintingVsMachiningBreakevenInputs,
): ThreeBPrintingVsMachiningBreakevenValidationResult {
  const errors = collectInputErrors(inputs);
  const warnings = collectWarnings(inputs);

  if (errors.length > 0) {
    return { ok: false, errors, warnings };
  }

  return { ok: true, errors: [], warnings };
}

export function validateThreeBPrintingVsMachiningBreakevenPartial(
  partial: Partial<ThreeBPrintingVsMachiningBreakevenInputs>,
): ThreeBPrintingVsMachiningBreakevenValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const key of THREE_B_PRINTING_VS_MACHINING_BREAKEVEN_INPUT_KEYS) {
    const value = partial[key];
    if (value !== undefined && value !== null && !isValidNumber(value)) {
      errors.push(`${INPUT_LABELS[key]} must be a finite number.`);
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors, warnings };
  }

  return { ok: true, errors: [], warnings };
}
