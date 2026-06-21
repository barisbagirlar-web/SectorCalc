// Auto-generated from talep-forecast-stok-maliyet-schema.json
import * as z from 'zod';

export interface Talep_forecast_stok_maliyetInput {
  ActualDemand: number;
  ForecastDemand: number;
  Z_Score: number;
  StdDev_ForecastError: number;
  LeadTime: number;
  UnitCost: number;
  HoldingRate: number;
  PenaltyCost: number;
  ForecastingSystemCost: number;
  dataConfidence?: number;
}

export const Talep_forecast_stok_maliyetInputSchema = z.object({
  ActualDemand: z.number().min(0).default(0),
  ForecastDemand: z.number().min(0).default(0),
  Z_Score: z.number().min(0).default(0),
  StdDev_ForecastError: z.number().min(0).default(0),
  LeadTime: z.number().min(0).default(0),
  UnitCost: z.number().min(0).default(0),
  HoldingRate: z.number().min(0).default(0),
  PenaltyCost: z.number().min(0).default(0),
  ForecastingSystemCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Talep_forecast_stok_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.abs(input.ActualDemand - input.ForecastDemand) / input.ActualDemand; results["ForecastError"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ForecastError"] = Number.NaN; }
  try { const v = input.Z_Score * input.StdDev_ForecastError * Math.sqrt(input.LeadTime); results["SafetyStock"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SafetyStock"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["SafetyStock"])) * input.UnitCost * input.HoldingRate; results["CarryingCost_Safety"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CarryingCost_Safety"] = Number.NaN; }
  try { const v = ((input.ActualDemand > (input.ForecastDemand + (toNumericFormulaValue(results["SafetyStock"])))) ? ((input.ActualDemand - input.ForecastDemand - (toNumericFormulaValue(results["SafetyStock"]))) * input.PenaltyCost) : (0)); results["StockoutCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["StockoutCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["CarryingCost_Safety"])) + (toNumericFormulaValue(results["StockoutCost"])) + input.ForecastingSystemCost; results["TotalForecastCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalForecastCost"] = Number.NaN; }
  return results;
}


export function calculateTalep_forecast_stok_maliyet(input: Talep_forecast_stok_maliyetInput): Talep_forecast_stok_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalForecastCost"]);
  const breakdown = {
    ForecastError: toNumericFormulaValue(values["ForecastError"]),
    SafetyStock: toNumericFormulaValue(values["SafetyStock"]),
    CarryingCost_Safety: toNumericFormulaValue(values["CarryingCost_Safety"]),
    StockoutCost: toNumericFormulaValue(values["StockoutCost"]),
    TotalForecastCost: toNumericFormulaValue(values["TotalForecastCost"])
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


export interface Talep_forecast_stok_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ForecastError: number; SafetyStock: number; CarryingCost_Safety: number; StockoutCost: number; TotalForecastCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Talep_forecast_stok_maliyetOutputMeta = {
  primaryKey: "TotalForecastCost",
  unit: "USD",
  breakdownKeys: ["ForecastError","SafetyStock","CarryingCost_Safety","StockoutCost","TotalForecastCost"],
} as const;

