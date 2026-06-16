// Auto-generated from juice-calculator-schema.json
import * as z from 'zod';

export interface Juice_calculatorInput {
  fruitWeight: number;
  extractionRate: number;
  waterAdded: number;
  otherAdditives: number;
}

export const Juice_calculatorInputSchema = z.object({
  fruitWeight: z.number().default(100),
  extractionRate: z.number().default(70),
  waterAdded: z.number().default(0),
  otherAdditives: z.number().default(0),
});

function evaluateAllFormulas(input: Juice_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fruitWeight * input.extractionRate / 100; results["juiceFromFruitOutput"] = Number.isFinite(v) ? v : 0; } catch { results["juiceFromFruitOutput"] = 0; }
  try { const v = input.waterAdded; results["waterOutput"] = Number.isFinite(v) ? v : 0; } catch { results["waterOutput"] = 0; }
  try { const v = input.otherAdditives; results["additivesOutput"] = Number.isFinite(v) ? v : 0; } catch { results["additivesOutput"] = 0; }
  try { const v = input.fruitWeight - (input.fruitWeight * input.extractionRate / 100); results["wasteOutput"] = Number.isFinite(v) ? v : 0; } catch { results["wasteOutput"] = 0; }
  try { const v = input.fruitWeight * input.extractionRate / 100 + input.waterAdded + input.otherAdditives; results["totalJuiceOutput"] = Number.isFinite(v) ? v : 0; } catch { results["totalJuiceOutput"] = 0; }
  return results;
}


export function calculateJuice_calculator(input: Juice_calculatorInput): Juice_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalJuiceOutput"] ?? 0;
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


export interface Juice_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
