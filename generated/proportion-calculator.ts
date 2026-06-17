// Auto-generated from proportion-calculator-schema.json
import * as z from 'zod';

export interface Proportion_calculatorInput {
  comp1: number;
  comp2: number;
  comp3: number;
  comp4: number;
}

export const Proportion_calculatorInputSchema = z.object({
  comp1: z.number().default(0),
  comp2: z.number().default(0),
  comp3: z.number().default(0),
  comp4: z.number().default(0),
});

function evaluateAllFormulas(input: Proportion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.comp1 + input.comp2 + input.comp3 + input.comp4; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (results["totalWeight"] ?? 0) > 0 ? (input.comp1 / (results["totalWeight"] ?? 0)) * 100 : 0; results["prop1"] = Number.isFinite(v) ? v : 0; } catch { results["prop1"] = 0; }
  try { const v = (results["totalWeight"] ?? 0) > 0 ? (input.comp2 / (results["totalWeight"] ?? 0)) * 100 : 0; results["prop2"] = Number.isFinite(v) ? v : 0; } catch { results["prop2"] = 0; }
  try { const v = (results["totalWeight"] ?? 0) > 0 ? (input.comp3 / (results["totalWeight"] ?? 0)) * 100 : 0; results["prop3"] = Number.isFinite(v) ? v : 0; } catch { results["prop3"] = 0; }
  try { const v = (results["totalWeight"] ?? 0) > 0 ? (input.comp4 / (results["totalWeight"] ?? 0)) * 100 : 0; results["prop4"] = Number.isFinite(v) ? v : 0; } catch { results["prop4"] = 0; }
  results["_prop1__"] = 0;
  results["_prop2__"] = 0;
  results["_prop3__"] = 0;
  results["_prop4__"] = 0;
  return results;
}


export function calculateProportion_calculator(input: Proportion_calculatorInput): Proportion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWeight"] ?? 0;
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


export interface Proportion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
