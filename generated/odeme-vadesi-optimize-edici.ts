// Auto-generated from odeme-vadesi-optimize-edici-schema.json
import * as z from 'zod';

export interface Odeme_vadesi_optimize_ediciInput {
  AccountsReceivable: number;
  Revenue: number;
  Days: number;
  AverageAR: number;
  WACC: number;
  DefaultRate: number;
  EarlyPaymentDiscountPct: number;
  DiscountTakeRate: number;
  NewDSO: number;
  OldDSO: number;
  CashInflow_t: number;
  DailyWACC: number;
  t: number;
  dataConfidence?: number;
}

export const Odeme_vadesi_optimize_ediciInputSchema = z.object({
  AccountsReceivable: z.number().min(0).default(0),
  Revenue: z.number().min(0).default(0),
  Days: z.number().min(0).default(0),
  AverageAR: z.number().min(0).default(0),
  WACC: z.number().min(0).default(0),
  DefaultRate: z.number().min(0).default(0),
  EarlyPaymentDiscountPct: z.number().min(0).default(0),
  DiscountTakeRate: z.number().min(0).default(0),
  NewDSO: z.number().min(0).default(0),
  OldDSO: z.number().min(0).default(0),
  CashInflow_t: z.number().min(0).default(0),
  DailyWACC: z.number().min(0).default(0),
  t: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Odeme_vadesi_optimize_ediciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.AccountsReceivable / input.Revenue) * input.Days; results["DSO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DSO"] = Number.NaN; }
  try { const v = input.AverageAR * input.WACC / 365; results["CarryingCost_AR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CarryingCost_AR"] = Number.NaN; }
  try { const v = input.Revenue * input.DefaultRate; results["BadDebtExpense"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BadDebtExpense"] = Number.NaN; }
  try { const v = input.EarlyPaymentDiscountPct * input.DiscountTakeRate * input.Revenue; results["DiscountCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DiscountCost"] = Number.NaN; }
  try { const v = 0.0; results["OptimalTerms"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OptimalTerms"] = Number.NaN; }
  try { const v = (input.NewDSO - input.OldDSO) * (input.Revenue / 365); results["CashFlowImpact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CashFlowImpact"] = Number.NaN; }
  results["NPV_Terms"] = Number.NaN;
  return results;
}


export function calculateOdeme_vadesi_optimize_edici(input: Odeme_vadesi_optimize_ediciInput): Odeme_vadesi_optimize_ediciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["NPV_Terms"]);
  const breakdown = {
    DSO: toNumericFormulaValue(values["DSO"]),
    CarryingCost_AR: toNumericFormulaValue(values["CarryingCost_AR"]),
    BadDebtExpense: toNumericFormulaValue(values["BadDebtExpense"]),
    DiscountCost: toNumericFormulaValue(values["DiscountCost"]),
    OptimalTerms: toNumericFormulaValue(values["OptimalTerms"]),
    CashFlowImpact: toNumericFormulaValue(values["CashFlowImpact"]),
    NPV_Terms: toNumericFormulaValue(values["NPV_Terms"])
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


export interface Odeme_vadesi_optimize_ediciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { DSO: number; CarryingCost_AR: number; BadDebtExpense: number; DiscountCost: number; OptimalTerms: number; CashFlowImpact: number; NPV_Terms: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Odeme_vadesi_optimize_ediciOutputMeta = {
  primaryKey: "NPV_Terms",
  unit: "USD",
  breakdownKeys: ["DSO","CarryingCost_AR","BadDebtExpense","DiscountCost","OptimalTerms","CashFlowImpact","NPV_Terms"],
} as const;

