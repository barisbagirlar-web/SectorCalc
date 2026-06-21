// Auto-generated from transfer-fiyatlandirmasi-optimize-edici-schema.json
import * as z from 'zod';

export interface Transfer_fiyatlandirmasi_optimize_ediciInput {
  FullCost: number;
  MarkupPct: number;
  ComparableUncontrolledPrice: number;
  VariableCost: number;
  OpportunityCost: number;
  TransferPrice: number;
  ArmLengthPrice: number;
  TaxRate_High: number;
  TaxRate_Low: number;
  Revenue_Final: number;
  Cost_Origin: number;
  Cost_Transfer: number;
  dataConfidence?: number;
}

export const Transfer_fiyatlandirmasi_optimize_ediciInputSchema = z.object({
  FullCost: z.number().min(0).default(0),
  MarkupPct: z.number().min(0).default(0),
  ComparableUncontrolledPrice: z.number().min(0).default(0),
  VariableCost: z.number().min(0).default(0),
  OpportunityCost: z.number().min(0).default(0),
  TransferPrice: z.number().min(0).default(0),
  ArmLengthPrice: z.number().min(0).default(0),
  TaxRate_High: z.number().min(0).default(0),
  TaxRate_Low: z.number().min(0).default(0),
  Revenue_Final: z.number().min(0).default(0),
  Cost_Origin: z.number().min(0).default(0),
  Cost_Transfer: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Transfer_fiyatlandirmasi_optimize_ediciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.FullCost * (1 + input.MarkupPct); results["CostPlusPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPlusPrice"] = Number.NaN; }
  try { const v = input.ComparableUncontrolledPrice; results["MarketBasedPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MarketBasedPrice"] = Number.NaN; }
  try { const v = input.VariableCost + input.OpportunityCost; results["MarginalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MarginalCost"] = Number.NaN; }
  try { const v = (input.TransferPrice - input.ArmLengthPrice) * (input.TaxRate_High - input.TaxRate_Low); results["TaxImpact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TaxImpact"] = Number.NaN; }
  try { const v = input.Revenue_Final - (input.Cost_Origin + input.Cost_Transfer + (toNumericFormulaValue(results["TaxImpact"]))); results["GlobalProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["GlobalProfit"] = Number.NaN; }
  try { const v = 0.0; results["OptimalTransferPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OptimalTransferPrice"] = Number.NaN; }
  return results;
}


export function calculateTransfer_fiyatlandirmasi_optimize_edici(input: Transfer_fiyatlandirmasi_optimize_ediciInput): Transfer_fiyatlandirmasi_optimize_ediciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["OptimalTransferPrice"]);
  const breakdown = {
    CostPlusPrice: toNumericFormulaValue(values["CostPlusPrice"]),
    MarketBasedPrice: toNumericFormulaValue(values["MarketBasedPrice"]),
    MarginalCost: toNumericFormulaValue(values["MarginalCost"]),
    TaxImpact: toNumericFormulaValue(values["TaxImpact"]),
    GlobalProfit: toNumericFormulaValue(values["GlobalProfit"]),
    OptimalTransferPrice: toNumericFormulaValue(values["OptimalTransferPrice"])
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


export interface Transfer_fiyatlandirmasi_optimize_ediciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { CostPlusPrice: number; MarketBasedPrice: number; MarginalCost: number; TaxImpact: number; GlobalProfit: number; OptimalTransferPrice: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Transfer_fiyatlandirmasi_optimize_ediciOutputMeta = {
  primaryKey: "OptimalTransferPrice",
  unit: "USD",
  breakdownKeys: ["CostPlusPrice","MarketBasedPrice","MarginalCost","TaxImpact","GlobalProfit","OptimalTransferPrice"],
} as const;

