// Auto-generated from stronglifts-calculator-schema.json
import * as z from 'zod';

export interface Stronglifts_calculatorInput {
  loadWeight: number;
  numberOfSlings: number;
  angleFromVertical: number;
  safetyFactor: number;
}

export const Stronglifts_calculatorInputSchema = z.object({
  loadWeight: z.number().default(1000),
  numberOfSlings: z.number().default(4),
  angleFromVertical: z.number().default(30),
  safetyFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Stronglifts_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loadWeight * input.safetyFactor / (input.numberOfSlings * Math.cos(input.angleFromVertical * Math.PI / 180)); results["requiredCapacityPerSlingKg"] = Number.isFinite(v) ? v : 0; } catch { results["requiredCapacityPerSlingKg"] = 0; }
  try { const v = input.loadWeight / (input.numberOfSlings * Math.cos(input.angleFromVertical * Math.PI / 180)); results["tensionPerSlingKg"] = Number.isFinite(v) ? v : 0; } catch { results["tensionPerSlingKg"] = 0; }
  try { const v = 1 / Math.cos(input.angleFromVertical * Math.PI / 180); results["angleMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["angleMultiplier"] = 0; }
  return results;
}


export function calculateStronglifts_calculator(input: Stronglifts_calculatorInput): Stronglifts_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredCapacityPerSlingKg"] ?? 0;
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


export interface Stronglifts_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
