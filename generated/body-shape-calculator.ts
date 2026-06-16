// Auto-generated from body-shape-calculator-schema.json
import * as z from 'zod';

export interface Body_shape_calculatorInput {
  bust: number;
  waist: number;
  highHip: number;
  hip: number;
}

export const Body_shape_calculatorInputSchema = z.object({
  bust: z.number().default(90),
  waist: z.number().default(70),
  highHip: z.number().default(95),
  hip: z.number().default(100),
});

function evaluateAllFormulas(input: Body_shape_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.abs(input.bust - input.hip); results["bustHipDiff"] = Number.isFinite(v) ? v : 0; } catch { results["bustHipDiff"] = 0; }
  try { const v = input.waist / input.hip; results["waistHipRatio"] = Number.isFinite(v) ? v : 0; } catch { results["waistHipRatio"] = 0; }
  try { const v = ((results["bustHipDiff"] ?? 0) < 5 && (results["waistHipRatio"] ?? 0) < 0.75) ? 'Hourglass' : ((results["bustHipDiff"] ?? 0) >= 5 && input.bust > input.hip) ? 'Apple' : ((results["bustHipDiff"] ?? 0) >= 5 && input.hip > input.bust) ? 'Pear' : ((results["waistHipRatio"] ?? 0) >= 0.85) ? 'Rectangle' : 'Inverted Triangle'; results["shape"] = Number.isFinite(v) ? v : 0; } catch { results["shape"] = 0; }
  return results;
}


export function calculateBody_shape_calculator(input: Body_shape_calculatorInput): Body_shape_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["shape"] ?? 0;
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


export interface Body_shape_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
