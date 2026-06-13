import {
  validateCalibrationDriftRiskInputs,
  type CalibrationDriftRiskInputs,
} from "@/lib/premium-schema/calculators/calibration-drift-risk-validation";

export type { CalibrationDriftRiskInputs };

export type CalibrationDriftRiskSummaryLevel = "low" | "warning" | "critical";

export type CalibrationDriftRiskPrimaryDriver = "rejectionExposure";

export type CalibrationDriftRiskResult = {
  toleranceUsage: number;
  rejectionExposure: number;
  summaryLevel: CalibrationDriftRiskSummaryLevel;
  primaryDriver: CalibrationDriftRiskPrimaryDriver;
  decisionVerdict: {
    summaryLevel: CalibrationDriftRiskSummaryLevel;
    primaryDriver: CalibrationDriftRiskPrimaryDriver;
    message: string;
  };
  warnings: string[];
};

const TOLERANCE_WARNING_THRESHOLD = 70;
const TOLERANCE_CRITICAL_THRESHOLD = 100;

function resolveSummaryLevel(toleranceUsage: number): CalibrationDriftRiskSummaryLevel {
  if (toleranceUsage >= TOLERANCE_CRITICAL_THRESHOLD) {
    return "critical";
  }
  if (toleranceUsage >= TOLERANCE_WARNING_THRESHOLD) {
    return "warning";
  }
  return "low";
}

function resolveDecisionMessage(summaryLevel: CalibrationDriftRiskSummaryLevel): string {
  if (summaryLevel === "low") {
    return "Tolerance usage is within the configured warning band. Continue monitoring calibration drift and batch exposure assumptions.";
  }
  if (summaryLevel === "warning") {
    return "Tolerance usage is elevated. Review calibration status, rejection risk and batch value before release.";
  }
  return "Tolerance usage is critical. Prioritize recalibration and validate rejection exposure before production acceptance.";
}

export function calculateCalibrationDriftRisk(
  inputs: CalibrationDriftRiskInputs,
): CalibrationDriftRiskResult {
  const validation = validateCalibrationDriftRiskInputs(inputs);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  const toleranceUsage =
    (Math.abs(inputs.actualValue - inputs.targetValue) / inputs.tolerance) * 100;
  const rejectionExposure =
    inputs.batchValue * (inputs.rejectionRiskPercent / 100);
  const summaryLevel = resolveSummaryLevel(toleranceUsage);
  const primaryDriver: CalibrationDriftRiskPrimaryDriver = "rejectionExposure";
  const message = resolveDecisionMessage(summaryLevel);

  return {
    toleranceUsage,
    rejectionExposure,
    summaryLevel,
    primaryDriver,
    decisionVerdict: {
      summaryLevel,
      primaryDriver,
      message,
    },
    warnings: [...validation.warnings],
  };
}
