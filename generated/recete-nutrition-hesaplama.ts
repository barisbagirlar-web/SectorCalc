// Auto-generated from recete-nutrition-hesaplama-schema.json
import * as z from 'zod';

export interface Recete_nutrition_hesaplamaInput {
  dailyCalories: number;
  dataConfidence?: number;
}

export const Recete_nutrition_hesaplamaInputSchema = z.object({
  dailyCalories: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Recete_nutrition_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyCalories * (1 + input.dailyCalories/500) + Math.sqrt(input.dailyCalories) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.dailyCalories * (1 + input.dailyCalories/500) + Math.sqrt(input.dailyCalories) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateRecete_nutrition_hesaplama(input: Recete_nutrition_hesaplamaInput): Recete_nutrition_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review assumptions."];
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
    unit: "kcal",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Recete_nutrition_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Recete_nutrition_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "kcal",
  breakdownKeys: ["result"],
} as const;

