// Auto-generated from digital-twin-maliyet-schema.json
import * as z from 'zod';

export interface Digital_twin_maliyetInput {
  Prototyping: number;
  FieldTest: number;
  Downtime: number;
  Travel: number;
  License: number;
  Compute: number;
  Sensor: number;
  Modeling: number;
  PhysCycle: number;
  DigCycle: number;
  Iterations: number;
  DailyRev: number;
  DefectReduction: number;
  WarrantyCost: number;
  Volume: number;
  dataConfidence?: number;
}

export const Digital_twin_maliyetInputSchema = z.object({
  Prototyping: z.number().min(0).default(0),
  FieldTest: z.number().min(0).default(0),
  Downtime: z.number().min(0).default(0),
  Travel: z.number().min(0).default(0),
  License: z.number().min(0).default(0),
  Compute: z.number().min(0).default(0),
  Sensor: z.number().min(0).default(0),
  Modeling: z.number().min(0).default(0),
  PhysCycle: z.number().min(0).default(0),
  DigCycle: z.number().min(0).default(0),
  Iterations: z.number().min(0).default(0),
  DailyRev: z.number().min(0).default(0),
  DefectReduction: z.number().min(0).default(0),
  WarrantyCost: z.number().min(0).default(0),
  Volume: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Digital_twin_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Prototyping + input.FieldTest + input.Downtime + input.Travel; results["Cost_Trad"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Trad"] = Number.NaN; }
  try { const v = input.License + input.Compute + input.Sensor + input.Modeling; results["Cost_DT"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_DT"] = Number.NaN; }
  try { const v = (input.PhysCycle - input.DigCycle) * input.Iterations; results["TimeGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TimeGain"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TimeGain"])) * input.DailyRev; results["RevenueGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RevenueGain"] = Number.NaN; }
  try { const v = input.DefectReduction * input.WarrantyCost * input.Volume; results["QualitySavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["QualitySavings"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["Cost_Trad"])) - (toNumericFormulaValue(results["Cost_DT"])) + (toNumericFormulaValue(results["RevenueGain"])) + (toNumericFormulaValue(results["QualitySavings"]))) / (toNumericFormulaValue(results["Cost_DT"])); results["ROI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI"] = Number.NaN; }
  return results;
}


export function calculateDigital_twin_maliyet(input: Digital_twin_maliyetInput): Digital_twin_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ROI"]);
  const breakdown = {
    Cost_Trad: toNumericFormulaValue(values["Cost_Trad"]),
    Cost_DT: toNumericFormulaValue(values["Cost_DT"]),
    TimeGain: toNumericFormulaValue(values["TimeGain"]),
    RevenueGain: toNumericFormulaValue(values["RevenueGain"]),
    QualitySavings: toNumericFormulaValue(values["QualitySavings"]),
    ROI: toNumericFormulaValue(values["ROI"])
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


export interface Digital_twin_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Cost_Trad: number; Cost_DT: number; TimeGain: number; RevenueGain: number; QualitySavings: number; ROI: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Digital_twin_maliyetOutputMeta = {
  primaryKey: "ROI",
  unit: "USD",
  breakdownKeys: ["Cost_Trad","Cost_DT","TimeGain","RevenueGain","QualitySavings","ROI"],
} as const;

