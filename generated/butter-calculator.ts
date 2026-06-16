// Auto-generated from butter-calculator-schema.json
import * as z from 'zod';

export interface Butter_calculatorInput {
  creamVolume: number;
  creamFatPercentage: number;
  butterFatPercentage: number;
  processEfficiency: number;
  saltPercentage: number;
}

export const Butter_calculatorInputSchema = z.object({
  creamVolume: z.number().default(100),
  creamFatPercentage: z.number().default(35),
  butterFatPercentage: z.number().default(80),
  processEfficiency: z.number().default(90),
  saltPercentage: z.number().default(0),
});

function evaluateAllFormulas(input: Butter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.creamVolume * input.creamFatPercentage / 100; results["totalFat"] = Number.isFinite(v) ? v : 0; } catch { results["totalFat"] = 0; }
  try { const v = (results["totalFat"] ?? 0) / (input.butterFatPercentage / 100); results["theoreticalYield"] = Number.isFinite(v) ? v : 0; } catch { results["theoreticalYield"] = 0; }
  try { const v = (results["theoreticalYield"] ?? 0) * input.processEfficiency / 100; results["butterYield"] = Number.isFinite(v) ? v : 0; } catch { results["butterYield"] = 0; }
  try { const v = input.creamVolume - (results["butterYield"] ?? 0); results["buttermilkVolume"] = Number.isFinite(v) ? v : 0; } catch { results["buttermilkVolume"] = 0; }
  try { const v = (results["butterYield"] ?? 0) * input.saltPercentage / 100; results["saltWeight"] = Number.isFinite(v) ? v : 0; } catch { results["saltWeight"] = 0; }
  try { const v = (results["butterYield"] ?? 0) + (results["saltWeight"] ?? 0); results["butterWithSalt"] = Number.isFinite(v) ? v : 0; } catch { results["butterWithSalt"] = 0; }
  return results;
}


export function calculateButter_calculator(input: Butter_calculatorInput): Butter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["butterYield"] ?? 0;
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


export interface Butter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
