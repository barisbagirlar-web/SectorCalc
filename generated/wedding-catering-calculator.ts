// Auto-generated from wedding-catering-calculator-schema.json
import * as z from 'zod';

export interface Wedding_catering_calculatorInput {
  guestCount: number;
  costPerPlate: number;
  drinksPerGuest: number;
  serviceChargePercent: number;
}

export const Wedding_catering_calculatorInputSchema = z.object({
  guestCount: z.number().default(100),
  costPerPlate: z.number().default(200),
  drinksPerGuest: z.number().default(50),
  serviceChargePercent: z.number().default(10),
});

function evaluateAllFormulas(input: Wedding_catering_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.guestCount * input.costPerPlate; results["totalFoodCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalFoodCost"] = 0; }
  try { const v = input.guestCount * input.drinksPerGuest; results["totalDrinksCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalDrinksCost"] = 0; }
  try { const v = ((results["totalFoodCost"] ?? 0) + (results["totalDrinksCost"] ?? 0)) * input.serviceChargePercent / 100; results["serviceCharge"] = Number.isFinite(v) ? v : 0; } catch { results["serviceCharge"] = 0; }
  try { const v = (results["totalFoodCost"] ?? 0) + (results["totalDrinksCost"] ?? 0) + (results["serviceCharge"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / input.guestCount; results["costPerGuest"] = Number.isFinite(v) ? v : 0; } catch { results["costPerGuest"] = 0; }
  return results;
}


export function calculateWedding_catering_calculator(input: Wedding_catering_calculatorInput): Wedding_catering_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Wedding_catering_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
