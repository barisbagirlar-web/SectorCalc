// Auto-generated from vegetarian-calculator-schema.json
import * as z from 'zod';

export interface Vegetarian_calculatorInput {
  dailyMeatConsumption: number;
  vegetarianDaysPerWeek: number;
  beefRatio: number;
  porkRatio: number;
  poultryRatio: number;
}

export const Vegetarian_calculatorInputSchema = z.object({
  dailyMeatConsumption: z.number().default(200),
  vegetarianDaysPerWeek: z.number().default(3),
  beefRatio: z.number().default(0.3),
  porkRatio: z.number().default(0.3),
  poultryRatio: z.number().default(0.4),
});

function evaluateAllFormulas(input: Vegetarian_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyMeatConsumption * (input.vegetarianDaysPerWeek / 7) * 365; results["meat_reduction"] = Number.isFinite(v) ? v : 0; } catch { results["meat_reduction"] = 0; }
  try { const v = (results["meat_reduction"] ?? 0) * input.beefRatio; results["beef_reduction"] = Number.isFinite(v) ? v : 0; } catch { results["beef_reduction"] = 0; }
  try { const v = (results["meat_reduction"] ?? 0) * input.porkRatio; results["pork_reduction"] = Number.isFinite(v) ? v : 0; } catch { results["pork_reduction"] = 0; }
  try { const v = (results["meat_reduction"] ?? 0) * input.poultryRatio; results["poultry_reduction"] = Number.isFinite(v) ? v : 0; } catch { results["poultry_reduction"] = 0; }
  try { const v = (results["beef_reduction"] ?? 0) * 27 + (results["pork_reduction"] ?? 0) * 12 + (results["poultry_reduction"] ?? 0) * 7; results["co2_saved"] = Number.isFinite(v) ? v : 0; } catch { results["co2_saved"] = 0; }
  try { const v = (results["beef_reduction"] ?? 0) * 15415 + (results["pork_reduction"] ?? 0) * 6000 + (results["poultry_reduction"] ?? 0) * 4300; results["water_saved"] = Number.isFinite(v) ? v : 0; } catch { results["water_saved"] = 0; }
  try { const v = (results["beef_reduction"] ?? 0) * 27 + (results["pork_reduction"] ?? 0) * 9 + (results["poultry_reduction"] ?? 0) * 5; results["land_saved"] = Number.isFinite(v) ? v : 0; } catch { results["land_saved"] = 0; }
  return results;
}


export function calculateVegetarian_calculator(input: Vegetarian_calculatorInput): Vegetarian_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["co2_saved"] ?? 0;
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


export interface Vegetarian_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
