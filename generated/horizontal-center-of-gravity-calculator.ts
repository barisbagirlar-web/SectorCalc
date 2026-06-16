// Auto-generated from horizontal-center-of-gravity-calculator-schema.json
import * as z from 'zod';

export interface Horizontal_center_of_gravity_calculatorInput {
  weight1: number;
  distance1: number;
  weight2: number;
  distance2: number;
  weight3: number;
  distance3: number;
  referencePoint: number;
}

export const Horizontal_center_of_gravity_calculatorInputSchema = z.object({
  weight1: z.number().default(1000),
  distance1: z.number().default(0.5),
  weight2: z.number().default(800),
  distance2: z.number().default(1.2),
  weight3: z.number().default(600),
  distance3: z.number().default(2),
  referencePoint: z.number().default(0),
});

function evaluateAllFormulas(input: Horizontal_center_of_gravity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.weight1 + input.weight2 + input.weight3); results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (input.weight1 * input.distance1 + input.weight2 * input.distance2 + input.weight3 * input.distance3); results["totalMoment"] = Number.isFinite(v) ? v : 0; } catch { results["totalMoment"] = 0; }
  try { const v = ((input.weight1 * input.distance1 + input.weight2 * input.distance2 + input.weight3 * input.distance3) / (input.weight1 + input.weight2 + input.weight3)); results["cgHorizontal"] = Number.isFinite(v) ? v : 0; } catch { results["cgHorizontal"] = 0; }
  return results;
}


export function calculateHorizontal_center_of_gravity_calculator(input: Horizontal_center_of_gravity_calculatorInput): Horizontal_center_of_gravity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cgHorizontal"] ?? 0;
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


export interface Horizontal_center_of_gravity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
