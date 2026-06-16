// Auto-generated from weight-watchers-points-calculator-schema.json
import * as z from 'zod';

export interface Weight_watchers_points_calculatorInput {
  calories: number;
  saturatedFat: number;
  sugar: number;
  protein: number;
}

export const Weight_watchers_points_calculatorInputSchema = z.object({
  calories: z.number().default(0),
  saturatedFat: z.number().default(0),
  sugar: z.number().default(0),
  protein: z.number().default(0),
});

function evaluateAllFormulas(input: Weight_watchers_points_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.calories * 0.0305; results["calTerm"] = Number.isFinite(v) ? v : 0; } catch { results["calTerm"] = 0; }
  try { const v = input.saturatedFat * 0.275; results["satFatTerm"] = Number.isFinite(v) ? v : 0; } catch { results["satFatTerm"] = 0; }
  try { const v = input.sugar * 0.12; results["sugarTerm"] = Number.isFinite(v) ? v : 0; } catch { results["sugarTerm"] = 0; }
  try { const v = input.protein * 0.098; results["protTerm"] = Number.isFinite(v) ? v : 0; } catch { results["protTerm"] = 0; }
  try { const v = (results["calTerm"] ?? 0) + (results["satFatTerm"] ?? 0) + (results["sugarTerm"] ?? 0) - (results["protTerm"] ?? 0); results["points"] = Number.isFinite(v) ? v : 0; } catch { results["points"] = 0; }
  return results;
}


export function calculateWeight_watchers_points_calculator(input: Weight_watchers_points_calculatorInput): Weight_watchers_points_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["points"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Weight_watchers_points_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
