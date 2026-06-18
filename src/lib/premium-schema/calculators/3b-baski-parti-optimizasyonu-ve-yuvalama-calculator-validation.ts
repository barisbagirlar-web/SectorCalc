export type ThreeBPrintingBatchNestingInputs = {
  bedWidthMm: number;
  bedDepthMm: number;
  partWidthMm: number;
  partDepthMm: number;
  printTimeHours: number;
};

export type ThreeBPrintingBatchNestingValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const THREE_B_PRINTING_BATCH_NESTING_INPUT_KEYS: readonly (keyof ThreeBPrintingBatchNestingInputs)[] = [
  "bedWidthMm",
  "bedDepthMm",
  "partWidthMm",
  "partDepthMm",
  "printTimeHours",
];

const INPUT_LABELS: Record<keyof ThreeBPrintingBatchNestingInputs, string> = {
  bedWidthMm: "bedWidthMm",
  bedDepthMm: "bedDepthMm",
  partWidthMm: "partWidthMm",
  partDepthMm: "partDepthMm",
  printTimeHours: "printTimeHours",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ThreeBPrintingBatchNestingInputs): string[] {
  const errors: string[] = [];

  for (const key of THREE_B_PRINTING_BATCH_NESTING_INPUT_KEYS) {
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

  if (inputs.bedWidthMm < 1) {
    errors.push("bedWidthMm must be at least 1.");
  }
  if (inputs.bedDepthMm < 1) {
    errors.push("bedDepthMm must be at least 1.");
  }
  if (inputs.partWidthMm < 1) {
    errors.push("partWidthMm must be at least 1.");
  }
  if (inputs.partDepthMm < 1) {
    errors.push("partDepthMm must be at least 1.");
  }
  if (inputs.partWidthMm > inputs.bedWidthMm) {
    errors.push("partWidthMm must not exceed bedWidthMm.");
  }
  if (inputs.partDepthMm > inputs.bedDepthMm) {
    errors.push("partDepthMm must not exceed bedDepthMm.");
  }
  if (inputs.printTimeHours < 0.1) {
    errors.push("printTimeHours must be at least 0.1.");
  }

  return errors;
}

function collectWarnings(_inputs: ThreeBPrintingBatchNestingInputs): string[] {
  return [];
}

export function validateThreeBPrintingBatchNestingInputs(
  inputs: ThreeBPrintingBatchNestingInputs,
): ThreeBPrintingBatchNestingValidationResult {
  const errors = collectInputErrors(inputs);
  const warnings = collectWarnings(inputs);

  if (errors.length > 0) {
    return { ok: false, errors, warnings };
  }

  return { ok: true, errors: [], warnings };
}

export function validateThreeBPrintingBatchNestingPartial(
  partial: Partial<ThreeBPrintingBatchNestingInputs>,
): ThreeBPrintingBatchNestingValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const key of THREE_B_PRINTING_BATCH_NESTING_INPUT_KEYS) {
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
