// Auto-generated from body-water-calculator-schema.json
import * as z from 'zod';

export interface Body_water_calculatorInput {
  sex: number;
  age: number;
  weight: number;
  height: number;
}

export const Body_water_calculatorInputSchema = z.object({
  sex: z.number().default(1),
  age: z.number().default(30),
  weight: z.number().default(70),
  height: z.number().default(170),
});

function evaluateAllFormulas(input: Body_water_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2.447 - (0.09156 * input.age) + (0.1074 * input.height) + (0.3362 * input.weight); results["tbwMale"] = Number.isFinite(v) ? v : 0; } catch { results["tbwMale"] = 0; }
  try { const v = -2.097 + (0.1069 * input.height) + (0.2466 * input.weight); results["tbwFemale"] = Number.isFinite(v) ? v : 0; } catch { results["tbwFemale"] = 0; }
  try { const v = input.sex === 1 ? (results["tbwMale"] ?? 0) : (results["tbwFemale"] ?? 0); results["totalBodyWater"] = Number.isFinite(v) ? v : 0; } catch { results["totalBodyWater"] = 0; }
  try { const v = ((input.sex === 1 ? (results["tbwMale"] ?? 0) : (results["tbwFemale"] ?? 0)) / input.weight) * 100; results["waterPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["waterPercentage"] = 0; }
  return results;
}


export function calculateBody_water_calculator(input: Body_water_calculatorInput): Body_water_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["toplam"] ?? 0;
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


export interface Body_water_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
