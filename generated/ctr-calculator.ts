// Auto-generated from ctr-calculator-schema.json
import * as z from 'zod';

export interface Ctr_calculatorInput {
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalCost: number;
  ctrTarget: number;
}

export const Ctr_calculatorInputSchema = z.object({
  totalImpressions: z.number().default(0),
  totalClicks: z.number().default(0),
  totalConversions: z.number().default(0),
  totalCost: z.number().default(0),
  ctrTarget: z.number().default(0),
});

function evaluateAllFormulas(input: Ctr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalImpressions !== 0 ? (input.totalClicks / input.totalImpressions) * 100 : 0; results["ctr"] = Number.isFinite(v) ? v : 0; } catch { results["ctr"] = 0; }
  try { const v = input.totalClicks !== 0 ? (input.totalConversions / input.totalClicks) * 100 : 0; results["conversionRate"] = Number.isFinite(v) ? v : 0; } catch { results["conversionRate"] = 0; }
  try { const v = input.totalClicks !== 0 ? input.totalCost / input.totalClicks : 0; results["costPerClick"] = Number.isFinite(v) ? v : 0; } catch { results["costPerClick"] = 0; }
  return results;
}


export function calculateCtr_calculator(input: Ctr_calculatorInput): Ctr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ctr"] ?? 0;
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


export interface Ctr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
