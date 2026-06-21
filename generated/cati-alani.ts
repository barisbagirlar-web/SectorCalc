// Auto-generated from cati-alani-schema.json
import * as z from 'zod';

export interface Cati_alaniInput {
  Length: number;
  Width: number;
  Footprint: number;
  PitchAngle: number;
  Perimeter: number;
  OverhangWidth: number;
  Area_Roof: number;
  WasteFactor: number;
  MaterialWeight: number;
  TotalArea: number;
  GroundSnow: number;
  Exposure: number;
  Thermal: number;
  dataConfidence?: number;
}

export const Cati_alaniInputSchema = z.object({
  Length: z.number().min(0).default(0),
  Width: z.number().min(0).default(0),
  Footprint: z.number().min(0).default(0),
  PitchAngle: z.number().min(0).default(0),
  Perimeter: z.number().min(0).default(0),
  OverhangWidth: z.number().min(0).default(0),
  Area_Roof: z.number().min(0).default(0),
  WasteFactor: z.number().min(0).default(0),
  MaterialWeight: z.number().min(0).default(0),
  TotalArea: z.number().min(0).default(0),
  GroundSnow: z.number().min(0).default(0),
  Exposure: z.number().min(0).default(0),
  Thermal: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cati_alaniInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Length * input.Width; results["Area_Footprint"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Area_Footprint"] = Number.NaN; }
  results["Area_Gable"] = Number.NaN;
  try { const v = input.Perimeter * input.OverhangWidth; results["OverhangArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OverhangArea"] = Number.NaN; }
  try { const v = input.Area_Roof * (1 + input.WasteFactor); results["TotalMaterialArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalMaterialArea"] = Number.NaN; }
  try { const v = input.Length - input.Width + (input.Width * Math.sqrt(2)); results["RidgeLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RidgeLength"] = Number.NaN; }
  try { const v = input.MaterialWeight * input.TotalArea; results["Load_Dead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Load_Dead"] = Number.NaN; }
  results["Load_Snow"] = Number.NaN;
  return results;
}


export function calculateCati_alani(input: Cati_alaniInput): Cati_alaniOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Load_Snow"]);
  const breakdown = {
    Area_Footprint: toNumericFormulaValue(values["Area_Footprint"]),
    Area_Gable: toNumericFormulaValue(values["Area_Gable"]),
    OverhangArea: toNumericFormulaValue(values["OverhangArea"]),
    TotalMaterialArea: toNumericFormulaValue(values["TotalMaterialArea"]),
    RidgeLength: toNumericFormulaValue(values["RidgeLength"]),
    Load_Dead: toNumericFormulaValue(values["Load_Dead"]),
    Load_Snow: toNumericFormulaValue(values["Load_Snow"])
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


export interface Cati_alaniOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Area_Footprint: number; Area_Gable: number; OverhangArea: number; TotalMaterialArea: number; RidgeLength: number; Load_Dead: number; Load_Snow: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cati_alaniOutputMeta = {
  primaryKey: "Load_Snow",
  unit: "USD",
  breakdownKeys: ["Area_Footprint","Area_Gable","OverhangArea","TotalMaterialArea","RidgeLength","Load_Dead","Load_Snow"],
} as const;

