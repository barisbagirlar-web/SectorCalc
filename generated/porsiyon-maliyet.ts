// Auto-generated from porsiyon-maliyet-schema.json
import * as z from 'zod';

export interface Porsiyon_maliyetInput {
  Quantity_i: number;
  UnitPrice_i: number;
  YieldPct: number;
  PrepTime: number;
  LaborRate: number;
  OverheadPct: number;
  MenuPrice: number;
  TargetFoodCostPct: number;
  dataConfidence?: number;
}

export const Porsiyon_maliyetInputSchema = z.object({
  Quantity_i: z.number().min(0).default(0),
  UnitPrice_i: z.number().min(0).default(0),
  YieldPct: z.number().min(0).default(0),
  PrepTime: z.number().min(0).default(0),
  LaborRate: z.number().min(0).default(0),
  OverheadPct: z.number().min(0).default(0),
  MenuPrice: z.number().min(0).default(0),
  TargetFoodCostPct: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Porsiyon_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["IngredientCost"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["IngredientCost"])) / input.YieldPct; results["YieldAdjustedCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["YieldAdjustedCost"] = Number.NaN; }
  try { const v = input.PrepTime * input.LaborRate; results["LaborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LaborCost"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["IngredientCost"])) + (toNumericFormulaValue(results["LaborCost"]))) * input.OverheadPct; results["Overhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Overhead"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["YieldAdjustedCost"])) + (toNumericFormulaValue(results["LaborCost"])) + (toNumericFormulaValue(results["Overhead"])); results["TotalPortionCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalPortionCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalPortionCost"])) / input.MenuPrice; results["FoodCostPct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FoodCostPct"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalPortionCost"])) / input.TargetFoodCostPct; results["MenuPrice_Target"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MenuPrice_Target"] = Number.NaN; }
  try { const v = input.MenuPrice - (toNumericFormulaValue(results["TotalPortionCost"])); results["Margin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Margin"] = Number.NaN; }
  return results;
}


export function calculatePorsiyon_maliyet(input: Porsiyon_maliyetInput): Porsiyon_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Margin"]);
  const breakdown = {
    IngredientCost: toNumericFormulaValue(values["IngredientCost"]),
    YieldAdjustedCost: toNumericFormulaValue(values["YieldAdjustedCost"]),
    LaborCost: toNumericFormulaValue(values["LaborCost"]),
    Overhead: toNumericFormulaValue(values["Overhead"]),
    TotalPortionCost: toNumericFormulaValue(values["TotalPortionCost"]),
    FoodCostPct: toNumericFormulaValue(values["FoodCostPct"]),
    MenuPrice_Target: toNumericFormulaValue(values["MenuPrice_Target"]),
    Margin: toNumericFormulaValue(values["Margin"])
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


export interface Porsiyon_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { IngredientCost: number; YieldAdjustedCost: number; LaborCost: number; Overhead: number; TotalPortionCost: number; FoodCostPct: number; MenuPrice_Target: number; Margin: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Porsiyon_maliyetOutputMeta = {
  primaryKey: "Margin",
  unit: "USD",
  breakdownKeys: ["IngredientCost","YieldAdjustedCost","LaborCost","Overhead","TotalPortionCost","FoodCostPct","MenuPrice_Target","Margin"],
} as const;

