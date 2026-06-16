// Auto-generated from energy-drink-calculator-schema.json
import * as z from 'zod';

export interface Energy_drink_calculatorInput {
  volume: number;
  caffeinePer100ml: number;
  sugarPer100ml: number;
  caloriesPer100ml: number;
  cansPerPack: number;
  pricePerPack: number;
}

export const Energy_drink_calculatorInputSchema = z.object({
  volume: z.number().default(250),
  caffeinePer100ml: z.number().default(32),
  sugarPer100ml: z.number().default(11),
  caloriesPer100ml: z.number().default(45),
  cansPerPack: z.number().default(4),
  pricePerPack: z.number().default(5.99),
});

function evaluateAllFormulas(input: Energy_drink_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.volume / 100) * input.caffeinePer100ml; results["totalCaffeine"] = Number.isFinite(v) ? v : 0; } catch { results["totalCaffeine"] = 0; }
  try { const v = (input.volume / 100) * input.sugarPer100ml; results["totalSugar"] = Number.isFinite(v) ? v : 0; } catch { results["totalSugar"] = 0; }
  try { const v = (input.volume / 100) * input.caloriesPer100ml; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = input.pricePerPack / input.cansPerPack; results["costPerCan"] = Number.isFinite(v) ? v : 0; } catch { results["costPerCan"] = 0; }
  try { const v = (input.pricePerPack / input.cansPerPack / input.volume) * 100; results["costPer100ml"] = Number.isFinite(v) ? v : 0; } catch { results["costPer100ml"] = 0; }
  return results;
}


export function calculateEnergy_drink_calculator(input: Energy_drink_calculatorInput): Energy_drink_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCalories"] ?? 0;
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


export interface Energy_drink_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
