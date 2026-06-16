// Auto-generated from body-roundness-index-calculator-schema.json
import * as z from 'zod';

export interface Body_roundness_index_calculatorInput {
  waist_cm: number;
  height_cm: number;
  waist_in: number;
  height_in: number;
}

export const Body_roundness_index_calculatorInputSchema = z.object({
  waist_cm: z.number().default(90),
  height_cm: z.number().default(170),
  waist_in: z.number().default(35.43),
  height_in: z.number().default(66.93),
});

function evaluateAllFormulas(input: Body_roundness_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 364.2 - 365.5 * Math.sqrt(1 - Math.pow(((input.waist_cm !== undefined && !isNaN(input.waist_cm)) ? input.waist_cm : (input.waist_in * 2.54)) / (2 * Math.PI), 2) / Math.pow(0.5 * ((input.height_cm !== undefined && !isNaN(input.height_cm)) ? input.height_cm : (input.height_in * 2.54)), 2)); results["BRI"] = Number.isFinite(v) ? v : 0; } catch { results["BRI"] = 0; }
  try { const v = (input.waist_cm !== undefined && !isNaN(input.waist_cm)) ? input.waist_cm : (input.waist_in * 2.54); results["waistUsedCm"] = Number.isFinite(v) ? v : 0; } catch { results["waistUsedCm"] = 0; }
  try { const v = (input.height_cm !== undefined && !isNaN(input.height_cm)) ? input.height_cm : (input.height_in * 2.54); results["heightUsedCm"] = Number.isFinite(v) ? v : 0; } catch { results["heightUsedCm"] = 0; }
  return results;
}


export function calculateBody_roundness_index_calculator(input: Body_roundness_index_calculatorInput): Body_roundness_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["BRI"] ?? 0;
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


export interface Body_roundness_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
