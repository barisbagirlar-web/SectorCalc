// Auto-generated from gubre-dozaj-schema.json
import * as z from 'zod';

export interface Gubre_dozajInput {
  YieldTarget: number;
  RemRate: number;
  SoilTest: number;
  ConvFactor: number;
  Eff: number;
  ContentPct: number;
  Area: number;
  Price: number;
  Uptake: number;
  Leach: number;
  YieldInc: number;
  CropPrice: number;
  BaseRate: number;
  ZoneFactor: number;
  dataConfidence?: number;
}

export const Gubre_dozajInputSchema = z.object({
  YieldTarget: z.number().min(0).default(0),
  RemRate: z.number().min(0).default(0),
  SoilTest: z.number().min(0).default(0),
  ConvFactor: z.number().min(0).default(0),
  Eff: z.number().min(0).default(0),
  ContentPct: z.number().min(0).default(0),
  Area: z.number().min(0).default(0),
  Price: z.number().min(0).default(0),
  Uptake: z.number().min(0).default(0),
  Leach: z.number().min(0).default(0),
  YieldInc: z.number().min(0).default(0),
  CropPrice: z.number().min(0).default(0),
  BaseRate: z.number().min(0).default(0),
  ZoneFactor: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gubre_dozajInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.YieldTarget * input.RemRate; results["NutReq"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NutReq"] = Number.NaN; }
  try { const v = input.SoilTest * input.ConvFactor; results["SoilSupp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SoilSupp"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["NutReq"])) - (toNumericFormulaValue(results["SoilSupp"]))) / input.Eff; results["FertNeed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FertNeed"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["FertNeed"])) / input.ContentPct; results["AppRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AppRate"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["AppRate"])) * input.Area * input.Price; results["Cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["AppRate"])) - input.Uptake) * input.Leach; results["EnvRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EnvRisk"] = Number.NaN; }
  try { const v = (input.YieldInc * input.CropPrice - (toNumericFormulaValue(results["Cost"]))) / (toNumericFormulaValue(results["Cost"])); results["ROI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI"] = Number.NaN; }
  try { const v = input.BaseRate * (1 + input.ZoneFactor); results["Precision"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Precision"] = Number.NaN; }
  return results;
}


export function calculateGubre_dozaj(input: Gubre_dozajInput): Gubre_dozajOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Precision"]);
  const breakdown = {
    NutReq: toNumericFormulaValue(values["NutReq"]),
    SoilSupp: toNumericFormulaValue(values["SoilSupp"]),
    FertNeed: toNumericFormulaValue(values["FertNeed"]),
    AppRate: toNumericFormulaValue(values["AppRate"]),
    Cost: toNumericFormulaValue(values["Cost"]),
    EnvRisk: toNumericFormulaValue(values["EnvRisk"]),
    ROI: toNumericFormulaValue(values["ROI"]),
    Precision: toNumericFormulaValue(values["Precision"])
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


export interface Gubre_dozajOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { NutReq: number; SoilSupp: number; FertNeed: number; AppRate: number; Cost: number; EnvRisk: number; ROI: number; Precision: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gubre_dozajOutputMeta = {
  primaryKey: "Precision",
  unit: "USD",
  breakdownKeys: ["NutReq","SoilSupp","FertNeed","AppRate","Cost","EnvRisk","ROI","Precision"],
} as const;

