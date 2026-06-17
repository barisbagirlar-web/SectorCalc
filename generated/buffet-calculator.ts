// Auto-generated from buffet-calculator-schema.json
import * as z from 'zod';

export interface Buffet_calculatorInput {
  numberOfGuests: number;
  pricePerGuest: number;
  foodCostPerGuest: number;
  laborCost: number;
  overheadCost: number;
  wastePercentage: number;
}

export const Buffet_calculatorInputSchema = z.object({
  numberOfGuests: z.number().default(50),
  pricePerGuest: z.number().default(30),
  foodCostPerGuest: z.number().default(10),
  laborCost: z.number().default(500),
  overheadCost: z.number().default(200),
  wastePercentage: z.number().default(5),
});

function evaluateAllFormulas(input: Buffet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfGuests * input.pricePerGuest; results["totalRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = input.numberOfGuests * input.foodCostPerGuest * (1 + input.wastePercentage / 100); results["totalFoodCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalFoodCost"] = 0; }
  try { const v = (results["totalFoodCost"] ?? 0) + input.laborCost + input.overheadCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalRevenue"] ?? 0) - (results["totalCost"] ?? 0); results["profit"] = Number.isFinite(v) ? v : 0; } catch { results["profit"] = 0; }
  try { const v = ((results["profit"] ?? 0) / (results["totalRevenue"] ?? 0)) * 100; results["profitMargin"] = Number.isFinite(v) ? v : 0; } catch { results["profitMargin"] = 0; }
  return results;
}


export function calculateBuffet_calculator(input: Buffet_calculatorInput): Buffet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalRevenue"] ?? 0;
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


export interface Buffet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
