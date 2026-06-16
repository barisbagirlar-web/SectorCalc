// Auto-generated from fermentation-calculator-schema.json
import * as z from 'zod';

export interface Fermentation_calculatorInput {
  initialSugar: number;
  fermentationTime: number;
  temperature: number;
  yeastPitchRate: number;
  batchVolume: number;
}

export const Fermentation_calculatorInputSchema = z.object({
  initialSugar: z.number().default(200),
  fermentationTime: z.number().default(48),
  temperature: z.number().default(20),
  yeastPitchRate: z.number().default(1000000),
  batchVolume: z.number().default(1000),
});

function evaluateAllFormulas(input: Fermentation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialSugar / 17; results["potentialABV"] = Number.isFinite(v) ? v : 0; } catch { results["potentialABV"] = 0; }
  try { const v = (1 / (1 + Math.exp(-(input.yeastPitchRate - 1000000)/1000000))) * Math.exp(-0.05 * (input.temperature - 20) ** 2) * (1 - Math.exp(-0.1 * input.fermentationTime)); results["efficiency"] = Number.isFinite(v) ? v : 0; } catch { results["efficiency"] = 0; }
  try { const v = (results["potentialABV"] ?? 0) * (results["efficiency"] ?? 0); results["actualABV"] = Number.isFinite(v) ? v : 0; } catch { results["actualABV"] = 0; }
  try { const v = input.initialSugar * 0.5 * input.batchVolume; results["co2Mass"] = Number.isFinite(v) ? v : 0; } catch { results["co2Mass"] = 0; }
  return results;
}


export function calculateFermentation_calculator(input: Fermentation_calculatorInput): Fermentation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["actualABV"] ?? 0;
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


export interface Fermentation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
