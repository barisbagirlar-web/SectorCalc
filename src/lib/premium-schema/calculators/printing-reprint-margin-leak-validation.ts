export type PrintingReprintMarginLeakInputs = {
  jobRevenue: number;
  materialCost: number;
  reprintRatePercent: number;
  designRevisionHours: number;
  laborRate: number;
  installReworkCost: number;
};

export type PrintingReprintMarginLeakValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PRINTING_REPRINT_MARGIN_LEAK_INPUT_KEYS: readonly (keyof PrintingReprintMarginLeakInputs)[] =
  [
    "jobRevenue",
    "materialCost",
    "reprintRatePercent",
    "designRevisionHours",
    "laborRate",
    "installReworkCost",
  ];

const INPUT_LABELS: Record<keyof PrintingReprintMarginLeakInputs, string> = {
  jobRevenue: "jobRevenue",
  materialCost: "materialCost",
  reprintRatePercent: "reprintRatePercent",
  designRevisionHours: "designRevisionHours",
  laborRate: "laborRate",
  installReworkCost: "installReworkCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: PrintingReprintMarginLeakInputs): string[] {
  const errors: string[] = [];

  for (const key of PRINTING_REPRINT_MARGIN_LEAK_INPUT_KEYS) {
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

  if (inputs.jobRevenue <= 0) {
    errors.push("jobRevenue must be greater than zero.");
  }
  if (inputs.materialCost < 0) {
    errors.push("materialCost must be greater than or equal to zero.");
  }
  if (inputs.reprintRatePercent < 0 || inputs.reprintRatePercent > 100) {
    errors.push("reprintRatePercent must be between 0 and 100.");
  }
  if (inputs.designRevisionHours < 0) {
    errors.push("designRevisionHours must be greater than or equal to zero.");
  }
  if (inputs.laborRate < 0) {
    errors.push("laborRate must be greater than or equal to zero.");
  }
  if (inputs.installReworkCost < 0) {
    errors.push("installReworkCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: PrintingReprintMarginLeakInputs): string[] {
  const warnings: string[] = [];
  const reprintCost = inputs.materialCost * (inputs.reprintRatePercent / 100);
  const revisionCost = inputs.designRevisionHours * inputs.laborRate;
  const totalExposure = reprintCost + revisionCost + inputs.installReworkCost;
  const marginPressure = (totalExposure / inputs.jobRevenue) * 100;

  if (inputs.reprintRatePercent >= 5) {
    warnings.push("Reprint rate is elevated — verify color proof and material allowance.");
  }

  if (marginPressure >= 5) {
    warnings.push("Margin pressure is building — hidden rework may compress profit.");
  }

  if (inputs.designRevisionHours >= 12 && inputs.laborRate > 0) {
    warnings.push(
      "Design revision hours are elevated. Confirm artwork scope and pre-press assumptions.",
    );
  }

  return warnings;
}

export function validatePrintingReprintMarginLeakInputs(
  inputs: PrintingReprintMarginLeakInputs,
): PrintingReprintMarginLeakValidationResult {
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
