// Auto-generated from pizza-calculator-schema.json
import * as z from 'zod';

export interface Pizza_calculatorInput {
  pizzaDiameter: number;
  pizzaPrice: number;
  quantity: number;
  discountRate: number;
}

export const Pizza_calculatorInputSchema = z.object({
  pizzaDiameter: z.number().default(30),
  pizzaPrice: z.number().default(10),
  quantity: z.number().default(1),
  discountRate: z.number().default(0),
});

function evaluateAllFormulas(input: Pizza_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * Math.pow(input.pizzaDiameter / 2, 2); results["pizzaArea"] = Number.isFinite(v) ? v : 0; } catch { results["pizzaArea"] = 0; }
  try { const v = input.pizzaPrice / (results["pizzaArea"] ?? 0); results["pricePerSquareCm"] = Number.isFinite(v) ? v : 0; } catch { results["pricePerSquareCm"] = 0; }
  try { const v = input.pizzaPrice * input.quantity * (1 - input.discountRate / 100); results["totalCostAfterDiscount"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostAfterDiscount"] = 0; }
  return results;
}


export function calculatePizza_calculator(input: Pizza_calculatorInput): Pizza_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCostAfterDiscount"] ?? 0;
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


export interface Pizza_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
