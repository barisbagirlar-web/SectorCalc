// Auto-generated from clv-cac-orani-schema.json
import * as z from 'zod';

export interface Clv_cac_oraniInput {
  AvgOrderValue: number;
  PurchaseFreq: number;
  Lifespan: number;
  GrossMarginPct: number;
  Retention: number;
  t: number;
  DiscountRate: number;
  SalesMarketing: number;
  Salaries: number;
  Overhead: number;
  NewCustomers: number;
  AvgMonthlyGrossProfit: number;
  dataConfidence?: number;
}

export const Clv_cac_oraniInputSchema = z.object({
  AvgOrderValue: z.number().min(0).default(0),
  PurchaseFreq: z.number().min(0).default(0),
  Lifespan: z.number().min(0).default(0),
  GrossMarginPct: z.number().min(0).default(0),
  Retention: z.number().min(0).default(0),
  t: z.number().min(0).default(0),
  DiscountRate: z.number().min(0).default(0),
  SalesMarketing: z.number().min(0).default(0),
  Salaries: z.number().min(0).default(0),
  Overhead: z.number().min(0).default(0),
  NewCustomers: z.number().min(0).default(0),
  AvgMonthlyGrossProfit: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Clv_cac_oraniInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.AvgOrderValue * input.PurchaseFreq * input.Lifespan; results["CLV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CLV"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["CLV"])) * input.GrossMarginPct; results["GrossMarginCLV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["GrossMarginCLV"] = Number.NaN; }
  results["DiscountedCLV"] = Number.NaN;
  try { const v = (input.SalesMarketing + input.Salaries + input.Overhead) / input.NewCustomers; results["CAC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CAC"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["CAC"])) / input.AvgMonthlyGrossProfit; results["Payback"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Payback"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["DiscountedCLV"])) / (toNumericFormulaValue(results["CAC"])); results["LTV_CAC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LTV_CAC"] = Number.NaN; }
  return results;
}


export function calculateClv_cac_orani(input: Clv_cac_oraniInput): Clv_cac_oraniOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["LTV_CAC"]);
  const breakdown = {
    CLV: toNumericFormulaValue(values["CLV"]),
    GrossMarginCLV: toNumericFormulaValue(values["GrossMarginCLV"]),
    DiscountedCLV: toNumericFormulaValue(values["DiscountedCLV"]),
    CAC: toNumericFormulaValue(values["CAC"]),
    Payback: toNumericFormulaValue(values["Payback"]),
    LTV_CAC: toNumericFormulaValue(values["LTV_CAC"])
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


export interface Clv_cac_oraniOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { CLV: number; GrossMarginCLV: number; DiscountedCLV: number; CAC: number; Payback: number; LTV_CAC: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Clv_cac_oraniOutputMeta = {
  primaryKey: "LTV_CAC",
  unit: "USD",
  breakdownKeys: ["CLV","GrossMarginCLV","DiscountedCLV","CAC","Payback","LTV_CAC"],
} as const;

