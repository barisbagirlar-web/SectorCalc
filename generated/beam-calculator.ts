// Auto-generated from beam-calculator-schema.json
import * as z from 'zod';

export interface Beam_calculatorInput {
  load: number;
  span: number;
  elasticModulus: number;
  momentOfInertia: number;
}

export const Beam_calculatorInputSchema = z.object({
  load: z.number().default(10),
  span: z.number().default(5),
  elasticModulus: z.number().default(200),
  momentOfInertia: z.number().default(1000),
});

function evaluateAllFormulas(input: Beam_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.load * input.span) / 4; results["maxBendingMoment"] = Number.isFinite(v) ? v : 0; } catch { results["maxBendingMoment"] = 0; }
  try { const v = (100000 * input.load * Math.pow(input.span, 3)) / (48 * input.elasticModulus * input.momentOfInertia); results["maxDeflection"] = Number.isFinite(v) ? v : 0; } catch { results["maxDeflection"] = 0; }
  return results;
}


export function calculateBeam_calculator(input: Beam_calculatorInput): Beam_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxBendingMoment"] ?? 0;
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


export interface Beam_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
