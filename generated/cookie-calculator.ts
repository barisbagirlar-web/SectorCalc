// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cookie_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.batch_size * input.flour_per_cookie; results["total_flour"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_flour"] = 0; }
  try { const v = input.batch_size * input.sugar_per_cookie; results["total_sugar"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_sugar"] = 0; }
  try { const v = input.batch_size * input.butter_per_cookie; results["total_butter"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_butter"] = 0; }
  try { const v = input.batch_size * input.egg_per_cookie; results["total_egg"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_egg"] = 0; }
  try { const v = input.batch_size * input.chocolate_per_cookie; results["total_chocolate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_chocolate"] = 0; }
  try { const v = (asFormulaNumber(results["total_flour"])) + (asFormulaNumber(results["total_sugar"])) + (asFormulaNumber(results["total_butter"])) + (asFormulaNumber(results["total_egg"])) + (asFormulaNumber(results["total_chocolate"])); results["total_dough_weight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_dough_weight"] = 0; }
  try { const v = input.oven_temp * input.baking_time * 0.05; results["energy_consumption"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["energy_consumption"] = 0; }
  try { const v = ((asFormulaNumber(results["total_flour"])) * 0.002 + (asFormulaNumber(results["total_sugar"])) * 0.003 + (asFormulaNumber(results["total_butter"])) * 0.005 + (asFormulaNumber(results["total_egg"])) * 0.004 + (asFormulaNumber(results["total_chocolate"])) * 0.006) / input.batch_size; results["cost_per_cookie"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cost_per_cookie"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCookie_calculator(input: Cookie_calculatorInput): Cookie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total_dough_weight"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
