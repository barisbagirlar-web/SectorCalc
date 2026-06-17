// Auto-generated from wim-hof-calculator-schema.json
import * as z from 'zod';

export interface Wim_hof_calculatorInput {
  age: number;
  weight: number;
  height: number;
  coreTemp: number;
  ambientTemp: number;
  exposureTime: number;
}

export const Wim_hof_calculatorInputSchema = z.object({
  age: z.number().default(30),
  weight: z.number().default(70),
  height: z.number().default(170),
  coreTemp: z.number().default(37),
  ambientTemp: z.number().default(10),
  exposureTime: z.number().default(10),
});

function evaluateAllFormulas(input: Wim_hof_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt((input.weight * input.height) / 3600); results["bsa"] = Number.isFinite(v) ? v : 0; } catch { results["bsa"] = 0; }
  try { const v = 5 * Math.sqrt((input.weight * input.height) / 3600) * ((input.coreTemp - 2) - input.ambientTemp); results["heatLossRate"] = Number.isFinite(v) ? v : 0; } catch { results["heatLossRate"] = 0; }
  try { const v = (5 * Math.sqrt((input.weight * input.height) / 3600) * ((input.coreTemp - 2) - input.ambientTemp) * input.exposureTime * 60) / 4184; results["metabolicIncrease"] = Number.isFinite(v) ? v : 0; } catch { results["metabolicIncrease"] = 0; }
  return results;
}


export function calculateWim_hof_calculator(input: Wim_hof_calculatorInput): Wim_hof_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bsa"] ?? 0;
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


export interface Wim_hof_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
