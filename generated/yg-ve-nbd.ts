// Auto-generated from yg-ve-nbd-schema.json
import * as z from 'zod';

export interface Yg_ve_nbdInput {
  TotalNetProfit: number;
  TotalInvestment: number;
  CashFlow_t: number;
  DiscountRate: number;
  t: number;
  InitialInvestment: number;
  UnrecoveredCost: number;
  CashFlow_RecoveryYear: number;
  PV_FutureCashFlows: number;
  CumulativeDiscountedCashFlow: number;
  dataConfidence?: number;
}

export const Yg_ve_nbdInputSchema = z.object({
  TotalNetProfit: z.number().min(0).default(0),
  TotalInvestment: z.number().min(0).default(0),
  CashFlow_t: z.number().min(0).default(0),
  DiscountRate: z.number().min(0).default(0),
  t: z.number().min(0).default(0),
  InitialInvestment: z.number().min(0).default(0),
  UnrecoveredCost: z.number().min(0).default(0),
  CashFlow_RecoveryYear: z.number().min(0).default(0),
  PV_FutureCashFlows: z.number().min(0).default(0),
  CumulativeDiscountedCashFlow: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yg_ve_nbdInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.TotalNetProfit / input.TotalInvestment) * 100; results["ROI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI"] = Number.NaN; }
  results["NPV"] = Number.NaN;
  try { const v = 0.0; results["IRR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["IRR"] = Number.NaN; }
  results["PaybackPeriod"] = Number.NaN;
  try { const v = input.PV_FutureCashFlows / input.InitialInvestment; results["ProfitabilityIndex"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ProfitabilityIndex"] = Number.NaN; }
  results["DiscountedPayback"] = Number.NaN;
  return results;
}


export function calculateYg_ve_nbd(input: Yg_ve_nbdInput): Yg_ve_nbdOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["DiscountedPayback"]);
  const breakdown = {
    ROI: toNumericFormulaValue(values["ROI"]),
    NPV: toNumericFormulaValue(values["NPV"]),
    IRR: toNumericFormulaValue(values["IRR"]),
    PaybackPeriod: toNumericFormulaValue(values["PaybackPeriod"]),
    ProfitabilityIndex: toNumericFormulaValue(values["ProfitabilityIndex"]),
    DiscountedPayback: toNumericFormulaValue(values["DiscountedPayback"])
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


export interface Yg_ve_nbdOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ROI: number; NPV: number; IRR: number; PaybackPeriod: number; ProfitabilityIndex: number; DiscountedPayback: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yg_ve_nbdOutputMeta = {
  primaryKey: "DiscountedPayback",
  unit: "USD",
  breakdownKeys: ["ROI","NPV","IRR","PaybackPeriod","ProfitabilityIndex","DiscountedPayback"],
} as const;

