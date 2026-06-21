// Auto-generated from moq-stok-denge-schema.json
import * as z from 'zod';

export interface Moq_stok_dengeInput {
  AnnualDemand: number;
  OrderCost: number;
  HoldingCost: number;
  MOQ: number;
  UnitPrice_Standard: number;
  UnitPrice_MOQ: number;
  AdditionalOrderCostSavings: number;
  dataConfidence?: number;
}

export const Moq_stok_dengeInputSchema = z.object({
  AnnualDemand: z.number().min(0).default(0),
  OrderCost: z.number().min(0).default(0),
  HoldingCost: z.number().min(0).default(0),
  MOQ: z.number().min(0).default(0),
  UnitPrice_Standard: z.number().min(0).default(0),
  UnitPrice_MOQ: z.number().min(0).default(0),
  AdditionalOrderCostSavings: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Moq_stok_dengeInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt((2 * input.AnnualDemand * input.OrderCost) / input.HoldingCost); results["EOQ"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EOQ"] = Number.NaN; }
  try { const v = ((input.MOQ > (toNumericFormulaValue(results["EOQ"]))) ? ((input.MOQ - (toNumericFormulaValue(results["EOQ"])))/2 * input.HoldingCost) : (0)); results["MOQ_Penalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MOQ_Penalty"] = Number.NaN; }
  try { const v = (input.UnitPrice_Standard - input.UnitPrice_MOQ) * input.AnnualDemand; results["PriceBreakSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PriceBreakSavings"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["PriceBreakSavings"])) - (toNumericFormulaValue(results["MOQ_Penalty"])) - input.AdditionalOrderCostSavings; results["NetBenefit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NetBenefit"] = Number.NaN; }
  try { const v = (((toNumericFormulaValue(results["NetBenefit"])) > 0) ? (input.MOQ) : ((toNumericFormulaValue(results["EOQ"])))); results["OptimalOrderQty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OptimalOrderQty"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["OptimalOrderQty"])) / 2) * input.HoldingCost; results["CycleStock_Cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CycleStock_Cost"] = Number.NaN; }
  return results;
}


export function calculateMoq_stok_denge(input: Moq_stok_dengeInput): Moq_stok_dengeOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CycleStock_Cost"]);
  const breakdown = {
    EOQ: toNumericFormulaValue(values["EOQ"]),
    MOQ_Penalty: toNumericFormulaValue(values["MOQ_Penalty"]),
    PriceBreakSavings: toNumericFormulaValue(values["PriceBreakSavings"]),
    NetBenefit: toNumericFormulaValue(values["NetBenefit"]),
    OptimalOrderQty: toNumericFormulaValue(values["OptimalOrderQty"]),
    CycleStock_Cost: toNumericFormulaValue(values["CycleStock_Cost"])
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


export interface Moq_stok_dengeOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { EOQ: number; MOQ_Penalty: number; PriceBreakSavings: number; NetBenefit: number; OptimalOrderQty: number; CycleStock_Cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Moq_stok_dengeOutputMeta = {
  primaryKey: "CycleStock_Cost",
  unit: "USD",
  breakdownKeys: ["EOQ","MOQ_Penalty","PriceBreakSavings","NetBenefit","OptimalOrderQty","CycleStock_Cost"],
} as const;

