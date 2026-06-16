// Auto-generated from supplement-calculator-schema.json
import * as z from 'zod';

export interface Supplement_calculatorInput {
  baseWeight: number;
  baseConc: number;
  desiredConc: number;
  suppConc: number;
}

export const Supplement_calculatorInputSchema = z.object({
  baseWeight: z.number().default(100),
  baseConc: z.number().default(5),
  desiredConc: z.number().default(10),
  suppConc: z.number().default(90),
});

function evaluateAllFormulas(input: Supplement_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseWeight * (input.desiredConc - input.baseConc) / (input.suppConc - input.desiredConc); results["supplementWeight"] = Number.isFinite(v) ? v : 0; } catch { results["supplementWeight"] = 0; }
  try { const v = input.baseWeight + (results["supplementWeight"] ?? 0); results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (input.baseWeight * input.baseConc + (results["supplementWeight"] ?? 0) * input.suppConc) / (results["totalWeight"] ?? 0); results["finalConc"] = Number.isFinite(v) ? v : 0; } catch { results["finalConc"] = 0; }
  return results;
}


export function calculateSupplement_calculator(input: Supplement_calculatorInput): Supplement_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["supplementWeight"] ?? 0;
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


export interface Supplement_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
