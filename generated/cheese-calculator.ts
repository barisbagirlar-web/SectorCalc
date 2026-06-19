// Auto-generated from cheese-calculator-schema.json
import * as z from 'zod';

export interface Cheese_calculatorInput {
  milkWeight: number;
  fatPercent: number;
  proteinPercent: number;
  moistureTarget: number;
  yieldFactor: number;
  dataConfidence?: number;
}

export const Cheese_calculatorInputSchema = z.object({
  milkWeight: z.number().default(1000),
  fatPercent: z.number().default(3.5),
  proteinPercent: z.number().default(3.2),
  moistureTarget: z.number().default(40),
  yieldFactor: z.number().default(0.9),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cheese_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.milkWeight * (input.fatPercent/100 + input.proteinPercent/100) * input.yieldFactor / (1 - input.moistureTarget/100); results["cheeseWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cheeseWeight"] = 0; }
  try { const v = input.milkWeight * (input.fatPercent/100) * input.yieldFactor; results["fatInCheese"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fatInCheese"] = 0; }
  try { const v = input.milkWeight * (input.proteinPercent/100) * input.yieldFactor; results["proteinInCheese"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["proteinInCheese"] = 0; }
  try { const v = (asFormulaNumber(results["cheeseWeight"])) * (input.moistureTarget/100); results["waterInCheese"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["waterInCheese"] = 0; }
  try { const v = (asFormulaNumber(results["cheeseWeight"])) - (asFormulaNumber(results["waterInCheese"])); results["solidsInCheese"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["solidsInCheese"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCheese_calculator(input: Cheese_calculatorInput): Cheese_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["cheeseWeight"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
