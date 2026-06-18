// @ts-nocheck
// Auto-generated from meat-doneness-calculator-schema.json
import * as z from 'zod';

export interface Meat_doneness_calculatorInput {
  meat_weight: number;
  oven_temp: number;
  target_temp: number;
  starting_temp: number;
  thickness: number;
  shape_factor: number;
}

export const Meat_doneness_calculatorInputSchema = z.object({
  meat_weight: z.number().default(1),
  oven_temp: z.number().default(180),
  target_temp: z.number().default(70),
  starting_temp: z.number().default(20),
  thickness: z.number().default(5),
  shape_factor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Meat_doneness_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.meat_weight * input.oven_temp * input.target_temp * input.starting_temp; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.meat_weight * input.oven_temp * input.target_temp * input.starting_temp * (input.thickness * input.shape_factor); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.thickness * input.shape_factor; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMeat_doneness_calculator(input: Meat_doneness_calculatorInput): Meat_doneness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Meat_doneness_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
