// Auto-generated from churn-rate-calculator-schema.json
import * as z from 'zod';

export interface Churn_rate_calculatorInput {
  startingCustomers: number;
  lostCustomers: number;
  startingMRR: number;
  lostMRR: number;
  periodMonths: number;
}

export const Churn_rate_calculatorInputSchema = z.object({
  startingCustomers: z.number().default(1000),
  lostCustomers: z.number().default(50),
  startingMRR: z.number().default(10000),
  lostMRR: z.number().default(500),
  periodMonths: z.number().default(1),
});

function evaluateAllFormulas(input: Churn_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.lostCustomers / input.startingCustomers) * 100; results["customerChurnRate"] = Number.isFinite(v) ? v : 0; } catch { results["customerChurnRate"] = 0; }
  try { const v = (input.lostMRR / input.startingMRR) * 100; results["revenueChurnRate"] = Number.isFinite(v) ? v : 0; } catch { results["revenueChurnRate"] = 0; }
  return results;
}


export function calculateChurn_rate_calculator(input: Churn_rate_calculatorInput): Churn_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["customerChurnRate"] ?? 0;
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


export interface Churn_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
