// Auto-generated from crane-load-calculator-schema.json
import * as z from 'zod';

export interface Crane_load_calculatorInput {
  liftedLoad: number;
  riggingWeight: number;
  dynamicFactor: number;
  windFactor: number;
}

export const Crane_load_calculatorInputSchema = z.object({
  liftedLoad: z.number().default(10),
  riggingWeight: z.number().default(1),
  dynamicFactor: z.number().default(1.2),
  windFactor: z.number().default(1.1),
});

function evaluateAllFormulas(input: Crane_load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.liftedLoad + input.riggingWeight; results["staticLoad"] = Number.isFinite(v) ? v : 0; } catch { results["staticLoad"] = 0; }
  try { const v = (results["staticLoad"] ?? 0) * input.dynamicFactor; results["dynamicLoad"] = Number.isFinite(v) ? v : 0; } catch { results["dynamicLoad"] = 0; }
  try { const v = (results["dynamicLoad"] ?? 0) * input.windFactor; results["totalLoad"] = Number.isFinite(v) ? v : 0; } catch { results["totalLoad"] = 0; }
  return results;
}


export function calculateCrane_load_calculator(input: Crane_load_calculatorInput): Crane_load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalLoad"] ?? 0;
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


export interface Crane_load_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
