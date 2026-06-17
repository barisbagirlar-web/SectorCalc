export type ThreeDPrintJobMarginToolInputs = {
  materialCost: number;
  machineTimeHours: number;
  machineHourlyRate: number;
  laborHours: number;
  laborHourlyRate: number;
  electricityCost: number;
  postProcessingCost: number;
  failureScrapRatePercent: number;
  overheadPercent: number;
  targetMarginPercent: number;
};

export type ThreeDPrintJobMarginToolValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const THREE_D_PRINT_JOB_MARGIN_TOOL_INPUT_KEYS: readonly (keyof ThreeDPrintJobMarginToolInputs)[] = [
  "materialCost",
  "machineTimeHours",
  "machineHourlyRate",
  "laborHours",
  "laborHourlyRate",
  "electricityCost",
  "postProcessingCost",
  "failureScrapRatePercent",
  "overheadPercent",
  "targetMarginPercent",
];

const INPUT_LABELS: Record<keyof ThreeDPrintJobMarginToolInputs, string> = {
  materialCost: "materialCost",
  machineTimeHours: "machineTimeHours",
  machineHourlyRate: "machineHourlyRate",
  laborHours: "laborHours",
  laborHourlyRate: "laborHourlyRate",
  electricityCost: "electricityCost",
  postProcessingCost: "postProcessingCost",
  failureScrapRatePercent: "failureScrapRatePercent",
  overheadPercent: "overheadPercent",
  targetMarginPercent: "targetMarginPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ThreeDPrintJobMarginToolInputs): string[] {
  const errors: string[] = [];

  for (const key of THREE_D_PRINT_JOB_MARGIN_TOOL_INPUT_KEYS) {
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

  if (inputs.materialCost < 0) {
    errors.push("materialCost must be greater than or equal to zero.");
  }

  if (inputs.electricityCost < 0) {
    errors.push("electricityCost must be greater than or equal to zero.");
  }

  if (inputs.postProcessingCost < 0) {
    errors.push("postProcessingCost must be greater than or equal to zero.");
  }

  if (inputs.machineTimeHours < 0) {
    errors.push("machineTimeHours must be greater than or equal to zero.");
  }

  if (inputs.laborHours < 0) {
    errors.push("laborHours must be greater than or equal to zero.");
  }

  if (inputs.machineHourlyRate < 0) {
    errors.push("machineHourlyRate must be greater than or equal to zero.");
  }

  if (inputs.laborHourlyRate < 0) {
    errors.push("laborHourlyRate must be greater than or equal to zero.");
  }

  if (inputs.failureScrapRatePercent < 0 || inputs.failureScrapRatePercent > 80) {
    errors.push("failureScrapRatePercent must be between 0 and 80.");
  }

  if (inputs.overheadPercent < 0 || inputs.overheadPercent > 200) {
    errors.push("overheadPercent must be between 0 and 200.");
  }

  if (inputs.targetMarginPercent < 1 || inputs.targetMarginPercent > 85) {
    errors.push("targetMarginPercent must be between 1 and 85.");
  }

  const marginDenominator = 1 - inputs.targetMarginPercent / 100;
  if (marginDenominator <= 0) {
    errors.push("targetMarginPercent must leave a positive quote price denominator.");
  }

  return errors;
}

function collectWarnings(inputs: ThreeDPrintJobMarginToolInputs): string[] {
  const warnings: string[] = [];

  if (inputs.failureScrapRatePercent >= 20) {
    warnings.push("Failure/scrap rate is elevated — verify reprint buffer before quoting.");
  }

  if (inputs.overheadPercent >= 50) {
    warnings.push("Overhead allocation is high — confirm shop-rate assumptions.");
  }

  return warnings;
}

export function validateThreeDPrintJobMarginToolInputs(
  inputs: ThreeDPrintJobMarginToolInputs,
): ThreeDPrintJobMarginToolValidationResult {
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
