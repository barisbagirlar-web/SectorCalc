// Auto-generated from volume-of-revolution-calculator-schema.json
import * as z from 'zod';

export interface Volume_of_revolution_calculatorInput {
  lowerBound: number;
  upperBound: number;
  slope: number;
  intercept: number;
}

export const Volume_of_revolution_calculatorInputSchema = z.object({
  lowerBound: z.number().default(0),
  upperBound: z.number().default(1),
  slope: z.number().default(1),
  intercept: z.number().default(0),
});

function evaluateAllFormulas(input: Volume_of_revolution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.slope**2 * (input.upperBound**3 - input.lowerBound**3) / 3) + (input.slope * input.intercept * (input.upperBound**2 - input.lowerBound**2)) + (input.intercept**2 * (input.upperBound - input.lowerBound)); results["integralOfF2"] = Number.isFinite(v) ? v : 0; } catch { results["integralOfF2"] = 0; }
  try { const v = Math.PI * (results["integralOfF2"] ?? 0); results["volume"] = Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = 'Math.PI × (' + (results["integralOfF2"] ?? 0) + ')'; results["volumeSteps"] = Number.isFinite(v) ? v : 0; } catch { results["volumeSteps"] = 0; }
  return results;
}


export function calculateVolume_of_revolution_calculator(input: Volume_of_revolution_calculatorInput): Volume_of_revolution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["volume"] ?? 0;
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


export interface Volume_of_revolution_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
