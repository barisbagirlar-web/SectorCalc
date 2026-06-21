// Auto-generated from depo-yerlesimi-schema.json
import * as z from 'zod';

export interface Depo_yerlesimiInput {
  Footprint: number;
  UtilRate: number;
  PalletFootprint: number;
  AisleFactor: number;
  RackLevels: number;
  Doors: number;
  Turnaround_Load: number;
  Turnaround_Unload: number;
  Freq: number;
  Dist: number;
  Lines: number;
  TravelTime: number;
  ActualVol: number;
  RackVol: number;
  FacilityCost: number;
  dataConfidence?: number;
}

export const Depo_yerlesimiInputSchema = z.object({
  Footprint: z.number().min(0).default(0),
  UtilRate: z.number().min(0).default(0),
  PalletFootprint: z.number().min(0).default(0),
  AisleFactor: z.number().min(0).default(0),
  RackLevels: z.number().min(0).default(0),
  Doors: z.number().min(0).default(0),
  Turnaround_Load: z.number().min(0).default(0),
  Turnaround_Unload: z.number().min(0).default(0),
  Freq: z.number().min(0).default(0),
  Dist: z.number().min(0).default(0),
  Lines: z.number().min(0).default(0),
  TravelTime: z.number().min(0).default(0),
  ActualVol: z.number().min(0).default(0),
  RackVol: z.number().min(0).default(0),
  FacilityCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Depo_yerlesimiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Footprint * input.UtilRate; results["StorageArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["StorageArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["StorageArea"])) / (input.PalletFootprint * input.AisleFactor); results["PalletPositions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PalletPositions"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["PalletPositions"])) * input.RackLevels; results["VerticalCap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["VerticalCap"] = Number.NaN; }
  try { const v = input.Doors / (input.Turnaround_Load + input.Turnaround_Unload); results["ThroughputCap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ThroughputCap"] = Number.NaN; }
  results["TravelDist"] = Number.NaN;
  try { const v = input.Lines / input.TravelTime; results["PickEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PickEfficiency"] = Number.NaN; }
  try { const v = input.ActualVol / input.RackVol; results["CubeUtil"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CubeUtil"] = Number.NaN; }
  try { const v = input.FacilityCost / (toNumericFormulaValue(results["PalletPositions"])); results["CostPerPos"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerPos"] = Number.NaN; }
  return results;
}


export function calculateDepo_yerlesimi(input: Depo_yerlesimiInput): Depo_yerlesimiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CostPerPos"]);
  const breakdown = {
    StorageArea: toNumericFormulaValue(values["StorageArea"]),
    PalletPositions: toNumericFormulaValue(values["PalletPositions"]),
    VerticalCap: toNumericFormulaValue(values["VerticalCap"]),
    ThroughputCap: toNumericFormulaValue(values["ThroughputCap"]),
    TravelDist: toNumericFormulaValue(values["TravelDist"]),
    PickEfficiency: toNumericFormulaValue(values["PickEfficiency"]),
    CubeUtil: toNumericFormulaValue(values["CubeUtil"]),
    CostPerPos: toNumericFormulaValue(values["CostPerPos"])
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


export interface Depo_yerlesimiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { StorageArea: number; PalletPositions: number; VerticalCap: number; ThroughputCap: number; TravelDist: number; PickEfficiency: number; CubeUtil: number; CostPerPos: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Depo_yerlesimiOutputMeta = {
  primaryKey: "CostPerPos",
  unit: "USD",
  breakdownKeys: ["StorageArea","PalletPositions","VerticalCap","ThroughputCap","TravelDist","PickEfficiency","CubeUtil","CostPerPos"],
} as const;

