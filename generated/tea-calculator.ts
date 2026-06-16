// Auto-generated from tea-calculator-schema.json
import * as z from 'zod';

export interface Tea_calculatorInput {
  cups: number;
  waterPerCup: number;
  teaLeavesPerCup: number;
  strengthFactor: number;
  absorptionRate: number;
}

export const Tea_calculatorInputSchema = z.object({
  cups: z.number().default(10),
  waterPerCup: z.number().default(200),
  teaLeavesPerCup: z.number().default(2.5),
  strengthFactor: z.number().default(1),
  absorptionRate: z.number().default(1.5),
});

function evaluateAllFormulas(input: Tea_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cups * input.waterPerCup + input.cups * input.teaLeavesPerCup * input.strengthFactor * input.absorptionRate) / 1000; results["totalWaterNeeded_liters"] = Number.isFinite(v) ? v : 0; } catch { results["totalWaterNeeded_liters"] = 0; }
  try { const v = input.cups * input.teaLeavesPerCup * input.strengthFactor; results["totalTeaLeaves_grams"] = Number.isFinite(v) ? v : 0; } catch { results["totalTeaLeaves_grams"] = 0; }
  try { const v = input.cups * input.teaLeavesPerCup * input.strengthFactor * input.absorptionRate; results["absorbedWater_ml"] = Number.isFinite(v) ? v : 0; } catch { results["absorbedWater_ml"] = 0; }
  return results;
}


export function calculateTea_calculator(input: Tea_calculatorInput): Tea_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWaterNeeded_liters"] ?? 0;
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


export interface Tea_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
