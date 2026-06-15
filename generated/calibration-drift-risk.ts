// Auto-generated from calibration-drift-risk-schema.json
import * as z from 'zod';

export interface Calibration_drift_riskInput {
  calibration_interval_days: number;
  days_since_last_calibration: number;
  measurement_tolerance_pct: number;
  observed_drift_pct: number;
  environmental_stress_factor: string;
  criticality_level: string;
  historical_failure_rate: number;
  data_confidence_score: number;
}

export const Calibration_drift_riskInputSchema = z.object({
  calibration_interval_days: z.number().min(1).max(365).default(90),
  days_since_last_calibration: z.number().min(0).max(730).default(45),
  measurement_tolerance_pct: z.number().min(0.1).max(20).default(5),
  observed_drift_pct: z.number().min(0).max(25).default(2.3),
  environmental_stress_factor: z.enum(['low', 'moderate', 'high', 'extreme']).default('moderate'),
  criticality_level: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  historical_failure_rate: z.number().min(0).max(50).default(3),
  data_confidence_score: z.number().min(0).max(100).default(85),
});

function evaluateAllFormulas(input: Calibration_drift_riskInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["time_based_drift_factor"] = Math.min(1.0, input.days_since_last_calibration / input.calibration_interval_days); } catch { results["time_based_drift_factor"] = 0; }
  try { results["drift_margin_ratio"] = Math.min(1.5, input.observed_drift_pct / input.measurement_tolerance_pct); } catch { results["drift_margin_ratio"] = 0; }
  results["environmental_multiplier"] = 0;
  results["criticality_multiplier"] = 0;
  try { results["historical_failure_factor"] = Math.min(1.0, input.historical_failure_rate / 50.0); } catch { results["historical_failure_factor"] = 0; }
  try { results["drift_risk_index"] = 0.30 * (results["time_based_drift_factor"] ?? 0) + 0.25 * (results["drift_margin_ratio"] ?? 0) + 0.15 * (results["environmental_multiplier"] ?? 0) / 2.0 + 0.20 * (results["criticality_multiplier"] ?? 0) / 2.5 + 0.10 * (results["historical_failure_factor"] ?? 0); } catch { results["drift_risk_index"] = 0; }
  try { results["data_confidence_adjusted_risk"] = (results["drift_risk_index"] ?? 0) * (1 + (100 - input.data_confidence_score) / 200); } catch { results["data_confidence_adjusted_risk"] = 0; }
  return results;
}


export function calculateCalibration_drift_risk(input: Calibration_drift_riskInput): Calibration_drift_riskOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["drift_risk_index"] ?? 0;
  const breakdown = {
    time_based_drift_factor: values["time_based_drift_factor"] ?? 0,
    drift_margin_ratio: values["drift_margin_ratio"] ?? 0,
    environmental_multiplier: values["environmental_multiplier"] ?? 0,
    criticality_multiplier: values["criticality_multiplier"] ?? 0,
    historical_failure_factor: values["historical_failure_factor"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Unplanned Downtime Risk","Quality Defect Potential","Compliance Exposure","Calibration Cost Overrun"];
  const suggestedActions: string[] = ["Shorten Calibration Interval","Immediate Recalibration","Remove from Service","Improve Environmental Controls","Implement Redundant Measurement","Improve Data Confidence"];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-instrument comparison","Automated alerting"],
  };
}


export interface Calibration_drift_riskOutput {
  totalWasteCost: number;
  breakdown: { time_based_drift_factor: number; drift_margin_ratio: number; environmental_multiplier: number; criticality_multiplier: number; historical_failure_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
