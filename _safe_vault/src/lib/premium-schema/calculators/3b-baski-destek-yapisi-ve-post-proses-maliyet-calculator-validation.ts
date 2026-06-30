export type ThreeBPrintingSupportPostProcessInputs = {
  supportVolumeCm3: number;
  materialCostPerCm3: number;
  cleaningTimeMinutes: number;
  laborRatePerHour: number;
  batchQuantity: number;
};

export type ThreeBPrintingSupportPostProcessValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const THREE_B_PRINTING_SUPPORT_POST_PROCESS_INPUT_KEYS: readonly (keyof ThreeBPrintingSupportPostProcessInputs)[] = [
  "supportVolumeCm3",
  "materialCostPerCm3",
  "cleaningTimeMinutes",
  "laborRatePerHour",
  "batchQuantity",
];

const INPUT_LABELS: Record<keyof ThreeBPrintingSupportPostProcessInputs, string> = {
  supportVolumeCm3: "supportVolumeCm3",
  materialCostPerCm3: "materialCostPerCm3",
  cleaningTimeMinutes: "cleaningTimeMinutes",
  laborRatePerHour: "laborRatePerHour",
  batchQuantity: "batchQuantity",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ThreeBPrintingSupportPostProcessInputs): string[] {
  const errors: string[] = [];

  for (const key of THREE_B_PRINTING_SUPPORT_POST_PROCESS_INPUT_KEYS) {
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

  if (inputs.supportVolumeCm3 < 0) {
    errors.push("supportVolumeCm3 must be non-negative.");
  }
  if (inputs.materialCostPerCm3 < 0) {
    errors.push("materialCostPerCm3 must be non-negative.");
  }
  if (inputs.cleaningTimeMinutes < 0) {
    errors.push("cleaningTimeMinutes must be non-negative.");
  }
  if (inputs.laborRatePerHour < 0) {
    errors.push("laborRatePerHour must be non-negative.");
  }
  if (inputs.batchQuantity < 1) {
    errors.push("batchQuantity must be at least 1.");
  }

  return errors;
}

function collectWarnings(_inputs: ThreeBPrintingSupportPostProcessInputs): string[] {
  return [];
}

export function validateThreeBPrintingSupportPostProcessInputs(
  inputs: ThreeBPrintingSupportPostProcessInputs,
): ThreeBPrintingSupportPostProcessValidationResult {
  const errors = collectInputErrors(inputs);
  const warnings = collectWarnings(inputs);

  if (errors.length > 0) {
    return { ok: false, errors, warnings };
  }

  return { ok: true, errors: [], warnings };
}

export function validateThreeBPrintingSupportPostProcessPartial(
  partial: Partial<ThreeBPrintingSupportPostProcessInputs>,
): ThreeBPrintingSupportPostProcessValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const key of THREE_B_PRINTING_SUPPORT_POST_PROCESS_INPUT_KEYS) {
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
