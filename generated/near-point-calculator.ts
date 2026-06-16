// Auto-generated from near-point-calculator-schema.json
import * as z from 'zod';

export interface Near_point_calculatorInput {
  age: number;
  refractiveError: number;
  amplitudeMethod: number;
  directAmplitude: number;
}

export const Near_point_calculatorInputSchema = z.object({
  age: z.number().default(30),
  refractiveError: z.number().default(0),
  amplitudeMethod: z.number().default(1),
  directAmplitude: z.number().default(2.5),
});

function evaluateAllFormulas(input: Near_point_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.amplitudeMethod === 0 ? input.directAmplitude : (input.amplitudeMethod === 1 ? 15 - 0.25 * input.age : (input.amplitudeMethod === 2 ? 18.5 - 0.30 * input.age : 25 - 0.40 * input.age)); results["amplitudeDiopters"] = Number.isFinite(v) ? v : 0; } catch { results["amplitudeDiopters"] = 0; }
  try { const v = 1 / ((results["amplitudeDiopters"] ?? 0) + input.refractiveError); results["nearPointDistanceMeters"] = Number.isFinite(v) ? v : 0; } catch { results["nearPointDistanceMeters"] = 0; }
  try { const v = (results["nearPointDistanceMeters"] ?? 0) * 100; results["nearPointDistanceCm"] = Number.isFinite(v) ? v : 0; } catch { results["nearPointDistanceCm"] = 0; }
  return results;
}


export function calculateNear_point_calculator(input: Near_point_calculatorInput): Near_point_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["nearPointDistanceCm"] ?? 0;
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


export interface Near_point_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
