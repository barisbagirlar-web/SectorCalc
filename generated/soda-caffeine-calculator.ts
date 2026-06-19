// Auto-generated from soda-caffeine-calculator-schema.json
import * as z from 'zod';

export interface Soda_caffeine_calculatorInput {
  cansConsumed: number;
  caffeinePerServing: number;
  servingSize: number;
  bodyWeight: number;
  safeLimitPerKg: number;
  coffeeCaffeinePerCup: number;
  dataConfidence?: number;
}

export const Soda_caffeine_calculatorInputSchema = z.object({
  cansConsumed: z.number().default(1),
  caffeinePerServing: z.number().default(34),
  servingSize: z.number().default(12),
  bodyWeight: z.number().default(70),
  safeLimitPerKg: z.number().default(2.5),
  coffeeCaffeinePerCup: z.number().default(95),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Soda_caffeine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cansConsumed * input.caffeinePerServing; results["totalCaffeine"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCaffeine"] = 0; }
  try { const v = input.bodyWeight * input.safeLimitPerKg; results["safeLimit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["safeLimit"] = 0; }
  try { const v = ((asFormulaNumber(results["totalCaffeine"])) / (asFormulaNumber(results["safeLimit"]))) * 100; results["percentOfLimit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["percentOfLimit"] = 0; }
  try { const v = (asFormulaNumber(results["totalCaffeine"])) / input.coffeeCaffeinePerCup; results["coffeeEquiv"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["coffeeEquiv"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSoda_caffeine_calculator(input: Soda_caffeine_calculatorInput): Soda_caffeine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCaffeine"]);
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


export interface Soda_caffeine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
