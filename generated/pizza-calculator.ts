// Auto-generated from pizza-calculator-schema.json
import * as z from 'zod';

export interface Pizza_calculatorInput {
  pizzaDiameter: number;
  pizzaPrice: number;
  quantity: number;
  discountRate: number;
  dataConfidence?: number;
}

export const Pizza_calculatorInputSchema = z.object({
  pizzaDiameter: z.number().default(30),
  pizzaPrice: z.number().default(10),
  quantity: z.number().default(1),
  discountRate: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pizza_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pizzaPrice * input.quantity * (1 - input.discountRate / 100); results["totalCostAfterDiscount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCostAfterDiscount"] = Number.NaN; }
  try { const v = input.pizzaPrice * input.quantity * (1 - input.discountRate / 100); results["totalCostAfterDiscount_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCostAfterDiscount_aux"] = Number.NaN; }
  return results;
}


export function calculatePizza_calculator(input: Pizza_calculatorInput): Pizza_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCostAfterDiscount"]);
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


export interface Pizza_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
