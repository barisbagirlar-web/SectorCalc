// Auto-generated from faiz-orani-riski-schema.json
import * as z from 'zod';

export interface Faiz_orani_riskiInput {
  FloatingDebt: number;
  HedgeRatio: number;
  BpsChange: number;
  AssetDur: number;
  LiabDur: number;
  AssetVal: number;
  RateChange: number;
  Inc: number;
  EarningAssets: number;
  PortVal: number;
  Volatility: number;
  Z: number;
  Notional: number;
  SwapSpread: number;
  Fixed: number;
  Floating_Curr: number;
  dataConfidence?: number;
}

export const Faiz_orani_riskiInputSchema = z.object({
  FloatingDebt: z.number().min(0).default(0),
  HedgeRatio: z.number().min(0).default(0),
  BpsChange: z.number().min(0).default(0),
  AssetDur: z.number().min(0).default(0),
  LiabDur: z.number().min(0).default(0),
  AssetVal: z.number().min(0).default(0),
  RateChange: z.number().min(0).default(0),
  Inc: z.number().min(0).default(0),
  EarningAssets: z.number().min(0).default(0),
  PortVal: z.number().min(0).default(0),
  Volatility: z.number().min(0).default(0),
  Z: z.number().min(0).default(0),
  Notional: z.number().min(0).default(0),
  SwapSpread: z.number().min(0).default(0),
  Fixed: z.number().min(0).default(0),
  Floating_Curr: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Faiz_orani_riskiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.FloatingDebt * (1 - input.HedgeRatio); results["Exposure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Exposure"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Exposure"])) * input.BpsChange / 10000; results["ShockImpact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ShockImpact"] = Number.NaN; }
  try { const v = input.AssetDur - input.LiabDur; results["DurGap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DurGap"] = Number.NaN; }
  try { const v = -(toNumericFormulaValue(results["DurGap"])) * input.AssetVal * input.RateChange; results["EVE_Change"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EVE_Change"] = Number.NaN; }
  results["NIM"] = Number.NaN;
  try { const v = input.PortVal * input.Volatility * input.Z; results["VaR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["VaR"] = Number.NaN; }
  try { const v = input.Notional * input.SwapSpread; results["HedgeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["HedgeCost"] = Number.NaN; }
  try { const v = input.Fixed - input.Floating_Curr; results["BreakEven"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BreakEven"] = Number.NaN; }
  return results;
}


export function calculateFaiz_orani_riski(input: Faiz_orani_riskiInput): Faiz_orani_riskiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["BreakEven"]);
  const breakdown = {
    Exposure: toNumericFormulaValue(values["Exposure"]),
    ShockImpact: toNumericFormulaValue(values["ShockImpact"]),
    DurGap: toNumericFormulaValue(values["DurGap"]),
    EVE_Change: toNumericFormulaValue(values["EVE_Change"]),
    NIM: toNumericFormulaValue(values["NIM"]),
    VaR: toNumericFormulaValue(values["VaR"]),
    HedgeCost: toNumericFormulaValue(values["HedgeCost"]),
    BreakEven: toNumericFormulaValue(values["BreakEven"])
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


export interface Faiz_orani_riskiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Exposure: number; ShockImpact: number; DurGap: number; EVE_Change: number; NIM: number; VaR: number; HedgeCost: number; BreakEven: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Faiz_orani_riskiOutputMeta = {
  primaryKey: "BreakEven",
  unit: "USD",
  breakdownKeys: ["Exposure","ShockImpact","DurGap","EVE_Change","NIM","VaR","HedgeCost","BreakEven"],
} as const;

