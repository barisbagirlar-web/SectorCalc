// Auto-generated from cheese-calculator-schema.json
import * as z from 'zod';

export interface Cheese_calculatorInput {
  milkWeight: number;
  fatPercent: number;
  proteinPercent: number;
  moistureTarget: number;
  yieldFactor: number;
}

export const Cheese_calculatorInputSchema = z.object({
  milkWeight: z.number().default(1000),
  fatPercent: z.number().default(3.5),
  proteinPercent: z.number().default(3.2),
  moistureTarget: z.number().default(40),
  yieldFactor: z.number().default(0.9),
});

function evaluateAllFormulas(input: Cheese_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.milkWeight * (input.fatPercent/100 + input.proteinPercent/100) * input.yieldFactor / (1 - input.moistureTarget/100); results["cheeseWeight"] = Number.isFinite(v) ? v : 0; } catch { results["cheeseWeight"] = 0; }
  try { const v = input.milkWeight * (input.fatPercent/100) * input.yieldFactor; results["fatInCheese"] = Number.isFinite(v) ? v : 0; } catch { results["fatInCheese"] = 0; }
  try { const v = input.milkWeight * (input.proteinPercent/100) * input.yieldFactor; results["proteinInCheese"] = Number.isFinite(v) ? v : 0; } catch { results["proteinInCheese"] = 0; }
  try { const v = (results["cheeseWeight"] ?? 0) * (input.moistureTarget/100); results["waterInCheese"] = Number.isFinite(v) ? v : 0; } catch { results["waterInCheese"] = 0; }
  try { const v = (results["cheeseWeight"] ?? 0) - (results["waterInCheese"] ?? 0); results["solidsInCheese"] = Number.isFinite(v) ? v : 0; } catch { results["solidsInCheese"] = 0; }
  return results;
}


export function calculateCheese_calculator(input: Cheese_calculatorInput): Cheese_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cheeseWeight"] ?? 0;
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


export interface Cheese_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
