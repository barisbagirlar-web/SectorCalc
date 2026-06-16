// Auto-generated from madrs-calculator-schema.json
import * as z from 'zod';

export interface Madrs_calculatorInput {
  axleDiameter: number;
  axleLength: number;
  load: number;
  elasticModulus: number;
  safetyFactor: number;
}

export const Madrs_calculatorInputSchema = z.object({
  axleDiameter: z.number().default(50),
  axleLength: z.number().default(500),
  load: z.number().default(1000),
  elasticModulus: z.number().default(210),
  safetyFactor: z.number().default(1.5),
});

function evaluateAllFormulas(input: Madrs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * Math.pow(input.axleDiameter, 4) / 64; results["momentOfInertia"] = Number.isFinite(v) ? v : 0; } catch { results["momentOfInertia"] = 0; }
  try { const v = (input.load * Math.pow(input.axleLength, 3)) / (48 * input.elasticModulus * 1000 * (results["momentOfInertia"] ?? 0)); results["maxDeflection"] = Number.isFinite(v) ? v : 0; } catch { results["maxDeflection"] = 0; }
  try { const v = (input.load * input.axleLength * input.axleDiameter) / (8 * (results["momentOfInertia"] ?? 0)); results["maxBendingStress"] = Number.isFinite(v) ? v : 0; } catch { results["maxBendingStress"] = 0; }
  return results;
}


export function calculateMadrs_calculator(input: Madrs_calculatorInput): Madrs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxDeflection"] ?? 0;
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


export interface Madrs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
