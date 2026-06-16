// Auto-generated from pizza-size-calculator-schema.json
import * as z from 'zod';

export interface Pizza_size_calculatorInput {
  diameter1: number;
  price1: number;
  diameter2: number;
  price2: number;
}

export const Pizza_size_calculatorInputSchema = z.object({
  diameter1: z.number().default(30),
  price1: z.number().default(10),
  diameter2: z.number().default(40),
  price2: z.number().default(15),
});

function evaluateAllFormulas(input: Pizza_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * (input.diameter1/2)**2; results["area1"] = Number.isFinite(v) ? v : 0; } catch { results["area1"] = 0; }
  try { const v = Math.PI * (input.diameter2/2)**2; results["area2"] = Number.isFinite(v) ? v : 0; } catch { results["area2"] = 0; }
  try { const v = input.price1 / (results["area1"] ?? 0); results["pricePerArea1"] = Number.isFinite(v) ? v : 0; } catch { results["pricePerArea1"] = 0; }
  try { const v = input.price2 / (results["area2"] ?? 0); results["pricePerArea2"] = Number.isFinite(v) ? v : 0; } catch { results["pricePerArea2"] = 0; }
  try { const v = (input.price2 * input.diameter1**2) / (input.price1 * input.diameter2**2); results["valueRatio"] = Number.isFinite(v) ? v : 0; } catch { results["valueRatio"] = 0; }
  return results;
}


export function calculatePizza_size_calculator(input: Pizza_size_calculatorInput): Pizza_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["valueRatio"] ?? 0;
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


export interface Pizza_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
