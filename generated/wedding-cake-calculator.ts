// Auto-generated from wedding-cake-calculator-schema.json
import * as z from 'zod';

export interface Wedding_cake_calculatorInput {
  guestCount: number;
  portionGrams: number;
  ingredientCostPerKg: number;
  laborHours: number;
  laborRate: number;
  overheadPercent: number;
  profitMarginPercent: number;
}

export const Wedding_cake_calculatorInputSchema = z.object({
  guestCount: z.number().default(100),
  portionGrams: z.number().default(150),
  ingredientCostPerKg: z.number().default(5),
  laborHours: z.number().default(4),
  laborRate: z.number().default(20),
  overheadPercent: z.number().default(15),
  profitMarginPercent: z.number().default(30),
});

function evaluateAllFormulas(input: Wedding_cake_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.guestCount * input.portionGrams) / 1000; results["totalCakeWeightKg"] = Number.isFinite(v) ? v : 0; } catch { results["totalCakeWeightKg"] = 0; }
  try { const v = (results["totalCakeWeightKg"] ?? 0) * input.ingredientCostPerKg; results["ingredientCost"] = Number.isFinite(v) ? v : 0; } catch { results["ingredientCost"] = 0; }
  try { const v = input.laborHours * input.laborRate; results["laborCost"] = Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = ((results["ingredientCost"] ?? 0) + (results["laborCost"] ?? 0)) * (input.overheadPercent / 100); results["overheadCost"] = Number.isFinite(v) ? v : 0; } catch { results["overheadCost"] = 0; }
  try { const v = (results["ingredientCost"] ?? 0) + (results["laborCost"] ?? 0) + (results["overheadCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) * (1 + input.profitMarginPercent / 100); results["totalPrice"] = Number.isFinite(v) ? v : 0; } catch { results["totalPrice"] = 0; }
  try { const v = (results["totalPrice"] ?? 0) / input.guestCount; results["pricePerServing"] = Number.isFinite(v) ? v : 0; } catch { results["pricePerServing"] = 0; }
  return results;
}


export function calculateWedding_cake_calculator(input: Wedding_cake_calculatorInput): Wedding_cake_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPrice"] ?? 0;
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


export interface Wedding_cake_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
