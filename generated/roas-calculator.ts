// Auto-generated from roas-calculator-schema.json
import * as z from 'zod';

export interface Roas_calculatorInput {
  spendA: number;
  spendB: number;
  revenueA: number;
  revenueB: number;
}

export const Roas_calculatorInputSchema = z.object({
  spendA: z.number().default(0),
  spendB: z.number().default(0),
  revenueA: z.number().default(0),
  revenueB: z.number().default(0),
});

function evaluateAllFormulas(input: Roas_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.spendA + input.spendB; results["totalSpend"] = Number.isFinite(v) ? v : 0; } catch { results["totalSpend"] = 0; }
  try { const v = input.revenueA + input.revenueB; results["totalRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (results["totalRevenue"] ?? 0) / (results["totalSpend"] ?? 0); results["roas"] = Number.isFinite(v) ? v : 0; } catch { results["roas"] = 0; }
  try { const v = (results["roas"] ?? 0) * 100; results["roasPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["roasPercentage"] = 0; }
  return results;
}


export function calculateRoas_calculator(input: Roas_calculatorInput): Roas_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roas"] ?? 0;
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


export interface Roas_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
