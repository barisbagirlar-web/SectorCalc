// Auto-generated from zone-diet-calculator-schema.json
import * as z from 'zod';

export interface Zone_diet_calculatorInput {
  weight: number;
  bodyFat: number;
  activityFactor: number;
}

export const Zone_diet_calculatorInputSchema = z.object({
  weight: z.number().default(150),
  bodyFat: z.number().default(20),
  activityFactor: z.number().default(0.7),
});

function evaluateAllFormulas(input: Zone_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (1 - input.bodyFat / 100); results["leanBodyMass"] = Number.isFinite(v) ? v : 0; } catch { results["leanBodyMass"] = 0; }
  try { const v = (results["leanBodyMass"] ?? 0) * input.activityFactor; results["proteinReq"] = Number.isFinite(v) ? v : 0; } catch { results["proteinReq"] = 0; }
  try { const v = (results["proteinReq"] ?? 0) / 7; results["dailyBlocks"] = Number.isFinite(v) ? v : 0; } catch { results["dailyBlocks"] = 0; }
  try { const v = (results["dailyBlocks"] ?? 0); results["proteinBlocks"] = Number.isFinite(v) ? v : 0; } catch { results["proteinBlocks"] = 0; }
  try { const v = (results["dailyBlocks"] ?? 0); results["carbBlocks"] = Number.isFinite(v) ? v : 0; } catch { results["carbBlocks"] = 0; }
  try { const v = (results["dailyBlocks"] ?? 0); results["fatBlocks"] = Number.isFinite(v) ? v : 0; } catch { results["fatBlocks"] = 0; }
  return results;
}


export function calculateZone_diet_calculator(input: Zone_diet_calculatorInput): Zone_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyBlocks"] ?? 0;
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


export interface Zone_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
