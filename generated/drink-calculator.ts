// Auto-generated from drink-calculator-schema.json
import * as z from 'zod';

export interface Drink_calculatorInput {
  spiritVol: number;
  spiritCostPerL: number;
  mixerVol: number;
  mixerCostPerL: number;
  otherCost: number;
  marginPercent: number;
}

export const Drink_calculatorInputSchema = z.object({
  spiritVol: z.number().default(50),
  spiritCostPerL: z.number().default(20),
  mixerVol: z.number().default(150),
  mixerCostPerL: z.number().default(2),
  otherCost: z.number().default(0.1),
  marginPercent: z.number().default(70),
});

function evaluateAllFormulas(input: Drink_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.spiritVol + input.mixerVol; results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = (input.spiritVol / 1000) * input.spiritCostPerL + (input.mixerVol / 1000) * input.mixerCostPerL + input.otherCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / (1 - input.marginPercent / 100); results["sellingPrice"] = Number.isFinite(v) ? v : 0; } catch { results["sellingPrice"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / (results["totalVolume"] ?? 0); results["costPerMl"] = Number.isFinite(v) ? v : 0; } catch { results["costPerMl"] = 0; }
  return results;
}


export function calculateDrink_calculator(input: Drink_calculatorInput): Drink_calculatorOutput {
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


export interface Drink_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
