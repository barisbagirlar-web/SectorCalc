// Auto-generated from smoking-cost-calculator-schema.json
import * as z from 'zod';

export interface Smoking_cost_calculatorInput {
  cigarettesPerDay: number;
  cigarettesPerPack: number;
  pricePerPack: number;
  yearsSmoking: number;
}

export const Smoking_cost_calculatorInputSchema = z.object({
  cigarettesPerDay: z.number().default(20),
  cigarettesPerPack: z.number().default(20),
  pricePerPack: z.number().default(10),
  yearsSmoking: z.number().default(10),
});

function evaluateAllFormulas(input: Smoking_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cigarettesPerDay / input.cigarettesPerPack) * input.pricePerPack; results["dailyCost"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCost"] = 0; }
  try { const v = (results["dailyCost"] ?? 0) * 365; results["yearlyCost"] = Number.isFinite(v) ? v : 0; } catch { results["yearlyCost"] = 0; }
  try { const v = (results["yearlyCost"] ?? 0) / 52; results["weeklyCost"] = Number.isFinite(v) ? v : 0; } catch { results["weeklyCost"] = 0; }
  try { const v = (results["yearlyCost"] ?? 0) / 12; results["monthlyCost"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyCost"] = 0; }
  try { const v = (results["dailyCost"] ?? 0) * 365 * input.yearsSmoking; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateSmoking_cost_calculator(input: Smoking_cost_calculatorInput): Smoking_cost_calculatorOutput {
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


export interface Smoking_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
