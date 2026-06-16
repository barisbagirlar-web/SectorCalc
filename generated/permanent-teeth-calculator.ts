// Auto-generated from permanent-teeth-calculator-schema.json
import * as z from 'zod';

export interface Permanent_teeth_calculatorInput {
  age: number;
  extracted: number;
  missing: number;
  wisdomOverride: number;
}

export const Permanent_teeth_calculatorInputSchema = z.object({
  age: z.number().default(25),
  extracted: z.number().default(0),
  missing: z.number().default(0),
  wisdomOverride: z.number().default(0),
});

function evaluateAllFormulas(input: Permanent_teeth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.wisdomOverride == 1) ? 32 : ( (input.age < 6) ? 0 : ((input.age <= 12) ? (input.age - 6) / 6 * 28 : ((input.age <= 21) ? 28 + (input.age - 12) / 9 * 4 : 32) ) ); results["expectedTeeth"] = Number.isFinite(v) ? v : 0; } catch { results["expectedTeeth"] = 0; }
  try { const v = Math.max(0, (results["expectedTeeth"] ?? 0) - input.extracted - input.missing); results["presentTeeth"] = Number.isFinite(v) ? v : 0; } catch { results["presentTeeth"] = 0; }
  return results;
}


export function calculatePermanent_teeth_calculator(input: Permanent_teeth_calculatorInput): Permanent_teeth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["presentTeeth"] ?? 0;
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


export interface Permanent_teeth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
