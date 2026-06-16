// Auto-generated from glove-size-calculator-schema.json
import * as z from 'zod';

export interface Glove_size_calculatorInput {
  handCircumferenceCm: number;
  handLengthCm: number;
}

export const Glove_size_calculatorInputSchema = z.object({
  handCircumferenceCm: z.number().default(20),
  handLengthCm: z.number().default(18.5),
});

function evaluateAllFormulas(input: Glove_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.handCircumferenceCm / 2.54; results["circumferenceInch"] = Number.isFinite(v) ? v : 0; } catch { results["circumferenceInch"] = 0; }
  try { const v = input.handLengthCm / 2.54; results["lengthInch"] = Number.isFinite(v) ? v : 0; } catch { results["lengthInch"] = 0; }
  try { const v = ((results["circumferenceInch"] ?? 0) + (results["lengthInch"] ?? 0)) / 2; results["averageInch"] = Number.isFinite(v) ? v : 0; } catch { results["averageInch"] = 0; }
  try { const v = Math.round((results["averageInch"] ?? 0) * 2) / 2; results["roundedSize"] = Number.isFinite(v) ? v : 0; } catch { results["roundedSize"] = 0; }
  return results;
}


export function calculateGlove_size_calculator(input: Glove_size_calculatorInput): Glove_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total"] ?? 0;
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


export interface Glove_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
