// Auto-generated from restaurant-menu-marj-kacak-schema.json
import * as z from 'zod';

export interface Restaurant_menu_marj_kacakInput {
  ItemsSold_i: number;
  PortionCost_i: number;
  BeginningInventory: number;
  Purchases: number;
  EndingInventory: number;
  TotalFoodSales: number;
  RecordedWaste: number;
  AvgPortionCost: number;
  CompMeals: number;
  dataConfidence?: number;
}

export const Restaurant_menu_marj_kacakInputSchema = z.object({
  ItemsSold_i: z.number().min(0).default(0),
  PortionCost_i: z.number().min(0).default(0),
  BeginningInventory: z.number().min(0).default(0),
  Purchases: z.number().min(0).default(0),
  EndingInventory: z.number().min(0).default(0),
  TotalFoodSales: z.number().min(0).default(0),
  RecordedWaste: z.number().min(0).default(0),
  AvgPortionCost: z.number().min(0).default(0),
  CompMeals: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Restaurant_menu_marj_kacakInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["TheoreticalFoodCost"] = Number.NaN;
  try { const v = input.BeginningInventory + input.Purchases - input.EndingInventory; results["ActualFoodCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ActualFoodCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ActualFoodCost"])) - (toNumericFormulaValue(results["TheoreticalFoodCost"])); results["Variance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Variance"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Variance"])) / input.TotalFoodSales; results["VariancePct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["VariancePct"] = Number.NaN; }
  try { const v = input.RecordedWaste * input.AvgPortionCost; results["WasteCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["WasteCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Variance"])) - (toNumericFormulaValue(results["WasteCost"])) - input.CompMeals; results["TheftLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TheftLoss"] = Number.NaN; }
  try { const v = 1 - ((toNumericFormulaValue(results["TheoreticalFoodCost"])) / input.TotalFoodSales); results["IdealMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["IdealMargin"] = Number.NaN; }
  try { const v = 1 - ((toNumericFormulaValue(results["ActualFoodCost"])) / input.TotalFoodSales); results["ActualMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ActualMargin"] = Number.NaN; }
  return results;
}


export function calculateRestaurant_menu_marj_kacak(input: Restaurant_menu_marj_kacakInput): Restaurant_menu_marj_kacakOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ActualMargin"]);
  const breakdown = {
    TheoreticalFoodCost: toNumericFormulaValue(values["TheoreticalFoodCost"]),
    ActualFoodCost: toNumericFormulaValue(values["ActualFoodCost"]),
    Variance: toNumericFormulaValue(values["Variance"]),
    VariancePct: toNumericFormulaValue(values["VariancePct"]),
    WasteCost: toNumericFormulaValue(values["WasteCost"]),
    TheftLoss: toNumericFormulaValue(values["TheftLoss"]),
    IdealMargin: toNumericFormulaValue(values["IdealMargin"]),
    ActualMargin: toNumericFormulaValue(values["ActualMargin"])
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


export interface Restaurant_menu_marj_kacakOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { TheoreticalFoodCost: number; ActualFoodCost: number; Variance: number; VariancePct: number; WasteCost: number; TheftLoss: number; IdealMargin: number; ActualMargin: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Restaurant_menu_marj_kacakOutputMeta = {
  primaryKey: "ActualMargin",
  unit: "USD",
  breakdownKeys: ["TheoreticalFoodCost","ActualFoodCost","Variance","VariancePct","WasteCost","TheftLoss","IdealMargin","ActualMargin"],
} as const;

