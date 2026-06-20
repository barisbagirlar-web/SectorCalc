// Auto-generated from cookie-calculator-schema.json
import * as z from 'zod';

export interface Cookie_calculatorInput {
  batch_size: number;
  flour_per_cookie: number;
  sugar_per_cookie: number;
  butter_per_cookie: number;
  egg_per_cookie: number;
  chocolate_per_cookie: number;
  oven_temp: number;
  baking_time: number;
  dataConfidence?: number;
}

export const Cookie_calculatorInputSchema = z.object({
  batch_size: z.number().default(24),
  flour_per_cookie: z.number().default(30),
  sugar_per_cookie: z.number().default(15),
  butter_per_cookie: z.number().default(10),
  egg_per_cookie: z.number().default(5),
  chocolate_per_cookie: z.number().default(10),
  oven_temp: z.number().default(180),
  baking_time: z.number().default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cookie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.batch_size * input.flour_per_cookie; results["total_flour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_flour"] = Number.NaN; }
  try { const v = input.batch_size * input.sugar_per_cookie; results["total_sugar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_sugar"] = Number.NaN; }
  try { const v = input.batch_size * input.butter_per_cookie; results["total_butter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_butter"] = Number.NaN; }
  try { const v = input.batch_size * input.egg_per_cookie; results["total_egg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_egg"] = Number.NaN; }
  try { const v = input.batch_size * input.chocolate_per_cookie; results["total_chocolate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_chocolate"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_flour"])) + (toNumericFormulaValue(results["total_sugar"])) + (toNumericFormulaValue(results["total_butter"])) + (toNumericFormulaValue(results["total_egg"])) + (toNumericFormulaValue(results["total_chocolate"])); results["total_dough_weight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_dough_weight"] = Number.NaN; }
  try { const v = input.oven_temp * input.baking_time * 0.05; results["energy_consumption"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energy_consumption"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["total_flour"])) * 0.002 + (toNumericFormulaValue(results["total_sugar"])) * 0.003 + (toNumericFormulaValue(results["total_butter"])) * 0.005 + (toNumericFormulaValue(results["total_egg"])) * 0.004 + (toNumericFormulaValue(results["total_chocolate"])) * 0.006) / input.batch_size; results["cost_per_cookie"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cost_per_cookie"] = Number.NaN; }
  return results;
}


export function calculateCookie_calculator(input: Cookie_calculatorInput): Cookie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total_dough_weight"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Cookie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
