// Auto-generated from weight-gain-calculator-schema.json
import * as z from 'zod';

export interface Weight_gain_calculatorInput {
  surfaceArea: number;
  coatingThickness: number;
  coatingDensity: number;
  numberOfParts: number;
}

export const Weight_gain_calculatorInputSchema = z.object({
  surfaceArea: z.number().default(0.5),
  coatingThickness: z.number().default(50),
  coatingDensity: z.number().default(1200),
  numberOfParts: z.number().default(100),
});

function evaluateAllFormulas(input: Weight_gain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.surfaceArea * input.coatingThickness / 1000000; results["coatingVolumePerPart"] = Number.isFinite(v) ? v : 0; } catch { results["coatingVolumePerPart"] = 0; }
  try { const v = (results["coatingVolumePerPart"] ?? 0) * input.coatingDensity; results["weightGainPerPart"] = Number.isFinite(v) ? v : 0; } catch { results["weightGainPerPart"] = 0; }
  try { const v = (results["weightGainPerPart"] ?? 0) * input.numberOfParts; results["totalWeightGain"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeightGain"] = 0; }
  return results;
}


export function calculateWeight_gain_calculator(input: Weight_gain_calculatorInput): Weight_gain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWeightGain"] ?? 0;
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


export interface Weight_gain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
