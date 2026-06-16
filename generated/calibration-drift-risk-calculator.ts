// Auto-generated from calibration-drift-risk-calculator-schema.json
import * as z from 'zod';

export interface Calibration_drift_risk_calculatorInput {
  calibration_interval_days: number;
  days_since_last_calibration: number;
  measurement_tolerance_pct: number;
  observed_drift_pct: number;
  environmental_stress_factor: string;
  criticality_level: string;
  historical_failure_rate: number;
  data_confidence_score: number;
}

export const Calibration_drift_risk_calculatorInputSchema = z.object({
  calibration_interval_days: z.number().min(1).max(365).default(90),
  days_since_last_calibration: z.number().min(0).max(730).default(45),
  measurement_tolerance_pct: z.number().min(0.1).max(20).default(5),
  observed_drift_pct: z.number().min(0).max(25).default(2.3),
  environmental_stress_factor: z.enum(['low', 'moderate', 'high', 'extreme']).default('moderate'),
  criticality_level: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  historical_failure_rate: z.number().min(0).max(50).default(3),
  data_confidence_score: z.number().min(0).max(100).default(85),
});

function evaluateAllFormulas(input: Calibration_drift_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(1.0, input.days_since_last_calibration / input.calibration_interval_days); results["time_based_drift_factor"] = Number.isFinite(v) ? v : 0; } catch { results["time_based_drift_factor"] = 0; }
  try { const v = Math.min(1.5, input.observed_drift_pct / input.measurement_tolerance_pct); results["drift_margin_ratio"] = Number.isFinite(v) ? v : 0; } catch { results["drift_margin_ratio"] = 0; }
  try { const v = (input.environmental_stress_factor === 'low' ? 1.0 : (input.environmental_stress_factor === 'moderate' ? 1.2 : (input.environmental_stress_factor === 'high' ? 1.5 : (input.environmental_stress_factor === 'extreme' ? 2.0 : 1.2)))); results["environmental_multiplier"] = Number.isFinite(v) ? v : 0; } catch { results["environmental_multiplier"] = 0; }
  try { const v = (input.criticality_level === 'low' ? 1.0 : (input.criticality_level === 'medium' ? 1.3 : (input.criticality_level === 'high' ? 1.7 : (input.criticality_level === 'critical' ? 2.5 : 1.3)))); results["criticality_multiplier"] = Number.isFinite(v) ? v : 0; } catch { results["criticality_multiplier"] = 0; }
  try { const v = Math.min(1.0, input.historical_failure_rate / 50.0); results["historical_failure_factor"] = Number.isFinite(v) ? v : 0; } catch { results["historical_failure_factor"] = 0; }
  try { const v = 0.30 * (results["time_based_drift_factor"] ?? 0) + 0.25 * (results["drift_margin_ratio"] ?? 0) + 0.15 * (results["environmental_multiplier"] ?? 0) / 2.0 + 0.20 * (results["criticality_multiplier"] ?? 0) / 2.5 + 0.10 * (results["historical_failure_factor"] ?? 0); results["drift_risk_index"] = Number.isFinite(v) ? v : 0; } catch { results["drift_risk_index"] = 0; }
  try { const v = (results["drift_risk_index"] ?? 0) * (1 + (100 - input.data_confidence_score) / 200); results["data_confidence_adjusted_risk"] = Number.isFinite(v) ? v : 0; } catch { results["data_confidence_adjusted_risk"] = 0; }
  return results;
}


export function calculateCalibration_drift_risk_calculator(input: Calibration_drift_risk_calculatorInput): Calibration_drift_risk_calculatorOutput {
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


export interface Calibration_drift_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: { time_based_drift_factor: number; drift_margin_ratio: number; environmental_multiplier: number; criticality_multiplier: number; historical_failure_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
