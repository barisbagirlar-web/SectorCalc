// Auto-generated from su-kullanimi-optimize-edici-schema.json
import * as z from 'zod';

export interface Su_kullanimi_optimize_ediciInput {
  TotalWaterConsumed: number;
  ProductionVolume: number;
  HistoricalAvg: number;
  ActualConsumption: number;
  WaterSupplyRate: number;
  WastewaterTreatmentRate: number;
  RecycledWater: number;
  TotalSupplied: number;
  TotalMetered: number;
  EquipmentCost: number;
  InstallationCost: number;
  TotalConsumed: number;
  EnergyIntensity_Water: number;
  GridEmissionFactor: number;
  dataConfidence?: number;
}

export const Su_kullanimi_optimize_ediciInputSchema = z.object({
  TotalWaterConsumed: z.number().min(0).default(0),
  ProductionVolume: z.number().min(0).default(0),
  HistoricalAvg: z.number().min(0).default(0),
  ActualConsumption: z.number().min(0).default(0),
  WaterSupplyRate: z.number().min(0).default(0),
  WastewaterTreatmentRate: z.number().min(0).default(0),
  RecycledWater: z.number().min(0).default(0),
  TotalSupplied: z.number().min(0).default(0),
  TotalMetered: z.number().min(0).default(0),
  EquipmentCost: z.number().min(0).default(0),
  InstallationCost: z.number().min(0).default(0),
  TotalConsumed: z.number().min(0).default(0),
  EnergyIntensity_Water: z.number().min(0).default(0),
  GridEmissionFactor: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Su_kullanimi_optimize_ediciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.TotalWaterConsumed / input.ProductionVolume; results["WaterIntensity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["WaterIntensity"] = Number.NaN; }
  try { const v = input.HistoricalAvg * input.ProductionVolume; results["BaselineConsumption"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BaselineConsumption"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["BaselineConsumption"])) - input.ActualConsumption; results["WaterSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["WaterSavings"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["WaterSavings"])) * (input.WaterSupplyRate + input.WastewaterTreatmentRate); results["CostSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostSavings"] = Number.NaN; }
  try { const v = input.RecycledWater / input.TotalWaterConsumed; results["RecycleRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RecycleRate"] = Number.NaN; }
  try { const v = input.TotalSupplied - input.TotalMetered; results["LeakLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LeakLoss"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["CostSavings"])) / (input.EquipmentCost + input.InstallationCost); results["ROI_Water"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI_Water"] = Number.NaN; }
  try { const v = input.TotalConsumed * input.EnergyIntensity_Water * input.GridEmissionFactor; results["CarbonFootprint_Water"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CarbonFootprint_Water"] = Number.NaN; }
  return results;
}


export function calculateSu_kullanimi_optimize_edici(input: Su_kullanimi_optimize_ediciInput): Su_kullanimi_optimize_ediciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CarbonFootprint_Water"]);
  const breakdown = {
    WaterIntensity: toNumericFormulaValue(values["WaterIntensity"]),
    BaselineConsumption: toNumericFormulaValue(values["BaselineConsumption"]),
    WaterSavings: toNumericFormulaValue(values["WaterSavings"]),
    CostSavings: toNumericFormulaValue(values["CostSavings"]),
    RecycleRate: toNumericFormulaValue(values["RecycleRate"]),
    LeakLoss: toNumericFormulaValue(values["LeakLoss"]),
    ROI_Water: toNumericFormulaValue(values["ROI_Water"]),
    CarbonFootprint_Water: toNumericFormulaValue(values["CarbonFootprint_Water"])
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


export interface Su_kullanimi_optimize_ediciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { WaterIntensity: number; BaselineConsumption: number; WaterSavings: number; CostSavings: number; RecycleRate: number; LeakLoss: number; ROI_Water: number; CarbonFootprint_Water: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Su_kullanimi_optimize_ediciOutputMeta = {
  primaryKey: "CarbonFootprint_Water",
  unit: "USD",
  breakdownKeys: ["WaterIntensity","BaselineConsumption","WaterSavings","CostSavings","RecycleRate","LeakLoss","ROI_Water","CarbonFootprint_Water"],
} as const;

