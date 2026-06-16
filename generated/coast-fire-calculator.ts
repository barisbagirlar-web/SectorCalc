// Auto-generated from coast-fire-calculator-schema.json
import * as z from 'zod';

export interface Coast_fire_calculatorInput {
  currentAge: number;
  retirementAge: number;
  annualReturnRate: number;
  fireTarget: number;
}

export const Coast_fire_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  annualReturnRate: z.number().default(7),
  fireTarget: z.number().default(1000000),
});

function evaluateAllFormulas(input: Coast_fire_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.retirementAge - input.currentAge; results["yearsToRetirement"] = Number.isFinite(v) ? v : 0; } catch { results["yearsToRetirement"] = 0; }
  try { const v = Math.pow(1 + input.annualReturnRate/100, (results["yearsToRetirement"] ?? 0)); results["growthFactor"] = Number.isFinite(v) ? v : 0; } catch { results["growthFactor"] = 0; }
  try { const v = input.fireTarget / (results["growthFactor"] ?? 0); results["coastFireNumber"] = Number.isFinite(v) ? v : 0; } catch { results["coastFireNumber"] = 0; }
  return results;
}


export function calculateCoast_fire_calculator(input: Coast_fire_calculatorInput): Coast_fire_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["coastFireNumber"] ?? 0;
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


export interface Coast_fire_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
