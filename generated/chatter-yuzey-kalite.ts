// Auto-generated from chatter-yuzey-kalite-schema.json
import * as z from 'zod';

export interface Chatter_yuzey_kaliteInput {
  D: number;
  n: number;
  V_f: number;
  z: number;
  r_epsilon: number;
  Theo: number;
  ChatterAmplification: number;
  Actual: number;
  ToleranceLimit: number;
  ReworkCostPerMicron: number;
  MaxTolerance: number;
  BatchSize: number;
  dataConfidence?: number;
}

export const Chatter_yuzey_kaliteInputSchema = z.object({
  D: z.number().min(0).default(0),
  n: z.number().min(0).default(0),
  V_f: z.number().min(0).default(0),
  z: z.number().min(0).default(0),
  r_epsilon: z.number().min(0).default(0),
  Theo: z.number().min(0).default(0),
  ChatterAmplification: z.number().min(0).default(0),
  Actual: z.number().min(0).default(0),
  ToleranceLimit: z.number().min(0).default(0),
  ReworkCostPerMicron: z.number().min(0).default(0),
  MaxTolerance: z.number().min(0).default(0),
  BatchSize: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Chatter_yuzey_kaliteInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.PI * input.D * input.n) / 1000; results["V_c"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["V_c"] = Number.NaN; }
  try { const v = input.V_f / (input.z * input.n); results["f_z"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["f_z"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["f_z"]))**2 / (8 * input.r_epsilon); results["SurfaceRoughness_Theo"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SurfaceRoughness_Theo"] = Number.NaN; }
  try { const v = input.Theo * input.ChatterAmplification; results["SurfaceRoughness_Actual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SurfaceRoughness_Actual"] = Number.NaN; }
  try { const v = (input.Actual - input.ToleranceLimit) * input.ReworkCostPerMicron; results["QualityLossCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["QualityLossCost"] = Number.NaN; }
  try { const v = ((input.Actual > input.MaxTolerance) ? (1) : (0)) * input.BatchSize; results["ScrapRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ScrapRate"] = Number.NaN; }
  return results;
}


export function calculateChatter_yuzey_kalite(input: Chatter_yuzey_kaliteInput): Chatter_yuzey_kaliteOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ScrapRate"]);
  const breakdown = {
    V_c: toNumericFormulaValue(values["V_c"]),
    f_z: toNumericFormulaValue(values["f_z"]),
    SurfaceRoughness_Theo: toNumericFormulaValue(values["SurfaceRoughness_Theo"]),
    SurfaceRoughness_Actual: toNumericFormulaValue(values["SurfaceRoughness_Actual"]),
    QualityLossCost: toNumericFormulaValue(values["QualityLossCost"]),
    ScrapRate: toNumericFormulaValue(values["ScrapRate"])
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


export interface Chatter_yuzey_kaliteOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { V_c: number; f_z: number; SurfaceRoughness_Theo: number; SurfaceRoughness_Actual: number; QualityLossCost: number; ScrapRate: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Chatter_yuzey_kaliteOutputMeta = {
  primaryKey: "ScrapRate",
  unit: "USD",
  breakdownKeys: ["V_c","f_z","SurfaceRoughness_Theo","SurfaceRoughness_Actual","QualityLossCost","ScrapRate"],
} as const;

