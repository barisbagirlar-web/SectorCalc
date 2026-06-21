// Auto-generated from calibration-sapma-schema.json
import * as z from 'zod';

export interface Calibration_sapmaInput {
  LastError: number;
  PrevError: number;
  TimeBetween: number;
  TimeSinceLast: number;
  BaseUncertainty: number;
  EnvFactor: number;
  Tolerance: number;
  Criticality: number;
  UsageFreq: number;
  BaseInterval: number;
  ExpandedUncertainty: number;
  k: number;
  dataConfidence?: number;
}

export const Calibration_sapmaInputSchema = z.object({
  LastError: z.number().min(0).default(0),
  PrevError: z.number().min(0).default(0),
  TimeBetween: z.number().min(0).default(0),
  TimeSinceLast: z.number().min(0).default(0),
  BaseUncertainty: z.number().min(0).default(0),
  EnvFactor: z.number().min(0).default(0),
  Tolerance: z.number().min(0).default(0),
  Criticality: z.number().min(0).default(0),
  UsageFreq: z.number().min(0).default(0),
  BaseInterval: z.number().min(0).default(0),
  ExpandedUncertainty: z.number().min(0).default(0),
  k: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Calibration_sapmaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.LastError - input.PrevError) / input.TimeBetween; results["DriftRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DriftRate"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["DriftRate"])) * input.TimeSinceLast; results["PredictedDrift"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PredictedDrift"] = Number.NaN; }
  try { const v = Math.sqrt(input.BaseUncertainty**2 + (toNumericFormulaValue(results["PredictedDrift"]))**2 + input.EnvFactor**2); results["CurrentUncertainty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CurrentUncertainty"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["CurrentUncertainty"])) / input.Tolerance) * input.Criticality * input.UsageFreq; results["RiskScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RiskScore"] = Number.NaN; }
  try { const v = input.BaseInterval * (input.Tolerance / (toNumericFormulaValue(results["CurrentUncertainty"]))); results["OptimalInterval"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OptimalInterval"] = Number.NaN; }
  try { const v = input.ExpandedUncertainty * input.k; results["GuardBand"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["GuardBand"] = Number.NaN; }
  return results;
}


export function calculateCalibration_sapma(input: Calibration_sapmaInput): Calibration_sapmaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["GuardBand"]);
  const breakdown = {
    DriftRate: toNumericFormulaValue(values["DriftRate"]),
    PredictedDrift: toNumericFormulaValue(values["PredictedDrift"]),
    CurrentUncertainty: toNumericFormulaValue(values["CurrentUncertainty"]),
    RiskScore: toNumericFormulaValue(values["RiskScore"]),
    OptimalInterval: toNumericFormulaValue(values["OptimalInterval"]),
    GuardBand: toNumericFormulaValue(values["GuardBand"])
  };
  const hiddenLossDrivers: string[] = ["Verify assumptions with real data","Cross-check with industry benchmarks"];
  const suggestedActions: string[] = ["Run sensitivity analysis","Review assumptions with domain expert"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report","Action plan"],
  };
}


export interface Calibration_sapmaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { DriftRate: number; PredictedDrift: number; CurrentUncertainty: number; RiskScore: number; OptimalInterval: number; GuardBand: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Calibration_sapmaOutputMeta = {
  primaryKey: "GuardBand",
  unit: "USD",
  breakdownKeys: ["DriftRate","PredictedDrift","CurrentUncertainty","RiskScore","OptimalInterval","GuardBand"],
} as const;

