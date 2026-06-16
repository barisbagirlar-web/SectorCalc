// Auto-generated from smoothie-calculator-schema.json
import * as z from 'zod';

export interface Smoothie_calculatorInput {
  servings: number;
  baseVolumeML: number;
  fruitGrams: number;
  iceGrams: number;
  baseCostPerLiter: number;
  fruitCostPerKg: number;
  iceCostPerKg: number;
}

export const Smoothie_calculatorInputSchema = z.object({
  servings: z.number().default(1),
  baseVolumeML: z.number().default(200),
  fruitGrams: z.number().default(150),
  iceGrams: z.number().default(80),
  baseCostPerLiter: z.number().default(1.5),
  fruitCostPerKg: z.number().default(4),
  iceCostPerKg: z.number().default(0.1),
});

function evaluateAllFormulas(input: Smoothie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseVolumeML * input.servings; results["totalVolumeML"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolumeML"] = 0; }
  try { const v = (input.baseVolumeML / 1000) * input.baseCostPerLiter * input.servings; results["baseCost"] = Number.isFinite(v) ? v : 0; } catch { results["baseCost"] = 0; }
  try { const v = (input.fruitGrams / 1000) * input.fruitCostPerKg * input.servings; results["fruitCost"] = Number.isFinite(v) ? v : 0; } catch { results["fruitCost"] = 0; }
  try { const v = (input.iceGrams / 1000) * input.iceCostPerKg * input.servings; results["iceCost"] = Number.isFinite(v) ? v : 0; } catch { results["iceCost"] = 0; }
  try { const v = (results["baseCost"] ?? 0) + (results["fruitCost"] ?? 0) + (results["iceCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / input.servings; results["costPerSmoothie"] = Number.isFinite(v) ? v : 0; } catch { results["costPerSmoothie"] = 0; }
  return results;
}


export function calculateSmoothie_calculator(input: Smoothie_calculatorInput): Smoothie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["costPerSmoothie"] ?? 0;
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


export interface Smoothie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
