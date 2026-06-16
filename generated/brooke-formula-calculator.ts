// Auto-generated from brooke-formula-calculator-schema.json
import * as z from 'zod';

export interface Brooke_formula_calculatorInput {
  weight: number;
  tbsa: number;
  fluidFactor: number;
  firstPeriodHours: number;
  secondPeriodHours: number;
}

export const Brooke_formula_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  tbsa: z.number().default(20),
  fluidFactor: z.number().default(2),
  firstPeriodHours: z.number().default(8),
  secondPeriodHours: z.number().default(16),
});

function evaluateAllFormulas(input: Brooke_formula_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fluidFactor * input.weight * input.tbsa; results["totalFluid"] = Number.isFinite(v) ? v : 0; } catch { results["totalFluid"] = 0; }
  try { const v = (results["totalFluid"] ?? 0) / 2; results["firstHalf"] = Number.isFinite(v) ? v : 0; } catch { results["firstHalf"] = 0; }
  try { const v = (results["totalFluid"] ?? 0) / 2; results["secondHalf"] = Number.isFinite(v) ? v : 0; } catch { results["secondHalf"] = 0; }
  try { const v = (results["firstHalf"] ?? 0) / input.firstPeriodHours; results["firstHourlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["firstHourlyRate"] = 0; }
  try { const v = (results["secondHalf"] ?? 0) / input.secondPeriodHours; results["secondHourlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["secondHourlyRate"] = 0; }
  return results;
}


export function calculateBrooke_formula_calculator(input: Brooke_formula_calculatorInput): Brooke_formula_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalFluid"] ?? 0;
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


export interface Brooke_formula_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
