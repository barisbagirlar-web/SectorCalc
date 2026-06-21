// Auto-generated from basabas-noktasi-schema.json
import * as z from 'zod';

export interface Basabas_noktasiInput {
  FixedCosts: number;
  UnitPrice: number;
  UnitVariableCost: number;
  ActualSales: number;
  ContributionMargin: number;
  NetOperatingIncome: number;
  TargetProfit: number;
  UnitContributionMargin: number;
  dataConfidence?: number;
}

export const Basabas_noktasiInputSchema = z.object({
  FixedCosts: z.number().min(0).default(0),
  UnitPrice: z.number().min(0).default(0),
  UnitVariableCost: z.number().min(0).default(0),
  ActualSales: z.number().min(0).default(0),
  ContributionMargin: z.number().min(0).default(0),
  NetOperatingIncome: z.number().min(0).default(0),
  TargetProfit: z.number().min(0).default(0),
  UnitContributionMargin: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Basabas_noktasiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.FixedCosts / (input.UnitPrice - input.UnitVariableCost); results["BEP_Units"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BEP_Units"] = Number.NaN; }
  try { const v = input.FixedCosts / (toNumericFormulaValue(results["CMR"])); results["BEP_Revenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BEP_Revenue"] = Number.NaN; }
  try { const v = (input.UnitPrice - input.UnitVariableCost) / input.UnitPrice; results["CMR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CMR"] = Number.NaN; }
  try { const v = (input.ActualSales - (toNumericFormulaValue(results["BEP_Units"]))) / input.ActualSales * 100; results["MarginOfSafety_Percent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MarginOfSafety_Percent"] = Number.NaN; }
  try { const v = input.ContributionMargin / input.NetOperatingIncome; results["OperatingLeverage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OperatingLeverage"] = Number.NaN; }
  try { const v = (input.FixedCosts + input.TargetProfit) / input.UnitContributionMargin; results["TargetProfit_Units"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TargetProfit_Units"] = Number.NaN; }
  return results;
}


export function calculateBasabas_noktasi(input: Basabas_noktasiInput): Basabas_noktasiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TargetProfit_Units"]);
  const breakdown = {
    BEP_Units: toNumericFormulaValue(values["BEP_Units"]),
    BEP_Revenue: toNumericFormulaValue(values["BEP_Revenue"]),
    CMR: toNumericFormulaValue(values["CMR"]),
    MarginOfSafety_Percent: toNumericFormulaValue(values["MarginOfSafety_Percent"]),
    OperatingLeverage: toNumericFormulaValue(values["OperatingLeverage"]),
    TargetProfit_Units: toNumericFormulaValue(values["TargetProfit_Units"])
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


export interface Basabas_noktasiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { BEP_Units: number; BEP_Revenue: number; CMR: number; MarginOfSafety_Percent: number; OperatingLeverage: number; TargetProfit_Units: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Basabas_noktasiOutputMeta = {
  primaryKey: "TargetProfit_Units",
  unit: "USD",
  breakdownKeys: ["BEP_Units","BEP_Revenue","CMR","MarginOfSafety_Percent","OperatingLeverage","TargetProfit_Units"],
} as const;

