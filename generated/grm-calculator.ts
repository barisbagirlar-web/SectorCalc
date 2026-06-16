// Auto-generated from grm-calculator-schema.json
import * as z from 'zod';

export interface Grm_calculatorInput {
  propertyPrice: number;
  annualRentalIncome: number;
}

export const Grm_calculatorInputSchema = z.object({
  propertyPrice: z.number().default(500000),
  annualRentalIncome: z.number().default(60000),
});

function evaluateAllFormulas(input: Grm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.propertyPrice / input.annualRentalIncome; results["grm"] = Number.isFinite(v) ? v : 0; } catch { results["grm"] = 0; }
  return results;
}


export function calculateGrm_calculator(input: Grm_calculatorInput): Grm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["grm"] ?? 0;
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


export interface Grm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
