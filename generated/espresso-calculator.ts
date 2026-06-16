// Auto-generated from espresso-calculator-schema.json
import * as z from 'zod';

export interface Espresso_calculatorInput {
  dosePerShot: number;
  coffeeBagPrice: number;
  bagWeight: number;
  wastePercentage: number;
}

export const Espresso_calculatorInputSchema = z.object({
  dosePerShot: z.number().default(18),
  coffeeBagPrice: z.number().default(10),
  bagWeight: z.number().default(1000),
  wastePercentage: z.number().default(5),
});

function evaluateAllFormulas(input: Espresso_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bagWeight * (1 - input.wastePercentage / 100); results["totalUsableCoffee"] = Number.isFinite(v) ? v : 0; } catch { results["totalUsableCoffee"] = 0; }
  try { const v = (results["totalUsableCoffee"] ?? 0) / input.dosePerShot; results["shotsPerBag"] = Number.isFinite(v) ? v : 0; } catch { results["shotsPerBag"] = 0; }
  try { const v = input.coffeeBagPrice / input.bagWeight; results["costPerGram"] = Number.isFinite(v) ? v : 0; } catch { results["costPerGram"] = 0; }
  try { const v = input.coffeeBagPrice / (results["shotsPerBag"] ?? 0); results["costPerShot"] = Number.isFinite(v) ? v : 0; } catch { results["costPerShot"] = 0; }
  return results;
}


export function calculateEspresso_calculator(input: Espresso_calculatorInput): Espresso_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["costPerShot"] ?? 0;
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


export interface Espresso_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
