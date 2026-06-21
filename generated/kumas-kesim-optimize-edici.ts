// Auto-generated from kumas-kesim-optimize-edici-schema.json
import * as z from 'zod';

export interface Kumas_kesim_optimize_ediciInput {
  TotalPatternArea: number;
  MarkerLength: number;
  FabricWidth: number;
  EndLossPct: number;
  PricePerMeter: number;
  NewEfficiency: number;
  OldEfficiency: number;
  Splices: number;
  OverlapLength: number;
  EndLoss: number;
  dataConfidence?: number;
}

export const Kumas_kesim_optimize_ediciInputSchema = z.object({
  TotalPatternArea: z.number().min(0).default(0),
  MarkerLength: z.number().min(0).default(0),
  FabricWidth: z.number().min(0).default(0),
  EndLossPct: z.number().min(0).default(0),
  PricePerMeter: z.number().min(0).default(0),
  NewEfficiency: z.number().min(0).default(0),
  OldEfficiency: z.number().min(0).default(0),
  Splices: z.number().min(0).default(0),
  OverlapLength: z.number().min(0).default(0),
  EndLoss: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kumas_kesim_optimize_ediciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.TotalPatternArea / (input.MarkerLength * input.FabricWidth)) * 100; results["MarkerEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MarkerEfficiency"] = Number.NaN; }
  try { const v = (input.TotalPatternArea / (toNumericFormulaValue(results["MarkerEfficiency"]))) * (1 + input.EndLossPct); results["FabricRequired"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FabricRequired"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["FabricRequired"])) * input.PricePerMeter; results["Cost_Fabric"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Fabric"] = Number.NaN; }
  try { const v = (input.NewEfficiency - input.OldEfficiency) * (toNumericFormulaValue(results["FabricRequired"])) * input.PricePerMeter; results["Utilization_Gain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Utilization_Gain"] = Number.NaN; }
  try { const v = input.Splices * input.OverlapLength * input.FabricWidth; results["SplicingLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SplicingLoss"] = Number.NaN; }
  try { const v = input.MarkerLength + input.EndLoss + (toNumericFormulaValue(results["SplicingLoss"])); results["TotalYardage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalYardage"] = Number.NaN; }
  return results;
}


export function calculateKumas_kesim_optimize_edici(input: Kumas_kesim_optimize_ediciInput): Kumas_kesim_optimize_ediciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalYardage"]);
  const breakdown = {
    MarkerEfficiency: toNumericFormulaValue(values["MarkerEfficiency"]),
    FabricRequired: toNumericFormulaValue(values["FabricRequired"]),
    Cost_Fabric: toNumericFormulaValue(values["Cost_Fabric"]),
    Utilization_Gain: toNumericFormulaValue(values["Utilization_Gain"]),
    SplicingLoss: toNumericFormulaValue(values["SplicingLoss"]),
    TotalYardage: toNumericFormulaValue(values["TotalYardage"])
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


export interface Kumas_kesim_optimize_ediciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { MarkerEfficiency: number; FabricRequired: number; Cost_Fabric: number; Utilization_Gain: number; SplicingLoss: number; TotalYardage: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kumas_kesim_optimize_ediciOutputMeta = {
  primaryKey: "TotalYardage",
  unit: "USD",
  breakdownKeys: ["MarkerEfficiency","FabricRequired","Cost_Fabric","Utilization_Gain","SplicingLoss","TotalYardage"],
} as const;

