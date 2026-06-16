// Auto-generated from underlayment-calculator-schema.json
import * as z from 'zod';

export interface Underlayment_calculatorInput {
  area: number;
  rollLength: number;
  rollWidth: number;
  wasteFactor: number;
  pricePerRoll: number;
}

export const Underlayment_calculatorInputSchema = z.object({
  area: z.number().default(500),
  rollLength: z.number().default(50),
  rollWidth: z.number().default(4),
  wasteFactor: z.number().default(10),
  pricePerRoll: z.number().default(30),
});

function evaluateAllFormulas(input: Underlayment_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rollLength * input.rollWidth; results["rollArea"] = Number.isFinite(v) ? v : 0; } catch { results["rollArea"] = 0; }
  try { const v = input.area * (1 + input.wasteFactor / 100); results["neededArea"] = Number.isFinite(v) ? v : 0; } catch { results["neededArea"] = 0; }
  try { const v = (results["neededArea"] ?? 0) / (results["rollArea"] ?? 0); results["exactRolls"] = Number.isFinite(v) ? v : 0; } catch { results["exactRolls"] = 0; }
  try { const v = (results["exactRolls"] ?? 0) * input.pricePerRoll; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateUnderlayment_calculator(input: Underlayment_calculatorInput): Underlayment_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["You"] ?? 0;
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


export interface Underlayment_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
