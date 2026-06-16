// Auto-generated from smoking-calculator-schema.json
import * as z from 'zod';

export interface Smoking_calculatorInput {
  cigarettesPerDay: number;
  costPerPack: number;
  yearsSmoking: number;
  packSize: number;
}

export const Smoking_calculatorInputSchema = z.object({
  cigarettesPerDay: z.number().default(20),
  costPerPack: z.number().default(30),
  yearsSmoking: z.number().default(10),
  packSize: z.number().default(20),
});

function evaluateAllFormulas(input: Smoking_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cigarettesPerDay / input.packSize) * input.costPerPack; results["dailyCost"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCost"] = 0; }
  try { const v = (results["dailyCost"] ?? 0) * 365; results["yearlyCost"] = Number.isFinite(v) ? v : 0; } catch { results["yearlyCost"] = 0; }
  try { const v = (results["yearlyCost"] ?? 0) * input.yearsSmoking; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateSmoking_calculator(input: Smoking_calculatorInput): Smoking_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Smoking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
