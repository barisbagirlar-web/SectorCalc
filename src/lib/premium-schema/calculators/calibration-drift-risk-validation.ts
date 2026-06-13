export type CalibrationDriftRiskInputs = {
  targetValue: number;
  actualValue: number;
  tolerance: number;
  batchValue: number;
  rejectionRiskPercent: number;
};

export type CalibrationDriftRiskValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CALIBRATION_DRIFT_RISK_INPUT_KEYS: readonly (keyof CalibrationDriftRiskInputs)[] =
  ["targetValue", "actualValue", "tolerance", "batchValue", "rejectionRiskPercent"];

const INPUT_LABELS: Record<keyof CalibrationDriftRiskInputs, string> = {
  targetValue: "targetValue",
  actualValue: "actualValue",
  tolerance: "tolerance",
  batchValue: "batchValue",
  rejectionRiskPercent: "rejectionRiskPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function computeToleranceUsage(inputs: CalibrationDriftRiskInputs): number {
  if (inputs.tolerance <= 0) {
    return 0;
  }
  return Math.max(
    (Math.abs(inputs.actualValue - inputs.targetValue) / inputs.tolerance) * 100,
    0,
  );
}

function collectInputErrors(inputs: CalibrationDriftRiskInputs): string[] {
  const errors: string[] = [];

  for (const key of CALIBRATION_DRIFT_RISK_INPUT_KEYS) {
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

  if (inputs.tolerance <= 0) {
    errors.push("tolerance must be greater than zero.");
  }
  if (inputs.batchValue < 0) {
    errors.push("batchValue must be greater than or equal to zero.");
  }
  if (inputs.rejectionRiskPercent < 0 || inputs.rejectionRiskPercent > 100) {
    errors.push("rejectionRiskPercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: CalibrationDriftRiskInputs): string[] {
  const warnings: string[] = [];
  const toleranceUsage = computeToleranceUsage(inputs);

  if (toleranceUsage >= 70) {
    warnings.push(
      "Tolerance band usage is elevated. Confirm measured value, target and tolerance assumptions before production release.",
    );
  }

  if (inputs.rejectionRiskPercent >= 25) {
    warnings.push(
      "Rejection risk percent is high. Confirm scrap or reject rate assumptions tied to drift exposure.",
    );
  }

  if (inputs.batchValue === 0 && inputs.rejectionRiskPercent > 0) {
    warnings.push(
      "Batch value is zero while rejection risk is positive. Exposure will be zero until batch value is supplied.",
    );
  }

  return warnings;
}

export function validateCalibrationDriftRiskInputs(
  inputs: CalibrationDriftRiskInputs,
): CalibrationDriftRiskValidationResult {
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
