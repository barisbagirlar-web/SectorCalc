// Auto-generated from weight-gain-calculator-schema.json
import * as z from 'zod';

export interface Weight_gain_calculatorInput {
  partArea: number;
  coatingThickness: number;
  coatingDensity: number;
  numberOfParts: number;
  wasteFactor: number;
  safetyFactor: number;
}

export const Weight_gain_calculatorInputSchema = z.object({
  partArea: z.number().default(0.5),
  coatingThickness: z.number().default(0.1),
  coatingDensity: z.number().default(2700),
  numberOfParts: z.number().default(100),
  wasteFactor: z.number().default(5),
  safetyFactor: z.number().default(1.1),
});

function evaluateAllFormulas(input: Weight_gain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.partArea * (input.coatingThickness / 1000); results["volumePerPart"] = Number.isFinite(v) ? v : 0; } catch { results["volumePerPart"] = 0; }
  try { const v = (results["volumePerPart"] ?? 0) * input.coatingDensity; results["weightGainPerPart"] = Number.isFinite(v) ? v : 0; } catch { results["weightGainPerPart"] = 0; }
  try { const v = (results["weightGainPerPart"] ?? 0) * input.numberOfParts; results["totalWeightWithoutWaste"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeightWithoutWaste"] = 0; }
  try { const v = (results["totalWeightWithoutWaste"] ?? 0) * (1 + input.wasteFactor / 100) * input.safetyFactor; results["totalWeightGain"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeightGain"] = 0; }
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
