// Auto-generated from number-of-stages-calculator-schema.json
import * as z from 'zod';

export interface Number_of_stages_calculatorInput {
  p_in: number;
  p_out: number;
  r_max: number;
  safety_factor: number;
}

export const Number_of_stages_calculatorInputSchema = z.object({
  p_in: z.number().default(1),
  p_out: z.number().default(10),
  r_max: z.number().default(3.5),
  safety_factor: z.number().default(1.1),
});

function evaluateAllFormulas(input: Number_of_stages_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.p_out / input.p_in; results["overallPR"] = Number.isFinite(v) ? v : 0; } catch { results["overallPR"] = 0; }
  try { const v = input.safety_factor * Math.log(input.p_out/input.p_in) / Math.log(input.r_max); results["stagesExact"] = Number.isFinite(v) ? v : 0; } catch { results["stagesExact"] = 0; }
  try { const v = Math.ceil(input.safety_factor * Math.log(input.p_out/input.p_in) / Math.log(input.r_max)); results["stages"] = Number.isFinite(v) ? v : 0; } catch { results["stages"] = 0; }
  return results;
}


export function calculateNumber_of_stages_calculator(input: Number_of_stages_calculatorInput): Number_of_stages_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["stages"] ?? 0;
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


export interface Number_of_stages_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
