// Auto-generated from kur-riski-schema.json
import * as z from 'zod';

export interface Kur_riskiInput {
  TotalRevenue_FC: number;
  TotalCost_FC: number;
  StdDev_ExchangeRate: number;
  Z_Score: number;
  Volatility: number;
  TimeHorizon: number;
  HedgeRatio: number;
  Notional: number;
  ForwardPoints: number;
  SpotRate: number;
  ForwardRate: number;
  dataConfidence?: number;
}

export const Kur_riskiInputSchema = z.object({
  TotalRevenue_FC: z.number().min(0).default(0),
  TotalCost_FC: z.number().min(0).default(0),
  StdDev_ExchangeRate: z.number().min(0).default(0),
  Z_Score: z.number().min(0).default(0),
  Volatility: z.number().min(0).default(0),
  TimeHorizon: z.number().min(0).default(0),
  HedgeRatio: z.number().min(0).default(0),
  Notional: z.number().min(0).default(0),
  ForwardPoints: z.number().min(0).default(0),
  SpotRate: z.number().min(0).default(0),
  ForwardRate: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kur_riskiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.TotalRevenue_FC - input.TotalCost_FC; results["Exposure_FC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Exposure_FC"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Exposure_FC"])) * input.StdDev_ExchangeRate * input.Z_Score; results["VaR_Historical"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["VaR_Historical"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Exposure_FC"])) * input.Volatility * Math.sqrt(input.TimeHorizon); results["VaR_Parametric"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["VaR_Parametric"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Exposure_FC"])) * input.HedgeRatio; results["HedgedExposure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["HedgedExposure"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["VaR_Historical"])) * (1 - input.HedgeRatio); results["UnhedgedVaR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["UnhedgedVaR"] = Number.NaN; }
  try { const v = input.Notional * input.ForwardPoints; results["CostOfHedge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostOfHedge"] = Number.NaN; }
  try { const v = (input.SpotRate - input.ForwardRate) * (toNumericFormulaValue(results["HedgedExposure"])); results["NetImpact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NetImpact"] = Number.NaN; }
  return results;
}


export function calculateKur_riski(input: Kur_riskiInput): Kur_riskiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["NetImpact"]);
  const breakdown = {
    Exposure_FC: toNumericFormulaValue(values["Exposure_FC"]),
    VaR_Historical: toNumericFormulaValue(values["VaR_Historical"]),
    VaR_Parametric: toNumericFormulaValue(values["VaR_Parametric"]),
    HedgedExposure: toNumericFormulaValue(values["HedgedExposure"]),
    UnhedgedVaR: toNumericFormulaValue(values["UnhedgedVaR"]),
    CostOfHedge: toNumericFormulaValue(values["CostOfHedge"]),
    NetImpact: toNumericFormulaValue(values["NetImpact"])
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


export interface Kur_riskiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Exposure_FC: number; VaR_Historical: number; VaR_Parametric: number; HedgedExposure: number; UnhedgedVaR: number; CostOfHedge: number; NetImpact: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kur_riskiOutputMeta = {
  primaryKey: "NetImpact",
  unit: "USD",
  breakdownKeys: ["Exposure_FC","VaR_Historical","VaR_Parametric","HedgedExposure","UnhedgedVaR","CostOfHedge","NetImpact"],
} as const;

