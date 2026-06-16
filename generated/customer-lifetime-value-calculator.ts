// Auto-generated from customer-lifetime-value-calculator-schema.json
import * as z from 'zod';

export interface Customer_lifetime_value_calculatorInput {
  avgPurchaseValue: number;
  purchaseFrequency: number;
  lifespanYears: number;
  grossMarginPercent: number;
}

export const Customer_lifetime_value_calculatorInputSchema = z.object({
  avgPurchaseValue: z.number().default(100),
  purchaseFrequency: z.number().default(12),
  lifespanYears: z.number().default(5),
  grossMarginPercent: z.number().default(100),
});

function evaluateAllFormulas(input: Customer_lifetime_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.avgPurchaseValue * input.purchaseFrequency * input.lifespanYears; results["totalRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = input.avgPurchaseValue * input.purchaseFrequency * input.grossMarginPercent / 100; results["annualValue"] = Number.isFinite(v) ? v : 0; } catch { results["annualValue"] = 0; }
  try { const v = (results["totalRevenue"] ?? 0) * input.grossMarginPercent / 100; results["clv"] = Number.isFinite(v) ? v : 0; } catch { results["clv"] = 0; }
  return results;
}


export function calculateCustomer_lifetime_value_calculator(input: Customer_lifetime_value_calculatorInput): Customer_lifetime_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["clv"] ?? 0;
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


export interface Customer_lifetime_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
